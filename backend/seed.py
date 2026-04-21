"""Seed the database with the same data as jm-data.js."""
import json
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from models import User, Product, Review, Notification, WantedAd, CourierRider, DeliveryJob, Report
from auth import hash_password


def run_seed(db: Session):
    # ── Sellers ──────────────────────────────────────────────────────────
    sellers_data = [
        dict(name="Akol Deng", business_name="Akol Electronics", phone="+211912345678",
             email="akol.electronics@gmail.com", role="seller", location="Juba, Central Equatoria",
             verified=True, online=True, total_sales=342, followers_count=287, rating=4.8,
             reviews_count=124, cover_color="#1a1a2e", badge="Top Seller",
             description="Quality electronics and accessories sourced from Kampala and Dubai. Fast delivery within Juba.",
             joined_label="Jan 2024", avatar="AE", whatsapp="+211912345678"),
        dict(name="Nyakim Mary", business_name="Nyakim Fashions", phone="+211927654321",
             email="nyakim.fashion@yahoo.com", role="seller", location="Juba, Munuki",
             verified=True, online=False, total_sales=215, followers_count=143, rating=4.6,
             reviews_count=89, cover_color="#6b2737", badge="Verified",
             description="Traditional and modern clothing for men, women and children. Custom tailoring available.",
             joined_label="Mar 2023", avatar="NF", whatsapp="+211927654321"),
        dict(name="James Green", business_name="Green Valley Farm", phone="+211955111222",
             email="greenvalley.farm@gmail.com", role="seller", location="Yei, Central Equatoria",
             verified=True, online=True, total_sales=891, followers_count=512, rating=4.9,
             reviews_count=203, cover_color="#2d5016", badge="Top Seller",
             description="Fresh organic produce direct from our farm. Wholesale and retail. Delivery to Juba available.",
             joined_label="Jun 2023", avatar="GV", whatsapp="+211955111222"),
        dict(name="Deng Majok", business_name="Deng Furniture Works", phone="+211901234567",
             email="deng.furniture@gmail.com", role="seller", location="Juba, Gudele",
             verified=False, online=False, total_sales=128, followers_count=78, rating=4.7,
             reviews_count=56, cover_color="#5c3d2e", badge=None,
             description="Custom hardwood furniture made to order. Living room, bedroom, and office furniture.",
             joined_label="Aug 2022", avatar="DF", whatsapp="+211901234567"),
        dict(name="John Ladu", business_name="Juba Auto Parts", phone="+211923456789",
             email="juba.autoparts@gmail.com", role="seller", location="Juba, Konyo Konyo",
             verified=True, online=True, total_sales=445, followers_count=201, rating=4.5,
             reviews_count=67, cover_color="#1c2938", badge="Verified",
             description="Genuine and quality spare parts for Toyota, Isuzu, and Land Rover.",
             joined_label="Feb 2023", avatar="JA", whatsapp="+211923456789"),
    ]

    seller_objs = []
    for s in sellers_data:
        u = User(password_hash=hash_password("seller123"), **s)
        db.add(u)
        seller_objs.append(u)
    db.flush()

    # ── Buyers ───────────────────────────────────────────────────────────
    buyer = User(name="Ayen Deng", phone="+211900000001", email="buyer@juba.ss",
                 password_hash=hash_password("buyer123"), role="buyer",
                 location="Juba, Central Equatoria", avatar="AD")
    db.add(buyer)

    # ── Admin ────────────────────────────────────────────────────────────
    admin = User(name="Admin", phone="+211900000000", email="admin@juba.ss",
                 password_hash=hash_password("admin123"), role="admin",
                 avatar="AD", verified=True)
    db.add(admin)
    db.flush()

    s1, s2, s3, s4, s5 = seller_objs

    # ── Products ─────────────────────────────────────────────────────────
    products_data = [
        dict(title="Samsung Galaxy A14 — 64GB", category="electronics", price=350, negotiable=True,
             seller_id=s1.id, location="Juba", neighborhood="konyo-konyo", condition="New",
             stock=8, description="Brand new Samsung Galaxy A14 with 64GB storage, 4GB RAM. Comes with charger and original box. 6-month warranty included.",
             tags='["smartphone","android","samsung"]', views=184, saves=23, featured=True, created_at=datetime.utcnow() - timedelta(hours=2)),
        dict(title="Traditional Dinka Wedding Dress", category="clothing", price=120, negotiable=True,
             seller_id=s2.id, location="Juba", neighborhood="munuki", condition="New",
             stock=3, description="Beautifully handcrafted traditional Dinka wedding attire with intricate bead work. Custom sizing available.",
             tags='["traditional","wedding","dinka","dress"]', views=320, saves=47, featured=True, created_at=datetime.utcnow() - timedelta(weeks=1)),
        dict(title="Fresh Cassava — 50kg Sack", category="food", price=25, deal_price=20, negotiable=True,
             seller_id=s3.id, location="Yei", neighborhood="yei", condition="Fresh",
             stock=50, description="Farm-fresh cassava harvested this week. Available in 50kg sacks. Bulk discounts for orders over 10 sacks.",
             tags='["cassava","fresh","wholesale","organic"]', views=97, saves=12, featured=False, created_at=datetime.utcnow() - timedelta(days=3)),
        dict(title="Hardwood Dining Table Set (6 chairs)", category="furniture", price=480, negotiable=True,
             seller_id=s4.id, location="Juba", neighborhood="gudele", condition="New",
             stock=2, description="Solid hardwood dining table with 6 matching chairs. Dark mahogany finish. 180cm x 90cm.",
             tags='["furniture","dining","hardwood","table"]', views=211, saves=38, featured=True, created_at=datetime.utcnow() - timedelta(days=5)),
        dict(title="iPhone 12 — 128GB", category="electronics", price=280, negotiable=False,
             seller_id=s1.id, location="Juba", neighborhood="konyo-konyo", condition="Used - Good",
             stock=1, description="iPhone 12 in excellent condition. Battery health 89%. Minor scratches on back. Original charger included.",
             tags='["iphone","apple","smartphone"]', views=456, saves=61, featured=False, created_at=datetime.utcnow() - timedelta(days=1)),
        dict(title="Men's African Print Shirt", category="clothing", price=18, negotiable=True,
             seller_id=s2.id, location="Juba", neighborhood="munuki", condition="New",
             stock=20, description="Vibrant African Ankara print shirts for men. Available in M, L, XL, XXL. Multiple patterns.",
             tags='["shirt","ankara","african","men"]', views=143, saves=19, featured=False, created_at=datetime.utcnow() - timedelta(days=4)),
        dict(title="Solar Panel Kit — 200W", category="electronics", price=195, deal_price=170, negotiable=True,
             seller_id=s1.id, location="Juba", neighborhood="konyo-konyo", condition="New",
             stock=5, description="200W solar panel complete kit with charge controller, battery clips and mounting hardware.",
             tags='["solar","power","energy","off-grid"]', views=388, saves=54, featured=True, created_at=datetime.utcnow() - timedelta(days=6)),
        dict(title="Maize — 100kg Bag", category="food", price=40, negotiable=True,
             seller_id=s3.id, location="Yei", neighborhood="yei", condition="Fresh",
             stock=200, description="High-quality dried maize, 100kg bags. Suitable for human consumption and animal feed.",
             tags='["maize","corn","grain","wholesale"]', views=72, saves=8, featured=False, created_at=datetime.utcnow() - timedelta(weeks=1)),
        dict(title="Toyota Land Cruiser — Front Bumper", category="vehicles", price=220, negotiable=True,
             seller_id=s5.id, location="Juba", neighborhood="konyo-konyo", condition="New",
             stock=3, description="Genuine Toyota Land Cruiser 70 Series front bumper. Steel, powder-coated black. Fits 2010–2022 models.",
             tags='["toyota","bumper","parts","landcruiser"]', views=267, saves=41, featured=False, created_at=datetime.utcnow() - timedelta(days=2)),
        dict(title="Live Goats — Pair", category="livestock", price=150, negotiable=True,
             seller_id=s3.id, location="Yei", neighborhood="yei", condition="Live",
             stock=10, description="Healthy Nubian goats, male and female pair. Vaccinated. Good for breeding or ceremony.",
             tags='["goats","livestock","animals","breeding"]', views=134, saves=21, featured=False, created_at=datetime.utcnow() - timedelta(days=3)),
        dict(title="Cement — 50kg Bag (Dangote)", category="building", price=12, negotiable=False,
             seller_id=s1.id, location="Juba", neighborhood="jebel", condition="New",
             stock=500, description="Dangote cement 50kg bags. Available in bulk. Delivery within Juba for orders of 50+ bags.",
             tags='["cement","building","construction","dangote"]', views=89, saves=15, featured=True, created_at=datetime.utcnow() - timedelta(days=1)),
        dict(title="Handwoven Nuer Basket", category="crafts", price=35, negotiable=True,
             seller_id=s2.id, location="Juba", neighborhood="kator", condition="New",
             stock=8, description="Beautiful handwoven basket by Nuer artisans. Each piece unique. Used for storage, decoration or gifting.",
             tags='["basket","handmade","nuer","craft"]', views=58, saves=17, featured=False, created_at=datetime.utcnow() - timedelta(days=5)),
    ]

    prod_objs = []
    for pd in products_data:
        p = Product(**pd)
        db.add(p)
        prod_objs.append(p)
    db.flush()

    # ── Reviews ──────────────────────────────────────────────────────────
    reviews = [
        Review(product_id=prod_objs[0].id, seller_id=s1.id, buyer_id=buyer.id,
               buyer_name="Ayen Deng", rating=5,
               comment="Excellent seller! Phone was exactly as described, fast response on WhatsApp.",
               created_at=datetime.utcnow() - timedelta(days=3)),
        Review(product_id=prod_objs[3].id, seller_id=s4.id, buyer_id=buyer.id,
               buyer_name="Peter Majok", rating=4,
               comment="Good quality furniture, took a bit longer than expected but worth it.",
               created_at=datetime.utcnow() - timedelta(weeks=1)),
        Review(product_id=prod_objs[2].id, seller_id=s3.id, buyer_id=buyer.id,
               buyer_name="Rebecca Ladu", rating=5,
               comment="Fresh cassava every time. Green Valley Farm is trustworthy. Always deliver on time!",
               created_at=datetime.utcnow() - timedelta(weeks=2)),
        Review(product_id=prod_objs[6].id, seller_id=s1.id, buyer_id=buyer.id,
               buyer_name="John Wol", rating=5,
               comment="Solar kit working perfectly. Saved me from buying generator fuel.",
               created_at=datetime.utcnow() - timedelta(weeks=4)),
    ]
    for r in reviews:
        db.add(r)

    # ── Notifications ─────────────────────────────────────────────────────
    for msg_data in [
        dict(user_id=buyer.id, type="price_drop", message="Solar Panel Kit dropped from $220 to $195!", read=False, product_id=prod_objs[6].id),
        dict(user_id=buyer.id, type="new_listing", message="Akol Electronics posted a new item you might like", read=False, product_id=prod_objs[10].id),
        dict(user_id=buyer.id, type="inquiry_reply", message="Akol Electronics replied to your inquiry about iPhone 12", read=True, product_id=prod_objs[4].id),
        dict(user_id=buyer.id, type="deal", message="Today's Deal: Fresh Cassava — 20% off, ends tonight!", read=True, product_id=prod_objs[2].id),
        dict(user_id=buyer.id, type="delivery", message="Your delivery from Akol Electronics is on the way! 🚚", read=False),
    ]:
        db.add(Notification(created_at=datetime.utcnow() - timedelta(hours=1), **msg_data))

    # ── Wanted Ads ───────────────────────────────────────────────────────
    wanted = [
        WantedAd(buyer_id=buyer.id, buyer_name="James Wol", buyer_avatar="JW",
                 title="Looking for a Generator — 5KVA", category="electronics", budget=800,
                 location="Juba", neighborhood="gudele", urgent=True,
                 description="Need a reliable petrol generator for home use. Prefer Honda or Sumec brand. Must come with warranty.",
                 created_at=datetime.utcnow() - timedelta(hours=1)),
        WantedAd(buyer_id=buyer.id, buyer_name="Mary Akot", buyer_avatar="MA",
                 title="Need 500kg of Groundnuts — Wholesale", category="food", budget=400,
                 location="Juba", neighborhood="all", urgent=False,
                 description="Looking for groundnuts supplier for my processing business. Need regular monthly supply.",
                 created_at=datetime.utcnow() - timedelta(hours=3)),
        WantedAd(buyer_id=buyer.id, buyer_name="David Lado", buyer_avatar="DL",
                 title="Toyota Hilux 2014–2018 — Any Condition", category="vehicles", budget=7000,
                 location="Juba", neighborhood="all", urgent=False,
                 description="Looking to buy a Toyota Hilux single or double cab. Any color. Must be mechanically sound.",
                 created_at=datetime.utcnow() - timedelta(hours=5)),
        WantedAd(buyer_id=buyer.id, buyer_name="NGO Procurement", buyer_avatar="NP",
                 title="Office Chairs — 10 Units", category="furniture", budget=300,
                 location="Juba", neighborhood="juba-centre", urgent=True,
                 description="Need 10 ergonomic office chairs for our Juba office. Must deliver. Invoice required.",
                 created_at=datetime.utcnow() - timedelta(days=1)),
        WantedAd(buyer_id=buyer.id, buyer_name="Ayen Deng", buyer_avatar="AD",
                 title="iPhone 13 or 14 — New or Like New", category="electronics", budget=500,
                 location="Juba", neighborhood="all", urgent=False,
                 description="Looking for iPhone 13 or 14 in good condition. Must have original charger and box.",
                 created_at=datetime.utcnow() - timedelta(days=2)),
    ]
    for w in wanted:
        db.add(w)

    # ── Courier Riders ────────────────────────────────────────────────────
    riders = [
        CourierRider(name="Moses Lado", avatar="ML", vehicle="Boda Boda (Motorcycle)",
                     zone="Juba Centre, Konyo Konyo, Gudele", rating=4.9, trips=234, online=True,
                     phone="+211923111222", fee="$2–5 within Juba"),
        CourierRider(name="Simon Deng", avatar="SD", vehicle="Tricycle (Bajaj)",
                     zone="Munuki, Kator, Nyakuron", rating=4.7, trips=189, online=True,
                     phone="+211955333444", fee="$3–8 depending on load"),
        CourierRider(name="Grace Akot", avatar="GA", vehicle="Car (Toyota)",
                     zone="All of Juba", rating=4.8, trips=312, online=False,
                     phone="+211912555666", fee="$5–15 depending on distance"),
    ]
    for r in riders:
        db.add(r)
    db.flush()

    # ── Reports ───────────────────────────────────────────────────────────
    db.add(Report(type="fake_listing", listing_title="iPhone 15 Pro — $50",
                  reporter_name="Ayen Deng", severity="high",
                  created_at=datetime.utcnow() - timedelta(hours=1)))
    db.add(Report(type="scam_attempt", listing_title="MacBook Pro — $80",
                  reporter_name="Peter Majok", severity="high",
                  created_at=datetime.utcnow() - timedelta(hours=3)))
    db.add(Report(type="wrong_category", listing_title="Goat in Electronics",
                  reporter_name="System", severity="low", status="resolved",
                  created_at=datetime.utcnow() - timedelta(days=1)))

    db.commit()
    print("✅ Database seeded successfully")
