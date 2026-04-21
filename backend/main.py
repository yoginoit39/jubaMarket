from fastapi import FastAPI, Depends, HTTPException, status, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from sqlalchemy import func
from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import datetime
import json, os, secrets
from dotenv import load_dotenv

from database import engine, get_db, Base
from models import (User, Product, Wishlist, Inquiry, Message, Notification,
                    WantedAd, WantedOffer, Follow, Review,
                    CourierRider, DeliveryJob, Report)
from auth import hash_password, check_password, create_token, decode_token

load_dotenv()
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Kampala Market API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

bearer = HTTPBearer(auto_error=False)

# ── Auth helpers ──────────────────────────────────────────────────────────

def get_current_user(
    creds: HTTPAuthorizationCredentials = Depends(bearer),
    db: Session = Depends(get_db),
) -> User:
    if not creds:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = decode_token(creds.credentials)
        user = db.query(User).filter(User.id == int(payload["sub"])).first()
        if not user or user.status == "suspended":
            raise HTTPException(status_code=401, detail="Invalid token")
        return user
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

def optional_user(
    creds: HTTPAuthorizationCredentials = Depends(bearer),
    db: Session = Depends(get_db),
) -> Optional[User]:
    if not creds:
        return None
    try:
        payload = decode_token(creds.credentials)
        return db.query(User).filter(User.id == int(payload["sub"])).first()
    except Exception:
        return None

def require_role(*roles):
    def dep(user: User = Depends(get_current_user)):
        if user.role not in roles:
            raise HTTPException(status_code=403, detail="Forbidden")
        return user
    return dep

# ── Shared serializers ────────────────────────────────────────────────────

def ser_user(u: User) -> dict:
    return {
        "id": u.id,
        "name": u.name,
        "phone": u.phone,
        "email": u.email,
        "role": u.role,
        "location": u.location,
        "business": u.business_name,
        "description": u.description,
        "verified": u.verified,
        "status": u.status,
        "avatar": u.avatar or (u.business_name or u.name or "U")[:2].upper(),
        "online": u.online,
        "followers": u.followers_count,
        "totalSales": u.total_sales,
        "rating": u.rating,
        "reviews": u.reviews_count,
        "badge": u.badge,
        "coverColor": u.cover_color,
        "whatsapp": u.whatsapp or u.phone,
        "joined": u.joined_label or u.created_at.strftime("%b %Y"),
    }

def ser_product(p: Product, db: Session) -> dict:
    seller = db.query(User).filter(User.id == p.seller_id).first()
    try:
        tags = json.loads(p.tags) if p.tags else []
    except Exception:
        tags = []
    delta = datetime.utcnow() - p.created_at
    if delta.days == 0:
        posted = f"{max(1, delta.seconds // 3600)} hours ago"
    elif delta.days == 1:
        posted = "1 day ago"
    else:
        posted = f"{delta.days} days ago"
    return {
        "id": p.id,
        "title": p.title,
        "category": p.category,
        "price": p.price,
        "dealPrice": p.deal_price,
        "negotiable": p.negotiable,
        "currency": p.currency,
        "sellerId": p.seller_id,
        "sellerName": seller.business_name or seller.name if seller else "",
        "sellerAvatar": seller.avatar or (seller.business_name or seller.name or "S")[:2].upper() if seller else "S",
        "sellerOnline": seller.online if seller else False,
        "location": p.location,
        "neighborhood": p.neighborhood,
        "condition": p.condition,
        "stock": p.stock,
        "description": p.description,
        "tags": tags,
        "postedAt": posted,
        "views": p.views,
        "saves": p.saves,
        "featured": p.featured,
        "status": p.status,
    }

def ser_seller(u: User, db: Session) -> dict:
    listing_count = db.query(func.count(Product.id)).filter(
        Product.seller_id == u.id, Product.status == "active"
    ).scalar()
    d = ser_user(u)
    d["listings"] = listing_count
    return d

