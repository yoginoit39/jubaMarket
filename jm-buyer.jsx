// jm-buyer.jsx v3 — Buyer Dashboard with chat, followed shops, wanted ads

function BuyerDashboard({ nav, user }) {
  const { PRODUCTS, SELLERS } = window.KampalaData;
  const [tab, setTab] = React.useState('feed');
  const [wishlistIds, setWishlistIds] = React.useState([]);
  const [notifs, setNotifs] = React.useState([]);
  const [threads, setThreads] = React.useState([]);
  const [activeThread, setActiveThread] = React.useState(null);
  const [newMsg, setNewMsg] = React.useState('');
  const [followed, setFollowed] = React.useState([]);
  const [followedSellers, setFollowedSellers] = React.useState([]);
  const [wishlistProducts, setWishlistProducts] = React.useState([]);
  const messagesEndRef = React.useRef(null);

  React.useEffect(() => {
    if (!window.API.isLoggedIn()) return;
    window.API.getWishlistIds().then(ids => {
      setWishlistIds(ids);
      if (ids.length > 0) {
        window.API.getWishlist().then(products => setWishlistProducts(products));
      }
    }).catch(() => {});
    window.API.getNotifications().then(data => setNotifs(data)).catch(() => {});
    window.API.getInquiries().then(data => {
      const mapped = data.map(inq => ({
        id: inq.id,
        sellerName: inq.sellerName,
        sellerAvatar: (inq.sellerName||'?').slice(0,2).toUpperCase(),
        productTitle: inq.productTitle,
        productId: inq.productId,
        lastMsg: inq.lastMsg || 'No messages yet',
        time: inq.time || 'Recently',
        unread: inq.unread || 0,
        messages: (inq.messages || []).map(m => ({
          from: m.senderRole === 'buyer' ? 'buyer' : 'seller',
          text: m.text,
          time: m.createdAt || '',
        })),
      }));
      setThreads(mapped);
    }).catch(() => {});
    window.API.getFollowed().then(sellers => {
      setFollowed(sellers.map(s => s.id));
      setFollowedSellers(sellers);
    }).catch(() => {});
  }, []);

  const unreadNotifs = notifs.filter(n => !n.read).length;
  const unreadChats = threads.filter(t => t.unread > 0).length;

  const tabs = [
    { id:'feed', label:'🏠 Feed' },
    { id:'chat', label:`💬 Chat${unreadChats>0?` (${unreadChats})`:''}` },
    { id:'wishlist', label:`♥ Wishlist (${wishlistProducts.length})` },
    { id:'following', label:`👥 Following (${followedSellers.length})` },
    { id:'notifications', label:`🔔${unreadNotifs>0?` (${unreadNotifs})`:''}` },
    { id:'settings', label:'⚙' },
  ];

  const toggleWishlist = async (id) => {
    const has = wishlistIds.includes(id);
    try {
      if (has) {
        await window.API.removeWishlist(id);
        setWishlistIds(w => w.filter(x => x !== id));
        setWishlistProducts(ps => ps.filter(p => p.id !== id));
      } else {
        await window.API.addWishlist(id);
        setWishlistIds(w => [...w, id]);
        const all = await window.API.getWishlist();
        setWishlistProducts(all);
      }
    } catch(e) {}
  };

  const unfollowSeller = async (id) => {
    try {
      await window.API.unfollow(id);
      setFollowed(f => f.filter(x => x !== id));
      setFollowedSellers(fs => fs.filter(s => s.id !== id));
    } catch(e) {}
  };

  const sendMessage = async () => {
    if (!newMsg.trim() || !activeThread) return;
    const text = newMsg;
    setNewMsg('');
    try {
      await window.API.sendMessage(activeThread, text);
      setThreads(ts => ts.map(t => t.id === activeThread ? {
        ...t,
        messages: [...t.messages, { from:'buyer', text, time:'Now' }],
        lastMsg: text,
      } : t));
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior:'smooth' }), 50);
    } catch(e) {
      setNewMsg(text);
    }
  };

  const markAllRead = async () => {
    try {
      await window.API.markNotifRead();
      setNotifs(n => n.map(x => ({ ...x, read:true })));
    } catch(e) {
      setNotifs(n => n.map(x => ({ ...x, read:true })));
    }
  };

  const thread = threads.find(t => t.id === activeThread);

  return (
    <div style={{ maxWidth:1060, margin:'0 auto', padding:'28px 24px' }}>
      <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:24 }}>
        <Avatar initials={user?.avatar||'U'} size={52} color={C.gold}/>
        <div>
          <div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:22 }}>{user?.name||'My Account'}</div>
          <div style={{ fontSize:13, color:C.muted }}>Buyer · {user?.location||'Kampala, Central Region'}</div>
        </div>
      </div>

      <div style={{ display:'flex', gap:4, borderBottom:`1.5px solid ${C.border}`, marginBottom:28, overflowX:'auto' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={()=>{ setTab(t.id); setActiveThread(null); }} style={{ padding:'10px 16px', border:'none', background:tab===t.id?C.goldLight:'transparent', fontFamily:'var(--font-body)', fontWeight:tab===t.id?700:500, fontSize:13.5, color:tab===t.id?C.goldDark:C.muted, borderBottom:tab===t.id?`2.5px solid ${C.gold}`:'2.5px solid transparent', cursor:'pointer', marginBottom:-1.5, whiteSpace:'nowrap', borderRadius:'8px 8px 0 0' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Feed */}
      {tab === 'feed' && (
        <div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(170px,1fr))', gap:14, marginBottom:28 }}>
            <StatCard icon="♥" label="Saved Items" value={wishlistProducts.length} color={C.red}/>
            <StatCard icon="💬" label="Active Chats" value={threads.length} color={C.green}/>
            <StatCard icon="🔔" label="New Alerts" value={unreadNotifs} color={C.gold}/>
            <StatCard icon="👥" label="Following" value={followedSellers.length} color={C.goldDark}/>
          </div>
          <SectionHeader title="Recommended for You" action="Browse all →" onAction={() => nav('browse')}/>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px,1fr))', gap:16, marginBottom:32 }}>
            {PRODUCTS.slice(0,6).map(p => (
              <ProductCard key={p.id} product={p} onView={id=>nav('product',id)}
                onWishlist={toggleWishlist}
                wishlisted={wishlistIds.includes(p.id)}/>
            ))}
          </div>

          {followedSellers.length > 0 && (
            <div>
              <SectionHeader title="Updates from Shops You Follow"/>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {followedSellers.map(seller => (
                  <div key={seller.id} style={{ ...S.card, padding:'14px 18px', display:'flex', gap:14, alignItems:'center', cursor:'pointer' }} onClick={()=>nav('seller-store',seller.id)}>
                    <Avatar initials={seller.avatar} size={42} color={C.green} online={seller.online}/>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:700, fontSize:14 }}>{seller.name}</div>
                      <div style={{ fontSize:13, color:C.muted }}>{seller.online?'Active now':'Last seen today'}</div>
                    </div>
                    <button style={{ ...S.outline, padding:'7px 14px', fontSize:12 }}>View Shop →</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Chat */}
      {tab === 'chat' && (
        <div style={{ display:'grid', gridTemplateColumns:activeThread?'280px 1fr':'1fr', gap:0, height:520, borderRadius:16, overflow:'hidden', border:`1.5px solid ${C.border}`, background:C.white }}>
          <div style={{ borderRight:`1px solid ${C.border}`, overflowY:'auto' }}>
            <div style={{ padding:'14px 16px', borderBottom:`1px solid ${C.border}`, fontFamily:'var(--font-display)', fontWeight:700, fontSize:15 }}>Messages</div>
            {threads.map(t => (
              <div key={t.id} onClick={()=>{ setActiveThread(t.id); setThreads(ts=>ts.map(x=>x.id===t.id?{...x,unread:0}:x)); }}
                style={{ padding:'14px 16px', borderBottom:`1px solid ${C.border}`, cursor:'pointer', background:activeThread===t.id?C.goldLight:'transparent', transition:'background 0.15s' }}>
                <div style={{ display:'flex', gap:10, alignItems:'flex-start' }}>
                  <div style={{ position:'relative' }}>
                    <Avatar initials={t.sellerAvatar} size={38} color={C.green}/>
                    {t.unread > 0 && <div style={{ position:'absolute', top:-4, right:-4, width:18, height:18, borderRadius:'50%', background:C.gold, color:'white', fontSize:10, fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center' }}>{t.unread}</div>}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:2 }}>
                      <span style={{ fontWeight:t.unread>0?700:600, fontSize:13 }}>{t.sellerName}</span>
                      <span style={{ fontSize:11, color:C.light }}>{t.time}</span>
                    </div>
                    <div style={{ fontSize:11, color:C.muted, marginBottom:2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>re: {t.productTitle}</div>
                    <div style={{ fontSize:12, color:C.muted, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', fontWeight:t.unread>0?600:400 }}>{t.lastMsg}</div>
                  </div>
                </div>
              </div>
            ))}
            {threads.length === 0 && (
              <div style={{ padding:32, textAlign:'center', color:C.muted }}>
                <div style={{ fontSize:32, marginBottom:8 }}>💬</div>
                <div style={{ fontSize:13 }}>No conversations yet.<br/>Contact a seller to start chatting.</div>
              </div>
            )}
          </div>

          {activeThread && thread ? (
            <div style={{ display:'flex', flexDirection:'column', height:'100%' }}>
              <div style={{ padding:'14px 18px', borderBottom:`1px solid ${C.border}`, display:'flex', alignItems:'center', gap:12 }}>
                <Avatar initials={thread.sellerAvatar} size={36} color={C.green}/>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, fontSize:14 }}>{thread.sellerName}</div>
                  <div style={{ fontSize:11, color:C.muted }}>re: {thread.productTitle}</div>
                </div>
                <button onClick={()=>nav('product',thread.productId)} style={{ ...S.outline, padding:'7px 14px', fontSize:12 }}>View Item</button>
              </div>

              <div style={{ flex:1, overflowY:'auto', padding:'16px 18px', display:'flex', flexDirection:'column', gap:10 }}>
                {thread.messages.map((msg,i) => (
                  <div key={i} style={{ display:'flex', justifyContent:msg.from==='buyer'?'flex-end':'flex-start' }}>
                    <div style={{ maxWidth:'72%', background:msg.from==='buyer'?C.gold:C.creamDark, color:msg.from==='buyer'?'white':C.text, borderRadius:msg.from==='buyer'?'14px 14px 4px 14px':'14px 14px 14px 4px', padding:'10px 14px', fontSize:14, lineHeight:1.5 }}>
                      <div>{msg.text}</div>
                      <div style={{ fontSize:10, opacity:0.65, marginTop:4, textAlign:msg.from==='buyer'?'right':'left' }}>{msg.time}</div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef}/>
              </div>

              <div style={{ padding:'8px 18px', display:'flex', gap:6, overflowX:'auto', borderTop:`1px solid ${C.border}` }}>
                {['Is this still available?',"What's your best price?",'Can you deliver?','I can pick up today'].map(qr => (
                  <button key={qr} onClick={()=>setNewMsg(qr)} style={{ background:C.creamDark, border:`1px solid ${C.border}`, borderRadius:99, padding:'5px 12px', fontSize:12, cursor:'pointer', whiteSpace:'nowrap', fontFamily:'var(--font-body)', color:C.muted }}>
                    {qr}
                  </button>
                ))}
              </div>

              <div style={{ padding:'12px 16px', borderTop:`1px solid ${C.border}`, display:'flex', gap:10 }}>
                <input value={newMsg} onChange={e=>setNewMsg(e.target.value)} onKeyDown={e=>e.key==='Enter'&&sendMessage()} placeholder="Type a message…" style={{ ...S.input, flex:1, borderRadius:99, padding:'10px 18px' }}/>
                <button onClick={sendMessage} style={{ ...S.primary, borderRadius:'50%', width:44, height:44, padding:0, fontSize:20, flexShrink:0 }}>↑</button>
              </div>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', color:C.muted, gap:10 }}>
              <div style={{ fontSize:48 }}>💬</div>
              <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:18 }}>Select a conversation</div>
              <div style={{ fontSize:14 }}>Or browse products and contact a seller</div>
              <button onClick={()=>nav('browse')} style={{ ...S.primary, marginTop:8, padding:'10px 24px' }}>Browse Products</button>
            </div>
          )}
        </div>
      )}

      {/* Wishlist */}
      {tab === 'wishlist' && (
        <div>
          {wishlistProducts.length === 0 ? (
            <div style={{ textAlign:'center', padding:'60px 24px', color:C.muted }}>
              <div style={{ fontSize:48, marginBottom:12 }}>♡</div>
              <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:18, marginBottom:8 }}>Your wishlist is empty</div>
              <div style={{ fontSize:14, marginBottom:20 }}>Save items to get notified when prices drop!</div>
              <button onClick={()=>nav('browse')} style={{ ...S.primary, padding:'11px 24px' }}>Browse Products</button>
            </div>
          ) : (
            <>
              <div style={{ fontSize:13, color:C.muted, marginBottom:20 }}>You'll be notified when prices drop on saved items.</div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px,1fr))', gap:16 }}>
                {wishlistProducts.map(p => (
                  <div key={p.id} style={{ position:'relative' }}>
                    <ProductCard product={p} onView={id=>nav('product',id)} wishlisted={true}
                      onWishlist={toggleWishlist}/>
                    {p.dealPrice && <div style={{ position:'absolute', top:-8, right:-8, background:C.red, color:'white', borderRadius:99, padding:'3px 10px', fontSize:11, fontWeight:800 }}>PRICE DROP ↓</div>}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Following */}
      {tab === 'following' && (
        <div>
          {followedSellers.length === 0 ? (
            <div style={{ textAlign:'center', padding:'60px 24px', color:C.muted }}>
              <div style={{ fontSize:48, marginBottom:12 }}>👥</div>
              <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:18, marginBottom:8 }}>Not following any shops yet</div>
              <div style={{ fontSize:14, marginBottom:20 }}>Follow sellers to get their latest listings and announcements.</div>
              <button onClick={()=>nav('browse')} style={{ ...S.primary, padding:'11px 24px' }}>Discover Sellers</button>
            </div>
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px,1fr))', gap:16 }}>
              {followedSellers.map(seller => (
                <div key={seller.id} style={{ ...S.card, overflow:'hidden' }}>
                  <div style={{ height:64, background:seller.coverColor||C.goldDark }}/>
                  <div style={{ padding:'0 18px 18px' }}>
                    <div style={{ marginTop:-22, marginBottom:10 }}>
                      <Avatar initials={seller.avatar} size={44} color={C.green} online={seller.online}/>
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                      <span style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:15 }}>{seller.name}</span>
                      {seller.verified && <Badge variant="green">✓</Badge>}
                    </div>
                    <div style={{ fontSize:12, color:C.muted, marginBottom:10 }}>📍 {seller.location} · 👥 {seller.followersCount||0} followers</div>
                    <div style={{ display:'flex', gap:8 }}>
                      <button onClick={()=>nav('seller-store',seller.id)} style={{ ...S.primary, flex:2, padding:'9px', fontSize:13 }}>View Shop</button>
                      <button onClick={()=>unfollowSeller(seller.id)} style={{ ...S.outline, flex:1, padding:'9px', fontSize:13, borderColor:C.red, color:C.red }}>Unfollow</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Notifications */}
      {tab === 'notifications' && (
        <div>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
            <div style={{ fontSize:13, color:C.muted }}>{unreadNotifs} unread</div>
            {unreadNotifs > 0 && <button onClick={markAllRead} style={{ ...S.outline, padding:'6px 14px', fontSize:13 }}>Mark all read</button>}
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {notifs.map(n => {
              const icons = { price_drop:'💸', new_listing:'📦', inquiry_reply:'💬', deal:'🔥', wanted_bid:'📢', follow:'👥', delivery:'🚚' };
              return (
                <div key={n.id} onClick={()=>{ setNotifs(ns=>ns.map(x=>x.id===n.id?{...x,read:true}:x)); if(n.productId) nav('product',n.productId); }}
                  style={{ ...S.card, padding:'14px 18px', display:'flex', gap:14, alignItems:'center', cursor:'pointer', background:!n.read?'oklch(0.96 0.04 80)':C.white, border:`1.5px solid ${!n.read?C.gold:C.border}` }}>
                  <div style={{ width:40, height:40, borderRadius:'50%', background:!n.read?C.goldLight:C.creamDark, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>{icons[n.type]||'🔔'}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:14, fontWeight:!n.read?700:500 }}>{n.message}</div>
                    <div style={{ fontSize:12, color:C.light, marginTop:3 }}>{n.createdAt || n.time}</div>
                  </div>
                  {!n.read && <div style={{ width:8, height:8, borderRadius:'50%', background:C.gold, flexShrink:0 }}/>}
                </div>
              );
            })}
            {notifs.length === 0 && (
              <div style={{ textAlign:'center', padding:'48px 24px', color:C.muted }}>
                <div style={{ fontSize:40, marginBottom:10 }}>🔔</div>
                <div style={{ fontSize:14 }}>No notifications yet.</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Settings */}
      {tab === 'settings' && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, maxWidth:700 }}>
          <div style={{ ...S.card, padding:24, gridColumn:'1/-1' }}>
            <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:16, marginBottom:18 }}>Personal Information</div>
            {[['Full Name',user?.name||''],['Phone Number',user?.phone||''],['Email',user?.email||''],['Location',user?.location||'Kampala, Central Region']].map(([lbl,val]) => (
              <div key={lbl} style={{ marginBottom:14 }}>
                <label style={S.label}>{lbl}</label>
                <input defaultValue={val} style={S.input}/>
              </div>
            ))}
            <button style={{ ...S.primary, padding:'10px 24px' }}>Save Changes</button>
          </div>
          <div style={{ ...S.card, padding:24 }}>
            <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:16, marginBottom:16 }}>Notifications</div>
            {['Price drops on saved items','New listings from followed shops','Chat messages','Delivery updates','Weekly deals digest'].map(opt => (
              <div key={opt} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
                <span style={{ fontSize:14 }}>{opt}</span>
                <div style={{ width:40, height:22, borderRadius:99, background:C.gold, position:'relative', cursor:'pointer' }}>
                  <div style={{ width:18, height:18, borderRadius:'50%', background:'white', position:'absolute', right:2, top:2 }}/>
                </div>
              </div>
            ))}
          </div>
          <div style={{ ...S.card, padding:24 }}>
            <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:16, marginBottom:12 }}>Payment Methods</div>
            <div style={{ fontSize:13, color:C.muted, lineHeight:1.7, marginBottom:12 }}>Kampala Market supports cash-based payments only. Online payment coming soon.</div>
            {['💵 Cash on Delivery','📱 Mobile Money (MTN/Airtel)','🏦 Bank Transfer'].map(m => (
              <div key={m} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10, fontSize:14 }}>
                <span style={{ color:C.green }}>✓</span> {m}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { BuyerDashboard });
