// jm-browse.jsx v3 — Browse, Product Detail, Seller Store with Near Me + followers

function BrowseScreen({ nav, initCategory='all' }) {
  const { PRODUCTS, SELLERS, CATEGORIES, NEIGHBORHOODS } = window.KampalaData;
  const [search, setSearch] = React.useState('');
  const [cat, setCat] = React.useState(initCategory);
  const [sort, setSort] = React.useState('trending');
  const [priceMax, setPriceMax] = React.useState(5000000);
  const [condition, setCondition] = React.useState('all');
  const [neighborhood, setNeighborhood] = React.useState('all');
  const [wishlist, setWishlist] = React.useState([]);
  const [view, setView] = React.useState('grid');
  const [nearMode, setNearMode] = React.useState(false);

  const CONDITIONS = ['all','New','Used - Good','Used - Fair','Fresh','Refurbished','Live'];

  const filtered = PRODUCTS
    .filter(p => cat==='all' || p.category===cat)
    .filter(p => !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.tags.some(t=>t.includes(search.toLowerCase())))
    .filter(p => p.price<=priceMax)
    .filter(p => condition==='all' || p.condition===condition)
    .filter(p => neighborhood==='all' || p.neighborhood===neighborhood)
    .sort((a,b) => sort==='price-asc'?a.price-b.price : sort==='price-desc'?b.price-a.price : sort==='newest'?-1 : b.views-a.views);

  const toggleWish = id => setWishlist(w=>w.includes(id)?w.filter(x=>x!==id):[...w,id]);

  return (
    <div style={{ maxWidth:1200, margin:'0 auto', padding:'28px 24px' }}>
      {/* Search bar */}
      <div style={{ display:'flex', gap:10, marginBottom:16, flexWrap:'wrap' }}>
        <div style={{ position:'relative', flex:1, minWidth:200 }}>
          <span style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', fontSize:16 }}>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search products, brands, keywords…" style={{ ...S.input, paddingLeft:38 }}/>
        </div>
        <select value={sort} onChange={e=>setSort(e.target.value)} style={{ ...S.input, width:'auto', cursor:'pointer' }}>
          <option value="trending">🔥 Trending</option>
          <option value="newest">🕐 Newest First</option>
          <option value="price-asc">💰 Price: Low → High</option>
          <option value="price-desc">💰 Price: High → Low</option>
        </select>
        <button onClick={()=>setNearMode(!nearMode)} style={{ ...nearMode?S.primary:S.outline, padding:'10px 16px', fontSize:13, display:'flex', alignItems:'center', gap:6 }}>
          📍 Near Me {nearMode&&'✓'}
        </button>
        <button onClick={()=>setView(v=>v==='grid'?'list':'grid')} style={{ ...S.outline, padding:'10px 14px' }}>
          {view==='grid'?'☰':'⊞'}
        </button>
      </div>

      {/* Near Me neighborhood strip */}
      {nearMode && (
        <div style={{ background:'oklch(0.94 0.04 155 / 0.3)', border:`1.5px solid ${C.green}`, borderRadius:12, padding:'14px 18px', marginBottom:16 }}>
          <div style={{ fontSize:13, fontWeight:700, color:C.green, marginBottom:10 }}>📍 Browsing near…</div>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            {NEIGHBORHOODS.map(n => (
              <button key={n.id} onClick={()=>setNeighborhood(n.id)} style={{ padding:'6px 14px', borderRadius:99, border:'1.5px solid', borderColor:neighborhood===n.id?C.green:C.border, background:neighborhood===n.id?C.greenLight:'white', color:neighborhood===n.id?C.green:C.muted, fontWeight:neighborhood===n.id?700:500, fontSize:12, cursor:'pointer', transition:'all 0.15s' }}>
                {n.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div style={{ display:'grid', gridTemplateColumns:'210px 1fr', gap:24, alignItems:'start' }}>
        {/* Sidebar */}
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <div style={{ ...S.card, padding:20 }}>
            <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:15, marginBottom:16 }}>Filters</div>

            <div style={{ marginBottom:18 }}>
              <label style={S.label}>Category</label>
              {CATEGORIES.map(c => (
                <div key={c.id} onClick={()=>setCat(c.id)} style={{ display:'flex', alignItems:'center', gap:8, padding:'7px 8px', borderRadius:8, cursor:'pointer', marginBottom:2, background:cat===c.id?C.goldLight:'transparent', color:cat===c.id?C.goldDark:C.text, fontWeight:cat===c.id?700:400, fontSize:13 }}>
                  {c.icon!=='▦'?c.icon:''} {c.label}
                </div>
              ))}
            </div>

            <div style={{ marginBottom:16 }}>
              <label style={S.label}>Max Price: {fmt(priceMax)}</label>
              <input type="range" min={10000} max={5000000} step={10000} value={priceMax} onChange={e=>setPriceMax(Number(e.target.value))} style={{ width:'100%', accentColor:C.gold }}/>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:C.muted }}><span>UGX 10K</span><span>UGX 5M</span></div>
            </div>

            <div style={{ marginBottom:14 }}>
              <label style={S.label}>Condition</label>
              <select value={condition} onChange={e=>setCondition(e.target.value)} style={{ ...S.input, fontSize:13 }}>
                {CONDITIONS.map(c=><option key={c} value={c}>{c==='all'?'Any Condition':c}</option>)}
              </select>
            </div>

            <button onClick={()=>{ setCat('all'); setPriceMax(1000); setCondition('all'); setNeighborhood('all'); setSearch(''); setNearMode(false); }} style={{ ...S.outline, width:'100%', padding:'9px', fontSize:13 }}>
              Clear Filters
            </button>
          </div>

          {/* Wanted ads CTA in sidebar */}
          <div style={{ background:`linear-gradient(135deg, oklch(0.55 0.15 225), oklch(0.45 0.14 245))`, borderRadius:12, padding:'18px 16px' }}>
            <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:14, color:'white', marginBottom:6 }}>📢 Can't find it?</div>
            <div style={{ color:'rgba(255,255,255,0.75)', fontSize:12, marginBottom:12 }}>Post a Wanted Ad and let sellers respond.</div>
            <button onClick={()=>nav('wanted')} style={{ background:'rgba(255,255,255,0.2)', border:'1px solid rgba(255,255,255,0.3)', color:'white', borderRadius:8, padding:'8px', width:'100%', cursor:'pointer', fontSize:13, fontFamily:'var(--font-body)', fontWeight:600 }}>Post Wanted Ad</button>
          </div>
        </div>

        {/* Results */}
        <div>
          <div style={{ fontSize:13, color:C.muted, marginBottom:16 }}>
            <strong style={{ color:C.text }}>{filtered.length}</strong> products found
            {cat!=='all' && ` in ${CATEGORIES.find(c=>c.id===cat)?.label}`}
            {search && ` matching "${search}"`}
            {neighborhood!=='all' && ` near ${NEIGHBORHOODS.find(n=>n.id===neighborhood)?.label}`}
          </div>

          {filtered.length === 0 ? (
            <div style={{ textAlign:'center', padding:'64px 24px', color:C.muted }}>
              <div style={{ fontSize:48, marginBottom:12 }}>🔎</div>
              <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:18, marginBottom:8 }}>No products found</div>
              <div style={{ fontSize:14, marginBottom:20 }}>Try adjusting your filters, or post a Wanted Ad.</div>
              <button onClick={()=>nav('wanted')} style={{ ...S.primary, padding:'11px 24px' }}>Post Wanted Ad</button>
            </div>
          ) : view==='grid' ? (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px,1fr))', gap:16 }}>
              {filtered.map((p,i) => (
                <div key={p.id} style={{ animation:`fadeUp 0.35s ease ${i*0.04}s both` }}>
                  <ProductCard product={p} onView={id=>nav('product',id)} onWishlist={toggleWish} wishlisted={wishlist.includes(p.id)}/>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {filtered.map(p => {
                const seller = SELLERS.find(s=>s.id===p.sellerId);
                return (
                  <div key={p.id} onClick={()=>nav('product',p.id)} style={{ ...S.card, display:'flex', cursor:'pointer', transition:'transform 0.15s' }}
                    onMouseEnter={e=>e.currentTarget.style.transform='translateX(3px)'}
                    onMouseLeave={e=>e.currentTarget.style.transform='none'}>
                    <div style={{ width:100, flexShrink:0 }}><ProductImage category={p.category} height={90}/></div>
                    <div style={{ padding:'12px 16px', flex:1 }}>
                      <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:14, marginBottom:4 }}>{p.title}</div>
                      <div style={{ display:'flex', gap:10, fontSize:12, color:C.muted, marginBottom:8, flexWrap:'wrap' }}>
                        <span>📍 {p.location}</span><span>🏷 {p.condition}</span><span>👁 {p.views}</span>
                        {p.negotiable && <span style={{ color:C.green }}>✓ Negotiable</span>}
                      </div>
                      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                        <span style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:18, color:p.dealPrice?C.red:C.goldDark }}>
                          {fmt(p.dealPrice||p.price)}
                          {p.dealPrice && <span style={{ fontFamily:'var(--font-body)', fontWeight:400, fontSize:12, color:C.light, textDecoration:'line-through', marginLeft:6 }}>{fmt(p.price)}</span>}
                        </span>
                        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                          <Avatar initials={seller?.avatar} size={22} color={C.green} online={seller?.online}/>
                          <span style={{ fontSize:12, color:C.muted }}>{seller?.name}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Product Detail ───────────────────────────────────────────────────────
function ProductScreen({ nav, productId }) {
  const { PRODUCTS, SELLERS, REVIEWS } = window.KampalaData;
  const product = PRODUCTS.find(p=>p.id===productId);
  const seller = product ? SELLERS.find(s=>s.id===product.sellerId) : null;
  const reviews = REVIEWS.filter(r=>r.sellerId===product?.sellerId);
  const related = PRODUCTS.filter(p=>p.category===product?.category && p.id!==productId).slice(0,4);
  const [contact, setContact] = React.useState(false);
  const [negotiate, setNegotiate] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [viewerCount] = React.useState(Math.floor(Math.random()*8)+3);

  if (!product || !seller) return <div style={{ padding:40, textAlign:'center', color:C.muted }}>Product not found.</div>;

  return (
    <div style={{ maxWidth:1100, margin:'0 auto', padding:'28px 24px' }}>
      {/* Breadcrumb */}
      <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:20, fontSize:13, color:C.muted }}>
        <button onClick={()=>nav('home')} style={{ background:'none', border:'none', cursor:'pointer', color:C.muted, fontFamily:'var(--font-body)' }}>Home</button>
        <span>›</span>
        <button onClick={()=>nav('browse')} style={{ background:'none', border:'none', cursor:'pointer', color:C.muted, fontFamily:'var(--font-body)' }}>Browse</button>
        <span>›</span>
        <span style={{ color:C.text }}>{product.title}</span>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'minmax(0,1.4fr) minmax(0,1fr)', gap:28, alignItems:'start' }}>
        {/* Left */}
        <div>
          <div style={{ borderRadius:16, overflow:'hidden', marginBottom:20, position:'relative' }}>
            <ProductImage category={product.category} height={340} dealBadge={!!product.dealPrice}/>
            {product.stock <= 3 && product.stock > 0 && (
              <div style={{ position:'absolute', bottom:14, left:14, background:'rgba(0,0,0,0.72)', color:'white', borderRadius:8, padding:'6px 14px', fontSize:13, fontWeight:700 }}>
                ⚠️ Only {product.stock} left!
              </div>
            )}
          </div>

          <div style={{ ...S.card, padding:24, marginBottom:18 }}>
            <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:16, marginBottom:12 }}>Description</div>
            <p style={{ color:C.muted, lineHeight:1.75, fontSize:14 }}>{product.description}</p>
            <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginTop:14 }}>
              {product.tags.map(t=><Badge key={t} variant="gray">#{t}</Badge>)}
            </div>
          </div>

          <div style={{ ...S.card, padding:24 }}>
            <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:16, marginBottom:16 }}>Seller Reviews ({reviews.length})</div>
            {reviews.length === 0 ? <div style={{ color:C.muted, fontSize:14 }}>No reviews yet.</div> :
              reviews.map(r => (
                <div key={r.id} style={{ borderBottom:`1px solid ${C.border}`, paddingBottom:14, marginBottom:14 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <Avatar initials={r.buyerName.slice(0,2)} size={28} color={C.gold}/>
                      <span style={{ fontWeight:700, fontSize:14 }}>{r.buyerName}</span>
                    </div>
                    <span style={{ fontSize:12, color:C.light }}>{r.date}</span>
                  </div>
                  <Stars rating={r.rating} size={12}/>
                  <p style={{ fontSize:13, color:C.muted, marginTop:6, lineHeight:1.6 }}>{r.comment}</p>
                </div>
              ))
            }
          </div>
        </div>

        {/* Right sticky */}
        <div style={{ display:'flex', flexDirection:'column', gap:16, position:'sticky', top:80 }}>
          <div style={{ ...S.card, padding:24 }}>
            {product.featured && <div style={{ marginBottom:10 }}><Badge variant="gold">★ Featured</Badge></div>}
            <h1 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:21, lineHeight:1.3, marginBottom:14 }}>{product.title}</h1>

            <div style={{ display:'flex', alignItems:'baseline', gap:10, marginBottom:6 }}>
              {product.dealPrice ? (
                <><span style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:34, color:C.red }}>{fmt(product.dealPrice)}</span>
                <span style={{ fontSize:16, color:C.light, textDecoration:'line-through' }}>{fmt(product.price)}</span>
                <Badge variant="red">SALE</Badge></>
              ) : (
                <span style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:34, color:C.goldDark }}>{fmt(product.price)}</span>
              )}
            </div>
            {product.negotiable && <div style={{ fontSize:13, color:C.green, fontWeight:600, marginBottom:16 }}>✓ Price negotiable — make an offer!</div>}

            <div style={{ background:C.creamDark, borderRadius:10, padding:'14px 16px', marginBottom:16 }}>
              {[['Condition',product.condition],['Location','📍 '+product.location],['Neighborhood',window.KampalaData.NEIGHBORHOODS.find(n=>n.id===product.neighborhood)?.label||product.location],['Stock',product.stock+' available'],['Posted',product.postedAt]].map(([k,v]) => (
                <div key={k} style={{ display:'flex', justifyContent:'space-between', fontSize:13, marginBottom:5 }}>
                  <span style={{ color:C.muted }}>{k}</span><span style={{ fontWeight:600 }}>{v}</span>
                </div>
              ))}
            </div>

            {/* Live activity */}
            <div style={{ background:C.greenLight, borderRadius:8, padding:'9px 14px', marginBottom:16, fontSize:13, color:C.green, fontWeight:600, display:'flex', alignItems:'center', gap:6 }}>
              <div style={{ width:7, height:7, borderRadius:'50%', background:'#22c55e', animation:'pulse 2s infinite' }}/>
              {viewerCount} people viewing this right now
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              <button onClick={()=>setContact(true)} style={{ ...S.primary, width:'100%', padding:'14px', fontSize:15, background:C.green }}>
                💬 Contact on WhatsApp
              </button>
              {product.negotiable && (
                <button onClick={()=>setNegotiate(true)} style={{ ...S.primary, width:'100%', padding:'13px', fontSize:15 }}>
                  🤝 Make an Offer
                </button>
              )}
              <button onClick={()=>nav('courier')} style={{ ...S.outline, width:'100%', padding:'12px', fontSize:14 }}>
                🚚 Request Delivery
              </button>
              <button onClick={()=>setSaved(!saved)} style={{ ...S.outline, width:'100%', padding:'11px', borderColor:saved?C.red:C.border, color:saved?C.red:C.text }}>
                {saved ? '♥ Saved to Wishlist' : '♡ Save to Wishlist'}
              </button>
            </div>
          </div>

          {/* Seller card */}
          <div style={{ ...S.card, padding:20, cursor:'pointer' }} onClick={()=>nav('seller-store',seller.id)}>
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:12 }}>
              <Avatar initials={seller.avatar} size={48} color={C.green} online={seller.online}/>
              <div>
                <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                  <span style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:15 }}>{seller.name}</span>
                  {seller.verified && <Badge variant="green">✓</Badge>}
                </div>
                <div style={{ fontSize:12, color:C.muted }}>{seller.online?<span style={{ color:'#22c55e' }}>● Online now</span>:'○ Offline'} · 👥 {seller.followers} followers</div>
              </div>
            </div>
            <div style={{ display:'flex', gap:12, fontSize:13, marginBottom:12 }}>
              <Stars rating={seller.rating} size={12}/>
              <span style={{ fontWeight:700 }}>{seller.rating}</span>
              <span style={{ color:C.muted }}>({seller.reviews} reviews)</span>
            </div>
            <div style={{ display:'flex', gap:8 }}>
              <button style={{ ...S.outline, flex:1, fontSize:13, padding:'9px' }}>View Store →</button>
              <button style={{ ...S.primary, flex:1, background:C.green, fontSize:13, padding:'9px' }}>+ Follow</button>
            </div>
          </div>

          <div style={{ background:'oklch(0.95 0.03 80)', borderRadius:12, padding:'16px 18px', border:`1px solid ${C.border}` }}>
            <div style={{ fontWeight:700, fontSize:13, marginBottom:8 }}>🛡 Safe Trading Tips</div>
            {['Meet in a public place (market, bank, church)','Inspect goods before paying','Never send money before seeing the item','Bring a friend for large purchases'].map(tip => (
              <div key={tip} style={{ fontSize:12, color:C.muted, marginBottom:5 }}>✓ {tip}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div style={{ marginTop:40 }}>
          <SectionHeader title="You may also like" action="Browse more →" onAction={()=>nav('browse')}/>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px,1fr))', gap:16 }}>
            {related.map(p=><ProductCard key={p.id} product={p} onView={id=>nav('product',id)}/>)}
          </div>
        </div>
      )}

      {contact && <ContactModal seller={seller} product={product} onClose={()=>setContact(false)}/>}
      {negotiate && <NegotiateModal product={product} seller={seller} onClose={()=>setNegotiate(false)}/>}
      <style>{`@keyframes pulse{0%,100%{box-shadow:0 0 0 3px rgba(34,197,94,0.3)}50%{box-shadow:0 0 0 6px rgba(34,197,94,0.1)}}`}</style>
    </div>
  );
}