def ser_inquiry(inq: Inquiry, db: Session, viewer_id: int) -> dict:
    buyer  = db.query(User).filter(User.id == inq.buyer_id).first()
    seller = db.query(User).filter(User.id == inq.seller_id).first()
    msgs   = db.query(Message).filter(Message.inquiry_id == inq.id).order_by(Message.created_at).all()
    return {
        "id": inq.id,
        "productId": inq.product_id,
        "productTitle": inq.product_title,
        "sellerId": inq.seller_id,
        "sellerName": seller.business_name or seller.name if seller else "",
        "sellerAvatar": seller.avatar or (seller.business_name or seller.name or "S")[:2].upper() if seller else "S",
        "buyerId": inq.buyer_id,
        "buyerName": buyer.name if buyer else "",
        "buyerAvatar": buyer.avatar or (buyer.name or "B")[:2].upper() if buyer else "B",
        "lastMsg": msgs[-1].text if msgs else "",
        "time": _time_label(inq.updated_at),
        "unread": sum(1 for m in msgs if m.sender_id != viewer_id),
        "messages": [
            {
                "from": "buyer" if m.sender_role == "buyer" else "seller",
                "text": m.text,
                "time": _time_label(m.created_at),
            }
            for m in msgs
        ],
    }

def _time_label(dt: datetime) -> str:
    if not dt:
        return ""
    delta = datetime.utcnow() - dt
    if delta.seconds < 60:
        return "Just now"
    if delta.seconds < 3600:
        return f"{delta.seconds // 60}m ago"
    if delta.days == 0:
        return f"{delta.seconds // 3600}h ago"
    if delta.days == 1:
        return "1 day ago"
    return f"{delta.days} days ago"

def ser_wanted(ad: WantedAd, db: Session) -> dict:
    offers_count = db.query(func.count(WantedOffer.id)).filter(WantedOffer.wanted_id == ad.id).scalar()
    return {
        "id": ad.id,
        "title": ad.title,
        "category": ad.category,
        "budget": ad.budget,
        "location": ad.location,
        "neighborhood": ad.neighborhood,
        "buyerName": ad.buyer_name,
        "buyerAvatar": ad.buyer_avatar,
        "posted": _time_label(ad.created_at),
        "responses": offers_count,
        "urgent": ad.urgent,
        "description": ad.description,
        "status": ad.status,
    }

# ── Pydantic input schemas ────────────────────────────────────────────────

class RegisterIn(BaseModel):
    name: str
    phone: str
    password: Optional[str] = None
    role: str = "buyer"
    email: Optional[str] = None
    location: Optional[str] = None
    business: Optional[str] = None

class LoginIn(BaseModel):
    phone: str
    password: str
    role: Optional[str] = None

class LoginOtpIn(BaseModel):
    phone: str

class ProductIn(BaseModel):
    title: str
    category: str
    price: float
    dealPrice: Optional[float] = None
    negotiable: bool = True
    condition: str = "New"
    stock: int = 1
    description: Optional[str] = None
    tags: Optional[List[str]] = []
    location: Optional[str] = None
    neighborhood: Optional[str] = None

class MessageIn(BaseModel):
    text: str

class InquiryIn(BaseModel):
    sellerId: int
    productId: Optional[int] = None
    productTitle: Optional[str] = None
    message: str

class WantedIn(BaseModel):
    title: str
    category: Optional[str] = None
    budget: Optional[float] = None
    location: str = "Kampala"
    description: Optional[str] = None
    urgent: bool = False

class OfferIn(BaseModel):
    price: float
    note: Optional[str] = None

class DeliveryIn(BaseModel):
    pickup: str
    dropoff: str
    item: str
    size: str = "small"
    notes: Optional[str] = None

class ReviewIn(BaseModel):
    sellerId: int
    productId: Optional[int] = None
    rating: int
    comment: str

class StatusIn(BaseModel):
    status: str

# ── AUTH ──────────────────────────────────────────────────────────────────

