(function() {
window.fmt = function(n) { return 'UGX\u00A0' + Number(n).toLocaleString('en-US'); };

var CATEGORIES = [
  { id:'all', label:'All Products', icon:'▦' },
  { id:'electronics', label:'Electronics', icon:'📱' },
  { id:'clothing', label:'Clothing & Fashion', icon:'👕' },
  { id:'food', label:'Food & Agriculture', icon:'🌽' },
  { id:'furniture', label:'Furniture & Home', icon:'🪑' },
  { id:'vehicles', label:'Vehicles & Parts', icon:'🚗' },
  { id:'crafts', label:'Crafts & Art', icon:'🎨' },
  { id:'services', label:'Services', icon:'🔧' },
  { id:'livestock', label:'Livestock', icon:'🐄' },
  { id:'building', label:'Building Materials', icon:'🧱' },
];

var NEIGHBORHOODS = [
  { id:'all', label:'Anywhere in Uganda' },
  { id:'kampala-city', label:'Kampala City Centre', city:'Kampala' },
  { id:'owino', label:'Owino Market', city:'Kampala' },
  { id:'ntinda', label:'Ntinda', city:'Kampala' },
  { id:'kabalagala', label:'Kabalagala', city:'Kampala' },
  { id:'nakasero', label:'Nakasero', city:'Kampala' },
  { id:'wandegeya', label:'Wandegeya', city:'Kampala' },
  { id:'muyenga', label:'Muyenga', city:'Kampala' },
  { id:'kireka', label:'Kireka', city:'Kampala' },
  { id:'entebbe', label:'Entebbe Town', city:'Entebbe' },
  { id:'jinja', label:'Jinja Town', city:'Jinja' },
  { id:'gulu', label:'Gulu', city:'Gulu' },
];

var SELLERS = [
  { id:'s1', name:'Ssekandi Electronics', avatar:'SE', location:'Kampala, Owino Market', neighborhood:'owino', phone:'+256 712 345 678', whatsapp:'+256 712 345 678', email:'ssekandi.electronics@gmail.com', joined:'Jan 2024', rating:4.8, reviews:124, verified:true, online:true, totalSales:342, followers:287, description:'Quality electronics and accessories sourced from Nairobi and Dubai. Fast delivery within Kampala.', coverColor:'#1a1a2e', badge:'Top Seller' },
  { id:'s2', name:'Namutebi Fashions', avatar:'NF', location:'Kampala, Kabalagala', neighborhood:'kabalagala', phone:'+256 727 654 321', whatsapp:'+256 727 654 321', email:'namutebi.fashion@yahoo.com', joined:'Mar 2023', rating:4.6, reviews:89, verified:true, online:false, totalSales:215, followers:143, description:'Traditional and modern clothing for men, women and children. Custom tailoring and gomesi designs available.', coverColor:'#6b2737', badge:'Verified' },
  { id:'s3', name:"Nakitto's Farm", avatar:'NK', location:'Jinja, Jinja Town', neighborhood:'jinja', phone:'+256 755 111 222', whatsapp:'+256 755 111 222', email:'nakitto.farm@gmail.com', joined:'Jun 2023', rating:4.9, reviews:203, verified:true, online:true, totalSales:891, followers:512, description:'Fresh organic produce direct from our farm near Jinja. Wholesale and retail. Delivery to Kampala every Wednesday.', coverColor:'#2d5016', badge:'Top Seller' },
  { id:'s4', name:'Mutebi Furniture Works', avatar:'MF', location:'Kampala, Ntinda', neighborhood:'ntinda', phone:'+256 701 234 567', whatsapp:'+256 701 234 567', email:'mutebi.furniture@gmail.com', joined:'Aug 2022', rating:4.7, reviews:56, verified:false, online:false, totalSales:128, followers:78, description:'Custom hardwood furniture made to order. Living room, bedroom, and office furniture.', coverColor:'#5c3d2e', badge:null },
  { id:'s5', name:'Kampala Auto Parts', avatar:'KA', location:'Kampala, Owino Market', neighborhood:'owino', phone:'+256 723 456 789', whatsapp:'+256 723 456 789', email:'kampala.autoparts@gmail.com', joined:'Feb 2023', rating:4.5, reviews:67, verified:true, online:true, totalSales:445, followers:201, description:'Genuine and quality spare parts for Toyota, Isuzu, and Land Rover. Competitive prices.', coverColor:'#1c2938', badge:'Verified' },
];

var PRODUCTS = [
  { id:'p1', title:'Samsung Galaxy A14 — 64GB', category:'electronics', price:1300000, negotiable:true, currency:'UGX', sellerId:'s1', location:'Kampala', neighborhood:'owino', condition:'New', stock:8, description:'Brand new Samsung Galaxy A14 with 64GB storage, 4GB RAM. Comes with charger and original box. 6-month warranty included. Available in black and blue.', tags:['smartphone','android','samsung'], postedAt:'2 hours ago', views:184, saves:23, featured:true, dealPrice:null },
  { id:'p2', title:'Traditional Buganda Gomesi — Custom Made', category:'clothing', price:450000, negotiable:true, currency:'UGX', sellerId:'s2', location:'Kampala', neighborhood:'kabalagala', condition:'New', stock:3, description:'Beautifully crafted traditional Buganda gomesi with vibrant silk fabric. Custom sizing available. Ideal for introductions (kwanjula), graduation and formal events. Takes 1 week to complete.', tags:['traditional','gomesi','buganda','dress'], postedAt:'1 week ago', views:320, saves:47, featured:true, dealPrice:null },
  { id:'p3', title:'Fresh Matooke — 50kg Bunch', category:'food', price:85000, negotiable:true, currency:'UGX', sellerId:'s3', location:'Jinja', neighborhood:'jinja', condition:'Fresh', stock:50, description:'Farm-fresh matooke harvested this week from Jinja. Available in bunches. Bulk discounts for orders over 10 bunches. Delivery to Kampala every Wednesday.', tags:['matooke','fresh','wholesale','organic'], postedAt:'3 days ago', views:97, saves:12, featured:false, dealPrice:68000 },
  { id:'p4', title:'Hardwood Dining Table Set (6 chairs)', category:'furniture', price:1800000, negotiable:true, currency:'UGX', sellerId:'s4', location:'Kampala', neighborhood:'ntinda', condition:'New', stock:2, description:'Solid hardwood dining table with 6 matching chairs. Dark mahogany finish. Dimensions: 180cm x 90cm. Custom sizes and colors available on request.', tags:['furniture','dining','hardwood','table'], postedAt:'5 days ago', views:211, saves:38, featured:true, dealPrice:null },
  { id:'p5', title:'iPhone 12 — 128GB', category:'electronics', price:1050000, negotiable:false, currency:'UGX', sellerId:'s1', location:'Kampala', neighborhood:'owino', condition:'Used - Good', stock:1, description:'iPhone 12 in excellent condition. Battery health 89%. Minor scratches on back. Original charger included. Price firm — serious buyers only.', tags:['iphone','apple','smartphone'], postedAt:'1 day ago', views:456, saves:61, featured:false, dealPrice:null },
  { id:'p6', title:"Men's African Print Shirt", category:'clothing', price:65000, negotiable:true, currency:'UGX', sellerId:'s2', location:'Kampala', neighborhood:'kabalagala', condition:'New', stock:20, description:'Vibrant African Ankara print shirts for men. Available in M, L, XL, XXL. Multiple patterns. Bulk orders welcome.', tags:['shirt','ankara','african','men'], postedAt:'4 days ago', views:143, saves:19, featured:false, dealPrice:null },
  { id:'p7', title:'Solar Panel Kit — 200W', category:'electronics', price:720000, negotiable:true, currency:'UGX', sellerId:'s1', location:'Kampala', neighborhood:'owino', condition:'New', stock:5, description:'200W solar panel complete kit with charge controller, battery clips and mounting hardware. Perfect for homes and businesses.', tags:['solar','power','energy','off-grid'], postedAt:'6 days ago', views:388, saves:54, featured:true, dealPrice:630000 },
  { id:'p8', title:'Maize — 100kg Bag', category:'food', price:150000, negotiable:true, currency:'UGX', sellerId:'s3', location:'Jinja', neighborhood:'jinja', condition:'Fresh', stock:200, description:'High-quality dried maize, 100kg bags. Suitable for human consumption and animal feed. Competitive prices for bulk purchases.', tags:['maize','corn','grain','wholesale'], postedAt:'1 week ago', views:72, saves:8, featured:false, dealPrice:null },
  { id:'p9', title:'Toyota Land Cruiser — Front Bumper', category:'vehicles', price:820000, negotiable:true, currency:'UGX', sellerId:'s5', location:'Kampala', neighborhood:'owino', condition:'New', stock:3, description:'Genuine Toyota Land Cruiser 70 Series front bumper. Steel, powder-coated black. Fits 2010–2022 models.', tags:['toyota','bumper','parts','landcruiser'], postedAt:'2 days ago', views:267, saves:41, featured:false, dealPrice:null },
  { id:'p10', title:'Live Goats — Pair', category:'livestock', price:560000, negotiable:true, currency:'UGX', sellerId:'s3', location:'Jinja', neighborhood:'jinja', condition:'Live', stock:10, description:'Healthy Kigezi goats, male and female pair. Vaccinated. Good for breeding or ceremony.', tags:['goats','livestock','animals','breeding'], postedAt:'3 days ago', views:134, saves:21, featured:false, dealPrice:null },
  { id:'p11', title:'Cement — 50kg Bag (Hima)', category:'building', price:45000, negotiable:false, currency:'UGX', sellerId:'s1', location:'Kampala', neighborhood:'kireka', condition:'New', stock:500, description:'Hima cement 50kg bags. Available in bulk. Delivery within Kampala for orders of 50+ bags.', tags:['cement','building','construction','hima'], postedAt:'1 day ago', views:89, saves:15, featured:true, dealPrice:null },
  { id:'p12', title:'Handwoven Ugandan Sisal Basket', category:'crafts', price:130000, negotiable:true, currency:'UGX', sellerId:'s2', location:'Kampala', neighborhood:'nakasero', condition:'New', stock:8, description:'Beautiful handwoven sisal basket by Ugandan artisans from Rakai. Each piece unique. Used for storage, decoration or gifting.', tags:['basket','handmade','ugandan','craft','sisal'], postedAt:'5 days ago', views:58, saves:17, featured:false, dealPrice:null },
];

var REVIEWS = [
  { id:'r1', productId:'p1', sellerId:'s1', buyerName:'Nalwoga Aisha', rating:5, comment:'Excellent seller! Phone was exactly as described, fast response on WhatsApp. Will buy again.', date:'3 days ago' },
  { id:'r2', productId:'p4', sellerId:'s4', buyerName:'David Ssebunya', rating:4, comment:'Good quality furniture, took a bit longer than expected but the result was worth it.', date:'1 week ago' },
  { id:'r3', productId:'p3', sellerId:'s3', buyerName:'Agnes Nabirye', rating:5, comment:"Fresh matooke every time. Nakitto's Farm is trustworthy. They always deliver on time!", date:'2 weeks ago' },
  { id:'r4', productId:'p7', sellerId:'s1', buyerName:'Brian Kato', rating:5, comment:'Solar kit working perfectly. Saved me from buying generator fuel. Very professional seller.', date:'1 month ago' },
];

var NOTIFICATIONS = [
  { id:'n1', type:'price_drop', message:'Solar Panel Kit dropped from UGX 820,000 to UGX 720,000!', time:'1h ago', read:false, productId:'p7' },
  { id:'n2', type:'new_listing', message:'Ssekandi Electronics posted a new item you might like', time:'3h ago', read:false, productId:'p11' },
  { id:'n3', type:'inquiry_reply', message:'Ssekandi Electronics replied to your inquiry about iPhone 12', time:'5h ago', read:true, productId:'p5' },
  { id:'n4', type:'deal', message:"Today's Deal: Fresh Matooke — 20% off! Now UGX 68,000, ends tonight!", time:'8h ago', read:true, productId:'p3' },
  { id:'n5', type:'wanted_bid', message:'3 sellers responded to your wanted ad for a Generator', time:'2h ago', read:false, productId:null },
  { id:'n6', type:'follow', message:"Nakitto's Farm posted a shop announcement", time:'4h ago', read:false, productId:null },
  { id:'n7', type:'delivery', message:'Your delivery from Ssekandi Electronics is on the way! 🚚', time:'30m ago', read:false, productId:'p1' },
];

var WANTED_ADS = [
  { id:'w1', title:'Looking for a Generator — 5KVA', category:'electronics', budget:3000000, location:'Kampala', neighborhood:'ntinda', buyerName:'James Okello', buyerAvatar:'JO', posted:'1h ago', responses:4, urgent:true, description:'Need a reliable petrol generator for home use. Prefer Honda or Sumec brand. Must come with warranty. Can pick up in Ntinda area.', status:'open' },
  { id:'w2', title:'Need 500kg of Groundnuts — Wholesale', category:'food', budget:1500000, location:'Kampala', neighborhood:'all', buyerName:'Mary Nakintu', buyerAvatar:'MN', posted:'3h ago', responses:2, urgent:false, description:'Looking for groundnuts supplier for my processing business. Need regular monthly supply. Prefer farmer direct.', status:'open' },
  { id:'w3', title:'Toyota Hilux 2014–2018 — Any Condition', category:'vehicles', budget:26000000, location:'Kampala', neighborhood:'all', buyerName:'David Ssali', buyerAvatar:'DS', posted:'5h ago', responses:1, urgent:false, description:'Looking to buy a Toyota Hilux single or double cab. Any color. Must be mechanically sound. Cash payment ready.', status:'open' },
  { id:'w4', title:'Office Chairs — 10 Units', category:'furniture', budget:1100000, location:'Kampala', neighborhood:'kampala-city', buyerName:'NGO Procurement', buyerAvatar:'NP', posted:'1 day ago', responses:6, urgent:true, description:'Need 10 ergonomic office chairs for our Kampala office. Budget is firm. Must deliver to our office. Invoice required.', status:'open' },
  { id:'w5', title:'iPhone 13 or 14 — New or Like New', category:'electronics', budget:1850000, location:'Kampala', neighborhood:'all', buyerName:'Nalwoga Aisha', buyerAvatar:'NA', posted:'2 days ago', responses:3, urgent:false, description:'Looking for iPhone 13 or 14 in good condition. Must have original charger and box. Will pay cash on meeting.', status:'open' },
];

var CHAT_THREADS = [
  { id:'c1', productId:'p5', sellerId:'s1', sellerName:'Ssekandi Electronics', sellerAvatar:'SE', productTitle:'iPhone 12 — 128GB', lastMsg:'I can do $265 if you pick up today.', time:'2h ago', unread:1,
    messages:[
      { from:'buyer', text:'Hi! Is the iPhone 12 still available?', time:'Yesterday 3:00pm' },
      { from:'seller', text:'Yes it is! Battery health 89%, comes with original charger.', time:'Yesterday 3:05pm' },
      { from:'buyer', text:'What is the lowest you can go? I was thinking $260.', time:'Yesterday 3:10pm' },
      { from:'seller', text:'I can do $265 if you pick up today. That is my final price.', time:'2h ago' },
    ]
  },
  { id:'c2', productId:'p7', sellerId:'s1', sellerName:'Ssekandi Electronics', sellerAvatar:'SE', productTitle:'Solar Panel Kit — 200W', lastMsg:'Yes available! Which area in Kampala?', time:'5h ago', unread:0,
    messages:[
      { from:'buyer', text:'Hello, do you still have solar panels in stock?', time:'Yesterday 10am' },
      { from:'seller', text:'Yes available! Which area in Kampala are you? We can arrange delivery.', time:'5h ago' },
    ]
  },
  { id:'c3', productId:'p2', sellerId:'s2', sellerName:'Namutebi Fashions', sellerAvatar:'NF', productTitle:'Traditional Buganda Gomesi', lastMsg:'Send me your measurements and I will make a custom one.', time:'1 day ago', unread:0,
    messages:[
      { from:'buyer', text:'Do you do custom sizes for the gomesi?', time:'2 days ago' },
      { from:'seller', text:'Yes! We do full custom tailoring. Send me your measurements and I will make a custom one.', time:'1 day ago' },
    ]
  },
];

var COURIER_RIDERS = [
  { id:'cr1', name:'Alex Mugisha', avatar:'AM', vehicle:'Boda Boda (Motorcycle)', zone:'Kampala City Centre, Owino, Ntinda', rating:4.9, trips:234, online:true, phone:'+256 723 111 222', fee:'UGX 5,000–15,000 within Kampala' },
  { id:'cr2', name:'Joseph Bbosa', avatar:'JB', vehicle:'Tricycle (Bajaj)', zone:'Kabalagala, Muyenga, Kireka', rating:4.7, trips:189, online:true, phone:'+256 755 333 444', fee:'UGX 8,000–20,000 depending on load' },
  { id:'cr3', name:'Catherine Nakabuye', avatar:'CN', vehicle:'Car (Toyota)', zone:'All of Kampala', rating:4.8, trips:312, online:false, phone:'+256 712 555 666', fee:'UGX 15,000–40,000 depending on distance' },
];

var DELIVERY_JOBS = [
  { id:'d1', status:'in_transit', item:'Samsung Galaxy A14', from:'Owino Market', to:'Ntinda', rider:'Alex Mugisha', riderAvatar:'AM', eta:'~20 mins', fee:5, orderedAt:'30 mins ago' },
  { id:'d2', status:'delivered', item:'Solar Panel Kit', from:'Owino Market', to:'Kabalagala', rider:'Joseph Bbosa', riderAvatar:'JB', eta:'Delivered', fee:8, orderedAt:'2 days ago' },
];

var FRIDAY_MARKET = {
  active: true,
  title: 'Friday Market 🎉',
  subtitle: 'Every Friday — special prices from top sellers',
  deals: ['p3','p7','p6','p11'],
  nextFriday: 'Tomorrow',
};

var TRENDING_SEARCHES = ['iPhone','solar panel','matooke','cement','Toyota Hilux','generator','gomesi','maize'];

window.KampalaData = { CATEGORIES, NEIGHBORHOODS, SELLERS, PRODUCTS, REVIEWS, NOTIFICATIONS, WANTED_ADS, CHAT_THREADS, COURIER_RIDERS, DELIVERY_JOBS, FRIDAY_MARKET, TRENDING_SEARCHES };
})();
