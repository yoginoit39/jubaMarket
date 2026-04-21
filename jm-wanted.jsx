// jm-wanted.jsx — Wanted Ads board with bidding flow

function WantedScreen({ nav, user }) {
  const { CATEGORIES } = window.KampalaData;
  const [ads, setAds] = React.useState([]);
  const [showPost, setShowPost] = React.useState(false);
  const [selectedAd, setSelectedAd] = React.useState(null);
  const [filter, setFilter] = React.useState('all');
  const [posted, setPosted] = React.useState(false);
  const [posting, setPosting] = React.useState(false);
  const [form, setForm] = React.useState({ title:'', category:'', budget:'', location:'Kampala', description:'', urgent:false });
  const sf = (k,v) => setForm(f=>({...f,[k]:v}));

  React.useEffect(() => {
    window.API.getWanted().then(data => setAds(data)).catch(() => {
      setAds(window.KampalaData.WANTED_ADS || []);
    });
  }, []);

  const filtered = filter === 'all' ? ads : ads.filter(a => a.category === filter);

  const handlePost = async () => {
    setPosting(true);
    try {
      const payload = { title:form.title, category:form.category||'electronics', budget:parseFloat(form.budget)||0, location:form.location, neighborhood:'all', description:form.description, urgent:form.urgent };
      const newAd = await window.API.createWanted(payload);
      setAds(a => [newAd, ...a]);
      setPosted(true);
      setTimeout(() => { setPosted(false); setShowPost(false); setForm({ title:'', category:'', budget:'', location:'Kampala', description:'', urgent:false }); }, 2200);
    } catch(e) {
      // fallback: show locally
      const newAd = { id:'w_'+Date.now(), ...form, budget:parseFloat(form.budget)||0, buyerName:user?.name||'You', buyerAvatar:(user?.name||'U').slice(0,2).toUpperCase(), posted:'Just now', responses:0, status:'open' };
      setAds(a => [newAd,...a]);
      setPosted(true);
      setTimeout(() => { setPosted(false); setShowPost(false); setForm({ title:'', category:'', budget:'', location:'Kampala', description:'', urgent:false }); }, 2200);
    } finally { setPosting(false); }
  };

  return (
    <div style={{ maxWidth:1000, margin:'0 auto', padding:'28px 24px' }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8, flexWrap:'wrap', gap:14 }}>
        <div>
          <h1 style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:26 }}>📢 Wanted Ads</h1>
          <div style={{ color:C.muted, fontSize:14, marginTop:3 }}>Can't find what you need? Post a wanted ad and let sellers come to you.</div>
        </div>
        <button onClick={() => setShowPost(true)} style={{ ...S.primary, padding:'12px 24px', fontSize:14 }}>+ Post Wanted Ad</button>
      </div>

      {/* How it works strip */}
      <div style={{ display:'flex', gap:0, background:C.creamDark, borderRadius:12, padding:'14px 20px', marginBottom:24, flexWrap:'wrap', gap:20 }}>
        {[['1. Post your need','Describe what you want and your max budget'],['2. Sellers respond','They send their best offers directly to you'],['3. Pick the best deal','Compare offers and choose via WhatsApp or chat']].map(([t,d],i) => (
          <div key={t} style={{ flex:1, minWidth:180, display:'flex', alignItems:'flex-start', gap:10 }}>
            <div style={{ width:28, height:28, borderRadius:'50%', background:C.gold, color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-display)', fontWeight:800, fontSize:13, flexShrink:0 }}>{i+1}</div>
            <div><div style={{ fontWeight:700, fontSize:13 }}>{t}</div><div style={{ fontSize:12, color:C.muted, marginTop:2 }}>{d}</div></div>
          </div>
        ))}
      </div>

      {/* Category filter */}
      <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:24 }}>
        {[{id:'all',label:'All Wanted Ads'},...CATEGORIES.filter(c=>c.id!=='all')].map(c => (
          <button key={c.id} onClick={()=>setFilter(c.id)} style={{ padding:'7px 16px', borderRadius:99, border:'1.5px solid', borderColor:filter===c.id?C.gold:C.border, background:filter===c.id?C.goldLight:'white', color:filter===c.id?C.goldDark:C.muted, fontWeight:filter===c.id?700:500, fontSize:13, cursor:'pointer', transition:'all 0.15s' }}>
            {c.icon && c.icon!=='▦' ? c.icon+' ':''}{c.label||c.id}
          </button>
        ))}
      </div>

      {/* Ad grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px,1fr))', gap:16, marginBottom:32 }}>
        {filtered.map((ad,i) => (
          <WantedAdCard key={ad.id} ad={ad} onView={() => setSelectedAd(ad)} isSeller={user?.role==='seller'}
            style={{ animation:`fadeUp 0.35s ease ${i*0.05}s both` }}/>
        ))}
      </div>

      {/* Post modal */}
      {showPost && (
        <Modal onClose={()=>setShowPost(false)} title="Post a Wanted Ad" width={500}>
          {posted ? (
            <div style={{ textAlign:'center', padding:'32px 0' }}>
              <div style={{ fontSize:56, marginBottom:14 }}>📢</div>
              <div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:22, marginBottom:8 }}>Wanted Ad Posted!</div>
              <div style={{ color:C.muted, fontSize:14 }}>Sellers will start responding shortly. Check your chat and WhatsApp.</div>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div><label style={S.label}>What do you need? *</label><input value={form.title} onChange={e=>sf('title',e.target.value)} placeholder="e.g. Looking for a 5KVA Generator" style={S.input}/></div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div><label style={S.label}>Category</label>
                  <select value={form.category} onChange={e=>sf('category',e.target.value)} style={{ ...S.input, cursor:'pointer' }}>
                    <option value="">Select…</option>
                    {CATEGORIES.filter(c=>c.id!=='all').map(c=><option key={c.id} value={c.id}>{c.label}</option>)}
                  </select>
                </div>
                <div><label style={S.label}>Max Budget (UGX)</label><input type="number" value={form.budget} onChange={e=>sf('budget',e.target.value)} placeholder="e.g. 2000000" style={S.input}/></div>
              </div>
              <div><label style={S.label}>Location</label>
                <select value={form.location} onChange={e=>sf('location',e.target.value)} style={{ ...S.input, cursor:'pointer' }}>
                  {['Kampala','Entebbe','Jinja','Gulu','Mbarara','Mbale'].map(l=><option key={l}>{l}</option>)}
                </select>
              </div>
              <div><label style={S.label}>Describe What You Need *</label><textarea value={form.description} onChange={e=>sf('description',e.target.value)} rows={4} placeholder="Be specific — brand, condition, quantity, how quickly you need it…" style={{ ...S.input, resize:'vertical' }}/></div>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <input type="checkbox" id="urgent" checked={form.urgent} onChange={e=>sf('urgent',e.target.checked)} style={{ width:16, height:16, accentColor:C.red }}/>
                <label htmlFor="urgent" style={{ fontSize:14, cursor:'pointer' }}>🚨 Mark as urgent (gets more visibility)</label>
              </div>
              <div style={{ background:C.greenLight, borderRadius:10, padding:'12px 14px', fontSize:13, color:C.green }}>
                ✓ Free to post · Sellers contact you directly · No commitment required
              </div>
              <button onClick={handlePost} disabled={!form.title||posting} style={{ ...S.primary, width:'100%', padding:'13px', fontSize:15, opacity:form.title&&!posting?1:0.5 }}>
                {posting ? 'Posting…' : '📢 Post Wanted Ad'}
              </button>
            </div>
          )}
        </Modal>
      )}

      {/* Ad detail / bidding modal */}
      {selectedAd && <WantedAdDetail ad={selectedAd} onClose={()=>setSelectedAd(null)} isSeller={user?.role==='seller'} user={user}/>}
    </div>
  );
}

