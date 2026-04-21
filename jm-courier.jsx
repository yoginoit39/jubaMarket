// jm-courier.jsx — Courier Network

function CourierScreen({ nav, user }) {
  const { COURIER_RIDERS, DELIVERY_JOBS, PRODUCTS } = window.JubaData;
  const [tab, setTab] = React.useState(user?.role === 'courier' ? 'jobs' : 'request');
  const [selectedRider, setSelectedRider] = React.useState(null);
  const [requestForm, setRequestForm] = React.useState({ pickup:'', dropoff:'', item:'', size:'small', notes:'' });
  const [requested, setRequested] = React.useState(false);
  const rf = (k,v) => setRequestForm(f=>({...f,[k]:v}));

  const fees = { small:'$2–4', medium:'$4–7', large:'$7–15' };
  const tabs = user?.role === 'courier'
    ? [{ id:'jobs', label:'📋 Available Jobs' },{ id:'my-deliveries', label:'🚚 My Deliveries' },{ id:'earnings', label:'💰 Earnings' }]
    : [{ id:'request', label:'📦 Request Delivery' },{ id:'track', label:'🔍 Track Order' },{ id:'riders', label:'🏍 Our Riders' }];

  return (
    <div style={{ maxWidth:960, margin:'0 auto', padding:'28px 24px' }}>
      {/* Header */}
      <div style={{ background:`linear-gradient(135deg, ${C.green}, oklch(0.30 0.11 140))`, borderRadius:20, padding:'28px 32px', marginBottom:28, position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', right:-10, top:-10, fontSize:100, opacity:0.08 }}>🚚</div>
        <div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:26, color:'white', marginBottom:6 }}>Juba Market Courier</div>
        <div style={{ color:'rgba(255,255,255,0.75)', fontSize:14, marginBottom:16 }}>Fast, affordable delivery anywhere in Juba. Boda boda, tricycle and car riders ready now.</div>
        <div style={{ display:'flex', gap:20 }}>
          {[['🏍 '+COURIER_RIDERS.filter(r=>r.online).length,'Riders Online'],['⚡ ~30min','Avg. Delivery'],['📍 Juba','Coverage Area']].map(([v,l]) => (
            <div key={l} style={{ color:'white' }}>
              <div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:18 }}>{v}</div>
              <div style={{ fontSize:11, opacity:0.65 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:4, borderBottom:`1.5px solid ${C.border}`, marginBottom:28 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={()=>setTab(t.id)} style={{ padding:'10px 20px', border:'none', background:tab===t.id?C.goldLight:'transparent', fontFamily:'var(--font-body)', fontWeight:tab===t.id?700:500, fontSize:14, color:tab===t.id?C.goldDark:C.muted, borderBottom:tab===t.id?`2.5px solid ${C.gold}`:'2.5px solid transparent', cursor:'pointer', marginBottom:-1.5, borderRadius:'8px 8px 0 0' }}>
            {t.label}
          </button>
        ))}
        {!user && (
          <button onClick={()=>nav('register-courier')} style={{ ...S.primary, marginLeft:'auto', padding:'8px 18px', fontSize:13, background:C.green }}>
            + Register as Rider
          </button>
        )}
      </div>

      {/* Request Delivery */}
      {tab === 'request' && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24, alignItems:'start' }}>
          <div>
            {!requested ? (
              <div style={{ ...S.card, padding:26 }}>
                <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:18, marginBottom:20 }}>Request a Delivery</div>
                <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                  <div>
                    <label style={S.label}>Pickup Location (Seller)</label>
                    <input value={requestForm.pickup} onChange={e=>rf('pickup',e.target.value)} placeholder="e.g. Konyo Konyo Market, stall 34" style={S.input}/>
                  </div>
                  <div>
                    <label style={S.label}>Dropoff Location (You)</label>
                    <input value={requestForm.dropoff} onChange={e=>rf('dropoff',e.target.value)} placeholder="e.g. Gudele Block 3, near church" style={S.input}/>
                  </div>
                  <div>
                    <label style={S.label}>Item Description</label>
                    <input value={requestForm.item} onChange={e=>rf('item',e.target.value)} placeholder="e.g. Samsung phone in box" style={S.input}/>
                  </div>
                  <div>
                    <label style={S.label}>Item Size</label>
                    <div style={{ display:'flex', gap:8 }}>
                      {['small','medium','large'].map(sz => (
                        <button key={sz} onClick={()=>rf('size',sz)} style={{ flex:1, padding:'10px 8px', border:`1.5px solid ${requestForm.size===sz?C.gold:C.border}`, borderRadius:8, background:requestForm.size===sz?C.goldLight:'white', color:requestForm.size===sz?C.goldDark:C.muted, fontWeight:requestForm.size===sz?700:500, cursor:'pointer', fontSize:13, fontFamily:'var(--font-body)' }}>
                          {sz==='small'?'📱 Small':sz==='medium'?'📦 Medium':'🛋 Large'}
                          <div style={{ fontSize:11, marginTop:2, opacity:0.7 }}>{fees[sz]}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label style={S.label}>Notes for Rider (optional)</label>
                    <textarea value={requestForm.notes} onChange={e=>rf('notes',e.target.value)} rows={2} placeholder="Special instructions, landmark, phone number to call…" style={{ ...S.input, resize:'vertical' }}/>
                  </div>
                  <div style={{ background:C.creamDark, borderRadius:10, padding:'12px 16px' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', fontSize:14 }}>
                      <span style={{ color:C.muted }}>Estimated fee</span>
                      <span style={{ fontFamily:'var(--font-display)', fontWeight:800, color:C.goldDark }}>{fees[requestForm.size]}</span>
                    </div>
                    <div style={{ fontSize:12, color:C.muted, marginTop:4 }}>💵 Pay rider in cash on delivery</div>
                  </div>
                  <button onClick={()=>setRequested(true)} disabled={!requestForm.pickup||!requestForm.dropoff||!requestForm.item}
                    style={{ ...S.primary, width:'100%', padding:'13px', fontSize:15, background:C.green, opacity:requestForm.pickup&&requestForm.dropoff&&requestForm.item?1:0.5 }}>
                    🚚 Find Rider Now
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ ...S.card, padding:32, textAlign:'center' }}>
                <div style={{ fontSize:52, marginBottom:14 }}>🏍</div>
                <div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:22, marginBottom:8 }}>Rider Found!</div>
                <div style={{ ...S.card, padding:16, marginBottom:16, display:'flex', alignItems:'center', gap:12 }}>
                  <Avatar initials="ML" size={48} color={C.green} online={true}/>
                  <div style={{ textAlign:'left' }}>
                    <div style={{ fontWeight:700, fontSize:16 }}>Moses Lado</div>
                    <div style={{ fontSize:13, color:C.muted }}>Boda Boda · <Stars rating={4.9} size={11}/> 4.9</div>
                    <div style={{ fontSize:12, color:C.green, fontWeight:600 }}>ETA: ~20 minutes</div>
                  </div>
                  <a href="tel:+211923111222" style={{ ...S.primary, background:C.green, padding:'8px 14px', fontSize:13, marginLeft:'auto', textDecoration:'none' }}>📞 Call</a>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:6, marginBottom:16 }}>
                  {[['Rider notified','✅'],['Heading to pickup','⏳'],['In transit','○'],['Delivered','○']].map(([s,ic]) => (
                    <div key={s} style={{ display:'flex', alignItems:'center', gap:10, fontSize:13 }}>
                      <span style={{ fontSize:16 }}>{ic}</span>
                      <span style={{ color:ic==='✅'?C.green:ic==='⏳'?C.gold:C.muted }}>{s}</span>
                    </div>
                  ))}
                </div>
                <button onClick={()=>setRequested(false)} style={{ ...S.outline, padding:'9px 20px', fontSize:13 }}>Cancel Request</button>
              </div>
            )}
          </div>

          {/* Riders online */}
          <div>
            <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:16, marginBottom:14 }}>Available Riders Now</div>
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {COURIER_RIDERS.map(rider => (
                <div key={rider.id} style={{ ...S.card, padding:18, opacity:rider.online?1:0.55 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:10 }}>
                    <Avatar initials={rider.avatar} size={44} color={C.green} online={rider.online}/>
                    <div style={{ flex:1 }}>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                        <span style={{ fontWeight:700, fontSize:15 }}>{rider.name}</span>
                        <span style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:14, color:C.goldDark }}>{rider.fee}</span>
                      </div>
                      <div style={{ fontSize:12, color:C.muted }}>{rider.vehicle}</div>
                      <div style={{ display:'flex', gap:10, fontSize:12, marginTop:3 }}>
                        <span><Stars rating={rider.rating} size={10}/> {rider.rating}</span>
                        <span style={{ color:C.muted }}>{rider.trips} trips</span>
                        <span style={{ color:rider.online?'#22c55e':C.muted, fontWeight:rider.online?600:400 }}>{rider.online?'● Online':'○ Offline'}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ fontSize:12, color:C.muted, marginBottom:10 }}>📍 {rider.zone}</div>
                  {rider.online && (
                    <a href={`https://wa.me/${rider.phone.replace(/\D/g,'')}?text=Hi! I need a delivery via Juba Market.`} target="_blank"
                      style={{ ...S.primary, display:'block', background:C.green, textAlign:'center', padding:'9px', fontSize:13, textDecoration:'none' }}>
                      💬 Book via WhatsApp
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Track Order */}
      {tab === 'track' && (
        <div style={{ maxWidth:560 }}>
          <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:18, marginBottom:20 }}>Your Deliveries</div>
          {DELIVERY_JOBS.map(job => (
            <div key={job.id} style={{ ...S.card, padding:22, marginBottom:16 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:14 }}>
                <div>
                  <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:16, marginBottom:4 }}>{job.item}</div>
                  <div style={{ fontSize:13, color:C.muted }}>{job.from} → {job.to}</div>
                </div>
                <Badge variant={job.status==='delivered'?'green':job.status==='in_transit'?'gold':'gray'}>
                  {job.status==='delivered'?'✅ Delivered':job.status==='in_transit'?'🚚 In Transit':'⏳ Pending'}
                </Badge>
              </div>
              {job.status === 'in_transit' && (
                <div style={{ marginBottom:14 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:13, marginBottom:6 }}>
                    <span style={{ color:C.muted }}>Progress</span>
                    <span style={{ fontWeight:700, color:C.green }}>ETA {job.eta}</span>
                  </div>
                  <div style={{ height:6, background:C.creamDark, borderRadius:3, overflow:'hidden' }}>
                    <div style={{ height:'100%', width:'60%', background:`linear-gradient(to right, ${C.gold}, ${C.green})`, borderRadius:3, animation:'progress 2s ease infinite alternate' }}/>
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:C.light, marginTop:4 }}>
                    <span>Picked up</span><span>→ On the way</span><span>Delivered</span>
                  </div>
                </div>
              )}
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <Avatar initials={job.riderAvatar} size={32} color={C.green}/>
                <div style={{ fontSize:13 }}><strong>{job.rider}</strong> · Rider</div>
                <span style={{ marginLeft:'auto', fontSize:12, color:C.muted }}>💵 ${job.fee} cash</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Riders tab */}
      {tab === 'riders' && (
        <div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(260px,1fr))', gap:16, marginBottom:32 }}>
            {COURIER_RIDERS.map(rider => (
              <div key={rider.id} style={{ ...S.card, padding:22 }}>
                <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:14 }}>
                  <Avatar initials={rider.avatar} size={52} color={C.green} online={rider.online}/>
                  <div>
                    <div style={{ fontWeight:700, fontSize:16 }}>{rider.name}</div>
                    <div style={{ fontSize:12, color:C.muted }}>{rider.vehicle}</div>
                    <div style={{ fontSize:12, color:rider.online?'#22c55e':C.muted, fontWeight:600 }}>{rider.online?'● Online now':'○ Currently offline'}</div>
                  </div>
                </div>
                <div style={{ display:'flex', gap:16, marginBottom:12, fontSize:13 }}>
                  <div style={{ textAlign:'center' }}><div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:18, color:C.goldDark }}>{rider.rating}</div><div style={{ fontSize:11, color:C.muted }}>Rating</div></div>
                  <div style={{ textAlign:'center' }}><div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:18, color:C.green }}>{rider.trips}</div><div style={{ fontSize:11, color:C.muted }}>Trips</div></div>
                  <div style={{ flex:1 }}><div style={{ fontSize:12, color:C.muted, marginBottom:4 }}>Zone</div><div style={{ fontSize:13 }}>{rider.zone}</div></div>
                </div>
                <div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:16, color:C.goldDark, marginBottom:12 }}>{rider.fee}</div>
                <a href={`https://wa.me/${rider.phone.replace(/\D/g,'')}?text=Hi ${rider.name}, I need a delivery via Juba Market!`} target="_blank"
                  style={{ ...S.primary, display:'block', textAlign:'center', padding:'10px', fontSize:13, textDecoration:'none', background:rider.online?C.green:'#999', cursor:rider.online?'pointer':'not-allowed' }}>
                  {rider.online ? '💬 Book Now' : 'Currently Offline'}
                </a>
              </div>
            ))}
          </div>

          {/* Become a rider */}
          <div style={{ background:`linear-gradient(135deg, ${C.green}, oklch(0.30 0.11 140))`, borderRadius:20, padding:'28px 32px', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:20 }}>
            <div>
              <div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:20, color:'white', marginBottom:6 }}>🏍 Earn Money as a Courier Rider</div>
              <div style={{ color:'rgba(255,255,255,0.75)', fontSize:14 }}>Register your boda boda, tricycle or car. Accept delivery jobs on your own schedule.</div>
            </div>
            <button onClick={()=>nav('register-courier')} style={{ ...S.primary, background:'white', color:C.green, padding:'12px 28px', fontSize:14, fontWeight:800 }}>Register as Rider →</button>
          </div>
        </div>
      )}

      {/* Courier dashboard tabs */}
      {tab === 'jobs' && (
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:18, marginBottom:4 }}>Available Jobs Near You</div>
          {[
            { item:'Samsung Galaxy A14', from:'Konyo Konyo', to:'Gudele', fee:3, size:'Small', time:'Just now', urgent:true },
            { item:'Bag of Maize — 10kg', from:'Jebel Market', to:'Munuki', fee:5, size:'Medium', time:'5 min ago', urgent:false },
            { item:'Office Chair', from:'Gudele', to:'Juba Centre', fee:10, size:'Large', time:'12 min ago', urgent:false },
          ].map((job,i) => (
            <div key={i} style={{ ...S.card, padding:20, border:`1.5px solid ${job.urgent?C.red:C.border}` }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
                <div>
                  <div style={{ display:'flex', gap:8, marginBottom:6 }}>
                    {job.urgent && <Badge variant="red">🚨 Urgent</Badge>}
                    <Badge variant="gray">{job.size}</Badge>
                  </div>
                  <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:16 }}>{job.item}</div>
                  <div style={{ fontSize:13, color:C.muted, marginTop:2 }}>📍 {job.from} → {job.to}</div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:22, color:C.green }}>${job.fee}</div>
                  <div style={{ fontSize:11, color:C.light }}>{job.time}</div>
                </div>
              </div>
              <button style={{ ...S.primary, background:C.green, width:'100%', padding:'10px', fontSize:14 }}>✓ Accept Job</button>
            </div>
          ))}
        </div>
      )}

      {tab === 'my-deliveries' && (
        <div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(170px,1fr))', gap:14, marginBottom:24 }}>
            {[['Today','3 deliveries','📦',C.goldDark],['This Week','18 trips','🚚',C.green],['Earned Today','$24','💰',C.goldDark],['Rating','4.9 ★','⭐',C.green]].map(([l,v,ic,c]) => (
              <StatCard key={l} icon={ic} label={l} value={v} color={c}/>
            ))}
          </div>
          {DELIVERY_JOBS.map(job => (
            <div key={job.id} style={{ ...S.card, padding:20, marginBottom:12, display:'flex', alignItems:'center', gap:16 }}>
              <div style={{ fontSize:28 }}>{job.status==='delivered'?'✅':'🚚'}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:700 }}>{job.item}</div>
                <div style={{ fontSize:13, color:C.muted }}>{job.from} → {job.to}</div>
              </div>
              <div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:18, color:C.green }}>${job.fee}</div>
            </div>
          ))}
        </div>
      )}

      {tab === 'earnings' && (
        <div style={{ maxWidth:560 }}>
          <div style={{ ...S.card, padding:24, marginBottom:20 }}>
            <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:16, marginBottom:16 }}>Earnings This Week</div>
            <div style={{ display:'flex', align:'flex-end', gap:6, height:80, marginBottom:8 }}>
              {[30,45,25,60,55,70,80].map((h,i) => (
                <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                  <div style={{ width:'100%', background:`linear-gradient(to top, ${C.green}, ${C.goldLight})`, borderRadius:'4px 4px 0 0', height:`${h}%` }}/>
                  <span style={{ fontSize:10, color:C.muted }}>{'SMTWTFS'[i]}</span>
                </div>
              ))}
            </div>
            <div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:32, color:C.green }}>$127</div>
            <div style={{ fontSize:13, color:C.muted }}>Total this week · 18 trips completed</div>
          </div>
        </div>
      )}

      <style>{`@keyframes progress { from{width:55%} to{width:70%} }`}</style>
    </div>
  );
}

Object.assign(window, { CourierScreen });
