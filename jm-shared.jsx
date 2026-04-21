// jm-shared.jsx — Shared UI components for Juba Market v2

const { useState, useEffect, useCallback, useRef } = React;

// ─── Design tokens (mirrored from CSS vars for inline use) ─────────────
const C = {
  gold: 'oklch(0.72 0.16 72)',
  goldDark: 'oklch(0.52 0.16 60)',
  goldLight: 'oklch(0.92 0.08 80)',
  green: 'oklch(0.40 0.13 155)',
  greenLight: 'oklch(0.88 0.07 155)',
  red: 'oklch(0.50 0.18 25)',
  redLight: 'oklch(0.94 0.05 25)',
  cream: 'oklch(0.97 0.02 85)',
  creamDark: 'oklch(0.93 0.03 80)',
  text: 'oklch(0.18 0.03 45)',
  muted: 'oklch(0.50 0.03 50)',
  light: 'oklch(0.68 0.02 50)',
  border: 'oklch(0.88 0.03 75)',
  white: 'oklch(0.99 0.01 80)',
};

const S = {
  input: { width:'100%', padding:'10px 14px', border:`1.5px solid ${C.border}`, borderRadius:8, background:C.cream, fontSize:14, outline:'none', fontFamily:'var(--font-body)', color:C.text },
  primary: { background:C.gold, color:C.white, border:'none', borderRadius:8, padding:'11px 22px', fontWeight:700, fontSize:14, cursor:'pointer', fontFamily:'var(--font-body)', transition:'filter 0.15s' },
  outline: { background:'transparent', color:C.text, border:`1.5px solid ${C.border}`, borderRadius:8, padding:'10px 20px', fontWeight:600, fontSize:14, cursor:'pointer', fontFamily:'var(--font-body)' },
  danger: { background:C.redLight, color:C.red, border:'none', borderRadius:8, padding:'10px 20px', fontWeight:600, fontSize:14, cursor:'pointer', fontFamily:'var(--font-body)' },
  label: { display:'block', fontSize:11, fontWeight:700, color:C.muted, marginBottom:5, textTransform:'uppercase', letterSpacing:'0.05em' },
  card: { background:C.white, borderRadius:12, boxShadow:'0 2px 12px rgba(0,0,0,0.08)', overflow:'hidden' },
};

// ─── Stars ────────────────────────────────────────────────────────────────
function Stars({ rating, size=13 }) {
  return (
    <span style={{ display:'inline-flex', gap:1 }}>
      {[1,2,3,4,5].map(i => (
        <svg key={i} width={size} height={size} viewBox="0 0 12 12">
          <path d="M6 1l1.3 2.6L10 4l-2 2 .5 3L6 7.7 3.5 9 4 6 2 4l2.7-.4z"
            fill={i <= Math.round(rating) ? C.gold : C.border}/>
        </svg>
      ))}
    </span>
  );
}

// ─── Avatar ───────────────────────────────────────────────────────────────
function Avatar({ initials, size=40, color=C.gold, online=false }) {
  return (
    <div style={{ position:'relative', display:'inline-flex', flexShrink:0 }}>
      <div style={{ width:size, height:size, borderRadius:'50%', background:color, color:C.white, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-display)', fontWeight:700, fontSize:size*0.33 }}>
        {initials}
      </div>
      {online && <div style={{ position:'absolute', bottom:1, right:1, width:size*0.28, height:size*0.28, borderRadius:'50%', background:'#22c55e', border:`2px solid ${C.white}` }}/>}
    </div>
  );
}

// ─── Badge ────────────────────────────────────────────────────────────────
function Badge({ children, variant='gold' }) {
  const colors = {
    gold: { bg:C.goldLight, color:C.goldDark },
    green: { bg:C.greenLight, color:C.green },
    red: { bg:C.redLight, color:C.red },
    gray: { bg:C.creamDark, color:C.muted },
    dark: { bg:'oklch(0.22 0.03 45)', color:C.white },
  };
  const c = colors[variant] || colors.gold;
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:3, padding:'3px 9px', borderRadius:99, fontSize:11, fontWeight:700, letterSpacing:'0.04em', textTransform:'uppercase', background:c.bg, color:c.color }}>
      {children}
    </span>
  );
}

