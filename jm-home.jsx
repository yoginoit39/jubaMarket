// jm-home.jsx v3 — Home screen with Friday Market, Near Me, deal counter, trending

function HomeScreen({ nav }) {
  const { PRODUCTS, SELLERS, CATEGORIES, FRIDAY_MARKET, TRENDING_SEARCHES, NEIGHBORHOODS } = window.JubaData;
  const [wishlist, setWishlist] = React.useState([]);
  const [dealsToday] = React.useState(Math.floor(Math.random()*8)+28);
  const [browsing] = React.useState(Math.floor(Math.random()*30)+40);
  const [nearMe, setNearMe] = React.useState('konyo-konyo');

  const deals = PRODUCTS.filter(p => p.dealPrice);
  const featured = PRODUCTS.filter(p => p.featured);
  const trending = PRODUCTS.slice().sort((a,b)=>b.views-a.views).slice(0,4);
  const fridayDeals = FRIDAY_MARKET.deals.map(id => PRODUCTS.find(p=>p.id===id)).filter(Boolean);
  const nearProducts = PRODUCTS.filter(p => p.neighborhood === nearMe).slice(0,4);
  const topSellers = SELLERS.slice(0,3);
  const jubaNeighborhoods = NEIGHBORHOODS.filter(n => n.city === 'Juba');

  const toggleWish = id => setWishlist(w => w.includes(id) ? w.filter(x=>x!==id) : [...w,id]);

  return (
    <div>
      {/* Hero */}
      <div style={{ background:'linear-gradient(135deg, oklch(0.38 0.13 155) 0%, oklch(0.28 0.11 140) 55%, oklch(0.20 0.08 100) 100%)', padding:'56px 24px 48px', position:'relative', overflow:'hidden' }}>
        <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.06 }} viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid slice">
          {Array.from({length:25}).map((_,i) => <circle key={i} cx={Math.sin(i*137.5)*500+500} cy={Math.cos(i*97)*250+250} r={20+i*10} fill="white"/>)}
        </svg>

        {/* Live pulse bar */}
        <div style={{ maxWidth:800, margin:'0 auto 20px', display:'flex', justifyContent:'center' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:20, background:'rgba(255,255,255,0.10)', backdropFilter:'blur(8px)', borderRadius:99, padding:'8px 24px', fontSize:13 }}>
            <div style={{ display:'flex', alignItems:'center', gap:7, color:'rgba(255,255,255,0.9)' }}>
              <div style={{ width:7, height:7, borderRadius:'50%', background:'#4ade80', boxShadow:'0 0 0 3px rgba(74,222,128,0.3)', animation:'pulse 2s infinite' }}/>
              <span><strong>{browsing}</strong> people browsing now</span>
            </div>
            <div style={{ width:1, height:16, background:'rgba(255,255,255,0.2)' }}/>
            <div style={{ color:'rgba(255,255,255,0.9)' }}>🔥 <strong>{dealsToday}</strong> deals posted today</div>
            <div style={{ width:1, height:16, background:'rgba(255,255,255,0.2)' }}/>
            <div style={{ color:'rgba(255,255,255,0.9)' }}>📦 <strong>1,248</strong> active listings</div>
          </div>
        </div>

        <div style={{ position:'relative', maxWidth:720, margin:'0 auto', textAlign:'center' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(255,255,255,0.12)', borderRadius:99, padding:'6px 18px', marginBottom:16, fontSize:13, color:'rgba(255,255,255,0.9)', fontWeight:500 }}>
            🇸🇸 South Sudan's #1 Marketplace
          </div>
          <h1 style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:'clamp(28px,5.5vw,54px)', color:'white', lineHeight:1.1, marginBottom:14, animation:'fadeUp 0.4s ease both' }}>
            Buy & Sell Anything<br/>in South Sudan
          </h1>
          <p style={{ color:'rgba(255,255,255,0.72)', fontSize:16, marginBottom:26, animation:'fadeUp 0.4s ease 0.08s both' }}>
            Connect with local sellers · No middlemen · No online payment needed
          </p>

          {/* Search */}
          <div style={{ display:'flex', background:'white', borderRadius:14, overflow:'hidden', boxShadow:'0 8px 40px rgba(0,0,0,0.25)', maxWidth:600, margin:'0 auto 16px', animation:'fadeUp 0.4s ease 0.14s both' }}>
            <span style={{ display:'flex', alignItems:'center', paddingLeft:18, color:C.muted, fontSize:18, flexShrink:0 }}>🔍</span>
            <input placeholder="What are you looking for?" style={{ flex:1, padding:'15px 14px', border:'none', outline:'none', fontSize:15, fontFamily:'var(--font-body)', color:C.text, background:'transparent' }}
              onKeyDown={e => e.key==='Enter' && nav('browse')}/>
            <button onClick={() => nav('browse')} style={{ ...S.primary, margin:6, borderRadius:10, padding:'0 24px', fontSize:14 }}>Search</button>
          </div>

          {/* Trending searches */}
          <div style={{ display:'flex', gap:8, justifyContent:'center', flexWrap:'wrap', animation:'fadeUp 0.4s ease 0.2s both' }}>
            <span style={{ color:'rgba(255,255,255,0.5)', fontSize:12, display:'flex', alignItems:'center' }}>Trending:</span>
            {TRENDING_SEARCHES.slice(0,6).map(q => (
              <button key={q} onClick={() => nav('browse')} style={{ background:'rgba(255,255,255,0.12)', border:'1px solid rgba(255,255,255,0.18)', color:'rgba(255,255,255,0.85)', borderRadius:99, padding:'4px 14px', fontSize:12, cursor:'pointer', fontFamily:'var(--font-body)', transition:'background 0.15s' }}>
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div style={{ background:C.white, borderBottom:`1px solid ${C.border}` }}>
        <div style={{ maxWidth:1200, margin:'0 auto', padding:'14px 24px', display:'flex', gap:24, justifyContent:'center', flexWrap:'wrap' }}>
          {[['1,248+','Active Listings'],['340+','Verified Sellers'],['4,800+','Registered Buyers'],['47','Deals Closed Today']].map(([n,l]) => (
            <div key={l} style={{ textAlign:'center' }}>
              <div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:20, color:C.goldDark }}>{n}</div>
              <div style={{ fontSize:11, color:C.muted }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth:1200, margin:'0 auto', padding:'36px 24px' }}>

        {/* Friday Market */}
        {FRIDAY_MARKET.active && (
          <div style={{ marginBottom:44 }}>
            <div style={{ background:'linear-gradient(135deg, oklch(0.22 0.03 45) 0%, oklch(0.30 0.08 50) 100%)', borderRadius:20, padding:'28px 32px', marginBottom:20, display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:16, position:'relative', overflow:'hidden' }}>
              <div style={{ position:'absolute', right:-20, top:-20, fontSize:100, opacity:0.07 }}>🎪</div>
              <div>
                <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:6 }}>
                  <span style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:26, color:'white' }}>🎉 Friday Market</span>
                  <span style={{ background:C.gold, color:'white', padding:'3px 12px', borderRadius:99, fontSize:12, fontWeight:800 }}>LIVE NOW</span>
                </div>
                <div style={{ color:'rgba(255,255,255,0.65)', fontSize:14 }}>Every Friday — top sellers post exclusive deals. Come back every week!</div>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ textAlign:'center', color:'white' }}>
                  <div style={{ fontSize:12, opacity:0.6, marginBottom:2 }}>Ends in</div>
                  <Countdown/>
                </div>
              </div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(220px,1fr))', gap:16 }}>
              {fridayDeals.map((p,i) => (
                <div key={p.id} style={{ animation:`fadeUp 0.4s ease ${i*0.07}s both` }}>
                  <ProductCard product={p} onView={id=>nav('product',id)} onWishlist={toggleWish} wishlisted={wishlist.includes(p.id)}/>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Daily Deals */}
        {deals.length > 0 && (
          <div style={{ marginBottom:44 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16, flexWrap:'wrap', gap:10 }}>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <h2 style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:22 }}>🔥 Today's Deals</h2>
                <div style={{ background:C.red, color:'white', borderRadius:99, padding:'5px 14px', fontSize:12, fontWeight:700, display:'flex', alignItems:'center', gap:8 }}>
                  Ends in <Countdown/>
                </div>
              </div>
              <button onClick={() => nav('browse')} style={{ ...S.outline, padding:'7px 16px', fontSize:13 }}>View all →</button>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(220px,1fr))', gap:16 }}>
              {deals.map((p,i) => (
                <div key={p.id} style={{ animation:`fadeUp 0.4s ease ${i*0.07}s both` }}>
                  <ProductCard product={p} onView={id=>nav('product',id)} onWishlist={toggleWish} wishlisted={wishlist.includes(p.id)}/>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Near Me */}
        <div style={{ marginBottom:44 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16, flexWrap:'wrap', gap:12 }}>
            <h2 style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:22 }}>📍 Near You in Juba</h2>
            <button onClick={() => nav('browse')} style={{ ...S.outline, padding:'7px 16px', fontSize:13 }}>Browse map →</button>
          </div>
          {/* Neighborhood pills */}
          <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:20 }}>
            {jubaNeighborhoods.map(n => (
              <button key={n.id} onClick={() => setNearMe(n.id)} style={{ padding:'7px 16px', borderRadius:99, border:'1.5px solid', borderColor:nearMe===n.id?C.gold:C.border, background:nearMe===n.id?C.goldLight:'white', color:nearMe===n.id?C.goldDark:C.muted, fontWeight:nearMe===n.id?700:500, fontSize:13, cursor:'pointer', transition:'all 0.15s' }}>
                {n.label}
              </button>
            ))}
          </div>
          {nearProducts.length > 0 ? (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(220px,1fr))', gap:16 }}>
              {nearProducts.map((p,i) => (
                <div key={p.id} style={{ animation:`fadeUp 0.3s ease ${i*0.06}s both` }}>
                  <ProductCard product={p} onView={id=>nav('product',id)} onWishlist={toggleWish} wishlisted={wishlist.includes(p.id)}/>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign:'center', padding:'32px 24px', color:C.muted, background:C.creamDark, borderRadius:16 }}>
              <div style={{ fontSize:32, marginBottom:8 }}>📍</div>
              <div style={{ fontWeight:600 }}>No listings in this area yet</div>
              <div style={{ fontSize:13, marginTop:4 }}>Be the first to sell here!</div>
            </div>
          )}
        </div>

        {/* Wanted Ads CTA */}
        <div style={{ background:`linear-gradient(135deg, oklch(0.55 0.15 225), oklch(0.45 0.14 245))`, borderRadius:20, padding:'28px 32px', marginBottom:44, display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:16 }}>
          <div>
            <div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:20, color:'white', marginBottom:6 }}>📢 Can't find what you need?</div>
            <div style={{ color:'rgba(255,255,255,0.78)', fontSize:14 }}>Post a Wanted Ad — sellers will come to you with their best prices!</div>
          </div>
          <button onClick={() => nav('wanted')} style={{ ...S.primary, background:'white', color:'oklch(0.45 0.14 245)', padding:'12px 28px', fontSize:14, fontWeight:800 }}>Post Wanted Ad →</button>
        </div>

        {/* Categories */}
        <div style={{ marginBottom:44 }}>
          <SectionHeader title="Browse by Category" action="See all →" onAction={() => nav('browse')}/>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(110px,1fr))', gap:10 }}>
            {CATEGORIES.filter(c=>c.id!=='all').map(cat => (
              <div key={cat.id} onClick={() => nav('browse',null,cat.id)}
                style={{ background:C.white, borderRadius:12, padding:'16px 10px', textAlign:'center', boxShadow:'0 1px 6px rgba(0,0,0,0.06)', cursor:'pointer', border:'1.5px solid transparent', transition:'all 0.18s' }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=C.gold;e.currentTarget.style.transform='translateY(-2px)';}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor='transparent';e.currentTarget.style.transform='none';}}>
                <div style={{ fontSize:24, marginBottom:6 }}>{cat.icon}</div>
                <div style={{ fontSize:11, fontWeight:600, color:C.text, lineHeight:1.3 }}>{cat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Trending */}
        <div style={{ marginBottom:44 }}>
          <SectionHeader title="🔝 Trending Now" action="Browse all →" onAction={() => nav('browse')}/>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(220px,1fr))', gap:16 }}>
            {trending.map((p,i) => (
              <div key={p.id} style={{ animation:`fadeUp 0.4s ease ${i*0.07}s both` }}>
                <ProductCard product={p} onView={id=>nav('product',id)} onWishlist={toggleWish} wishlisted={wishlist.includes(p.id)}/>
              </div>
            ))}
          </div>
        </div>

        {/* Top Sellers */}
        <div style={{ marginBottom:44 }}>
          <SectionHeader title="🏆 Top Sellers This Week"/>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(260px,1fr))', gap:16 }}>
            {topSellers.map((seller,i) => (
              <div key={seller.id} onClick={() => nav('seller-store',seller.id)}
                style={{ ...S.card, cursor:'pointer', transition:'transform 0.2s', animation:`fadeUp 0.4s ease ${i*0.08}s both` }}
                onMouseEnter={e=>e.currentTarget.style.transform='translateY(-3px)'}
                onMouseLeave={e=>e.currentTarget.style.transform='none'}>
                <div style={{ height:64, background:seller.coverColor, borderRadius:'12px 12px 0 0', position:'relative' }}>
                  <div style={{ position:'absolute', bottom:-22, left:18 }}>
                    <Avatar initials={seller.avatar} size={44} color={C.green} online={seller.online}/>
                  </div>
                </div>
                <div style={{ padding:'28px 18px 18px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                    <span style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:15 }}>{seller.name}</span>
                    {seller.badge && <Badge variant={seller.badge==='Top Seller'?'gold':'green'}>{seller.badge}</Badge>}
                  </div>
                  <div style={{ fontSize:12, color:C.muted, marginBottom:10 }}>📍 {seller.location}</div>
                  <div style={{ display:'flex', gap:16, fontSize:13, marginBottom:10 }}>
                    <span><Stars rating={seller.rating} size={11}/> <strong>{seller.rating}</strong> <span style={{color:C.muted}}>({seller.reviews})</span></span>
                    <span style={{ color:C.muted }}>👥 {seller.followers} followers</span>
                  </div>
                  <button style={{ ...S.primary, width:'100%', padding:'8px', fontSize:13, background:C.green }}>Follow Shop</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Courier CTA */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:44 }}>
          <div style={{ background:`linear-gradient(135deg, ${C.green}, oklch(0.32 0.11 140))`, borderRadius:20, padding:'28px 28px' }}>
            <div style={{ fontSize:36, marginBottom:12 }}>🚚</div>
            <div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:18, color:'white', marginBottom:8 }}>Fast Local Delivery</div>
            <div style={{ color:'rgba(255,255,255,0.75)', fontSize:13, marginBottom:16, lineHeight:1.6 }}>Boda boda & tricycle riders ready to deliver anywhere in Juba within the hour.</div>
            <button onClick={() => nav('courier')} style={{ background:'rgba(255,255,255,0.18)', border:'1px solid rgba(255,255,255,0.3)', color:'white', borderRadius:8, padding:'9px 20px', fontSize:13, cursor:'pointer', fontFamily:'var(--font-body)', fontWeight:600 }}>Find a Courier →</button>
          </div>
          <div style={{ background:`linear-gradient(135deg, ${C.goldDark}, ${C.gold})`, borderRadius:20, padding:'28px 28px' }}>
            <div style={{ fontSize:36, marginBottom:12 }}>🏪</div>
            <div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:18, color:'white', marginBottom:8 }}>Start Selling Today</div>
            <div style={{ color:'rgba(255,255,255,0.78)', fontSize:13, marginBottom:16, lineHeight:1.6 }}>Free to register. Post unlimited listings. Reach 4,800+ buyers across South Sudan.</div>
            <button onClick={() => nav('register-seller')} style={{ background:'rgba(255,255,255,0.18)', border:'1px solid rgba(255,255,255,0.3)', color:'white', borderRadius:8, padding:'9px 20px', fontSize:13, cursor:'pointer', fontFamily:'var(--font-body)', fontWeight:600 }}>Become a Seller →</button>
          </div>
        </div>

        {/* How it works */}
        <div style={{ background:`linear-gradient(135deg, oklch(0.95 0.04 80), oklch(0.93 0.04 90))`, borderRadius:20, padding:'36px 32px' }}>
          <h2 style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:22, textAlign:'center', marginBottom:28 }}>How Juba Market Works</h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px,1fr))', gap:20 }}>
            {[
              { icon:'🔍', title:'Find It', desc:'Search or browse thousands of local listings. Filter by neighborhood, price, condition.' },
              { icon:'💬', title:'Connect', desc:'Chat in-app or message directly on WhatsApp. Negotiate freely — no middlemen.' },
              { icon:'🤝', title:'Agree & Meet', desc:'Agree on price and meeting spot. We suggest safe public locations near you.' },
              { icon:'🚚', title:'Get Delivered', desc:'Request a boda boda delivery instead of meeting. Track your item in real time.' },
              { icon:'⭐', title:'Rate & Review', desc:'Leave a review after your deal. Build trust for the whole community.' },
            ].map(item => (
              <div key={item.title} style={{ textAlign:'center' }}>
                <div style={{ width:52, height:52, borderRadius:'50%', background:C.gold, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, margin:'0 auto 12px', boxShadow:`0 4px 12px oklch(0.72 0.16 72 / 0.3)` }}>{item.icon}</div>
                <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:14, marginBottom:5 }}>{item.title}</div>
                <div style={{ fontSize:12, color:C.muted, lineHeight:1.65 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{box-shadow:0 0 0 3px rgba(74,222,128,0.3)} 50%{box-shadow:0 0 0 6px rgba(74,222,128,0.1)} }
      `}</style>
    </div>
  );
}

Object.assign(window, { HomeScreen });