function WantedAdCard({ ad, onView, isSeller, style: extraStyle }) {
  const catIcon = window.KampalaData.CATEGORIES.find(c=>c.id===ad.category)?.icon || '📦';
  return (
    <div onClick={onView} style={{ ...S.card, cursor:'pointer', padding:20, transition:'all 0.2s', border:`1.5px solid ${ad.urgent?C.red:C.border}`, ...extraStyle }}
      onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='0 8px 28px rgba(0,0,0,0.12)';}}
      onMouseLeave={e=>{e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='0 2px 12px rgba(0,0,0,0.08)';}}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          <Badge variant="gray">{catIcon} {ad.category}</Badge>
          {ad.urgent && <Badge variant="red">🚨 Urgent</Badge>}
        </div>
        <span style={{ fontSize:11, color:C.light, flexShrink:0 }}>{ad.posted}</span>
      </div>
      <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:16, marginBottom:6, lineHeight:1.3 }}>{ad.title}</div>
      <div style={{ fontSize:13, color:C.muted, marginBottom:14, lineHeight:1.6, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{ad.description}</div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div>
          <div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:20, color:C.green }}>Up to {fmt(ad.budget)}</div>
          <div style={{ fontSize:11, color:C.muted }}>📍 {ad.location}</div>
        </div>
        <div style={{ textAlign:'right' }}>
          <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:4 }}>
            <Avatar initials={ad.buyerAvatar} size={22} color={C.gold}/>
            <span style={{ fontSize:12, color:C.muted }}>{ad.buyerName}</span>
          </div>
          <div style={{ fontSize:12, color:ad.responses>0?C.green:C.muted, fontWeight:ad.responses>0?700:400 }}>
            {ad.responses > 0 ? `💬 ${ad.responses} offer${ad.responses!==1?'s':''}` : 'No offers yet'}
          </div>
        </div>
      </div>
      {isSeller && (
        <button onClick={e=>{e.stopPropagation();onView();}} style={{ ...S.primary, width:'100%', marginTop:14, padding:'10px', fontSize:13, background:C.green }}>
          Make an Offer →
        </button>
      )}
    </div>
  );
}