// ─── Product image placeholder ────────────────────────────────────────────
const CAT_COLORS = {
  electronics:['#1a1a2e','#16213e','#0f3460','#533483'],
  clothing:['#6b2737','#9b2335','#c8102e','#e8a0a0'],
  food:['#2d5016','#4a7c24','#7ab648','#c5e384'],
  furniture:['#5c3d2e','#8b5e3c','#b8864e','#d4a96a'],
  vehicles:['#1c2938','#2e4057','#5b7fa6','#8cafc7'],
  crafts:['#6b4c6b','#9b6e9b','#c49bc4','#e8cce8'],
  services:['#1a3a4a','#2c5f6e','#4a8fa6','#7cb8c8'],
  livestock:['#3d2b1a','#6b4a2a','#9b6b3c','#c49b5e'],
  building:['#2a2a2a','#3d3d3d','#5a5a5a','#7a7a7a'],
};
const CAT_ICONS = { electronics:'📱', clothing:'👕', food:'🌽', furniture:'🪑', vehicles:'🚗', crafts:'🎨', services:'🔧', livestock:'🐄', building:'🧱' };

function ProductImage({ category, height=160, dealBadge=false }) {
  const cols = CAT_COLORS[category] || CAT_COLORS.services;
  return (
    <div style={{ height, position:'relative', background:cols[0], flexShrink:0, overflow:'hidden' }}>
      {cols.map((c,i) => <div key={i} style={{ position:'absolute', inset:0, background:c, opacity:0.5+i*0.1, clipPath:`polygon(0 ${i*25}%, 100% ${i*22}%, 100% ${(i+1)*25}%, 0 ${(i+1)*28}%)` }}/>)}
      <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:6 }}>
        <span style={{ fontSize:height*0.22, filter:'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>{CAT_ICONS[category]||'📦'}</span>
        <span style={{ fontFamily:'monospace', fontSize:9, color:'rgba(255,255,255,0.4)', letterSpacing:'0.1em', textTransform:'uppercase' }}>{category}</span>
      </div>
      {dealBadge && <div style={{ position:'absolute', top:10, left:10, background:C.red, color:'white', fontSize:11, fontWeight:800, padding:'3px 8px', borderRadius:6 }}>🔥 DEAL</div>}
    </div>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────
function ProductCard({ product, onView, onWishlist, wishlisted=false }) {
  const { SELLERS } = window.JubaData;
  const seller = SELLERS.find(s => s.id === product.sellerId);
  const [hov, setHov] = useState(false);
  const [wl, setWl] = useState(wishlisted);

  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ ...S.card, cursor:'pointer', transform:hov ? 'translateY(-3px)' : 'none', boxShadow:hov ? '0 8px 32px rgba(0,0,0,0.14)' : '0 2px 12px rgba(0,0,0,0.08)', transition:'all 0.2s', display:'flex', flexDirection:'column' }}>
      <div style={{ position:'relative' }} onClick={() => onView(product.id)}>
        <ProductImage category={product.category} height={160} dealBadge={!!product.dealPrice} />
        <button onClick={e => { e.stopPropagation(); setWl(!wl); onWishlist && onWishlist(product.id); }}
          style={{ position:'absolute', top:8, right:8, width:32, height:32, borderRadius:'50%', border:'none', background:wl ? C.red : 'rgba(255,255,255,0.9)', color:wl ? 'white' : C.muted, fontSize:15, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 1px 4px rgba(0,0,0,0.2)', transition:'all 0.18s' }}>
          {wl ? '♥' : '♡'}
        </button>
      </div>
      <div style={{ padding:'14px 14px 12px', flex:1, display:'flex', flexDirection:'column', gap:6 }} onClick={() => onView(product.id)}>
        <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
          {product.featured && <Badge variant="gold">★ Featured</Badge>}
          {product.negotiable && <Badge variant="gray">Negotiable</Badge>}
        </div>
        <div style={{ fontFamily:'var(--font-display)', fontWeight:600, fontSize:13.5, lineHeight:1.35, color:C.text }}>{product.title}</div>
        <div style={{ display:'flex', alignItems:'baseline', gap:6 }}>
          {product.dealPrice
            ? <><span style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:17, color:C.red }}>${product.dealPrice}</span><span style={{ fontSize:12, color:C.light, textDecoration:'line-through' }}>${product.price}</span></>
            : <span style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:17, color:C.goldDark }}>${product.price}</span>
          }
        </div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:'auto', paddingTop:8, borderTop:`1px solid ${C.border}` }}>
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <Avatar initials={seller?.avatar} size={20} color={C.green} online={seller?.online} />
            <span style={{ fontSize:11, color:C.muted, maxWidth:90, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{seller?.name}</span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:8, fontSize:11, color:C.light }}>
            <span>♥ {product.saves}</span>
            <span>👁 {product.views}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Modal wrapper ────────────────────────────────────────────────────────