// ─── Seller Store (public) ────────────────────────────────────────────────
function SellerStoreScreen({ nav, sellerId }) {
  const { SELLERS, PRODUCTS, REVIEWS } = window.KampalaData;
  const seller = SELLERS.find(s=>s.id===sellerId);
  const listings = PRODUCTS.filter(p=>p.sellerId===sellerId);
  const reviews = REVIEWS.filter(r=>r.sellerId===sellerId);
  const [tab, setTab] = React.useState('listings');
  const [following, setFollowing] = React.useState(false);

  if (!seller) return <div style={{ padding:40, textAlign:'center' }}>Seller not found.</div>;

  return (
    <div>
      <div style={{ height:180, background:seller.coverColor, position:'relative' }}>
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.4))' }}/>
        <div style={{ position:'absolute', bottom:-40, left:40 }}>
          <Avatar initials={seller.avatar} size={80} color={C.green} online={seller.online}/>
        </div>
      </div>

      <div style={{ maxWidth:1000, margin:'0 auto', padding:'0 24px' }}>
        <div style={{ paddingTop:52, marginBottom:24, display:'flex', alignItems:'flex-end', justifyContent:'space-between', flexWrap:'wrap', gap:14 }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
              <h1 style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:24 }}>{seller.name}</h1>
              {seller.verified && <Badge variant="green">✓ Verified</Badge>}
              {seller.badge && <Badge variant="gold">{seller.badge}</Badge>}
            </div>
            <div style={{ fontSize:13, color:C.muted }}>📍 {seller.location} · Member since {seller.joined} · {seller.online?<span style={{ color:'#22c55e' }}>● Online now</span>:'Last seen today'}</div>
          </div>
          <div style={{ display:'flex', gap:12, alignItems:'center' }}>
            <div style={{ display:'flex', gap:20, fontSize:14 }}>
              <div style={{ textAlign:'center' }}><div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:22, color:C.goldDark }}>{listings.length}</div><div style={{ fontSize:11, color:C.muted }}>Listings</div></div>
              <div style={{ textAlign:'center' }}><div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:22, color:C.goldDark }}>{seller.followers}</div><div style={{ fontSize:11, color:C.muted }}>Followers</div></div>
              <div style={{ textAlign:'center' }}><div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:22, color:C.goldDark }}>{seller.rating}</div><div style={{ fontSize:11, color:C.muted }}>Rating</div></div>
            </div>
            <button onClick={()=>setFollowing(!following)} style={{ ...following?{...S.outline,borderColor:C.green,color:C.green}:S.primary, padding:'11px 22px', fontSize:14, background:following?'transparent':C.green }}>
              {following ? '✓ Following' : '+ Follow Shop'}
            </button>
            <a href={`https://wa.me/${seller.whatsapp?.replace(/\D/g,'')}?text=Hi ${seller.name}!`} target="_blank"
              style={{ ...S.primary, padding:'11px 18px', fontSize:14, textDecoration:'none', background:C.green }}>💬 WhatsApp</a>
          </div>
        </div>

        {following && (
          <div style={{ background:C.greenLight, borderRadius:10, padding:'10px 16px', marginBottom:18, fontSize:13, color:C.green, fontWeight:600 }}>
            ✓ You're now following {seller.name}. You'll get notified of new listings and announcements.
          </div>
        )}

        <p style={{ color:C.muted, fontSize:14, lineHeight:1.7, marginBottom:24, maxWidth:600 }}>{seller.description}</p>

        <div style={{ display:'flex', gap:4, borderBottom:`1.5px solid ${C.border}`, marginBottom:24 }}>
          {['listings','reviews'].map(t => (
            <button key={t} onClick={()=>setTab(t)} style={{ padding:'10px 22px', border:'none', background:'transparent', fontFamily:'var(--font-body)', fontWeight:tab===t?700:500, fontSize:14, color:tab===t?C.goldDark:C.muted, borderBottom:tab===t?`2.5px solid ${C.gold}`:'2.5px solid transparent', cursor:'pointer', marginBottom:-1.5 }}>
              {t.charAt(0).toUpperCase()+t.slice(1)} {t==='listings'?`(${listings.length})`:`(${reviews.length})`}
            </button>
          ))}
        </div>

        {tab === 'listings' && (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px,1fr))', gap:16, marginBottom:40 }}>
            {listings.map(p=><ProductCard key={p.id} product={p} onView={id=>nav('product',id)}/>)}
          </div>
        )}
        {tab === 'reviews' && (
          <div style={{ display:'flex', flexDirection:'column', gap:14, maxWidth:600, marginBottom:40 }}>
            {reviews.length === 0 ? <div style={{ color:C.muted, fontSize:14 }}>No reviews yet.</div> :
              reviews.map(r => (
                <div key={r.id} style={{ ...S.card, padding:20 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <Avatar initials={r.buyerName.slice(0,2)} size={32} color={C.gold}/>
                      <span style={{ fontWeight:700 }}>{r.buyerName}</span>
                    </div>
                    <span style={{ fontSize:12, color:C.light }}>{r.date}</span>
                  </div>
                  <Stars rating={r.rating}/>
                  <p style={{ fontSize:13, color:C.muted, marginTop:8, lineHeight:1.6 }}>{r.comment}</p>
                </div>
              ))
            }
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { BrowseScreen, ProductScreen, SellerStoreScreen });
