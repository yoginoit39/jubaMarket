// jm-admin.jsx — Admin Dashboard

function AdminDashboard({ nav }) {
  const { PRODUCTS } = window.KampalaData;
  const [tab, setTab] = React.useState('overview');
  const [stats, setStats] = React.useState(null);
  const [listings, setListings] = React.useState(PRODUCTS);
  const [users, setUsers] = React.useState([]);
  const [pendingListings, setPendingListings] = React.useState([]);
  const [reports, setReports] = React.useState([]);
  const [featured, setFeatured] = React.useState(PRODUCTS.filter(p=>p.featured).map(p=>p.id));

  React.useEffect(() => {
    window.API.adminStats().then(d => setStats(d)).catch(() => {});
    window.API.adminUsers().then(d => setUsers(d)).catch(() => {});
    window.API.adminPending().then(d => setPendingListings(d)).catch(() => {});
    window.API.adminReports().then(d => setReports(d)).catch(() => {});
    window.API.adminFeatured().then(d => {
      setListings(d.all || PRODUCTS);
      setFeatured((d.featured || []).map(p => p.id));
    }).catch(() => {});
  }, []);

  const approveListing = async (id) => {
    try {
      await window.API.adminListingStatus(id, 'active');
      setPendingListings(ps => ps.filter(p => p.id !== id));
    } catch(e) {}
  };

  const rejectListing = async (id) => {
    try {
      await window.API.adminListingStatus(id, 'rejected');
      setPendingListings(ps => ps.filter(p => p.id !== id));
    } catch(e) {}
  };

  const setUserStatus = async (id, status) => {
    try {
      await window.API.adminSetUserStatus(id, status);
      setUsers(us => us.map(u => u.id === id ? { ...u, status } : u));
    } catch(e) {}
  };

  const resolveReport = async (id) => {
    try {
      await window.API.adminReportStatus(id, 'resolved');
      setReports(rs => rs.map(r => r.id === id ? { ...r, status:'resolved' } : r));
    } catch(e) {}
  };

  const toggleFeatured = async (id) => {
    try {
      if (featured.includes(id)) {
        await window.API.adminRemoveFeatured(id);
        setFeatured(f => f.filter(x => x !== id));
      } else if (featured.length < 6) {
        await window.API.adminAddFeatured(id);
        setFeatured(f => [...f, id]);
      }
    } catch(e) {}
  };

  const tabs = [
    { id:'overview', label:'📊 Overview' },
    { id:'listings', label:`📦 Listings (${pendingListings.length} pending)` },
    { id:'users', label:`👥 Users (${users.length})` },
    { id:'reports', label:`🚨 Reports (${reports.filter(r=>r.status==='open').length})` },
    { id:'featured', label:'⭐ Featured Slots' },
    { id:'settings', label:'⚙ Platform' },
  ];

  return (
    <div style={{ display:'flex', minHeight:'calc(100vh - 64px)' }}>
      {/* Sidebar */}
      <div style={{ width:220, background:'oklch(0.18 0.03 45)', padding:'24px 0', flexShrink:0 }}>
        <div style={{ padding:'0 20px 20px', borderBottom:'1px solid rgba(255,255,255,0.08)', marginBottom:16 }}>
          <div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:13, color:'rgba(255,255,255,0.5)', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:10 }}>Admin Panel</div>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <Avatar initials="AD" size={36} color={C.gold}/>
            <div>
              <div style={{ fontWeight:700, fontSize:13, color:'white' }}>Admin</div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)' }}>Super Administrator</div>
            </div>
          </div>
        </div>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ display:'flex', alignItems:'center', width:'100%', padding:'12px 20px', border:'none', background:tab===t.id?'rgba(255,255,255,0.08)':'transparent', color:tab===t.id?'white':'rgba(255,255,255,0.55)', fontFamily:'var(--font-body)', fontWeight:tab===t.id?700:400, fontSize:13.5, cursor:'pointer', textAlign:'left', borderLeft:tab===t.id?`3px solid ${C.gold}`:'3px solid transparent', transition:'all 0.15s' }}>
            {t.label}
          </button>
        ))}
        <div style={{ margin:'24px 20px 0', padding:'14px', background:'rgba(255,255,255,0.05)', borderRadius:10 }}>
          <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', marginBottom:6 }}>PLATFORM STATUS</div>
          <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:13, color:'#22c55e', fontWeight:600 }}>
            <div style={{ width:7,height:7,borderRadius:'50%',background:'#22c55e' }}/> All systems online
          </div>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex:1, padding:'28px 32px', overflowY:'auto', background:C.cream }}>

        {/* Overview */}
        {tab === 'overview' && (
          <div>
            <div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:22, marginBottom:24 }}>Platform Overview</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(160px,1fr))', gap:14, marginBottom:28 }}>
              {[['Total Users',stats?.totalUsers??'…','','👥',C.green],['Active Sellers',stats?.activeSellers??'…','','🏪',C.goldDark],['Total Listings',stats?.totalListings??'…','','📦',C.goldDark],['Pending Review',stats?.pendingReview??'…','Action needed','⏳',C.red],['Open Reports',stats?.openReports??'…','High priority','🚨',C.red],['Monthly Inquiries',stats?.monthlyInquiries??'…','','💬',C.green]].map(([l,v,sub,ic,col]) => (
                <div key={l} style={{ ...S.card, padding:'18px 18px' }}>
                  <div style={{ fontSize:22, marginBottom:6 }}>{ic}</div>
                  <div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:22, color:col }}>{v}</div>
                  <div style={{ fontSize:12, fontWeight:600, color:C.text, marginTop:2 }}>{l}</div>
                  <div style={{ fontSize:11, color:C.muted, marginTop:3 }}>{sub}</div>
                </div>
              ))}
            </div>

            {/* Activity chart */}
            <div style={{ ...S.card, padding:24, marginBottom:20 }}>
              <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:16, marginBottom:20 }}>Weekly Activity — New Listings & Inquiries</div>
              <div style={{ display:'flex', alignItems:'flex-end', gap:6, height:100 }}>
                {[
                  {l:45,i:70},{l:60,i:85},{l:50,i:65},{l:80,i:110},{l:70,i:90},{l:95,i:130},{l:110,i:150}
                ].map((d,i) => (
                  <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:2 }}>
                    <div style={{ width:'100%', display:'flex', gap:2, alignItems:'flex-end', height:90 }}>
                      <div style={{ flex:1, background:C.gold, borderRadius:'3px 3px 0 0', height:`${(d.l/150)*90}px`, transition:'height 0.5s ease' }}/>
                      <div style={{ flex:1, background:C.green, borderRadius:'3px 3px 0 0', height:`${(d.i/150)*90}px`, transition:'height 0.5s ease' }}/>
                    </div>
                    <span style={{ fontSize:10, color:C.muted }}>{'SMTWTFS'[i]}</span>
                  </div>
                ))}
              </div>
              <div style={{ display:'flex', gap:20, marginTop:12 }}>
                <div style={{ display:'flex', alignItems:'center', gap:6 }}><div style={{ width:12,height:12,borderRadius:2,background:C.gold }}/><span style={{ fontSize:12, color:C.muted }}>New Listings</span></div>
                <div style={{ display:'flex', alignItems:'center', gap:6 }}><div style={{ width:12,height:12,borderRadius:2,background:C.green }}/><span style={{ fontSize:12, color:C.muted }}>Inquiries</span></div>
              </div>
            </div>

            {/* Pending & Reports quick view */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
              <div style={{ ...S.card, padding:20 }}>
                <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:15, marginBottom:14 }}>⏳ Pending Listings</div>
                {pendingListings.map(p => (
                  <div key={p.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10, paddingBottom:10, borderBottom:`1px solid ${C.border}` }}>
                    <div>
                      <div style={{ fontWeight:600, fontSize:13 }}>{p.title}</div>
                      <div style={{ fontSize:11, color:C.muted }}>by {p.sellerName||p.seller} · {p.createdAt||p.submitted}</div>
                    </div>
                    <div style={{ display:'flex', gap:6 }}>
                      <button onClick={()=>approveListing(p.id)} style={{ ...S.primary, background:C.green, padding:'5px 10px', fontSize:11 }}>✓</button>
                      <button onClick={()=>rejectListing(p.id)} style={{ ...S.danger, padding:'5px 10px', fontSize:11 }}>✕</button>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ ...S.card, padding:20 }}>
                <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:15, marginBottom:14 }}>🚨 Open Reports</div>
                {reports.filter(r=>r.status==='open').map(r => (
                  <div key={r.id} style={{ marginBottom:12, paddingBottom:12, borderBottom:`1px solid ${C.border}` }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                      <div>
                        <Badge variant={r.severity==='high'?'red':'gray'}>{r.severity?.toUpperCase()}</Badge>
                        <div style={{ fontWeight:600, fontSize:13, marginTop:4 }}>{r.listingTitle||r.listing}</div>
                        <div style={{ fontSize:11, color:C.muted }}>Reported by {r.reporterName||r.reporter} · {r.createdAt||r.time}</div>
                      </div>
                      <button onClick={()=>resolveReport(r.id)} style={{ ...S.primary, padding:'5px 12px', fontSize:11 }}>Resolve</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Listings moderation */}
        {tab === 'listings' && (
          <div>
            <div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:22, marginBottom:20 }}>Listing Moderation</div>
            <div style={{ ...S.card, padding:0, overflow:'hidden', marginBottom:24 }}>
              <div style={{ padding:'16px 20px', background:'oklch(0.96 0.03 80)', borderBottom:`1px solid ${C.border}`, display:'flex', gap:12, alignItems:'center' }}>
                <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:15 }}>Pending Review ({pendingListings.length})</div>
                <Badge variant="red">Action required</Badge>
              </div>
              {pendingListings.map(p => (
                <div key={p.id} style={{ padding:'16px 20px', borderBottom:`1px solid ${C.border}`, display:'flex', alignItems:'center', gap:16 }}>
                  <div style={{ width:52, height:52, borderRadius:8, overflow:'hidden' }}><ProductImage category={p.category} height={52}/></div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:700, fontSize:14 }}>{p.title}</div>
                    <div style={{ fontSize:12, color:C.muted }}>By {p.sellerName||p.seller} · ${p.price}</div>
                  </div>
                  <div style={{ display:'flex', gap:8 }}>
                    <button onClick={()=>approveListing(p.id)} style={{ ...S.primary, background:C.green, padding:'8px 18px', fontSize:13 }}>✓ Approve</button>
                    <button onClick={()=>rejectListing(p.id)} style={{ ...S.danger, padding:'8px 14px', fontSize:13 }}>✕ Reject</button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:17, marginBottom:14 }}>All Listings</div>
            <div style={{ ...S.card, overflow:'hidden' }}>
              {listings.slice(0,8).map((p,i) => (
                <div key={p.id} style={{ padding:'14px 20px', borderBottom:i<7?`1px solid ${C.border}`:'none', display:'flex', alignItems:'center', gap:14 }}>
                  <div style={{ width:44, height:44, borderRadius:8, overflow:'hidden', flexShrink:0 }}><ProductImage category={p.category} height={44}/></div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontWeight:600, fontSize:14, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.title}</div>
                    <div style={{ fontSize:11, color:C.muted }}>📍 {p.location} · 👁 {p.views} · ♥ {p.saves}</div>
                  </div>
                  <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                    <Badge variant={p.featured?'gold':'gray'}>{p.featured?'Featured':'Standard'}</Badge>
                    <span style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:15, color:C.goldDark }}>${p.price}</span>
                    <button style={{ ...S.outline, padding:'5px 12px', fontSize:12 }}>Manage</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Users */}
        {tab === 'users' && (
          <div>
            <div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:22, marginBottom:20 }}>User Management</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:14, marginBottom:24 }}>
              {[['Total Users','5,140','👥',C.green],['Active Sellers','340','🏪',C.goldDark],['Pending Verification','8','⏳',C.red]].map(([l,v,ic,c]) => (
                <div key={l} style={{ ...S.card, padding:'16px 20px', display:'flex', gap:14, alignItems:'center' }}>
                  <div style={{ fontSize:28 }}>{ic}</div>
                  <div><div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:22, color:c }}>{v}</div><div style={{ fontSize:12, color:C.muted }}>{l}</div></div>
                </div>
              ))}
            </div>
            <div style={{ ...S.card, overflow:'hidden' }}>
              <div style={{ padding:'14px 20px', background:C.creamDark, borderBottom:`1px solid ${C.border}`, display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr 1fr 1fr', gap:8, fontSize:11, fontWeight:700, color:C.muted, textTransform:'uppercase', letterSpacing:'0.05em' }}>
                <span>User</span><span>Role</span><span>Status</span><span>Joined</span><span>Revenue</span><span>Actions</span>
              </div>
              {users.map((u,i) => (
                <div key={u.id} style={{ padding:'14px 20px', borderBottom:i<users.length-1?`1px solid ${C.border}`:'none', display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr 1fr 1fr', gap:8, alignItems:'center' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <Avatar initials={u.avatar||(u.name||'?').slice(0,2).toUpperCase()} size={34} color={u.role==='seller'?C.green:C.gold}/>
                    <div>
                      <div style={{ fontWeight:700, fontSize:13 }}>{u.name}</div>
                      <div style={{ fontSize:11, color:C.muted }}>📍 {u.location}</div>
                    </div>
                  </div>
                  <Badge variant={u.role==='seller'?'green':'gray'}>{u.role}</Badge>
                  <Badge variant={u.status==='active'?'green':u.status==='pending'?'gold':'red'}>{u.status||'active'}</Badge>
                  <span style={{ fontSize:12, color:C.muted }}>{u.joinedLabel||u.joined}</span>
                  <span style={{ fontSize:13, fontWeight:700 }}>—</span>
                  <div style={{ display:'flex', gap:6 }}>
                    <button style={{ ...S.outline, padding:'5px 10px', fontSize:11 }}>View</button>
                    {u.status==='active' ? <button onClick={() => setUserStatus(u.id, 'suspended')} style={{ ...S.danger, padding:'5px 10px', fontSize:11 }}>Suspend</button>
                      : <button onClick={() => setUserStatus(u.id, 'active')} style={{ ...S.primary, background:C.green, padding:'5px 10px', fontSize:11 }}>Restore</button>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reports */}
        {tab === 'reports' && (
          <div>
            <div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:22, marginBottom:20 }}>Reports & Disputes</div>
            {reports.map(r => (
              <div key={r.id} style={{ ...S.card, padding:22, marginBottom:14, border:`1.5px solid ${r.status==='open'?(r.severity==='high'?C.red:C.gold):C.border}` }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
                  <div style={{ display:'flex', gap:10, alignItems:'center' }}>
                    <Badge variant={r.severity==='high'?'red':'gold'}>{r.severity} severity</Badge>
                    <Badge variant={r.status==='open'?'red':'green'}>{r.status}</Badge>
                    <span style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:14 }}>{r.type.replace(/_/g,' ').toUpperCase()}</span>
                  </div>
                  <span style={{ fontSize:12, color:C.light }}>{r.time}</span>
                </div>
                <div style={{ fontSize:14, marginBottom:4 }}>Listing: <strong>{r.listingTitle||r.listing}</strong></div>
                <div style={{ fontSize:13, color:C.muted, marginBottom:16 }}>Reported by: {r.reporterName||r.reporter}</div>
                {r.status === 'open' && (
                  <div style={{ display:'flex', gap:10 }}>
                    <button style={{ ...S.danger, padding:'8px 18px', fontSize:13 }}>Remove Listing</button>
                    <button onClick={()=>resolveReport(r.id)} style={{ ...S.primary, background:C.green, padding:'8px 18px', fontSize:13 }}>✓ Resolve</button>
                    <button style={{ ...S.outline, padding:'8px 18px', fontSize:13 }}>Warn Seller</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Featured slots */}
        {tab === 'featured' && (
          <div>
            <div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:22, marginBottom:8 }}>Featured Slots Management</div>
            <div style={{ fontSize:14, color:C.muted, marginBottom:24 }}>Control which listings appear featured on the homepage and top of search. Max 6 featured slots.</div>
            <div style={{ background:C.goldLight, borderRadius:12, padding:'16px 20px', marginBottom:24, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div><strong style={{ color:C.goldDark }}>Featured Slots Used:</strong> <span style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:20, color:C.goldDark }}>{featured.length}/6</span></div>
              <div style={{ height:8, width:200, background:C.border, borderRadius:4, overflow:'hidden' }}>
                <div style={{ height:'100%', width:`${(featured.length/6)*100}%`, background:`linear-gradient(to right, ${C.gold}, ${C.goldDark})`, borderRadius:4 }}/>
              </div>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {listings.map(p => (
                <div key={p.id} style={{ ...S.card, padding:'14px 20px', display:'flex', alignItems:'center', gap:14, border:`1.5px solid ${featured.includes(p.id)?C.gold:C.border}`, background:featured.includes(p.id)?'oklch(0.96 0.04 80)':C.white }}>
                  <div style={{ width:50, height:50, borderRadius:8, overflow:'hidden', flexShrink:0 }}><ProductImage category={p.category} height={50}/></div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontWeight:700, fontSize:14, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.title}</div>
                    <div style={{ fontSize:12, color:C.muted }}>👁 {p.views} views · ♥ {p.saves} saves · ${p.price}</div>
                  </div>
                  <button onClick={() => toggleFeatured(p.id)}
                    style={{ ...featured.includes(p.id)?S.primary:{...S.outline}, padding:'8px 18px', fontSize:13, background:featured.includes(p.id)?C.gold:undefined, flexShrink:0 }}>
                    {featured.includes(p.id) ? '★ Featured' : '+ Feature'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Platform settings */}
        {tab === 'settings' && (
          <div style={{ maxWidth:580 }}>
            <div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:22, marginBottom:24 }}>Platform Settings</div>
            {[
              { title:'General', fields:[['Platform Name','Kampala Market'],['Support WhatsApp','+256 712 000 000'],['Admin Email','admin@kampalamarket.ug'],['Base Currency','USD']] },
              { title:'Moderation', fields:[['Require listing approval','Yes — all new listings reviewed'],['Max images per listing','6'],['Max price limit ($)','50000'],['Auto-flag price threshold','50% below category average']] },
            ].map(section => (
              <div key={section.title} style={{ ...S.card, padding:24, marginBottom:20 }}>
                <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:16, marginBottom:18 }}>{section.title}</div>
                {section.fields.map(([lbl,val]) => (
                  <div key={lbl} style={{ marginBottom:14 }}>
                    <label style={S.label}>{lbl}</label>
                    <input defaultValue={val} style={S.input}/>
                  </div>
                ))}
                <button style={{ ...S.primary, padding:'10px 24px' }}>Save {section.title}</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { AdminDashboard });