function Modal({ onClose, children, width=480, title }) {
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:2000, display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ ...S.card, width:'100%', maxWidth:width, maxHeight:'92vh', overflowY:'auto', borderRadius:16, padding:28, animation:'fadeUp 0.25s ease both' }}>
        {title && (
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:22 }}>
            <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:19 }}>{title}</div>
            <button onClick={onClose} style={{ background:C.creamDark, border:'none', borderRadius:8, width:32, height:32, cursor:'pointer', fontSize:18, color:C.muted }}>×</button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

// ─── Section header ───────────────────────────────────────────────────────
function SectionHeader({ title, action, onAction }) {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
      <h2 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:20, color:C.text }}>{title}</h2>
      {action && <button onClick={onAction} style={{ ...S.outline, padding:'7px 16px', fontSize:13 }}>{action}</button>}
    </div>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, sub, color=C.goldDark }) {
  return (
    <div style={{ ...S.card, padding:'18px 20px' }}>
      <div style={{ fontSize:22, marginBottom:6 }}>{icon}</div>
      <div style={{ fontFamily:'var(--font-display)', fontWeight:800, fontSize:24, color }}>{value}</div>
      <div style={{ fontSize:12, fontWeight:600, color:C.text, marginTop:2 }}>{label}</div>
      {sub && <div style={{ fontSize:11, color:C.muted, marginTop:3 }}>{sub}</div>}
    </div>
  );
}

// ─── Countdown timer ──────────────────────────────────────────────────────
function Countdown() {
  const [t, setT] = useState({ h:6, m:24, s:17 });
  useEffect(() => {
    const iv = setInterval(() => setT(prev => {
      let { h, m, s } = prev;
      s--; if (s < 0) { s = 59; m--; } if (m < 0) { m = 59; h--; } if (h < 0) { h = 23; m = 59; s = 59; }
      return { h, m, s };
    }), 1000);
    return () => clearInterval(iv);
  }, []);
  const pad = n => String(n).padStart(2, '0');
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:4, fontFamily:'var(--font-display)', fontWeight:800 }}>
      {['h','m','s'].map((unit, i) => (
        <React.Fragment key={unit}>
          {i > 0 && <span style={{ opacity:0.6 }}>:</span>}
          <span style={{ background:'rgba(0,0,0,0.25)', borderRadius:6, padding:'3px 8px', minWidth:34, textAlign:'center' }}>
            {pad(t[unit])}
          </span>
        </React.Fragment>
      ))}
    </span>
  );
}

