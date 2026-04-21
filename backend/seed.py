"""Seed the database with Uganda-localised demo data."""
import json
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from models import User, Product, Review, Notification, WantedAd, CourierRider, DeliveryJob, Report
from auth import hash_password


def run_seed(db: Session):
    # ── Sellers ──────────────────────────────────────────────────────────
    sellers_data = [
        dict(name="Moses Ssekandi", business_name="Ssekandi Electronics", phone="+256712345678",
             email="ssekandi.electronics@gmail.com", role="seller", location="Kampala, Owino Market",
             verified=True, online=True, total_sales=342, followers_count=287, rating=4.8,
             reviews_count=124, cover_color="#1a1a2e", badge="Top Seller",
             description="Quality electronics and accessories sourced from Nairobi and Dubai. Fast delivery within Kampala.",
             joined_label="Jan 2024", avatar="SE", whatsapp="+256712345678"),
        dict(name="Sarah Namutebi", business_name="Namutebi Fashions", phone="+256727654321",
             email="namutebi.fashion@yahoo.com", role="seller", location="Kampala, Kabalagala",
             verified=True, online=False, total_sales=215, followers_count=143, rating=4.6,
             reviews_count=89, cover_color="#6b2737", badge="Verified",
             description="Traditional and modern clothing for men, women and children. Custom gomesi and tailoring available.",
             joined_label="Mar 2023", avatar="NF", whatsapp="+256727654321"),
        dict(name="Grace Nakitto", business_name="Nakitto's Farm", phone="+256755111222",
             email="nakitto.farm@gmail.com", role="seller", location="Jinja, Jinja Town",
             verified=True, online=True, total_sales=891, followers_count=512, rating=4.9,
             reviews_count=203, cover_color="#2d5016", badge="Top Seller",
             description="Fresh organic produce direct from our farm near Jinja. Wholesale and retail. Delivery to Kampala every Wednesday.",
             joined_label="Jun 2023", avatar="NK", whatsapp="+256755111222"),
        dict(name="Robert Mutebi", business_name="Mutebi Furniture Works", phone="+256701234567",
             email="mutebi.furniture@gmail.com", role="seller", location="Kampala, Ntinda",
             verified=False, online=False, total_sales=128, followers_count=78, rating=4.7,
             reviews_count=56, cover_color="#5c3d2e", badge=None,
             description="Custom hardwood furniture made to order. Living room, bedroom, and office furniture.",
             joined_label="Aug 2022", avatar="MF", whatsapp="+256701234567"),
        dict(name="Patrick Ssemanda", business_name="Kampala Auto Parts", phone="+256723456789",
             email="kampala.autoparts@gmail.com", role="seller", location="Kampala, Owino Market",
             verified=True, online=True, total_sales=445, followers_count=201, rating=4.5,
             reviews_count=67, cover_color="#1c2938", badge="Verified",
             description="Genuine and quality spare parts for Toyota, Isuzu, and Land Rover.",
             joined_label="Feb 2023", avatar="KA", whatsapp="+256723456789"),
    ]

    seller_objs = []
    for s in sellers_data:
        u = User(password_hash=hash_password("seller123"), **s)
        db.add(u)
        seller_objs.append(u)
    db.flush()

    # ── Buyers ───────────────────────────────────────────────────────────
    buyer = User(name="Nalwoga Aisha", phone="+256700000001", email="buyer@kampalamarket.ug",
                 password_hash=hash_password("buyer123"), role="buyer",
                 location="Kampala, Central Region", avatar="NA")
    db.add(buyer)

    # ── Admin ────────────────────────────────────────────────────────────
    admin = User(name="Admin", phone="+256700000000", email="admin@kampalamarket.ug",
                 password_hash=hash_password("admin123"), role="admin",
                 avatar="AD", verified=True)
    db.add(admin)
    db.flush()

    s1, s2, s3, s4, s5 = seller_objs

    # ── Products ─────────────────────────────────────────────────────────
    products_data = [
        dict(title="Samsung Galaxy A14 — 64GB", category="electronics", price=1300000, negotiable=True,
             seller_id=s1.id, location="Kampala", neighborhood="owino", condition="New",
             stock=8, description="Brand new Samsung Galaxy A14 with 64GB storage, 4GB RAM. Comes with charger and original box. 6-month warranty included.",
             tags='["smartphone","android","samsung"]', views=184, saves=23, featured=True, created_at=datetime.utcnow() - timedelta(hours=2)),
        dict(title="Traditional Buganda Gomesi — Custom Made", category="clothing", price=450000, negotiable=True,
             seller_id=s2.id, location="Kampala", neighborhood="kabalagala", condition="New",
             stock=3, description="Beautifully crafted traditional Buganda gomesi with vibrant silk fabric. Ideal for kwanjula, graduation and formal events. Custom sizing available.",
             tags='["traditional","gomesi","buganda","dress"]', views=320, saves=47, featured=True, created_at=datetime.utcnow() - timedelta(weeks=1)),
        dict(title="Fresh Matooke — 50kg Bunch", category="food", price=85000, deal_price=68000, negotiable=True,
             seller_id=s3.id, location="Jinja", neighborhood="jinja", condition="Fresh",
             stock=50, description="Farm-fresh matooke harvested this week from Jinja. Available in bunches. Bulk discounts for orders over 10 bunches. Delivery to Kampala every Wednesday.",
             tags='["matooke","fresh","wholesale","organic"]', views=97, saves=12, featured=False, created_at=datetime.utcnow() - timedelta(days=3)),
        dict(title="Hardwood Dining Table Set (6 chairs)", category="furniture", price=1800000, negotiable=True,
             seller_id=s4.id, location="Kampala", neighborhood="ntinda", condition="New",
             stock=2, description="Solid hardwood dining table with 6 matching chairs. Dark mahogany finish. 180cm x 90cm.",
             tags='["furniture","dining","hardwood","table"]', views=211, saves=38, featured=True, created_at=datetime.utcnow() - timedelta(days=5)),
        dict(title="iPhone 12 — 128GB", category="electronics", price=1050000, negotiable=False,
             seller_id=s1.id, location="Kampala", neighborhood="owino", condition="Used - Good",
             stock=1, description="iPhone 12 in excellent condition. Battery health 89%. Minor scratches on back. Original charger included.",
             tags='["iphone","apple","smartphone"]', views=456, saves=61, featured=False, created_at=datetime.utcnow() - timedelta(days=1)),
        dict(title="Men's African Print Shirt", category="clothing", price=65000, negotiable=True,
             seller_id=s2.id, location="Kampala", neighborhood="kabalagala", condition="New",
             stock=20, description="Vibrant African Ankara print shirts for men. Available in M, L, XL, XXL. Multiple patterns.",
             tags='["shirt","ankara","african","men"]', views=143, saves=19, featured=False, created_at=datetime.utcnow() - timedelta(days=4)),
        dict(title="Solar Panel Kit — 200W", category="electronics", price=720000, deal_price=630000, negotiable=True,
             seller_id=s1.id, location="Kampala", neighborhood="owino", condition="New",
             stock=5, description="200W solar panel complete kit with charge controller, battery clips and mounting hardware.",
             tags='["solar","power","energy","off-grid"]', views=388, saves=54, featured=True, created_at=datetime.utcnow() - timedelta(days=6)),
        dict(title="Maize — 100kg Bag", category="food", price=150000, negotiable=True,
             seller_id=s3.id, location="Jinja", neighborhood="jinja", condition="Fresh",
             stock=200, description="High-quality dried maize, 100kg bags. Suitable for human consumption and animal feed.",
             tags='["maize","corn","grain","wholesale"]', views=72, saves=8, featured=False, created_at=datetime.utcnow() - timedelta(weeks=1)),
        dict(title="Toyota Land Cruiser — Front Bumper", category="vehicles", price=820000, negotiable=True,
             seller_id=s5.id, location="Kampala", neighborhood="owino", condition="New",
             stock=3, description="Genuine Toyota Land Cruiser 70 Series front bumper. Steel, powder-coated black. Fits 2010–2022 models.",
             tags='["toyota","bumper","parts","landcruiser"]', views=267, saves=41, featured=False, created_at=datetime.utcnow() - timedelta(days=2)),
        dict(title="Live Goats — Pair", category="livestock", price=560000, negotiable=True,
             seller_id=s3.id, location="Jinja", neighborhood="jinja", condition="Live",
             stock=10, description="Healthy Kigezi goats, male and female pair. Vaccinated. Good for breeding or ceremony.",
             tags='["goats","livestock","animals","breeding"]', views=134, saves=21, featured=False, created_at=datetime.utcnow() - timedelta(days=3)),
        dict(title="Cement — 50kg Bag (Hima)", category="building", price=45000, negotiable=False,
             seller_id=s1.id, location="Kampala", neighborhood="kireka", condition="New",
             stock=500, description="Hima cement 50kg bags. Available in bulk. Delivery within Kampala for orders of 50+ bags.",
             tags='["cement","building","construction","hima"]', views=89, saves=15, featured=True, created_at=datetime.utcnow() - timedelta(days=1)),
        dict(title="Handwoven Ugandan Sisal Basket", category="crafts", price=130000, negotiable=True,
             seller_id=s2.id, location="Kampala", neighborhood="nakasero", condition="New",
             stock=8, description="Beautiful handwoven sisal basket by Ugandan artisans from Rakai. Each piece unique. Used for storage, decoration or gifting.",
             tags='["basket","handmade","ugandan","craft","sisal"]', views=58, saves=17, featured=False, created_at=datetime.utcnow() - timedelta(days=5)),
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
               buyer_name="Nalwoga Aisha", rating=5,
               comment="Excellent seller! Phone was exactly as described, fast response on WhatsApp.",
               created_at=datetime.utcnow() - timedelta(days=3)),
        Review(product_id=prod_objs[3].id, seller_id=s4.id, buyer_id=buyer.id,
               buyer_name="David Ssebunya", rating=4,
               comment="Good quality furniture, took a bit longer than expected but worth it.",
               created_at=datetime.utcnow() - timedelta(weeks=1)),
        Review(product_id=prod_objs[2].id, seller_id=s3.id, buyer_id=buyer.id,
               buyer_name="Agnes Nabirye", rating=5,
               comment="Fresh matooke every time. Nakitto's Farm is trustworthy. Always deliver on time!",
               created_at=datetime.utcnow() - timedelta(weeks=2)),
        Review(product_id=prod_objs[6].id, seller_id=s1.id, buyer_id=buyer.id,
               buyer_name="Brian Kato", rating=5,
               comment="Solar kit working perfectly. Saved me from buying generator fuel.",
               created_at=datetime.utcnow() - timedelta(weeks=4)),
    ]
    for r in reviews:
        db.add(r)

    # ── Notifications ─────────────────────────────────────────────────────
    for msg_data in [
        dict(user_id=buyer.id, type="price_drop", message="Solar Panel Kit dropped from $220 to $195!", read=False, product_id=prod_objs[6].id),
        dict(user_id=buyer.id, type="new_listing", message="Ssekandi Electronics posted a new item you might like", read=False, product_id=prod_objs[10].id),
        dict(user_id=buyer.id, type="inquiry_reply", message="Ssekandi Electronics replied to your inquiry about iPhone 12", read=True, product_id=prod_objs[4].id),
        dict(user_id=buyer.id, type="deal", message="Today's Deal: Fresh Matooke — 20% off, ends tonight!", read=True, product_id=prod_objs[2].id),
        dict(user_id=buyer.id, type="delivery", message="Your delivery from Ssekandi Electronics is on the way! 🚚", read=False),
    ]:
        db.add(Notification(created_at=datetime.utcnow() - timedelta(hours=1), **msg_data))

    # ── Wanted Ads ───────────────────────────────────────────────────────
    wanted = [
        WantedAd(buyer_id=buyer.id, buyer_name="James Okello", buyer_avatar="JO",
                 title="Looking for a Generator — 5KVA", category="electronics", budget=3000000,
                 location="Kampala", neighborhood="ntinda", urgent=True,
                 description="Need a reliable petrol generator for home use. Prefer Honda or Sumec brand. Must come with warranty.",
                 created_at=datetime.utcnow() - timedelta(hours=1)),
        WantedAd(buyer_id=buyer.id, buyer_name="Mary Nakintu", buyer_avatar="MN",
                 title="Need 500kg of Groundnuts — Wholesale", category="food", budget=1500000,
                 location="Kampala", neighborhood="all", urgent=False,
                 description="Looking for groundnuts supplier for my processing business. Need regular monthly supply.",
                 created_at=datetime.utcnow() - timedelta(hours=3)),
        WantedAd(buyer_id=buyer.id, buyer_name="David Ssali", buyer_avatar="DS",
                 title="Toyota Hilux 2014–2018 — Any Condition", category="vehicles", budget=26000000,
                 location="Kampala", neighborhood="all", urgent=False,
                 description="Looking to buy a Toyota Hilux single or double cab. Any color. Must be mechanically sound.",
                 created_at=datetime.utcnow() - timedelta(hours=5)),
        WantedAd(buyer_id=buyer.id, buyer_name="NGO Procurement", buyer_avatar="NP",
                 title="Office Chairs — 10 Units", category="furniture", budget=1100000,
                 location="Kampala", neighborhood="kampala-city", urgent=True,
                 description="Need 10 ergonomic office chairs for our Kampala office. Must deliver. Invoice required.",
                 created_at=datetime.utcnow() - timedelta(days=1)),
        WantedAd(buyer_id=buyer.id, buyer_name="Nalwoga Aisha", buyer_avatar="NA",
                 title="iPhone 13 or 14 — New or Like New", category="electronics", budget=1850000,
                 location="Kampala", neighborhood="all", urgent=False,
                 description="Looking for iPhone 13 or 14 in good condition. Must have original charger and box.",
                 created_at=datetime.utcnow() - timedelta(days=2)),
    ]
    for w in wanted:
        db.add(w)

    # ── Courier Riders ────────────────────────────────────────────────────
    riders = [
        CourierRider(name="Alex Mugisha", avatar="AM", vehicle="Boda Boda (Motorcycle)",
                     zone="Kampala City Centre, Owino, Ntinda", rating=4.9, trips=234, online=True,
                     phone="+256723111222", fee="UGX 5,000–15,000 within Kampala"),
        CourierRider(name="Joseph Bbosa", avatar="JB", vehicle="Tricycle (Bajaj)",
                     zone="Kabalagala, Muyenga, Kireka", rating=4.7, trips=189, online=True,
                     phone="+256755333444", fee="UGX 8,000–20,000 depending on load"),
        CourierRider(name="Catherine Nakabuye", avatar="CN", vehicle="Car (Toyota)",
                     zone="All of Kampala", rating=4.8, trips=312, online=False,
                     phone="+256712555666", fee="UGX 15,000–40,000 depending on distance"),
    ]
    for r in riders:
        db.add(r)
    db.flush()

    # ── Reports ───────────────────────────────────────────────────────────
    db.add(Report(type="fake_listing", listing_title="iPhone 15 Pro — $50",
                  reporter_name="Nalwoga Aisha", severity="high",
                  created_at=datetime.utcnow() - timedelta(hours=1)))
    db.add(Report(type="scam_attempt", listing_title="MacBook Pro — $80",
                  reporter_name="David Ssebunya", severity="high",
                  created_at=datetime.utcnow() - timedelta(hours=3)))
    db.add(Report(type="wrong_category", listing_title="Goat in Electronics",
                  reporter_name="System", severity="low", status="resolved",
                  created_at=datetime.utcnow() - timedelta(days=1)))

    db.commit()
    print("✅ Database seeded successfully")
