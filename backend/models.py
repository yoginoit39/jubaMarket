from sqlalchemy import Column, Integer, String, Float, Boolean, Text, DateTime, ForeignKey
from datetime import datetime
from database import Base


class User(Base):
    __tablename__ = "users"
    id            = Column(Integer, primary_key=True, index=True)
    name          = Column(String, nullable=False)
    email         = Column(String, unique=True, index=True, nullable=True)
    phone         = Column(String, nullable=False)
    password_hash = Column(String, nullable=False)
    role          = Column(String, default="buyer")   # buyer | seller | admin | courier
    location      = Column(String, nullable=True)
    business_name = Column(String, nullable=True)
    description   = Column(String, nullable=True)
    verified      = Column(Boolean, default=False)
    status        = Column(String, default="active")  # active | suspended | pending
    cover_color   = Column(String, default="#1a1a2e")
    badge         = Column(String, nullable=True)
    whatsapp      = Column(String, nullable=True)
    avatar        = Column(String, nullable=True)
    online        = Column(Boolean, default=False)
    followers_count = Column(Integer, default=0)
    total_sales   = Column(Integer, default=0)
    rating        = Column(Float, default=0.0)
    reviews_count = Column(Integer, default=0)
    joined_label  = Column(String, nullable=True)
    created_at    = Column(DateTime, default=datetime.utcnow)


class Product(Base):
    __tablename__ = "products"
    id          = Column(Integer, primary_key=True, index=True)
    title       = Column(String, nullable=False)
    category    = Column(String, nullable=False)
    price       = Column(Float, nullable=False)
    deal_price  = Column(Float, nullable=True)
    negotiable  = Column(Boolean, default=True)
    currency    = Column(String, default="USD")
    seller_id   = Column(Integer, ForeignKey("users.id"), nullable=False)
    location    = Column(String, nullable=True)
    neighborhood = Column(String, nullable=True)
    condition   = Column(String, default="New")
    stock       = Column(Integer, default=1)
    description = Column(Text, nullable=True)
    tags        = Column(Text, default="[]")   # JSON string
    views       = Column(Integer, default=0)
    saves       = Column(Integer, default=0)
    featured    = Column(Boolean, default=False)
    status      = Column(String, default="active")  # active | pending | paused | sold
    created_at  = Column(DateTime, default=datetime.utcnow)


class Wishlist(Base):
    __tablename__ = "wishlists"
    id         = Column(Integer, primary_key=True)
    user_id    = Column(Integer, ForeignKey("users.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class Inquiry(Base):
    __tablename__ = "inquiries"
    id            = Column(Integer, primary_key=True, index=True)
    buyer_id      = Column(Integer, ForeignKey("users.id"), nullable=False)
    seller_id     = Column(Integer, ForeignKey("users.id"), nullable=False)
    product_id    = Column(Integer, nullable=True)
    product_title = Column(String, nullable=True)
    created_at    = Column(DateTime, default=datetime.utcnow)
    updated_at    = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Message(Base):
    __tablename__ = "messages"
    id          = Column(Integer, primary_key=True, index=True)
    inquiry_id  = Column(Integer, ForeignKey("inquiries.id"), nullable=False)
    sender_id   = Column(Integer, ForeignKey("users.id"), nullable=False)
    sender_role = Column(String)   # buyer | seller
    text        = Column(Text, nullable=False)
    created_at  = Column(DateTime, default=datetime.utcnow)


class Notification(Base):
    __tablename__ = "notifications"
    id         = Column(Integer, primary_key=True, index=True)
    user_id    = Column(Integer, ForeignKey("users.id"), nullable=False)
    type       = Column(String)
    message    = Column(String)
    read       = Column(Boolean, default=False)
    product_id = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class WantedAd(Base):
    __tablename__ = "wanted_ads"
    id           = Column(Integer, primary_key=True, index=True)
    buyer_id     = Column(Integer, ForeignKey("users.id"), nullable=False)
    buyer_name   = Column(String)
    buyer_avatar = Column(String)
    title        = Column(String, nullable=False)
    category     = Column(String)
    budget       = Column(Float)
    location     = Column(String, default="Juba")
    neighborhood = Column(String, default="all")
    description  = Column(Text)
    urgent       = Column(Boolean, default=False)
    status       = Column(String, default="open")
    created_at   = Column(DateTime, default=datetime.utcnow)


class WantedOffer(Base):
    __tablename__ = "wanted_offers"
    id          = Column(Integer, primary_key=True, index=True)
    wanted_id   = Column(Integer, ForeignKey("wanted_ads.id"), nullable=False)
    seller_id   = Column(Integer, ForeignKey("users.id"), nullable=False)
    seller_name = Column(String)
    seller_avatar = Column(String)
    seller_rating = Column(Float, default=0.0)
    verified    = Column(Boolean, default=False)
    price       = Column(Float)
    note        = Column(Text)
    created_at  = Column(DateTime, default=datetime.utcnow)


class Follow(Base):
    __tablename__ = "follows"
    id          = Column(Integer, primary_key=True)
    follower_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    seller_id   = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at  = Column(DateTime, default=datetime.utcnow)


class Review(Base):
    __tablename__ = "reviews"
    id          = Column(Integer, primary_key=True, index=True)
    product_id  = Column(Integer, nullable=True)
    seller_id   = Column(Integer, ForeignKey("users.id"), nullable=False)
    buyer_id    = Column(Integer, ForeignKey("users.id"), nullable=False)
    buyer_name  = Column(String)
    rating      = Column(Integer)
    comment     = Column(Text)
    created_at  = Column(DateTime, default=datetime.utcnow)


class CourierRider(Base):
    __tablename__ = "courier_riders"
    id      = Column(Integer, primary_key=True, index=True)
    name    = Column(String)
    avatar  = Column(String)
    vehicle = Column(String)
    zone    = Column(String)
    rating  = Column(Float, default=5.0)
    trips   = Column(Integer, default=0)
    online  = Column(Boolean, default=True)
    phone   = Column(String)
    fee     = Column(String)


class DeliveryJob(Base):
    __tablename__ = "delivery_jobs"
    id            = Column(Integer, primary_key=True, index=True)
    rider_id      = Column(Integer, ForeignKey("courier_riders.id"), nullable=True)
    buyer_id      = Column(Integer, ForeignKey("users.id"), nullable=False)
    item          = Column(String)
    from_location = Column(String)
    to_location   = Column(String)
    status        = Column(String, default="pending")
    fee           = Column(Float)
    rider_name    = Column(String, nullable=True)
    rider_avatar  = Column(String, nullable=True)
    created_at    = Column(DateTime, default=datetime.utcnow)


class Report(Base):
    __tablename__ = "reports"
    id            = Column(Integer, primary_key=True, index=True)
    type          = Column(String)
    listing_title = Column(String)
    reporter_name = Column(String)
    reporter_id   = Column(Integer, nullable=True)
    status        = Column(String, default="open")
    severity      = Column(String, default="medium")
    created_at    = Column(DateTime, default=datetime.utcnow)
