(function() {
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
  { id:'all', label:'Anywhere in SS' },
  { id:'juba-centre', label:'Juba Centre', city:'Juba' },
  { id:'konyo-konyo', label:'Konyo Konyo Market', city:'Juba' },
  { id:'gudele', label:'Gudele', city:'Juba' },
  { id:'munuki', label:'Munuki', city:'Juba' },
  { id:'kator', label:'Kator', city:'Juba' },
  { id:'customs', label:'Customs Area', city:'Juba' },
  { id:'jebel', label:'Jebel Market', city:'Juba' },
  { id:'nyakuron', label:'Nyakuron', city:'Juba' },
  { id:'yei', label:'Yei Town', city:'Yei' },
  { id:'malakal', label:'Malakal', city:'Malakal' },
  { id:'wau', label:'Wau', city:'Wau' },
];

var SELLERS = [
  { id:'s1', name:'Akol Electronics', avatar:'AE', location:'Juba, Central Equatoria', neighborhood:'konyo-konyo', phone:'+211 912 345 678', whatsapp:'+211 912 345 678', email:'akol.electronics@gmail.com', joined:'Jan 2024', rating:4.8, reviews:124, verified:true, online:true, totalSales:342, followers:287, description:'Quality electronics and accessories sourced from Kampala and Dubai. Fast delivery within Juba.', coverColor:'#1a1a2e', badge:'Top Seller' },
  { id:'s2', name:'Nyakim Fashions', avatar:'NF', location:'Juba, Munuki', neighborhood:'munuki', phone:'+211 927 654 321', whatsapp:'+211 927 654 321', email:'nyakim.fashion@yahoo.com', joined:'Mar 2023', rating:4.6, reviews:89, verified:true, online:false, totalSales:215, followers:143, description:'Traditional and modern clothing for men, women and children. Custom tailoring available.', coverColor:'#6b2737', badge:'Verified' },
  { id:'s3', name:'Green Valley Farm', avatar:'GV', location:'Yei, Central Equatoria', neighborhood:'yei', phone:'+211 955 111 222', whatsapp:'+211 955 111 222', email:'greenvalley.farm@gmail.com', joined:'Jun 2023', rating:4.9, reviews:203, verified:true, online:true, totalSales:891, followers:512, description:'Fresh organic produce direct from our farm. Wholesale and retail. Delivery to Juba available.', coverColor:'#2d5016', badge:'Top Seller' },
  { id:'s4', name:'Deng Furniture Works', avatar:'DF', location:'Juba, Gudele', neighborhood:'gudele', phone:'+211 901 234 567', whatsapp:'+211 901 234 567', email:'deng.furniture@gmail.com', joined:'Aug 2022', rating:4.7, reviews:56, verified:false, online:false, totalSales:128, followers:78, description:'Custom hardwood furniture made to order. Living room, bedroom, and office furniture.', coverColor:'#5c3d2e', badge:null },
  { id:'s5', name:'Juba Auto Parts', avatar:'JA', location:'Juba, Konyo Konyo', neighborhood:'konyo-konyo', phone:'+211 923 456 789', whatsapp:'+211 923 456 789', email:'juba.autoparts@gmail.com', joined:'Feb 2023', rating:4.5, reviews:67, verified:true, online:true, totalSales:445, followers:201, description:'Genuine and quality spare parts for Toyota, Isuzu, and Land Rover. Competitive prices.', coverColor:'#1c2938', badge:'Verified' },
];

var PRODUCTS = [
  { id:'p1', title:'Samsung Galaxy A14 — 64GB', category:'electronics', price:350, negotiable:true, currency:'USD', sellerId:'s1', location:'Juba', neighborhood:'konyo-konyo', condition:'New', stock:8, description:'Brand new Samsung Galaxy A14 with 64GB storage, 4GB RAM. Comes with charger and original box. 6-month warranty included. Available in black and blue.', tags:['smartphone','android','samsung'], postedAt:'2 hours ago', views:184, saves:23, featured:true, dealPrice:null },
  { id:'p2', title:'Traditional Dinka Wedding Dress', category:'clothing', price:120, negotiable:true, currency:'USD', sellerId:'s2', location:'Juba', neighborhood:'munuki', condition:'New', stock:3, description:'Beautifully handcrafted traditional Dinka wedding attire with intricate bead work. Custom sizing available. Takes 2 weeks to complete.', tags:['traditional','wedding','dinka','dress'], postedAt:'1 week ago', views:320, saves:47, featured:true, dealPrice:null },
  { id:'p3', title:'Fresh Cassava — 50kg Sack', category:'food', price:25, negotiable:true, currency:'USD', sellerId:'s3', location:'Yei', neighborhood:'yei', condition:'Fresh', stock:50, description:'Farm-fresh cassava harvested this week. Available in 50kg sacks. Bulk discounts for orders over 10 sacks. Delivery to Juba every Wednesday.', tags:['cassava','fresh','wholesale','organic'], postedAt:'3 days ago', views:97, saves:12, featured:false, dealPrice:20 },
  { id:'p4', title:'Hardwood Dining Table Set (6 chairs)', category:'furniture', price:480, negotiable:true, currency:'USD', sellerId:'s4', location:'Juba', neighborhood:'gudele', condition:'New', stock:2, description:'Solid hardwood dining table with 6 matching chairs. Dark mahogany finish. Dimensions: 180cm x 90cm. Custom sizes and colors available on request.', tags:['furniture','dining','hardwood','table'], postedAt:'5 days ago', views:211, saves:38, featured:true, dealPrice:null },
  { id:'p5', title:'iPhone 12 — 128GB', category:'electronics', price:280, negotiable:false, currency:'USD', sellerId:'s1', location:'Juba', neighborhood:'konyo-konyo', condition:'Used - Good', stock:1, description:'iPhone 12 in excellent condition. Battery health 89%. Minor scratches on back. Original charger included. Price firm — serious buyers only.', tags:['iphone','apple','smartphone'], postedAt:'1 day ago', views:456, saves:61, featured:false, dealPrice:null },
  { id:'p6', title:"Men's African Print Shirt", category:'clothing', price:18, negotiable:true, currency:'USD', sellerId:'s2', location:'Juba', neighborhood:'munuki', condition:'New', stock:20, description:'Vibrant African Ankara print shirts for men. Available in M, L, XL, XXL. Multiple patterns. Bulk orders welcome.', tags:['shirt','ankara','african','men'], postedAt:'4 days ago', views:143, saves:19, featured:false, dealPrice:null },
  { id:'p7', title:'Solar Panel Kit — 200W', category:'electronics', price:195, negotiable:true, currency:'USD', sellerId:'s1', location:'Juba', neighborhood:'konyo-konyo', condition:'New', stock:5, description:'200W solar panel complete kit with charge controller, battery clips and mounting hardware. Perfect for homes and businesses.', tags:['solar','power','energy','off-grid'], postedAt:'6 days ago', views:388, saves:54, featured:true, dealPrice:170 },
  { id:'p8', title:'Maize — 100kg Bag', category:'food', price:40, negotiable:true, currency:'USD', sellerId:'s3', location:'Yei', neighborhood:'yei', condition:'Fresh', stock:200, description:'High-quality dried maize, 100kg bags. Suitable for human consumption and animal feed. Competitive prices for bulk purchases.', tags:['maize','corn','grain','wholesale'], postedAt:'1 week ago', views:72, saves:8, featured:false, dealPrice:null },
  { id:'p9', title:'Toyota Land Cruiser — Front Bumper', category:'vehicles', price:220, negotiable:true, currency:'USD', sellerId:'s5', location:'Juba', neighborhood:'konyo-konyo', condition:'New', stock:3, description:'Genuine Toyota Land Cruiser 70 Series front bumper. Steel, powder-coated black. Fits 2010–2022 models.', tags:['toyota','bumper','parts','landcruiser'], postedAt:'2 days ago', views:267, saves:41, featured:false, dealPrice:null },
  { id:'p10', title:'Live Goats — Pair', category:'livestock', price:150, negotiable:true, currency:'USD', sellerId:'s3', location:'Yei', neighborhood:'yei', condition:'Live', stock:10, description:'Healthy Nubian goats, male and female pair. Vaccinated. Good for breeding or ceremony.', tags:['goats','livestock','animals','breeding'], postedAt:'3 days ago', views:134, saves:21, featured:false, dealPrice:null },
  { id:'p11', title:'Cement — 50kg Bag (Dangote)', category:'building', price:12, negotiable:false, currency:'USD', sellerId:'s1', location:'Juba', neighborhood:'jebel', condition:'New', stock:500, description:'Dangote cement 50kg bags. Available in bulk. Delivery within Juba for orders of 50+ bags.', tags:['cement','building','construction','dangote'], postedAt:'1 day ago', views:89, saves:15, featured:true, dealPrice:null },
  { id:'p12', title:'Handwoven Nuer Basket', category:'crafts', price:35, negotiable:true, currency:'USD', sellerId:'s2', location:'Juba', neighborhood:'kator', condition:'New', stock:8, description:'Beautiful handwoven basket by Nuer artisans. Each piece unique. Used for storage, decoration or gifting.', tags:['basket','handmade','nuer','craft'], postedAt:'5 days ago', views:58, saves:17, featured:false, dealPrice:null },
];

var REVIEWS = [
  { id:'r1', productId:'p1', sellerId:'s1', buyerName:'Ayen Deng', rating:5, comment:'Excellent seller! Phone was exactly as described, fast response on WhatsApp. Will buy again.', date:'3 days ago' },
  { id:'r2', productId:'p4', sellerId:'s4', buyerName:'Peter Majok', rating:4, comment:'Good quality furniture, took a bit longer than expected but the result was worth it.', date:'1 week ago' },
  { id:'r3', productId:'p3', sellerId:'s3', buyerName:'Rebecca Ladu', rating:5, comment:'Fresh cassava every time. Green Valley Farm is trustworthy. They always deliver on time!', date:'2 weeks ago' },
  { id:'r4', productId:'p7', sellerId:'s1', buyerName:'John Wol', rating:5, comment:'Solar kit working perfectly. Saved me from buying generator fuel. Very professional seller.', date:'1 month ago' },
];

var NOTIFICATIONS = [
  { id:'n1', type:'price_drop', message:'Solar Panel Kit dropped from $220 to $195!', time:'1h ago', read:false, productId:'p7' },
  { id:'n2', type:'new_listing', message:'Akol Electronics posted a new item you might like', time:'3h ago', read:false, productId:'p11' },
  { id:'n3', type:'inquiry_reply', message:'Akol Electronics replied to your inquiry about iPhone 12', time:'5h ago', read:true, productId:'p5' },
  { id:'n4', type:'deal', message:"Today's Deal: Fresh Cassava — 20% off, ends tonight!", time:'8h ago', read:true, productId:'p3' },
  { id:'n5', type:'wanted_bid', message:'3 sellers responded to your wanted ad for a Generator', time:'2h ago', read:false, productId:null },
  { id:'n6', type:'follow', message:'Green Valley Farm posted a shop announcement', time:'4h ago', read:false, productId:null },
  { id:'n7', type:'delivery', message:'Your delivery from Akol Electronics is on the way! 🚚', time:'30m ago', read:false, productId:'p1' },
];

var WANTED_ADS = [
  { id:'w1', title:'Looking for a Generator — 5KVA', category:'electronics', budget:800, location:'Juba', neighborhood:'gudele', buyerName:'James Wol', buyerAvatar:'JW', posted:'1h ago', responses:4, urgent:true, description:'Need a reliable petrol generator for home use. Prefer Honda or Sumec brand. Must come with warranty. Can pick up in Gudele area.', status:'open' },
  { id:'w2', title:'Need 500kg of Groundnuts — Wholesale', category:'food', budget:400, location:'Juba', neighborhood:'all', buyerName:'Mary Akot', buyerAvatar:'MA', posted:'3h ago', responses:2, urgent:false, description:'Looking for groundnuts supplier for my processing business. Need regular monthly supply. Prefer farmer direct.', status:'open' },
  { id:'w3', title:'Toyota Hilux 2014–2018 — Any Condition', category:'vehicles', budget:7000, location:'Juba', neighborhood:'all', buyerName:'David Lado', buyerAvatar:'DL', posted:'5h ago', responses:1, urgent:false, description:'Looking to buy a Toyota Hilux single or double cab. Any color. Must be mechanically sound. Cash payment ready.', status:'open' },
  { id:'w4', title:'Office Chairs — 10 Units', category:'furniture', budget:300, location:'Juba', neighborhood:'juba-centre', buyerName:'NGO Procurement', buyerAvatar:'NP', posted:'1 day ago', responses:6, urgent:true, description:'Need 10 ergonomic office chairs for our Juba office. Budget is firm. Must deliver to our office. Invoice required.', status:'open' },
  { id:'w5', title:'iPhone 13 or 14 — New or Like New', category:'electronics', budget:500, location:'Juba', neighborhood:'all', buyerName:'Ayen Deng', buyerAvatar:'AD', posted:'2 days ago', responses:3, urgent:false, description:'Looking for iPhone 13 or 14 in good condition. Must have original charger and box. Will pay cash on meeting.', status:'open' },
];

var CHAT_THREADS = [
  { id:'c1', productId:'p5', sellerId:'s1', sellerName:'Akol Electronics', sellerAvatar:'AE', productTitle:'iPhone 12 — 128GB', lastMsg:'I can do $265 if you pick up today.', time:'2h ago', unread:1,
    messages:[
      { from:'buyer', text:'Hi! Is the iPhone 12 still available?', time:'Yesterday 3:00pm' },
      { from:'seller', text:'Yes it is! Battery health 89%, comes with original charger.', time:'Yesterday 3:05pm' },
      { from:'buyer', text:'What is the lowest you can go? I was thinking $260.', time:'Yesterday 3:10pm' },
      { from:'seller', text:'I can do $265 if you pick up today. That is my final price.', time:'2h ago' },
    ]
  },
  { id:'c2', productId:'p7', sellerId:'s1', sellerName:'Akol Electronics', sellerAvatar:'AE', productTitle:'Solar Panel Kit — 200W', lastMsg:'Yes available! Which area in Juba?', time:'5h ago', unread:0,
    messages:[
      { from:'buyer', text:'Hello, do you still have solar panels in stock?', time:'Yesterday 10am' },
      { from:'seller', text:'Yes available! Which area in Juba are you? We can arrange delivery.', time:'5h ago' },
    ]
  },
  { id:'c3', productId:'p2', sellerId:'s2', sellerName:'Nyakim Fashions', sellerAvatar:'NF', productTitle:'Traditional Dinka Wedding Dress', lastMsg:'Send me your measurements and I will make a custom one.', time:'1 day ago', unread:0,
    messages:[
      { from:'buyer', text:'Do you do custom sizes for the wedding dress?', time:'2 days ago' },
      { from:'seller', text:'Yes! We do full custom tailoring. Send me your measurements and I will make a custom one.', time:'1 day ago' },
    ]
  },
];

var COURIER_RIDERS = [
  { id:'cr1', name:'Moses Lado', avatar:'ML', vehicle:'Boda Boda (Motorcycle)', zone:'Juba Centre, Konyo Konyo, Gudele', rating:4.9, trips:234, online:true, phone:'+211 923 111 222', fee:'$2–5 within Juba' },
  { id:'cr2', name:'Simon Deng', avatar:'SD', vehicle:'Tricycle (Bajaj)', zone:'Munuki, Kator, Nyakuron', rating:4.7, trips:189, online:true, phone:'+211 955 333 444', fee:'$3–8 depending on load' },
  { id:'cr3', name:'Grace Akot', avatar:'GA', vehicle:'Car (Toyota)', zone:'All of Juba', rating:4.8, trips:312, online:false, phone:'+211 912 555 666', fee:'$5–15 depending on distance' },
];

var DELIVERY_JOBS = [
  { id:'d1', status:'in_transit', item:'Samsung Galaxy A14', from:'Konyo Konyo', to:'Gudele', rider:'Moses Lado', riderAvatar:'ML', eta:'~20 mins', fee:3, orderedAt:'30 mins ago' },
  { id:'d2', status:'delivered', item:'Solar Panel Kit', from:'Konyo Konyo', to:'Munuki', rider:'Simon Deng', riderAvatar:'SD', eta:'Delivered', fee:5, orderedAt:'2 days ago' },
];

var FRIDAY_MARKET = {
  active: true,
  title: 'Friday Market 🎉',
  subtitle: 'Every Friday — special prices from top sellers',
  deals: ['p3','p7','p6','p11'],
  nextFriday: 'Tomorrow',
};

var TRENDING_SEARCHES = ['iPhone','solar panel','cassava','cement','Toyota Hilux','generator','wedding dress','maize'];

window.JubaData = { CATEGORIES, NEIGHBORHOODS, SELLERS, PRODUCTS, REVIEWS, NOTIFICATIONS, WANTED_ADS, CHAT_THREADS, COURIER_RIDERS, DELIVERY_JOBS, FRIDAY_MARKET, TRENDING_SEARCHES };
})();