// ─── Contact Modal ────────────────────────────────────────────────────────
function ContactModal({ seller, product, onClose }) {
  const [tab, setTab] = useState('whatsapp');
  const [form, setForm] = useState({ name:'', phone:'', message:`Hi! I'm interested in "${product?.title}". Is it available?` });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendErr, setSendErr] = useState('');

  const tabs = [
    { id:'whatsapp', label:'💬 WhatsApp', primary:true },
    { id:'message', label:'✉ Message' },
    { id:'phone', label:'📞 Call' },
    { id:'email', label:'📧 Email' },
  ];

  return (
    <Modal onClose={onClose} title={`Contact ${seller?.name}`} width={440}>
      <div style={{ display:'flex', gap:4, background:C.creamDark, borderRadius:99, padding:4, marginBottom:20 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ flex:1, padding:'7px 4px', border:'none', borderRadius:99, fontSize:12, fontWeight:tab===t.id?700:500, background:tab===t.id ? (t.primary ? C.green : C.gold) : 'transparent', color:tab===t.id ? 'white' : C.muted, cursor:'pointer', transition:'all 0.18s' }}>{t.label}</button>
        ))}
      </div>

      {tab === 'whatsapp' && (
        <div style={{ textAlign:'center', padding:'12px 0' }}>
          <div style={{ fontSize:52, marginBottom:12 }}>💬</div>
          <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:17, marginBottom:6 }}>Chat on WhatsApp</div>
          <div style={{ color:C.muted, fontSize:13, marginBottom:4 }}>Sellers respond fastest on WhatsApp</div>
          <div style={{ fontFamily:'var(--font-display)', fontSize:20, color:C.green, marginBottom:20 }}>{seller?.whatsapp}</div>
          <a href={`https://wa.me/${seller?.whatsapp?.replace(/\D/g,'')}?text=${encodeURIComponent(form.message)}`} target="_blank"
            style={{ ...S.primary, display:'inline-block', background:C.green, padding:'12px 32px', fontSize:15 }}>Open WhatsApp →</a>
        </div>
      )}
      {tab === 'message' && !sent && (
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          <div><label style={S.label}>Your Name</label><input value={form.name} onChange={e => setForm(f=>({...f,name:e.target.value}))} placeholder="e.g. Ayen Deng" style={S.input}/></div>
          <div><label style={S.label}>Your Phone</label><input value={form.phone} onChange={e => setForm(f=>({...f,phone:e.target.value}))} placeholder="+211 9XX XXX XXX" style={S.input}/></div>
          <div><label style={S.label}>Message</label><textarea value={form.message} onChange={e => setForm(f=>({...f,message:e.target.value}))} rows={4} style={{ ...S.input, resize:'vertical' }}/></div>
          {sendErr && <div style={{ fontSize:12, color:C.red }}>{sendErr}</div>}
          <button onClick={async () => {
            setSending(true); setSendErr('');
            try {
              if (window.API.isLoggedIn()) {
                await window.API.createInquiry({ sellerId: seller?.id, productId: product?.id, productTitle: product?.title, message: form.message });
              }
              setSent(true);
            } catch(e) { setSendErr(e.message || 'Failed to send'); }
            finally { setSending(false); }
          }} disabled={sending} style={{ ...S.primary, width:'100%', padding:'12px', opacity:sending?0.6:1 }}>
            {sending ? 'Sending…' : 'Send Message'}
          </button>
        </div>
      )}
      {tab === 'message' && sent && (
        <div style={{ textAlign:'center', padding:'24px 0' }}>
          <div style={{ fontSize:44, marginBottom:10 }}>✅</div>
          <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:18, marginBottom:6 }}>Message Sent!</div>
          <div style={{ color:C.muted, fontSize:14 }}>The seller will reply to your phone number soon.</div>
        </div>
      )}
      {tab === 'phone' && (
        <div style={{ textAlign:'center', padding:'12px 0' }}>
          <div style={{ fontSize:52, marginBottom:12 }}>📞</div>
          <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:17, marginBottom:6 }}>Call Seller Directly</div>
          <div style={{ fontFamily:'var(--font-display)', fontSize:22, color:C.green, marginBottom:20 }}>{seller?.phone}</div>
          <a href={`tel:${seller?.phone?.replace(/\s/g,'')}`} style={{ ...S.primary, display:'inline-block', padding:'12px 32px' }}>Tap to Call</a>
        </div>
      )}
      {tab === 'email' && (
        <div style={{ textAlign:'center', padding:'12px 0' }}>
          <div style={{ fontSize:52, marginBottom:12 }}>📧</div>
          <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:17, marginBottom:6 }}>Send an Email</div>
          <div style={{ color:C.muted, fontSize:14, marginBottom:20 }}>{seller?.email}</div>
          <a href={`mailto:${seller?.email}?subject=Inquiry: ${product?.title}&body=${encodeURIComponent(form.message)}`}
            style={{ ...S.primary, display:'inline-block', padding:'12px 32px' }}>Open Email App</a>
        </div>
      )}

      <div style={{ marginTop:20, padding:'14px 16px', background:C.creamDark, borderRadius:10, fontSize:12, color:C.muted }}>
        🛡 <strong>Safety tip:</strong> Always meet in a public place (market, bank area). Inspect goods before paying. Never send money in advance.
      </div>
    </Modal>
  );
}

