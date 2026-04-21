// jm-api.js — Kampala Market API client
(function () {
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const BASE = isLocal ? 'http://localhost:8008/api' : '/api';

  const getToken = () => localStorage.getItem('jm_token');
  const setToken = (t) => localStorage.setItem('jm_token', t);
  const clearToken = () => { localStorage.removeItem('jm_token'); localStorage.removeItem('jm2_state'); };

  async function req(method, path, body) {
    const headers = { 'Content-Type': 'application/json' };
    const token = getToken();
    if (token) headers['Authorization'] = 'Bearer ' + token;
    const res = await fetch(BASE + path, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Request failed (' + res.status + ')');
    }
    return res.json();
  }

  const get  = (path)        => req('GET',    path);
  const post = (path, body)  => req('POST',   path, body);
  const put  = (path, body)  => req('PUT',    path, body);
  const del  = (path)        => req('DELETE', path);

  const API = {
    // ── Auth ──────────────────────────────────────────────────────────
    login:    (phone, password) => post('/auth/login', { phone, password }),
    loginOtp: (phone)           => post('/auth/login-otp', { phone }),
    register: (data)            => post('/auth/register', data),
    me:       ()                => get('/auth/me'),

    // ── Products ──────────────────────────────────────────────────────
    getProducts:   (params = {}) => get('/products?' + new URLSearchParams(params)),
    getProduct:    (id)          => get('/products/' + id),
    createProduct: (data)        => post('/products', data),
    updateProduct: (id, data)    => put('/products/' + id, data),
    deleteProduct: (id)          => del('/products/' + id),
    myProducts:    ()            => get('/my-products'),

    // ── Wishlist ──────────────────────────────────────────────────────
    getWishlist:    ()  => get('/wishlist'),
    getWishlistIds: ()  => get('/wishlist/ids'),
    addWishlist:    (id) => post('/wishlist/' + id),
    removeWishlist: (id) => del('/wishlist/' + id),

    // ── Sellers ───────────────────────────────────────────────────────
    getSellers: ()   => get('/sellers'),
    getSeller:  (id) => get('/sellers/' + id),

    // ── Follows ───────────────────────────────────────────────────────
    getFollowed: ()   => get('/follow'),
    follow:      (id) => post('/follow/' + id),
    unfollow:    (id) => del('/follow/' + id),

    // ── Inquiries / Chat ──────────────────────────────────────────────
    getInquiries:   ()            => get('/inquiries'),
    createInquiry:  (data)        => post('/inquiries', data),
    sendMessage:    (id, text)    => post('/inquiries/' + id + '/message', { text }),

    // ── Notifications ─────────────────────────────────────────────────
    getNotifications:   () => get('/notifications'),
    markNotifRead:      () => put('/notifications/read'),

    // ── Wanted Ads ────────────────────────────────────────────────────
    getWanted:      ()        => get('/wanted'),
    createWanted:   (data)    => post('/wanted', data),
    getWantedDetail:(id)      => get('/wanted/' + id),
    submitOffer:    (id, data)=> post('/wanted/' + id + '/offer', data),

    // ── Reviews ───────────────────────────────────────────────────────
    getSellerReviews: (id)   => get('/reviews/seller/' + id),
    createReview:     (data) => post('/reviews', data),

    // ── Courier ───────────────────────────────────────────────────────
    getRiders:       ()     => get('/courier/riders'),
    requestDelivery: (data) => post('/courier/request', data),
    getDeliveries:   ()     => get('/courier/deliveries'),

    // ── Admin ─────────────────────────────────────────────────────────
    adminStats:           ()         => get('/admin/stats'),
    adminUsers:           ()         => get('/admin/users'),
    adminSetUserStatus:   (id, s)    => put('/admin/users/' + id + '/status', { status: s }),
    adminPending:         ()         => get('/admin/listings/pending'),
    adminListingStatus:   (id, s)    => put('/admin/listings/' + id + '/status', { status: s }),
    adminReports:         ()         => get('/admin/reports'),
    adminReportStatus:    (id, s)    => put('/admin/reports/' + id + '/status', { status: s }),
    adminFeatured:        ()         => get('/admin/featured'),
    adminAddFeatured:     (id)       => post('/admin/featured/' + id),
    adminRemoveFeatured:  (id)       => del('/admin/featured/' + id),

    // ── Token helpers ─────────────────────────────────────────────────
    setToken,
    clearToken,
    getToken,
    isLoggedIn: () => !!getToken(),
  };

  window.API = API;
})();
