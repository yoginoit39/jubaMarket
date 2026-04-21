// jm-seller.jsx v3 — Seller Dashboard with followers, broadcast, wanted ad responses

function SellerDashboard({ nav, user }) {
  const { WANTED_ADS } = window.KampalaData;
  const [tab, setTab] = React.useState('overview');
  const [listings, setListings] = React.useState([]);
  const [inquiries, setInquiries] = React.useState([]);
  const [followers, setFollowers] = React.useState([]);
  const [showPost, setShowPost] = React.useState(false);
  const [showBroadcast, setShowBroadcast] = React.useState(false);
  const [broadcastMsg, setBroadcastMsg] = React.useState('');
  const [broadcastSent, setBroadcastSent] = React.useState(false);
  const [postForm, setPostForm] = React.useState({ title:'', category:'', price:'', condition:'New', description:'', stock:'1', negotiable:true });
  const [posted, setPosted] = React.useState(false);
  const [postErr, setPostErr] = React.useState('');
  const [wantedResponses] = React.useState(WANTED_ADS.filter(a => ['electronics','building'].includes(a.category)));
  const sp = (k,v) => setPostForm(f=>({...f,[k]:v}));

  // Load real data
  React.useEffect(() => {
    if (!window.API.isLoggedIn()) return;
    window.API.myProducts().then(setListings).catch(()=>{});
    window.API.getInquiries().then(inqs => {
      // Reshape to match template expectations
      setInquiries(inqs.map(i => ({
        id: i.id,
        buyer: i.buyerName,
        phone: '+256 700 000 000',
        msg: i.lastMsg || i.messages?.slice(-1)[0]?.text || '',
        time: i.time,
        product: i.productTitle,
        read: i.unread === 0,
        offer: null,
        thread: i,
      })));
    }).catch(()=>{});
    window.API.getFollowed().then(f => {
      setFollowers(f.map((s, idx) => ({ id: s.id, name: s.name, avatar: s.avatar, location: s.location, since: '—', purchases: 0 })));
    }).catch(()=>{});
  }, [user]);

  const handlePost = async () => {
    setPostErr('');
    try {
      const np = await window.API.createProduct({
        title: postForm.title,
        category: postForm.category || 'electronics',
        price: parseFloat(postForm.price) || 0,
        negotiable: postForm.negotiable,
        condition: postForm.condition,
        stock: parseInt(postForm.stock) || 1,
        description: postForm.description,
        tags: [],
      });
      setListings(l => [np, ...l]);
      setPosted(true);
      setTimeout(() => { setPosted(false); setShowPost(false); setPostForm({ title:'', category:'', price:'', condition:'New', description:'', stock:'1', negotiable:true }); }, 2200);
    } catch(e) {
      setPostErr(e.message || 'Failed to post listing');
    }
  };

  const tabs = [
    { id:'overview', label:'📊 Overview' },
    { id:'listings', label:`📦 Listings (${listings.length})` },
    { id:'inquiries', label:`💬 Inquiries (${inquiries.filter(i=>!i.read).length} new)` },
    { id:'followers', label:`👥 Followers (${followers.length})` },
    { id:'wanted', label:`📢 Wanted Ads (${wantedResponses.length})` },
    { id:'analytics', label:'📈 Analytics' },
    { id:'boost', label:'🚀 Boost' },
    { id:'settings', label:'⚙' },
  ];

  const totalViews = listings.reduce((a,p)=>a+(p.views||0),0);
  const totalSaves = listings.reduce((a,p)=>a+(p.saves||0),0);

  return (
    <div style={{ maxWidth:1060, margin:'0 auto', padding:'28px 24px' }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24, flexWrap:'wrap', gap:14 }}>
        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
          <Avatar initials={user?.avatar||'S'} size={54} color={C.green} online={true}/>
          <div>
            <div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:22 }}>{user?.business||user?.name||'My Shop'}</div>
            <div style={{ display:'flex', gap:10, alignItems:'center', fontSize:13, color:C.muted }}>
              <span style={{ color:'#22c55e', fontWeight:600 }}>● Online</span>
              <span>·</span><span>Juba</span>
              <Badge variant="gold">Top Seller</Badge>
              <span>· <strong style={{ color:C.text }}>{followers.length}</strong> followers</span>
            </div>
          </div>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <button onClick={()=>setShowBroadcast(true)} style={{ ...S.outline, padding:'11px 18px', fontSize:13, display:'flex', alignItems:'center', gap:6 }}>
            📢 Broadcast
          </button>
          <button onClick={()=>setShowPost(true)} style={{ ...S.primary, padding:'12px 22px', fontSize:14 }}>
            + New Listing
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:2, borderBottom:`1.5px solid ${C.border}`, marginBottom:28, overflowX:'auto' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={()=>setTab(t.id)} style={{ padding:'10px 16px', border:'none', background:tab===t.id?C.goldLight:'transparent', fontFamily:'var(--font-body)', fontWeight:tab===t.id?700:500, fontSize:13, color:tab===t.id?C.goldDark:C.muted, borderBottom:tab===t.id?`2.5px solid ${C.gold}`:'2.5px solid transparent', cursor:'pointer', marginBottom:-1.5, whiteSpace:'nowrap', borderRadius:'8px 8px 0 0' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Overview */}
      {tab === 'overview' && (
        <div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(165px,1fr))', gap:14, marginBottom:28 }}>
            <StatCard icon="📦" label="Active Listings" value={listings.length} sub="2 pending"/>
            <StatCard icon="👁" label="Total Views" value={totalViews.toLocaleString()} color={C.green}/>
            <StatCard icon="♥" label="Saves" value={totalSaves} color={C.red}/>
            <StatCard icon="💬" label="New Inquiries" value={inquiries.filter(i=>!i.read).length} color={C.goldDark}/>
            <StatCard icon="👥" label="Followers" value={followers.length} sub="+3 this week" color={C.green}/>
            <StatCard icon="⭐" label="Rating" value="4.8" sub="124 reviews" color={C.goldDark}/>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:24 }}>
            <div style={{ ...S.card, padding:22 }}>
              <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:15, marginBottom:16 }}>Quick Actions</div>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {[['+ Post New Listing',()=>setShowPost(true),S.primary],['📢 Broadcast to Followers',()=>setShowBroadcast(true),S.outline],['🚀 Boost a Listing',()=>setTab('boost'),S.outline],['📢 Browse Wanted Ads',()=>setTab('wanted'),S.outline]].map(([l,fn,st]) => (
                  <button key={l} onClick={fn} style={{ ...st, padding:'10px', fontSize:13, textAlign:'left' }}>{l}</button>
                ))}
              </div>
            </div>
            <div style={{ ...S.card, padding:22 }}>
              <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:15, marginBottom:14 }}>Views This Week</div>
              <div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:32, color:C.green, marginBottom:12 }}>1,284</div>
              <div style={{ display:'flex', alignItems:'flex-end', gap:4, height:60 }}>
                {[40,65,55,80,95,72,100].map((h,i) => (
                  <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:3 }}>
                    <div style={{ width:'100%', background:`linear-gradient(to top, ${C.green}, ${C.goldLight})`, borderRadius:'3px 3px 0 0', height:`${h}%` }}/>
                    <span style={{ fontSize:9, color:C.muted }}>{'SMTWTFS'[i]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <SectionHeader title="Recent Inquiries"/>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {inquiries.slice(0,3).map(inq => (
              <div key={inq.id} style={{ ...S.card, padding:'14px 18px', display:'flex', gap:14, alignItems:'center', background:!inq.read?'oklch(0.96 0.04 80)':C.white, border:`1.5px solid ${!inq.read?C.gold:C.border}` }}>
                <Avatar initials={inq.buyer.slice(0,2)} size={38} color={C.gold}/>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', justifyContent:'space-between' }}>
                    <span style={{ fontWeight:700, fontSize:14 }}>{inq.buyer}</span>
                    <span style={{ fontSize:12, color:C.light }}>{inq.time}</span>
                  </div>
                  <div style={{ fontSize:12, color:C.muted, marginBottom:2 }}>re: {inq.product}</div>
                  <div style={{ fontSize:13, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{inq.msg}</div>
                </div>
                {inq.offer && <Badge variant="gold">Offer: ${inq.offer}</Badge>}
                <a href={`https://wa.me/${inq.phone.replace(/\D/g,'')}?text=Hi ${inq.buyer}!`} target="_blank"
                  style={{ ...S.primary, background:C.green, padding:'8px 14px', fontSize:12, textDecoration:'none', flexShrink:0 }}>WhatsApp</a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Listings */}
      {tab === 'listings' && (
        <div>
          <div style={{ display:'flex', gap:10, marginBottom:20, justifyContent:'flex-end' }}>
            <button onClick={()=>setShowPost(true)} style={{ ...S.primary, padding:'9px 18px', fontSize:13 }}>+ Add Listing</button>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {listings.map(p => (
              <div key={p.id} style={{ ...S.card, padding:'16px 20px', display:'flex', alignItems:'center', gap:16 }}>
                <div style={{ width:60, height:60, borderRadius:10, overflow:'hidden', flexShrink:0 }}><ProductImage category={p.category} height={60}/></div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontWeight:700, fontSize:14, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', marginBottom:4 }}>{p.title}</div>
                  <div style={{ display:'flex', gap:12, fontSize:12, color:C.muted, flexWrap:'wrap' }}>
                    <span>📦 {p.stock} in stock</span><span>👁 {p.views} views</span><span>♥ {p.saves} saves</span>
                    {p.featured && <Badge variant="gold">Featured</Badge>}
                    {p.dealPrice && <Badge variant="red">Deal</Badge>}
                  </div>
                </div>
                <div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:18, color:C.goldDark }}>{fmt(p.price)}</div>
                <div style={{ display:'flex', gap:8 }}>
                  <button style={{ ...S.outline, padding:'7px 14px', fontSize:12 }}>Edit</button>
                  <button onClick={()=>setListings(l=>l.filter(x=>x.id!==p.id))} style={{ ...S.danger, padding:'7px 14px', fontSize:12 }}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Inquiries */}
      {tab === 'inquiries' && (
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {inquiries.map(inq => (
            <div key={inq.id} style={{ ...S.card, padding:20, border:`1.5px solid ${!inq.read?C.gold:C.border}`, background:!inq.read?'oklch(0.96 0.04 80)':C.white }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
                <div style={{ display:'flex', gap:12, alignItems:'center' }}>
                  <Avatar initials={inq.buyer.slice(0,2)} size={40} color={C.gold}/>
                  <div>
                    <div style={{ fontWeight:700, fontSize:15 }}>{inq.buyer}</div>
                    <div style={{ fontSize:12, color:C.muted }}>re: {inq.product}</div>
                  </div>
                  {inq.offer && <Badge variant="gold">🤝 Offer: ${inq.offer}</Badge>}
                </div>
                <span style={{ fontSize:12, color:C.light }}>{inq.time}</span>
              </div>
              <p style={{ fontSize:14, color:C.muted, lineHeight:1.6, marginBottom:14 }}>{inq.msg}</p>
              <div style={{ display:'flex', gap:10 }}>
                <a href={`https://wa.me/${inq.phone.replace(/\D/g,'')}?text=Hi ${inq.buyer}! Thanks for your message.`} target="_blank"
                  style={{ ...S.primary, background:C.green, padding:'9px 18px', fontSize:13, textDecoration:'none' }}>💬 Reply on WhatsApp</a>
                <a href={`tel:${inq.phone.replace(/\s/g,'')}`} style={{ ...S.outline, padding:'9px 14px', fontSize:13, textDecoration:'none' }}>📞 Call</a>
                {inq.offer && <button style={{ ...S.primary, padding:'9px 18px', fontSize:13 }}>✓ Accept Offer</button>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Followers */}
      {tab === 'followers' && (
        <div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:14, marginBottom:24 }}>
            <StatCard icon="👥" label="Total Followers" value={followers.length} sub="+3 this week" color={C.green}/>
            <StatCard icon="📢" label="Last Broadcast" value="3 days ago" sub="94% open rate" color={C.goldDark}/>
            <StatCard icon="💰" label="From Followers" value="UGX 10.5M" sub="Est. revenue" color={C.green}/>
          </div>

          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
            <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:16 }}>Your Followers</div>
            <button onClick={()=>setShowBroadcast(true)} style={{ ...S.primary, background:C.green, padding:'9px 20px', fontSize:13 }}>📢 Send Broadcast</button>
          </div>

          <div style={{ ...S.card, overflow:'hidden' }}>
            <div style={{ padding:'12px 20px', background:C.creamDark, borderBottom:`1px solid ${C.border}`, display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', fontSize:11, fontWeight:700, color:C.muted, textTransform:'uppercase', letterSpacing:'0.05em' }}>
              <span>Follower</span><span>Location</span><span>Following Since</span><span>Purchases</span>
            </div>
            {followers.map((f,i) => (
              <div key={f.id} style={{ padding:'14px 20px', borderBottom:i<followers.length-1?`1px solid ${C.border}`:'none', display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', alignItems:'center', gap:8 }}>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <Avatar initials={f.avatar} size={34} color={C.gold}/>
                  <span style={{ fontWeight:700, fontSize:14 }}>{f.name}</span>
                </div>
                <span style={{ fontSize:13, color:C.muted }}>📍 {f.location}</span>
                <span style={{ fontSize:13, color:C.muted }}>{f.since}</span>
                <span style={{ fontSize:13, fontWeight:f.purchases>0?700:400, color:f.purchases>0?C.green:C.muted }}>{f.purchases > 0 ? `${f.purchases} purchase${f.purchases>1?'s':''}` : 'Browsing'}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Wanted Ads */}
      {tab === 'wanted' && (
        <div>
          <div style={{ background:`linear-gradient(135deg, oklch(0.55 0.15 225), oklch(0.45 0.14 245))`, borderRadius:16, padding:'20px 24px', marginBottom:24, display:'flex', alignItems:'center', gap:16 }}>
            <div style={{ fontSize:40 }}>📢</div>
            <div>
              <div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:18, color:'white', marginBottom:4 }}>Buyers are looking for your products!</div>
              <div style={{ color:'rgba(255,255,255,0.75)', fontSize:13 }}>These buyers posted wanted ads in your categories. Respond with your best offer.</div>
            </div>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {wantedResponses.map(ad => (
              <div key={ad.id} style={{ ...S.card, padding:20, border:`1.5px solid ${ad.urgent?C.red:C.border}` }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
                  <div>
                    <div style={{ display:'flex', gap:8, marginBottom:6 }}>
                      {ad.urgent && <Badge variant="red">🚨 Urgent</Badge>}
                      <Badge variant="gray">{ad.category}</Badge>
                    </div>
                    <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:17 }}>{ad.title}</div>
                    <div style={{ fontSize:13, color:C.muted, marginTop:4 }}>📍 {ad.location} · Posted {ad.posted} · {ad.responses} offers so far</div>
                  </div>
                  <div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:22, color:C.green, flexShrink:0 }}>Up to {fmt(ad.budget)}</div>
                </div>
                <p style={{ fontSize:13, color:C.muted, lineHeight:1.6, marginBottom:14 }}>{ad.description}</p>
                <div style={{ display:'flex', gap:10 }}>
                  <button onClick={()=>nav('wanted')} style={{ ...S.primary, background:C.green, padding:'10px 20px', fontSize:13 }}>Make an Offer →</button>
                  <div style={{ display:'flex', alignItems:'center', gap:8, fontSize:13, color:C.muted }}>
                    <Avatar initials={ad.buyerAvatar} size={24} color={C.gold}/>
                    <span>by {ad.buyerName}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analytics */}
      {tab === 'analytics' && (
        <div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:24 }}>
            {[['Views This Week','1,284',C.green,[40,65,55,80,95,72,100]],['Inquiries This Week','38',C.goldDark,[20,35,25,60,45,50,80]]].map(([title,val,color,data]) => (
              <div key={title} style={{ ...S.card, padding:24 }}>
                <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:15, marginBottom:4 }}>{title}</div>
                <div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:34, color, marginBottom:14 }}>{val}</div>
                <div style={{ display:'flex', alignItems:'flex-end', gap:4, height:72 }}>
                  {data.map((h,i) => (
                    <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:3 }}>
                      <div style={{ width:'100%', background:`linear-gradient(to top, ${color}, ${C.goldLight})`, borderRadius:'3px 3px 0 0', height:`${h}%` }}/>
                      <span style={{ fontSize:9, color:C.muted }}>{'SMTWTFS'[i]}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{ ...S.card, padding:24 }}>
            <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:15, marginBottom:16 }}>Top Listings by Views</div>
            {listings.slice().sort((a,b)=>b.views-a.views).map((p,i) => (
              <div key={p.id} style={{ display:'flex', alignItems:'center', gap:14, marginBottom:14 }}>
                <span style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:16, color:C.muted, width:24 }}>#{i+1}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:600, fontSize:13, marginBottom:4 }}>{p.title}</div>
                  <div style={{ height:6, background:C.creamDark, borderRadius:3, overflow:'hidden' }}>
                    <div style={{ height:'100%', background:`linear-gradient(to right, ${C.gold}, ${C.green})`, width:`${Math.min(100,(p.views/500)*100)}%`, borderRadius:3 }}/>
                  </div>
                </div>
                <span style={{ fontSize:13, fontWeight:700, width:60, textAlign:'right' }}>{p.views} views</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Boost */}
      {tab === 'boost' && (
        <div>
          <div style={{ ...S.card, padding:28, marginBottom:20, background:`linear-gradient(135deg, ${C.goldDark}, ${C.gold})`, color:'white' }}>
            <div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:22, marginBottom:6 }}>🚀 Boost Your Listings</div>
            <div style={{ opacity:0.85, fontSize:14 }}>Get 5–10× more views. Activate via WhatsApp — no online payment needed.</div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:16 }}>
            {[
              { plan:'Basic', price:'UGX 18,000/wk', features:['Top of category results','Featured badge','2× more views'], popular:false },
              { plan:'Pro', price:'UGX 45,000/wk', features:['Homepage featured slot','5× more views','Priority support','Analytics report'], popular:true },
              { plan:'Premium', price:'UGX 90,000/wk', features:['Hero banner position','10× more views','Daily deal eligibility','Dedicated account manager'], popular:false },
            ].map(b => (
              <div key={b.plan} style={{ ...S.card, padding:24, border:`2px solid ${b.popular?C.gold:C.border}`, position:'relative' }}>
                {b.popular && <div style={{ position:'absolute', top:-12, left:'50%', transform:'translateX(-50%)', background:C.gold, color:'white', padding:'3px 16px', borderRadius:99, fontSize:11, fontWeight:800 }}>MOST POPULAR</div>}
                <div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:18, marginBottom:4 }}>{b.plan}</div>
                <div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:26, color:b.popular?C.goldDark:C.text, marginBottom:16 }}>{b.price}</div>
                {b.features.map(f => <div key={f} style={{ fontSize:13, color:C.muted, marginBottom:8 }}>✓ {f}</div>)}
                <a href={`https://wa.me/211912000000?text=I want to activate the ${b.plan} boost plan for my shop`} target="_blank"
                  style={{ ...S.primary, display:'block', textAlign:'center', marginTop:16, textDecoration:'none', background:b.popular?C.gold:C.green, padding:'11px' }}>
                  Activate via WhatsApp
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Settings */}
      {tab === 'settings' && (
        <div style={{ maxWidth:520 }}>
          <div style={{ ...S.card, padding:24 }}>
            <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:16, marginBottom:18 }}>Shop Information</div>
            {[['Shop Name',user?.business||'My Shop'],['Your Name',user?.name||''],['WhatsApp','+256 712 345 678'],['Email','seller@gmail.com'],['Location','Kampala, Central Region']].map(([lbl,val]) => (
              <div key={lbl} style={{ marginBottom:14 }}>
                <label style={S.label}>{lbl}</label>
                <input defaultValue={val} style={S.input}/>
              </div>
            ))}
            <div style={{ marginBottom:14 }}>
              <label style={S.label}>Shop Description</label>
              <textarea rows={3} style={{ ...S.input, resize:'vertical' }} defaultValue="Quality electronics at the best prices in Juba."/>
            </div>
            <button style={{ ...S.primary, padding:'11px 24px' }}>Save Changes</button>
          </div>
        </div>
      )}

      {/* Post Modal */}
      {showPost && (
        <Modal onClose={()=>setShowPost(false)} title="Post a New Listing" width={520}>
          {posted ? (
            <div style={{ textAlign:'center', padding:'32px 0' }}>
              <div style={{ fontSize:56, marginBottom:14 }}>🎉</div>
              <div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:22, marginBottom:8 }}>Listing Posted!</div>
              <div style={{ color:C.muted, fontSize:14 }}>Your item is now live and visible to thousands of buyers.</div>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div><label style={S.label}>Item Title *</label><input value={postForm.title} onChange={e=>sp('title',e.target.value)} placeholder="e.g. Samsung Galaxy A14 — 64GB" style={S.input}/></div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div><label style={S.label}>Category</label>
                  <select value={postForm.category} onChange={e=>sp('category',e.target.value)} style={{ ...S.input, cursor:'pointer' }}>
                    <option value="">Select…</option>
                    {['electronics','clothing','food','furniture','vehicles','crafts','services','livestock','building'].map(c=><option key={c} value={c}>{c.charAt(0).toUpperCase()+c.slice(1)}</option>)}
                  </select>
                </div>
                <div><label style={S.label}>Condition</label>
                  <select value={postForm.condition} onChange={e=>sp('condition',e.target.value)} style={{ ...S.input, cursor:'pointer' }}>
                    {['New','Used - Good','Used - Fair','Refurbished','Fresh','Live'].map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div><label style={S.label}>Price (UGX) *</label><input type="number" value={postForm.price} onChange={e=>sp('price',e.target.value)} placeholder="e.g. 150000" style={S.input}/></div>
                <div><label style={S.label}>Stock / Qty</label><input type="number" value={postForm.stock} onChange={e=>sp('stock',e.target.value)} placeholder="1" style={S.input}/></div>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <input type="checkbox" checked={postForm.negotiable} onChange={e=>sp('negotiable',e.target.checked)} style={{ width:16, height:16, accentColor:C.gold }}/>
                <label style={{ fontSize:14, cursor:'pointer' }}>Price is negotiable</label>
              </div>
              <div><label style={S.label}>Description *</label><textarea value={postForm.description} onChange={e=>sp('description',e.target.value)} rows={4} placeholder="Describe clearly — condition, what's included, delivery…" style={{ ...S.input, resize:'vertical' }}/></div>
              <div style={{ background:C.creamDark, borderRadius:10, border:`2px dashed ${C.border}`, padding:18, textAlign:'center', color:C.muted, fontSize:13 }}>
                📷 Photo upload · up to 6 images<br/><span style={{ fontSize:11 }}>Available in mobile app</span>
              </div>
              <button onClick={handlePost} disabled={!postForm.title||!postForm.price} style={{ ...S.primary, width:'100%', padding:'14px', fontSize:15, opacity:postForm.title&&postForm.price?1:0.5 }}>
                🚀 Publish Listing
              </button>
            </div>
          )}
        </Modal>
      )}

      {/* Broadcast Modal */}
      {showBroadcast && (
        <Modal onClose={()=>{ setShowBroadcast(false); setBroadcastSent(false); setBroadcastMsg(''); }} title="📢 Broadcast to Followers" width={460}>
          {broadcastSent ? (
            <div style={{ textAlign:'center', padding:'28px 0' }}>
              <div style={{ fontSize:52, marginBottom:12 }}>📢</div>
              <div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:22, marginBottom:8 }}>Broadcast Sent!</div>
              <div style={{ color:C.muted, fontSize:14 }}>Your message was sent to all <strong>{followers.length} followers</strong>. They'll see it in their notifications.</div>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div style={{ background:C.greenLight, borderRadius:10, padding:'12px 16px', fontSize:13, color:C.green }}>
                📢 This message will be sent to all <strong>{followers.length} followers</strong> of your shop.
              </div>
              <div>
                <label style={S.label}>Your Message</label>
                <textarea value={broadcastMsg} onChange={e=>setBroadcastMsg(e.target.value)} rows={5} placeholder="e.g. 🎉 Big restock this Friday! New phones just arrived from Nairobi. Come early for best prices. Available at Owino Market, stall 14." style={{ ...S.input, resize:'vertical' }}/>
                <div style={{ fontSize:12, color:C.muted, marginTop:4, textAlign:'right' }}>{broadcastMsg.length}/280</div>
              </div>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                {['🎉 Big restock this Friday!','⚡ Flash sale today only!','🆕 New arrivals just in!'].map(t => (
                  <button key={t} onClick={()=>setBroadcastMsg(t)} style={{ background:C.creamDark, border:`1px solid ${C.border}`, borderRadius:99, padding:'5px 12px', fontSize:12, cursor:'pointer', fontFamily:'var(--font-body)', color:C.muted }}>{t}</button>
                ))}
              </div>
              <button onClick={()=>setBroadcastSent(true)} disabled={!broadcastMsg.trim()} style={{ ...S.primary, width:'100%', padding:'13px', fontSize:15, background:C.green, opacity:broadcastMsg.trim()?1:0.5 }}>
                📢 Send to {followers.length} Followers
              </button>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}

Object.assign(window, { SellerDashboard });