// ─── Negotiate Modal ──────────────────────────────────────────────────────
function NegotiateModal({ product, seller, onClose }) {
  const [offer, setOffer] = useState('');
  const [sent, setSent] = useState(false);
  const [note, setNote] = useState('');

  return (
    <Modal onClose={onClose} title="Make an Offer" width={400}>
      {!sent ? (
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <div style={{ background:C.creamDark, borderRadius:10, padding:'12px 16px', display:'flex', justifyContent:'space-between', fontSize:14 }}>
            <span style={{ color:C.muted }}>Listed price</span>
            <span style={{ fontFamily:'var(--font-display)', fontWeight:800, color:C.goldDark }}>${product?.price}</span>
          </div>
          <div>
            <label style={S.label}>Your Offer (USD)</label>
            <input type="number" value={offer} onChange={e => setOffer(e.target.value)} placeholder={`e.g. ${Math.round(product?.price * 0.85)}`} style={{ ...S.input, fontSize:18, fontFamily:'var(--font-display)', fontWeight:700 }}/>
            {offer && Number(offer) < product?.price && <div style={{ fontSize:12, color:C.muted, marginTop:4 }}>That's {Math.round((1 - offer/product?.price)*100)}% below asking price</div>}
          </div>
          <div>
            <label style={S.label}>Note to seller (optional)</label>
            <textarea value={note} onChange={e => setNote(e.target.value)} rows={3} placeholder="e.g. I can pick up today and pay cash..." style={{ ...S.input, resize:'vertical' }}/>
          </div>
          <button onClick={() => setSent(true)} disabled={!offer} style={{ ...S.primary, width:'100%', padding:'12px', opacity:offer?1:0.5 }}>Send Offer via WhatsApp</button>
          <p style={{ fontSize:12, color:C.muted, textAlign:'center' }}>Your offer will be sent to {seller?.name} on WhatsApp</p>
        </div>
      ) : (
        <div style={{ textAlign:'center', padding:'20px 0' }}>
          <div style={{ fontSize:48, marginBottom:10 }}>🤝</div>
          <div style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:20, marginBottom:8 }}>Offer Sent!</div>
          <div style={{ color:C.muted, fontSize:14, lineHeight:1.6 }}>Your offer of <strong style={{ color:C.goldDark }}>${offer}</strong> has been sent to {seller?.name}.<br/>They'll respond on WhatsApp.</div>
        </div>
      )}
    </Modal>
  );
}

// Export all shared components
Object.assign(window, { C, S, Stars, Avatar, Badge, ProductImage, ProductCard, Modal, SectionHeader, StatCard, Countdown, ContactModal, NegotiateModal, CAT_ICONS, CAT_COLORS });