function WantedAdDetail({ ad, onClose, isSeller, user }) {
  const [bids, setBids] = React.useState([]);
  const [myBid, setMyBid] = React.useState({ price:'', note:'' });
  const [bidSent, setBidSent] = React.useState(false);
  const [bidding, setBidding] = React.useState(false);

  React.useEffect(() => {
    if (ad?.id) {
      window.API.getWantedDetail(ad.id).then(d => setBids(d.offers || [])).catch(() => {});
    }
  }, [ad?.id]);

  const submitOffer = async () => {
    setBidding(true);
    try {
      await window.API.submitOffer(ad.id, { price: parseFloat(myBid.price), note: myBid.note });
      setBidSent(true);
    } catch(e) { setBidSent(true); }
    finally { setBidding(false); }
  };

  return (
    <Modal onClose={onClose} title={null} width={560}>
      {/* Ad info */}
      <div style={{ background:C.creamDark, borderRadius:12, padding:'16px 18px', marginBottom:20 }}>
        <div style={{ display:'flex', gap:8, marginBottom:8 }}>
          {ad.urgent && <Badge variant="red">🚨 Urgent</Badge>}
          <Badge variant="gray">{ad.category}</Badge>
        </div>
        <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:18, marginBottom:6 }}>{ad.title}</div>
        <p style={{ fontSize:13, color:C.muted, lineHeight:1.6, marginBottom:10 }}>{ad.description}</p>
        <div style={{ display:'flex', gap:20, fontSize:13 }}>
          <span>💰 Budget: <strong style={{ color:C.green }}>{fmt(ad.budget)}</strong></span>
          <span>📍 {ad.location}</span>
          <span>🕐 {ad.posted}</span>
        </div>
      </div>

      {/* Seller bid form */}
      {isSeller && !bidSent && (
        <div style={{ border:`1.5px solid ${C.gold}`, borderRadius:12, padding:18, marginBottom:20 }}>
          <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:15, marginBottom:14, color:C.goldDark }}>🤝 Submit Your Offer</div>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            <div><label style={S.label}>Your Price (UGX)</label><input type="number" value={myBid.price} onChange={e=>setMyBid(b=>({...b,price:e.target.value}))} placeholder={`Max budget is ${fmt(ad.budget)}`} style={S.input}/></div>
            <div><label style={S.label}>Your Message</label><textarea value={myBid.note} onChange={e=>setMyBid(b=>({...b,note:e.target.value}))} rows={3} placeholder="Describe your product, condition, and when you can deliver…" style={{ ...S.input, resize:'vertical' }}/></div>
            <button onClick={submitOffer} disabled={!myBid.price||bidding} style={{ ...S.primary, background:C.green, padding:'11px', opacity:myBid.price&&!bidding?1:0.5 }}>
              {bidding ? 'Submitting…' : 'Submit Offer →'}
            </button>
          </div>
        </div>
      )}
      {isSeller && bidSent && (
        <div style={{ background:C.greenLight, borderRadius:12, padding:'16px 18px', marginBottom:20, textAlign:'center' }}>
          <div style={{ fontSize:32, marginBottom:6 }}>✅</div>
          <div style={{ fontWeight:700, color:C.green }}>Offer Submitted!</div>
          <div style={{ fontSize:13, color:C.muted, marginTop:4 }}>The buyer will contact you if they're interested.</div>
        </div>
      )}

      {/* Existing bids */}
      <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:15, marginBottom:14 }}>
        {bids.length} Offer{bids.length !== 1 ? 's' : ''} Received
      </div>
      {bids.length === 0 && (
        <div style={{ textAlign:'center', padding:'28px 0', color:C.muted, fontSize:13 }}>No offers yet. Be the first to respond!</div>
      )}
      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        {bids.map((bid,i) => (
          <div key={bid.id} style={{ ...S.card, padding:16, border:`1.5px solid ${i===0?C.green:C.border}` }}>
            {i===0 && <div style={{ marginBottom:8 }}><Badge variant="green">🏆 Best Offer</Badge></div>}
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <Avatar initials={(bid.sellerName||'?').slice(0,2).toUpperCase()} size={36} color={C.green}/>
                <div>
                  <div style={{ display:'flex', gap:6, alignItems:'center' }}>
                    <span style={{ fontWeight:700, fontSize:14 }}>{bid.sellerName}</span>
                  </div>
                </div>
              </div>
              <div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:20, color:C.green }}>{fmt(bid.price)}</div>
            </div>
            <p style={{ fontSize:13, color:C.muted, lineHeight:1.6, marginBottom:12 }}>{bid.note}</p>
            <div style={{ display:'flex', gap:8 }}>
              <span style={{ fontSize:11, color:C.light, display:'flex', alignItems:'center' }}>{bid.createdAt}</span>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}

Object.assign(window, { WantedScreen, WantedAdCard });