@app.post("/api/auth/register")
def register(body: RegisterIn, db: Session = Depends(get_db)):
    if db.query(User).filter(User.phone == body.phone).first():
        raise HTTPException(400, "Phone already registered")
    if body.email and db.query(User).filter(User.email == body.email).first():
        raise HTTPException(400, "Email already registered")
    pw = body.password if body.password else secrets.token_hex(32)
    user = User(
        name=body.name,
        phone=body.phone,
        email=body.email,
        password_hash=hash_password(pw),
        role=body.role,
        location=body.location,
        business_name=body.business,
        whatsapp=body.phone,
        online=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    token = create_token({"sub": str(user.id), "role": user.role})
    return {"token": token, "user": ser_user(user)}

@app.post("/api/auth/login")
def login(body: LoginIn, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.phone == body.phone).first()
    if not user or not check_password(body.password, user.password_hash):
        raise HTTPException(401, "Invalid phone or password")
    if user.status == "suspended":
        raise HTTPException(403, "Account suspended")
    token = create_token({"sub": str(user.id), "role": user.role})
    return {"token": token, "user": ser_user(user)}

@app.post("/api/auth/login-otp")
def login_otp(body: LoginOtpIn, db: Session = Depends(get_db)):
    """Firebase already verified the phone — just issue a JWT."""
    user = db.query(User).filter(User.phone == body.phone).first()
    if not user:
        raise HTTPException(404, "No account found for this phone number. Please register first.")
    if user.status == "suspended":
        raise HTTPException(403, "Account suspended")
    token = create_token({"sub": str(user.id), "role": user.role})
    return {"token": token, "user": ser_user(user)}

@app.get("/api/auth/me")
def me(user: User = Depends(get_current_user)):
    return ser_user(user)

# ── PRODUCTS ──────────────────────────────────────────────────────────────

@app.get("/api/products")
def list_products(
    search: str = Query(""),
    category: str = Query("all"),
    sort: str = Query("trending"),
    price_max: float = Query(50000000),
    condition: str = Query("all"),
    neighborhood: str = Query("all"),
    db: Session = Depends(get_db),
):
    q = db.query(Product).filter(Product.status == "active")
    if search:
        q = q.filter(Product.title.ilike(f"%{search}%"))
    if category and category != "all":
        q = q.filter(Product.category == category)
    if condition and condition != "all":
        q = q.filter(Product.condition == condition)
    if neighborhood and neighborhood != "all":
        q = q.filter(Product.neighborhood == neighborhood)
    q = q.filter(Product.price <= price_max)
    if sort == "price-asc":
        q = q.order_by(Product.price.asc())
    elif sort == "price-desc":
        q = q.order_by(Product.price.desc())
    elif sort == "newest":
        q = q.order_by(Product.created_at.desc())
    else:  # trending
        q = q.order_by(Product.views.desc())
    return [ser_product(p, db) for p in q.all()]

@app.get("/api/products/{product_id}")
def get_product(product_id: int, db: Session = Depends(get_db)):
    p = db.query(Product).filter(Product.id == product_id).first()
    if not p:
        raise HTTPException(404, "Product not found")
    p.views += 1
    db.commit()
    return ser_product(p, db)

@app.post("/api/products")
def create_product(body: ProductIn, user: User = Depends(require_role("seller", "admin")), db: Session = Depends(get_db)):
    p = Product(
        title=body.title,
        category=body.category,
        price=body.price,
        deal_price=body.dealPrice,
        negotiable=body.negotiable,
        condition=body.condition,
        stock=body.stock,
        description=body.description,
        tags=json.dumps(body.tags or []),
        location=user.location or "Kampala",
        neighborhood=body.neighborhood or "all",
        seller_id=user.id,
        status="active",
    )
    db.add(p)
    db.commit()
    db.refresh(p)
    return ser_product(p, db)

@app.put("/api/products/{product_id}")
def update_product(product_id: int, body: ProductIn, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    p = db.query(Product).filter(Product.id == product_id).first()
    if not p:
        raise HTTPException(404, "Not found")
    if p.seller_id != user.id and user.role != "admin":
        raise HTTPException(403, "Forbidden")
    p.title = body.title; p.category = body.category; p.price = body.price
    p.deal_price = body.dealPrice; p.negotiable = body.negotiable
    p.condition = body.condition; p.stock = body.stock
    p.description = body.description; p.tags = json.dumps(body.tags or [])
    db.commit()
    return ser_product(p, db)

@app.delete("/api/products/{product_id}")
def delete_product(product_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    p = db.query(Product).filter(Product.id == product_id).first()
    if not p:
        raise HTTPException(404, "Not found")
    if p.seller_id != user.id and user.role != "admin":
        raise HTTPException(403, "Forbidden")
    db.delete(p)
    db.commit()
    return {"ok": True}

@app.get("/api/my-products")
def my_products(user: User = Depends(require_role("seller")), db: Session = Depends(get_db)):
    prods = db.query(Product).filter(Product.seller_id == user.id).order_by(Product.created_at.desc()).all()
    return [ser_product(p, db) for p in prods]

# ── WISHLIST ──────────────────────────────────────────────────────────────

@app.get("/api/wishlist")
def get_wishlist(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    wl = db.query(Wishlist).filter(Wishlist.user_id == user.id).all()
    ids = [w.product_id for w in wl]
    prods = db.query(Product).filter(Product.id.in_(ids)).all()
    return [ser_product(p, db) for p in prods]

@app.post("/api/wishlist/{product_id}")
def add_wishlist(product_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if db.query(Wishlist).filter(Wishlist.user_id == user.id, Wishlist.product_id == product_id).first():
        return {"ok": True}
    p = db.query(Product).filter(Product.id == product_id).first()
    if p:
        p.saves += 1
    db.add(Wishlist(user_id=user.id, product_id=product_id))
    db.commit()
    return {"ok": True}

@app.delete("/api/wishlist/{product_id}")
def remove_wishlist(product_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    w = db.query(Wishlist).filter(Wishlist.user_id == user.id, Wishlist.product_id == product_id).first()
    if w:
        db.delete(w)
        p = db.query(Product).filter(Product.id == product_id).first()
        if p and p.saves > 0:
            p.saves -= 1
        db.commit()
    return {"ok": True}

@app.get("/api/wishlist/ids")
def wishlist_ids(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return [w.product_id for w in db.query(Wishlist).filter(Wishlist.user_id == user.id).all()]

# ── SELLERS ───────────────────────────────────────────────────────────────

@app.get("/api/sellers")
def list_sellers(db: Session = Depends(get_db)):
    sellers = db.query(User).filter(User.role == "seller", User.status == "active").all()
    return [ser_seller(s, db) for s in sellers]

@app.get("/api/sellers/{seller_id}")
def get_seller(seller_id: int, db: Session = Depends(get_db)):
    s = db.query(User).filter(User.id == seller_id).first()
    if not s:
        raise HTTPException(404, "Seller not found")
    return ser_seller(s, db)

# ── FOLLOWS ───────────────────────────────────────────────────────────────

@app.get("/api/follow")
def get_followed(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    follows = db.query(Follow).filter(Follow.follower_id == user.id).all()
    ids = [f.seller_id for f in follows]
    sellers = db.query(User).filter(User.id.in_(ids)).all()
    return [ser_seller(s, db) for s in sellers]

@app.post("/api/follow/{seller_id}")
def follow(seller_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not db.query(Follow).filter(Follow.follower_id == user.id, Follow.seller_id == seller_id).first():
        db.add(Follow(follower_id=user.id, seller_id=seller_id))
        seller = db.query(User).filter(User.id == seller_id).first()
        if seller:
            seller.followers_count += 1
        db.commit()
    return {"ok": True}

@app.delete("/api/follow/{seller_id}")
def unfollow(seller_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    f = db.query(Follow).filter(Follow.follower_id == user.id, Follow.seller_id == seller_id).first()
    if f:
        db.delete(f)
        seller = db.query(User).filter(User.id == seller_id).first()
        if seller and seller.followers_count > 0:
            seller.followers_count -= 1
        db.commit()
    return {"ok": True}

# ── INQUIRIES ─────────────────────────────────────────────────────────────

@app.get("/api/inquiries")
def get_inquiries(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if user.role == "seller":
        inqs = db.query(Inquiry).filter(Inquiry.seller_id == user.id).order_by(Inquiry.updated_at.desc()).all()
    else:
        inqs = db.query(Inquiry).filter(Inquiry.buyer_id == user.id).order_by(Inquiry.updated_at.desc()).all()
    return [ser_inquiry(i, db, user.id) for i in inqs]

@app.post("/api/inquiries")
def create_inquiry(body: InquiryIn, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Reuse existing thread for same buyer-seller-product combo
    existing = db.query(Inquiry).filter(
        Inquiry.buyer_id == user.id,
        Inquiry.seller_id == body.sellerId,
        Inquiry.product_id == body.productId,
    ).first()
    if existing:
        inq = existing
    else:
        inq = Inquiry(
            buyer_id=user.id,
            seller_id=body.sellerId,
            product_id=body.productId,
            product_title=body.productTitle,
        )
        db.add(inq)
        db.flush()
    msg = Message(inquiry_id=inq.id, sender_id=user.id, sender_role=user.role, text=body.message)
    db.add(msg)
    inq.updated_at = datetime.utcnow()
    # Notify seller
    db.add(Notification(
        user_id=body.sellerId,
        type="inquiry_reply",
        message=f"{user.name} sent an inquiry about {body.productTitle or 'a listing'}",
        product_id=body.productId,
    ))
    db.commit()
    return ser_inquiry(inq, db, user.id)

@app.post("/api/inquiries/{inquiry_id}/message")
def send_message(inquiry_id: int, body: MessageIn, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    inq = db.query(Inquiry).filter(Inquiry.id == inquiry_id).first()
    if not inq:
        raise HTTPException(404, "Thread not found")
    if user.id not in (inq.buyer_id, inq.seller_id):
        raise HTTPException(403, "Forbidden")
    msg = Message(inquiry_id=inq.id, sender_id=user.id, sender_role=user.role, text=body.text)
    db.add(msg)
    inq.updated_at = datetime.utcnow()
    # Notify the other party
    other_id = inq.buyer_id if user.id == inq.seller_id else inq.seller_id
    db.add(Notification(user_id=other_id, type="inquiry_reply", message=f"New message from {user.name}"))
    db.commit()
    return {"ok": True, "message": {"from": user.role, "text": body.text, "time": "Just now"}}

# ── NOTIFICATIONS ─────────────────────────────────────────────────────────

@app.get("/api/notifications")
def get_notifications(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    notifs = db.query(Notification).filter(Notification.user_id == user.id).order_by(Notification.created_at.desc()).limit(30).all()
    return [{"id": n.id, "type": n.type, "message": n.message, "read": n.read, "productId": n.product_id, "time": _time_label(n.created_at)} for n in notifs]

@app.put("/api/notifications/read")
def mark_read(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db.query(Notification).filter(Notification.user_id == user.id, Notification.read == False).update({"read": True})
    db.commit()
    return {"ok": True}

# ── WANTED ADS ────────────────────────────────────────────────────────────

@app.get("/api/wanted")
def list_wanted(db: Session = Depends(get_db)):
    ads = db.query(WantedAd).filter(WantedAd.status == "open").order_by(WantedAd.created_at.desc()).all()
    return [ser_wanted(a, db) for a in ads]

@app.post("/api/wanted")
def create_wanted(body: WantedIn, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    ad = WantedAd(
        buyer_id=user.id,
        buyer_name=user.name,
        buyer_avatar=user.avatar or user.name[:2].upper(),
        title=body.title,
        category=body.category,
        budget=body.budget,
        location=body.location,
        description=body.description,
        urgent=body.urgent,
    )
    db.add(ad)
    db.commit()
    db.refresh(ad)
    return ser_wanted(ad, db)

@app.get("/api/wanted/{wanted_id}")
def get_wanted(wanted_id: int, db: Session = Depends(get_db)):
    ad = db.query(WantedAd).filter(WantedAd.id == wanted_id).first()
    if not ad:
        raise HTTPException(404, "Not found")
    offers = db.query(WantedOffer).filter(WantedOffer.wanted_id == wanted_id).order_by(WantedOffer.price.asc()).all()
    result = ser_wanted(ad, db)
    result["offers"] = [
        {"id": o.id, "sellerName": o.seller_name, "sellerAvatar": o.seller_avatar,
         "sellerRating": o.seller_rating, "verified": o.verified,
         "price": o.price, "note": o.note, "time": _time_label(o.created_at)}
        for o in offers
    ]
    return result

@app.post("/api/wanted/{wanted_id}/offer")
def submit_offer(wanted_id: int, body: OfferIn, user: User = Depends(require_role("seller")), db: Session = Depends(get_db)):
    ad = db.query(WantedAd).filter(WantedAd.id == wanted_id).first()
    if not ad:
        raise HTTPException(404, "Not found")
    offer = WantedOffer(
        wanted_id=wanted_id,
        seller_id=user.id,
        seller_name=user.business_name or user.name,
        seller_avatar=user.avatar or (user.business_name or user.name)[:2].upper(),
        seller_rating=user.rating,
        verified=user.verified,
        price=body.price,
        note=body.note,
    )
    db.add(offer)
    db.add(Notification(
        user_id=ad.buyer_id,
        type="wanted_bid",
        message=f"{user.business_name or user.name} made an offer on your wanted ad: {ad.title}",
    ))
    db.commit()
    return {"ok": True}

# ── REVIEWS ───────────────────────────────────────────────────────────────

@app.get("/api/reviews/seller/{seller_id}")
def seller_reviews(seller_id: int, db: Session = Depends(get_db)):
    revs = db.query(Review).filter(Review.seller_id == seller_id).order_by(Review.created_at.desc()).all()
    return [{"id": r.id, "buyerName": r.buyer_name, "rating": r.rating, "comment": r.comment, "date": _time_label(r.created_at)} for r in revs]

@app.post("/api/reviews")
def create_review(body: ReviewIn, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    rev = Review(product_id=body.productId, seller_id=body.sellerId, buyer_id=user.id,
                 buyer_name=user.name, rating=body.rating, comment=body.comment)
    db.add(rev)
    seller = db.query(User).filter(User.id == body.sellerId).first()
    if seller:
        all_revs = db.query(Review).filter(Review.seller_id == body.sellerId).all()
        total = sum(r.rating for r in all_revs) + body.rating
        seller.rating = round(total / (len(all_revs) + 1), 1)
        seller.reviews_count += 1
    db.commit()
    return {"ok": True}

# ── COURIER ───────────────────────────────────────────────────────────────

@app.get("/api/courier/riders")
def get_riders(db: Session = Depends(get_db)):
    riders = db.query(CourierRider).all()
    return [{"id": r.id, "name": r.name, "avatar": r.avatar, "vehicle": r.vehicle,
             "zone": r.zone, "rating": r.rating, "trips": r.trips, "online": r.online,
             "phone": r.phone, "fee": r.fee} for r in riders]

@app.post("/api/courier/request")
def request_delivery(body: DeliveryIn, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    fee_map = {"small": 3.0, "medium": 5.5, "large": 11.0}
    rider = db.query(CourierRider).filter(CourierRider.online == True).first()
    job = DeliveryJob(
        buyer_id=user.id,
        item=body.item,
        from_location=body.pickup,
        to_location=body.dropoff,
        status="in_transit" if rider else "pending",
        fee=fee_map.get(body.size, 3.0),
        rider_id=rider.id if rider else None,
        rider_name=rider.name if rider else None,
        rider_avatar=rider.avatar if rider else None,
    )
    db.add(job)
    db.commit()
    db.refresh(job)
    return {"id": job.id, "status": job.status, "riderName": job.rider_name,
            "riderAvatar": job.rider_avatar, "fee": job.fee, "eta": "~20 mins"}

@app.get("/api/courier/deliveries")
def my_deliveries(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    jobs = db.query(DeliveryJob).filter(DeliveryJob.buyer_id == user.id).order_by(DeliveryJob.created_at.desc()).all()
    return [{"id": j.id, "item": j.item, "from": j.from_location, "to": j.to_location,
             "status": j.status, "fee": j.fee, "rider": j.rider_name,
             "riderAvatar": j.rider_avatar, "eta": "~20 mins", "orderedAt": _time_label(j.created_at)} for j in jobs]

# ── ADMIN ─────────────────────────────────────────────────────────────────

@app.get("/api/admin/stats")
def admin_stats(user: User = Depends(require_role("admin")), db: Session = Depends(get_db)):
    return {
        "totalUsers": db.query(func.count(User.id)).scalar(),
        "activeSellers": db.query(func.count(User.id)).filter(User.role == "seller", User.status == "active").scalar(),
        "totalListings": db.query(func.count(Product.id)).filter(Product.status == "active").scalar(),
        "pendingReview": db.query(func.count(Product.id)).filter(Product.status == "pending").scalar(),
        "openReports": db.query(func.count(Report.id)).filter(Report.status == "open").scalar(),
        "monthlyInquiries": db.query(func.count(Inquiry.id)).scalar(),
    }

@app.get("/api/admin/users")
def admin_users(user: User = Depends(require_role("admin")), db: Session = Depends(get_db)):
    users = db.query(User).order_by(User.created_at.desc()).all()
    return [ser_user(u) for u in users]

@app.put("/api/admin/users/{user_id}/status")
def admin_set_user_status(user_id: int, body: StatusIn, user: User = Depends(require_role("admin")), db: Session = Depends(get_db)):
    u = db.query(User).filter(User.id == user_id).first()
    if not u:
        raise HTTPException(404, "User not found")
    u.status = body.status
    db.commit()
    return ser_user(u)

@app.get("/api/admin/listings/pending")
def admin_pending(user: User = Depends(require_role("admin")), db: Session = Depends(get_db)):
    prods = db.query(Product).filter(Product.status == "pending").order_by(Product.created_at.desc()).all()
    return [ser_product(p, db) for p in prods]

@app.put("/api/admin/listings/{product_id}/status")
def admin_listing_status(product_id: int, body: StatusIn, user: User = Depends(require_role("admin")), db: Session = Depends(get_db)):
    p = db.query(Product).filter(Product.id == product_id).first()
    if not p:
        raise HTTPException(404, "Not found")
    p.status = body.status
    db.commit()
    return {"ok": True}

@app.get("/api/admin/reports")
def admin_reports(user: User = Depends(require_role("admin")), db: Session = Depends(get_db)):
    reports = db.query(Report).order_by(Report.created_at.desc()).all()
    return [{"id": r.id, "type": r.type, "listing": r.listing_title, "reporter": r.reporter_name,
             "status": r.status, "severity": r.severity, "time": _time_label(r.created_at)} for r in reports]

@app.put("/api/admin/reports/{report_id}/status")
def admin_report_status(report_id: int, body: StatusIn, user: User = Depends(require_role("admin")), db: Session = Depends(get_db)):
    r = db.query(Report).filter(Report.id == report_id).first()
    if not r:
        raise HTTPException(404, "Not found")
    r.status = body.status
    db.commit()
    return {"ok": True}

@app.get("/api/admin/featured")
def admin_featured(user: User = Depends(require_role("admin")), db: Session = Depends(get_db)):
    prods = db.query(Product).filter(Product.featured == True).all()
    return [ser_product(p, db) for p in prods]

@app.post("/api/admin/featured/{product_id}")
def admin_add_featured(product_id: int, user: User = Depends(require_role("admin")), db: Session = Depends(get_db)):
    count = db.query(func.count(Product.id)).filter(Product.featured == True).scalar()
    if count >= 6:
        raise HTTPException(400, "Maximum 6 featured slots")
    p = db.query(Product).filter(Product.id == product_id).first()
    if not p:
        raise HTTPException(404, "Not found")
    p.featured = True
    db.commit()
    return {"ok": True}

@app.delete("/api/admin/featured/{product_id}")
def admin_remove_featured(product_id: int, user: User = Depends(require_role("admin")), db: Session = Depends(get_db)):
    p = db.query(Product).filter(Product.id == product_id).first()
    if p:
        p.featured = False
        db.commit()
    return {"ok": True}

# ── SEED ──────────────────────────────────────────────────────────────────

def seed(db: Session):
    if db.query(User).first():
        return  # already seeded

    from seed import run_seed
    run_seed(db)


@app.on_event("startup")
def startup():
    db = next(get_db())
    try:
        seed(db)
    finally:
        db.close()
