// Bach Hoa Xanh — Frontend Logic (v2: pixel-perfect BHX layout)
(function () {
  const data = window.BHX_DATA || { menuHeader: [], menuV2: [], banners: [], flashSale: [], categories: {} };

  // ─── STATE ───────────────────────────────────────────────────────
  const state = {
    cart: JSON.parse(localStorage.getItem('bhx_cart') || '[]'),
    location: localStorage.getItem('bhx_location') || 'Chọn vị trí giao gần bạn',
    bannerIndex: 0,
    searchQuery: '',
  };

  // ─── HELPERS ──────────────────────────────────────────────────────
  function fmt(n) {
    return n ? Number(n).toLocaleString('vi-VN') + '₫' : '0₫';
  }

  function saveCart() {
    localStorage.setItem('bhx_cart', JSON.stringify(state.cart));
    updateCartBadge();
    renderFlashSale();
    renderCategoryProducts();
  }

  function addToCart(product) {
    const existing = state.cart.find(i => i.name === product.name);
    if (existing) { existing.quantity++; }
    else { state.cart.push({ name: product.name, avatar: product.avatar, price: product.price, unit: product.unit || 'gói', quantity: 1 }); }
    saveCart();
    showToast('Đã thêm vào giỏ hàng', product.name);
  }

  function updateCartQuantity(name, delta) {
    const item = state.cart.find(i => i.name === name);
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) state.cart = state.cart.filter(i => i.name !== name);
    saveCart();
    renderCartDrawer();
  }

  window.__bhx_addCart = (enc) => { try { addToCart(JSON.parse(decodeURIComponent(enc))); } catch (e) { } };
  window.__bhx_updateQty = (name, delta) => updateCartQuantity(name, delta);
  window.__bhx_showProductDetail = (enc) => {
    try {
      const p = JSON.parse(decodeURIComponent(enc));
      const modal = document.getElementById('product-detail-modal');
      document.getElementById('detail-modal-img').src = p.avatar;
      document.getElementById('detail-modal-title').textContent = p.name;
      document.getElementById('detail-modal-price').textContent = fmt(p.price);
      document.getElementById('detail-modal-unit').textContent = p.unit || 'gói';
      const op = document.getElementById('detail-modal-orig-price');
      if (op) { op.textContent = p.originalPrice > p.price ? fmt(p.originalPrice) : ''; op.style.display = p.originalPrice > p.price ? 'inline' : 'none'; }
      const addBtn = document.getElementById('detail-modal-add-btn');
      if (addBtn) addBtn.onclick = () => { addToCart(p); modal.classList.add('hidden'); };
      modal.classList.remove('hidden');
    } catch (e) { }
  };

  // ─── TOAST ────────────────────────────────────────────────────────
  function showToast(title, sub) {
    const toast = document.getElementById('bhx-toast');
    if (!toast) return;
    toast.innerHTML = `
      <div class="flex items-center gap-3 bg-[#007E42] text-white px-4 py-3 rounded-xl shadow-2xl border border-green-400 min-w-[260px]">
        <svg class="w-6 h-6 text-yellow-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <div>
          <div class="font-semibold text-sm">${title}</div>
          ${sub ? `<div class="text-xs text-green-100 truncate max-w-[200px]">${sub}</div>` : ''}
        </div>
      </div>`;
    toast.classList.remove('opacity-0', 'pointer-events-none', '-translate-y-4');
    toast.classList.add('opacity-100', 'translate-y-0');
    clearTimeout(window.__toastT);
    window.__toastT = setTimeout(() => {
      toast.classList.add('opacity-0', 'pointer-events-none', '-translate-y-4');
      toast.classList.remove('opacity-100', 'translate-y-0');
    }, 2500);
  }

  // ─── CART BADGE ───────────────────────────────────────────────────
  function updateCartBadge() {
    const total = state.cart.reduce((s, i) => s + i.quantity, 0);
    const badge = document.getElementById('cart-badge');
    const mobBadge = document.getElementById('mobile-cart-badge');
    const botBadge = document.getElementById('bottom-cart-badge');
    const drawerCount = document.getElementById('drawer-cart-count');
    if (badge) { badge.textContent = total; badge.style.display = total > 0 ? 'flex' : 'none'; }
    if (mobBadge) { mobBadge.textContent = total; mobBadge.style.display = total > 0 ? 'flex' : 'none'; }
    if (botBadge) { botBadge.textContent = total; botBadge.style.display = total > 0 ? 'flex' : 'none'; }
    if (drawerCount) drawerCount.textContent = `(${total})`;
  }

  // ─── SIDEBAR (BHX: each item w/icon + name, hover submenu flyout) ─
  function renderSidebarMenu() {
    const menus = data.menuV2 || [];

    // Desktop sidebar
    const container = document.getElementById('sidebar-menu-list');
    if (container) {
      container.innerHTML = menus.map((menu, idx) => {
        const hasChildren = menu.childrens && menu.childrens.length > 0;
        const iconHtml = menu.icon ? `
          <img src="${menu.icon}" alt="${menu.name}"
               class="w-[24px] h-[24px] object-contain shrink-0"
               onerror="this.src='https://cdnv2-tmdt.tgdd.vn/bhx/product-fe/cart/home/_next/public/static/images/default-image.svg'">
        ` : `
          <div class="w-[24px] h-[24px] rounded-full bg-[#007E42]/10 flex items-center justify-center shrink-0 text-[#007E42]">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
          </div>
        `;
        return `
          <div class="relative group/m">
            <a href="#cat-${idx}"
               class="flex items-center justify-between px-3 py-[9px] text-[13px] text-[#333] 
                      hover:bg-[#F0FFF3] hover:text-[#007E42] border-b border-[#f3f4f7] transition-colors cursor-pointer">
              <div class="flex items-center gap-2 min-w-0">
                ${iconHtml}
                <span class="truncate font-medium leading-snug">${menu.name}</span>
              </div>
              ${hasChildren ? `
                <svg class="w-3 h-3 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>` : ''}
            </a>
            ${hasChildren ? `
              <div class="hidden group-hover/m:flex absolute left-full top-0 w-[460px] bg-white border border-gray-200 
                          shadow-2xl rounded-r-xl z-50 p-4 min-h-[240px] flex-col gap-3">
                <div class="text-sm font-bold text-[#007E42] border-b pb-2 flex items-center justify-between">
                  <span>${menu.name}</span>
                  <span class="text-xs text-gray-500 font-normal">Xem tất cả &rarr;</span>
                </div>
                <div class="grid grid-cols-2 gap-1.5">
                  ${menu.childrens.map(child => `
                    <a href="#cat-${idx}" class="flex items-center gap-2 p-1.5 rounded hover:bg-[#F0FFF3] text-xs text-gray-700 hover:text-[#007E42] transition-colors">
                      ${child.icon ? `<img src="${child.icon}" class="w-5 h-5 object-contain shrink-0" onerror="this.style.display='none'">` : ''}
                      <span class="truncate">${child.name}</span>
                    </a>`).join('')}
                </div>
              </div>` : ''}
          </div>`;
      }).join('');
    }

    // Mobile category drawer list
    const mobileContainer = document.getElementById('mobile-category-list');
    if (mobileContainer) {
      mobileContainer.innerHTML = menus.map((menu, idx) => {
        const hasChildren = menu.childrens && menu.childrens.length > 0;
        return `
          <div class="mobile-cat-item">
            <div class="flex items-center justify-between p-3 hover:bg-gray-50 transition-colors">
              <a href="#cat-${idx}" class="flex items-center gap-3 flex-1 min-w-0" onclick="window.__bhx_closeMobileDrawer()">
                ${menu.icon ? `<img src="${menu.icon}" alt="${menu.name}" class="w-6 h-6 object-contain shrink-0" onerror="this.src='https://cdnv2-tmdt.tgdd.vn/bhx/product-fe/cart/home/_next/public/static/images/default-image.svg'">` : ''}
                <span class="text-xs font-semibold text-gray-800 truncate">${menu.name}</span>
              </a>
              ${hasChildren ? `
                <button onclick="window.__bhx_toggleMobileSub(${idx})" class="p-1.5 text-gray-400 hover:text-gray-700" aria-label="Mở rộng">
                  <svg id="mob-arrow-${idx}" class="w-4 h-4 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                </button>` : ''}
            </div>
            ${hasChildren ? `
              <div id="mob-sub-${idx}" class="hidden bg-gray-50 px-4 py-2 border-t border-gray-100 grid grid-cols-2 gap-2">
                ${menu.childrens.map(c => `
                  <a href="#cat-${idx}" class="text-[11px] text-gray-600 hover:text-[#EF5121] py-1 truncate" onclick="window.__bhx_closeMobileDrawer()">
                    • ${c.name}
                  </a>`).join('')}
              </div>` : ''}
          </div>`;
      }).join('');
    }

    // Setup mobile drawer events
    window.__bhx_closeMobileDrawer = () => {
      const d = document.getElementById('mobile-category-drawer');
      const o = document.getElementById('mobile-category-overlay');
      if (d) d.classList.add('-translate-x-full');
      if (o) { o.classList.add('opacity-0', 'pointer-events-none'); o.classList.remove('opacity-100'); }
    };
    window.__bhx_openMobileDrawer = () => {
      const d = document.getElementById('mobile-category-drawer');
      const o = document.getElementById('mobile-category-overlay');
      if (d) d.classList.remove('-translate-x-full');
      if (o) { o.classList.remove('opacity-0', 'pointer-events-none'); o.classList.add('opacity-100'); }
    };
    window.__bhx_toggleMobileSub = (idx) => {
      const sub = document.getElementById(`mob-sub-${idx}`);
      const arrow = document.getElementById(`mob-arrow-${idx}`);
      if (!sub) return;
      sub.classList.toggle('hidden');
      if (arrow) arrow.classList.toggle('rotate-180');
    };

    const btnMobMenu = document.getElementById('btn-mobile-menu');
    const btnBotCategory = document.getElementById('btn-bottom-category');
    const btnMobClose = document.getElementById('mobile-category-close');
    const mobOverlay = document.getElementById('mobile-category-overlay');
    const btnHeaderCat = document.getElementById('btn-header-category');

    if (btnMobMenu) btnMobMenu.onclick = window.__bhx_openMobileDrawer;
    if (btnBotCategory) btnBotCategory.onclick = window.__bhx_openMobileDrawer;
    if (btnMobClose) btnMobClose.onclick = window.__bhx_closeMobileDrawer;
    if (mobOverlay) mobOverlay.onclick = window.__bhx_closeMobileDrawer;
    if (btnHeaderCat) btnHeaderCat.onclick = () => {
      const firstCat = document.getElementById('cat-0');
      if (firstCat) firstCat.scrollIntoView({ behavior: 'smooth' });
    };
  }

  // ─── STORY BADGES (BHX: w-20 per item, 60x60 img, text below) ────
  function renderStoryBadges() {
    const track = document.getElementById('story-badges-track');
    if (!track) return;
    const badges = data.menuHeader || [];

    track.innerHTML = badges.map(b => `
      <a href="/${b.url || '#'}"
         class="cate_name w-20 mr-3 flex cursor-pointer flex-col items-center justify-start px-[4px] 
                hover:bg-[#F0FFF3] hover:text-[#007E42] rounded transition-colors shrink-0">
        <div class="relative mb-[2px] mx-auto" style="width:60px;height:60px">
          <img alt="${b.name}"
               width="60" height="60"
               class="object-contain w-[60px] h-[60px]"
               src="${b.icon}"
               onerror="this.src='https://cdnv2-tmdt.tgdd.vn/bhx/product-fe/cart/home/_next/public/static/images/default-image.svg'">
        </div>
        <div class="mb-[8px] flex h-[32px] items-start">
          <div class="leading-[16px] text-[13px] line-clamp-2 text-center">${b.name}</div>
        </div>
      </a>`).join('');
  }

  // ─── BANNER CAROUSEL ──────────────────────────────────────────────
  function initBanners() {
    const banners = data.banners || [];
    const slide = document.getElementById('banner-slide');
    const dots = document.getElementById('banner-dots');
    if (!slide || banners.length === 0) return;

    function show(idx) {
      state.bannerIndex = (idx + banners.length) % banners.length;
      const b = banners[state.bannerIndex];
      slide.innerHTML = `
        <div class="relative w-full overflow-hidden cursor-pointer" style="aspect-ratio:1200/300">
          <img src="${b.image}" alt="${b.title}"
               class="w-full h-full object-cover object-center"
               onerror="this.onerror=null;this.src='${b.fallback || ''}';this.style.background='linear-gradient(135deg,#007E42,#006133)'"
               style="display:block">
        </div>`;
      if (dots) {
        dots.innerHTML = banners.map((_, i) => `
          <button onclick="window.__bhxBanner(${i})"
                  class="rounded-full transition-all ${i === state.bannerIndex ? 'bg-white w-5 h-2' : 'bg-white/50 w-2 h-2'}"></button>`).join('');
      }
    }

    window.__bhxBanner = show;
    show(0);

    const auto = setInterval(() => show(state.bannerIndex + 1), 4500);
    const prev = document.getElementById('banner-prev');
    const next = document.getElementById('banner-next');
    if (prev) prev.onclick = () => { clearInterval(auto); show(state.bannerIndex - 1); };
    if (next) next.onclick = () => { clearInterval(auto); show(state.bannerIndex + 1); };

    // hover show prev/next
    const bannerContainer = slide.parentElement;
    if (bannerContainer) {
      bannerContainer.addEventListener('mouseenter', () => {
        if (prev) prev.style.opacity = '1';
        if (next) next.style.opacity = '1';
      });
      bannerContainer.addEventListener('mouseleave', () => {
        if (prev) prev.style.opacity = '0';
        if (next) next.style.opacity = '0';
      });
    }
  }

  // ─── FLASH SALE TIMER ─────────────────────────────────────────────
  function initFlashSaleTimer() {
    let secs = 2 * 3600 + 45 * 60 + 20;
    const hEl = document.getElementById('fs-hours');
    const mEl = document.getElementById('fs-minutes');
    const sEl = document.getElementById('fs-seconds');
    if (!hEl) return;
    setInterval(() => {
      secs = secs > 0 ? secs - 1 : 24 * 3600;
      hEl.textContent = String(Math.floor(secs / 3600)).padStart(2, '0');
      mEl.textContent = String(Math.floor((secs % 3600) / 60)).padStart(2, '0');
      sEl.textContent = String(secs % 60).padStart(2, '0');
    }, 1000);
  }

  // ─── FLASH SALE PRODUCTS ──────────────────────────────────────────
  function renderFlashSale() {
    const container = document.getElementById('flash-sale-products');
    if (!container) return;
    const items = data.flashSale || [];
    container.innerHTML = items.map(p => {
      const inCart = state.cart.find(c => c.name === p.name);
      const pct = Math.min(100, Math.round((p.sold / p.total) * 100));
      return `
        <div class="product-card group bg-white rounded-xl p-2 border border-gray-100 hover:border-green-400 flex flex-col justify-between relative">
          <div class="absolute top-2 left-2 z-10 bg-red-600 text-white font-black text-[10px] px-1.5 py-[2px] rounded">
            -${p.discountPercent}%
          </div>
          <div class="absolute top-2 right-2 z-10 bg-[#007E42] text-white font-semibold text-[9px] px-1 py-[2px] rounded">
            Giao 2h
          </div>
          <div class="relative w-full aspect-square overflow-hidden rounded-lg mb-2 cursor-pointer bg-gray-50 flex items-center justify-center"
               onclick="window.__bhx_showProductDetail('${encodeURIComponent(JSON.stringify(p))}')">
            <img src="${p.avatar}" alt="${p.name}"
                 class="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                 onerror="this.src='https://cdnv2-tmdt.tgdd.vn/bhx/product-fe/cart/home/_next/public/static/images/default-image.svg'">
          </div>
          <div class="flex-1">
            <h3 class="text-[12px] font-medium text-gray-800 line-clamp-2 leading-snug mb-1 cursor-pointer hover:text-[#007E42]"
                onclick="window.__bhx_showProductDetail('${encodeURIComponent(JSON.stringify(p))}')">${p.name}</h3>
            <div class="text-[11px] text-gray-400 mb-1">ĐVT: ${p.unit}</div>
            <div class="flex items-baseline gap-1 mb-1.5">
              <span class="text-[13px] font-bold text-red-600">${fmt(p.price)}</span>
              ${p.originalPrice > p.price ? `<span class="text-[10px] text-gray-400 line-through">${fmt(p.originalPrice)}</span>` : ''}
            </div>
            <div class="progress-bar-sold mb-2">
              <div class="progress-bar-sold-fill" style="width:${pct}%"></div>
              <div class="progress-bar-sold-text">Đã bán ${p.sold}</div>
            </div>
          </div>
          ${inCart ? `
            <div class="flex items-center justify-between border border-green-600 rounded-full px-2 py-1 bg-[#F0FFF3]">
              <button onclick="window.__bhx_updateQty('${p.name}',-1)" class="w-6 h-6 rounded-full bg-white text-green-700 font-bold hover:bg-green-100 flex items-center justify-center shadow-sm text-sm">−</button>
              <span class="text-xs font-bold text-green-800">${inCart.quantity}</span>
              <button onclick="window.__bhx_updateQty('${p.name}',1)" class="w-6 h-6 rounded-full bg-[#007E42] text-white font-bold hover:bg-green-700 flex items-center justify-center shadow-sm text-sm">+</button>
            </div>` : `
            <button onclick="window.__bhx_addCart('${encodeURIComponent(JSON.stringify(p))}')"
                    class="w-full bg-[#007E42] hover:bg-[#006133] text-white font-bold text-xs py-1.5 rounded-full flex items-center justify-center gap-1 shadow-sm transition-all">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
              Chọn mua
            </button>`}
        </div>`;
    }).join('');
  }

  // ─── CATEGORY PRODUCT SECTIONS ────────────────────────────────────
  function renderCategoryProducts() {
    const container = document.getElementById('categories-container');
    if (!container) return;
    const cats = data.categories || {};
    const keys = Object.keys(cats);
    if (keys.length === 0) {
      container.innerHTML = '<div class="p-8 text-center text-gray-400 text-sm">Đang tải sản phẩm...</div>';
      return;
    }

    container.innerHTML = keys.map((title, idx) => {
      const items = (cats[title] || []).filter(p => !state.searchQuery || p.name.toLowerCase().includes(state.searchQuery.toLowerCase()));
      if (items.length === 0) return '';
      // Show max 8 for each section
      const shown = items.slice(0, 8);

      return `
        <section id="cat-${idx}" class="mb-2 bg-white">
          <div class="flex items-center justify-between px-4 pt-4 pb-2 border-b border-gray-100">
            <div class="flex items-center gap-2">
              <span class="w-1 h-5 bg-[#007E42] rounded-full inline-block"></span>
              <h2 class="text-[15px] font-bold text-gray-900 uppercase tracking-tight">${title}</h2>
              <span class="text-[11px] bg-green-50 text-green-700 font-semibold px-1.5 py-0.5 rounded-full">${items.length} sp</span>
            </div>
            <a href="javascript:void(0)" class="text-[12px] text-[#007E42] font-semibold hover:underline flex items-center gap-0.5">
              Xem tất cả <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </a>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-[1px] bg-gray-100">
            ${shown.map(p => {
              const inCart = state.cart.find(c => c.name === p.name);
              return `
                <div class="product-card group bg-white p-3 flex flex-col justify-between relative">
                  ${p.discountPercent > 0 ? `
                    <div class="absolute top-2 left-2 z-10 bg-red-600 text-white font-black text-[10px] px-1 py-[1px] rounded">
                      -${p.discountPercent}%
                    </div>` : ''}
                  <div class="absolute top-2 right-2 z-10 bg-emerald-600 text-white text-[9px] font-semibold px-1 py-[1px] rounded">
                    Giao 2h
                  </div>
                  <div class="relative w-full aspect-square overflow-hidden rounded-lg mb-2 cursor-pointer bg-gray-50 flex items-center justify-center"
                       onclick="window.__bhx_showProductDetail('${encodeURIComponent(JSON.stringify(p))}')">
                    <img src="${p.avatar}" alt="${p.name}"
                         class="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                         onerror="this.src='https://cdnv2-tmdt.tgdd.vn/bhx/product-fe/cart/home/_next/public/static/images/default-image.svg'">
                  </div>
                  <div class="flex-1">
                    <h3 class="text-[12px] font-medium text-gray-800 line-clamp-2 leading-snug mb-1 cursor-pointer hover:text-[#007E42]"
                        onclick="window.__bhx_showProductDetail('${encodeURIComponent(JSON.stringify(p))}')">${p.name}</h3>
                    <div class="text-[11px] text-gray-400 mb-1">ĐVT: ${p.unit || 'gói'}</div>
                    <div class="flex items-baseline gap-1 mb-2">
                      <span class="text-[13px] font-bold text-[#007E42]">${fmt(p.price)}</span>
                      ${p.originalPrice > p.price ? `<span class="text-[10px] text-gray-400 line-through">${fmt(p.originalPrice)}</span>` : ''}
                    </div>
                  </div>
                  ${inCart ? `
                    <div class="flex items-center justify-between border border-green-600 rounded-full px-2 py-1 bg-[#F0FFF3]">
                      <button onclick="window.__bhx_updateQty('${p.name}',-1)" class="w-6 h-6 rounded-full bg-white text-green-700 font-bold hover:bg-green-100 flex items-center justify-center text-sm">−</button>
                      <span class="text-xs font-bold text-green-800">${inCart.quantity}</span>
                      <button onclick="window.__bhx_updateQty('${p.name}',1)" class="w-6 h-6 rounded-full bg-[#007E42] text-white font-bold hover:bg-green-700 flex items-center justify-center text-sm">+</button>
                    </div>` : `
                    <button onclick="window.__bhx_addCart('${encodeURIComponent(JSON.stringify(p))}')"
                            class="w-full bg-[#007E42] hover:bg-[#006133] text-white font-bold text-[11px] py-1.5 rounded-full flex items-center justify-center gap-1 shadow-sm transition-all">
                      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                      Chọn mua
                    </button>`}
                </div>`;
            }).join('')}
          </div>
        </section>`;
    }).join('');
  }

  // ─── TẾT TRUNG THU ──────────────────────────────────────────────────────
  function renderTetTrungThu() {
    const el = document.getElementById('tet-trung-thu-section');
    if (!el) return;
    const d = data.tetTrungThu;
    if (!d) return;
    const tabs = d.tabs || [];
    const products = d.products || [];

    el.innerHTML = `
      <div class="bg-white">
        <!-- Header row: red bg + tabs -->
        <div class="bg-[#B71C1C] px-3 sm:px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h2 class="text-[16px] sm:text-[18px] font-black text-white uppercase tracking-wide">TẾT TRUNG THU</h2>
          <div class="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 sm:pb-0" style="scrollbar-width:none">
            ${tabs.map((tab, i) => `
              <button class="shrink-0 text-[11px] sm:text-[12px] font-semibold px-2.5 sm:px-3 py-1 rounded-full border transition-all
                            ${i === 0 ? 'bg-red-600 text-white border-white' : 'bg-transparent text-white border-white/60 hover:border-white'}"
                      onclick="window.__bhxTTT(${i}, this)">
                ${tab}
              </button>`).join('')}
          </div>
        </div>
        <!-- Products row -->
        <div class="flex overflow-x-auto gap-0 bg-[#B71C1C] pb-3 px-2" style="scrollbar-width:none">
          ${products.map(p => `
            <div class="shrink-0 w-[150px] sm:w-[170px] mx-1 bg-white rounded-lg overflow-hidden flex flex-col cursor-pointer hover:shadow-md transition-shadow">
              <!-- Ingredients list -->
              ${p.ingredients && p.ingredients.length ? `
                <div class="bg-gray-50 px-2 py-1.5 text-[10px] text-gray-600 leading-tight border-b border-gray-100">
                  ${p.ingredients.slice(0,4).map(ing => `• ${ing}`).join('<br>')}
                </div>` : ''}
              <!-- Product image -->
              <div class="relative bg-white flex items-center justify-center" style="height:120px">
                ${p.badge ? `<div class="absolute top-2 left-2 z-10 bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded">${p.badge}</div>` : ''}
                ${p.discountPercent > 0 ? `<div class="absolute top-2 right-2 z-10 bg-red-600 text-white text-[10px] font-black px-1 py-[2px] rounded">-${p.discountPercent}%</div>` : ''}
                <img src="${p.avatar}" alt="${p.name}"
                     class="w-full h-full object-contain p-1"
                     onerror="this.onerror=null;this.style='background:#f3f4f7;padding:8px';this.src='https://cdnv2-tmdt.tgdd.vn/bhx/product-fe/cart/home/_next/public/static/images/default-image.svg'">
              </div>
              <!-- Bill promo banner -->
              ${p.bill ? `<div class="bg-[#B71C1C] text-white text-[9px] font-bold px-2 py-1 text-center leading-tight">${p.bill}</div>` : ''}
              <!-- Info -->
              <div class="p-2 flex-1 flex flex-col">
                <div class="text-[11px] text-gray-700 line-clamp-2 leading-snug mb-1">${p.name}</div>
                <div class="text-[11px] text-gray-400 mb-1">${p.unit}</div>
                <div class="flex items-baseline gap-1 mb-1">
                  <span class="text-[14px] font-black text-gray-900">${fmt(p.price)}</span>
                  ${p.originalPrice > p.price ? `<span class="text-[10px] text-gray-400 line-through">${fmt(p.originalPrice)}</span>` : ''}
                </div>
                ${p.promo ? `<div class="text-[11px] font-bold text-[#F8A61A] mb-2">${p.promo}</div>` : ''}
                <button onclick="window.__bhx_addCart('${encodeURIComponent(JSON.stringify(p))}')"
                        class="mt-auto w-full py-1.5 text-[12px] font-bold text-[#007E42] border border-[#007E42]
                               rounded hover:bg-[#007E42] hover:text-white transition-colors">
                  MUA
                </button>
              </div>
            </div>`).join('')}
        </div>
      </div>`;

    window.__bhxTTT = (idx, btn) => {
      btn.closest('.bg-\\[\\#B71C1C\\]').querySelectorAll('button').forEach((b, i) => {
        b.className = b.className.replace('bg-red-600 text-white border-white', 'bg-transparent text-white border-white/60 hover:border-white');
        if (i === idx) b.className = b.className.replace('bg-transparent text-white border-white/60 hover:border-white', 'bg-red-600 text-white border-white');
      });
    };
  }

  // ─── SIÊU TIẾT KIỆM ─────────────────────────────────────────────────────
  function renderSieuTietKiem() {
    const el = document.getElementById('sieu-tiet-kiem-section');
    if (!el) return;
    const d = data.sieuTietKiem;
    if (!d) return;
    const stores = d.stores || [];
    const brandRows = d.brandRows || [];
    const banner = d.banner || {};

    el.innerHTML = `
      <div class="bg-white">
        <!-- Big promotional banner -->
        <div class="relative overflow-hidden" style="min-height:160px;background:linear-gradient(135deg,#e53935,#e53935 40%,#fff 40%)">
          <div class="flex flex-col sm:flex-row items-stretch">
            <!-- Left red area -->
            <div class="w-full sm:w-[180px] shrink-0 bg-[#e53935] flex sm:flex-col items-center justify-between sm:justify-center text-white p-3 sm:p-4">
              <div class="text-[11px] font-bold border-2 sm:border-4 border-white rounded px-2 py-0.5 sm:py-1 mb-0 sm:mb-2 tracking-widest">SIÊU TIẾT KIỆM</div>
              <div class="hidden sm:block text-[22px] font-black leading-tight text-center">TIẾT<br>KIỆM</div>
            </div>
            <!-- Center product image placeholder -->
            <div class="flex-1 relative overflow-hidden bg-white flex items-center justify-center p-2 min-h-[130px] sm:min-h-[190px]">
              <img src="${banner.image}" alt="Siêu tiết kiệm"
                   class="max-h-[140px] sm:max-h-[190px] w-auto object-contain"
                   onerror="this.onerror=null;if('${banner.fallback}')this.src='${banner.fallback}'">
            </div>
            <!-- Right text area -->
            <div class="w-full sm:w-[200px] shrink-0 bg-yellow-300 flex flex-col items-center justify-center p-3 sm:p-4 text-center">
              <div class="text-[18px] sm:text-[22px] font-black text-[#e53935] leading-tight">TẶNG NGAY 25.000Đ</div>
              <div class="text-[12px] sm:text-[13px] font-semibold text-gray-800 mt-1 leading-snug">${banner.subtitle || 'Khi Mua 1 Thùng Vinamilk 220ML'}</div>
              <div class="text-[10px] sm:text-[11px] text-gray-500 mt-1">* Phiếu giảm dùng cho đơn tiếp theo</div>
            </div>
          </div>
          <!-- Slider dots -->
          <div class="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex gap-1.5">
            <div class="w-5 h-1.5 sm:h-2 bg-[#007E42] rounded-full"></div>
            ${[1,2,3,4,5,6,7,8,9].map(() => '<div class="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-300 rounded-full"></div>').join('')}
          </div>
        </div>
        <!-- Brand logo rows -->
        ${brandRows.map((row, ri) => `
          <div class="px-3 py-2 border-b border-gray-100 flex items-center gap-4 overflow-x-auto" style="background:#FFFDE7;scrollbar-width:none">
            ${row.map(brand => `
              <span class="text-[11px] font-bold text-gray-700 whitespace-nowrap shrink-0 px-1">${brand}</span>`).join('<span class="text-gray-300 shrink-0">|</span>')}
          </div>`).join('')}
        <!-- Brand store cards -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-[1px] bg-gray-200">
          ${stores.map(s => `
            <div class="bg-yellow-400 flex flex-col items-center justify-between p-3 cursor-pointer hover:brightness-105 transition-all" style="min-height:160px">
              <div class="w-full flex-1 flex items-center justify-center p-2" style="min-height:80px">
                <img src="${s.image}" alt="${s.name}"
                     class="max-w-[100px] max-h-[75px] object-contain bg-white rounded-lg p-2 shadow-sm"
                     onerror="this.onerror=null;this.src='https://cdnv2-tmdt.tgdd.vn/bhx/product-fe/cart/home/_next/public/static/images/default-image.svg'">
              </div>
              <div class="text-center mt-2">
                <div class="text-[12px] font-semibold text-gray-800">${s.name}</div>
                <div class="text-[16px] font-black text-[#007E42] leading-tight">${s.discount}</div>
                <div class="mt-1 bg-[#007E42] text-white text-[11px] font-semibold px-3 py-1 rounded-full">${s.label}</div>
              </div>
            </div>`).join('')}
        </div>
      </div>`;
  }

  // ─── PROMO BANNER GRID TOP (images 5-8, nằm trước HÔM NAY ĂN GÌ) ──────────
  function renderPromoBannerGrid() {
    const items = data.promoBannerGrid;
    if (!items || items.length === 0) return;

    const renderCard = (item) => `
      <div class="relative overflow-hidden cursor-pointer group bg-gray-100" style="aspect-ratio:1/1">
        <img src="${item.image}" alt="${item.title}"
             class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
             onerror="this.onerror=null;this.src='${item.fallback || 'https://cdn.tgdd.vn/bachhoaxanh/productsuggest/187868-202508151626153362.jpg'}'">
        <div class="absolute bottom-0 left-0 right-0 p-2.5 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
          <div class="text-white text-[12px] font-bold leading-snug drop-shadow">${item.label}</div>
        </div>
      </div>`;

    // TOP: items 4-7 (images 5-8) – hiển thị TRÊN, trước HÔM NAY ĂN GÌ
    const topEl = document.getElementById('promo-banner-grid-section');
    if (topEl) {
      const topItems = items.slice(4, 8);
      topEl.innerHTML = `
        <div class="bg-white">
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-[2px] bg-gray-200">
            ${topItems.map(renderCard).join('')}
          </div>
        </div>`;
    }

    // BOTTOM: items 0-3 (images 1-4) – hiển thị SAU sản phẩm
    const botEl = document.getElementById('promo-banner-grid-bottom');
    if (botEl) {
      const botItems = items.slice(0, 4);
      botEl.innerHTML = `
        <div class="bg-white">
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-[2px] bg-gray-200">
            ${botItems.map(renderCard).join('')}
          </div>
        </div>`;
    }
  }

  // ─── CATEGORY IMAGE GRID (2×4) ───────────────────────────────────────────
  function renderCategoryImageGrid() {
    const el = document.getElementById('category-image-grid-section');
    if (!el) return;
    const items = data.categoryImageGrid;
    if (!items || items.length === 0) return;

    const renderTile = (tile) => `
      <a href="${tile.url || '#'}" class="relative overflow-hidden cursor-pointer group block ${tile.bg || 'bg-[#F4F5F7]'} p-3 flex flex-col justify-between"
         style="aspect-ratio:1/1">
        <div class="flex-1 flex items-center justify-center p-1">
          <img src="${tile.image}" alt="${tile.name.replace(/\\n/,' ')}"
               class="max-w-[75%] max-h-[75%] object-contain group-hover:scale-110 transition-transform duration-300 drop-shadow-sm"
               onerror="this.onerror=null;this.src='https://cdnv2-tmdt.tgdd.vn/bhx/product-fe/cart/home/_next/public/static/images/default-image.svg'">
        </div>
        <div class="pt-1">
          <div class="text-gray-900 text-[13px] font-black leading-tight whitespace-pre-line">${tile.name}</div>
          <div class="mt-1 inline-block bg-[#007E42] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">${tile.label}</div>
        </div>
      </a>`;

    const row1 = items.slice(0, 4);
    const row2 = items.slice(4, 8);

    el.innerHTML = `
      <div class="bg-white">
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-[2px] bg-gray-200">
          ${row1.map(renderTile).join('')}
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-[2px] bg-gray-200 mt-[2px]">
          ${row2.map(renderTile).join('')}
        </div>
      </div>`;
  }

  // ─── HÔM NAY ĂN GÌ? ─────────────────────────────────────────────────────
  function renderHomNayAnGi() {
    const el = document.getElementById('hom-nay-an-gi-section');
    if (!el) return;
    const d = data.homNayAnGi;
    if (!d) return;
    const tabs = d.tabs || [];
    const recipes = d.recipes || [];

    el.innerHTML = `
      <div class="bg-white">
        <!-- Header -->
        <div class="px-4 pt-3 pb-0">
          <div class="flex items-baseline gap-2 mb-1">
            <h2 class="text-[16px] font-black text-gray-900 uppercase">HÔM NAY ĂN GÌ?</h2>
          </div>
          <div class="text-[11px] text-[#007E42] font-semibold mb-2">(Hàng tươi sống không hài lòng 1 đổi 2)</div>
          <!-- Tabs -->
          <div class="flex gap-2 overflow-x-auto pb-2" style="scrollbar-width:none">
            ${tabs.map((tab, i) => `
              <button id="hna-tab-${i}"
                      class="shrink-0 relative text-[12px] font-semibold px-3 py-1 rounded-full border transition-all
                             ${tab.active ? 'bg-[#007E42] text-white border-[#007E42]' : 'bg-white text-gray-700 border-gray-300 hover:border-[#007E42]'}"
                      onclick="window.__bhxHNA(${i})">
                ${tab.name}
                ${tab.discount ? `<span class="absolute -top-1.5 -right-1 bg-red-500 text-white text-[8px] font-black px-1 rounded-full leading-tight">${tab.discount}</span>` : ''}
              </button>`).join('')}
          </div>
        </div>
        <!-- Recipe cards -->
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-[2px] bg-gray-200">
          ${recipes.map(r => `
            <div class="relative overflow-hidden cursor-pointer group bg-white flex flex-col justify-between" style="aspect-ratio:1/1">
              <div class="flex-1 overflow-hidden relative">
                <img src="${r.image}" alt="${r.name}"
                     class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                     onerror="this.onerror=null;this.src='https://cdnv2-tmdt.tgdd.vn/bhx/product-fe/cart/home/_next/public/static/images/default-image.svg'">
              </div>
              <div class="bg-white/95 py-1.5 px-2 border-t border-gray-100">
                <div class="text-[11px] font-medium text-gray-800 truncate" title="${r.name}">${r.name}</div>
                <div class="text-[10px] font-bold text-[#007E42] uppercase tracking-wide">MUA NGUYÊN LIỆU</div>
              </div>
            </div>`).join('')}
        </div>
      </div>`;

    window.__bhxHNA = (idx) => {
      tabs.forEach((t, i) => {
        const btn = document.getElementById(`hna-tab-${i}`);
        if (!btn) return;
        if (i === idx) {
          btn.className = btn.className.replace('bg-white text-gray-700 border-gray-300 hover:border-[#007E42]', 'bg-[#007E42] text-white border-[#007E42]');
        } else {
          btn.className = btn.className.replace('bg-[#007E42] text-white border-[#007E42]', 'bg-white text-gray-700 border-gray-300 hover:border-[#007E42]');
        }
      });
    };
  }

  // ─── CART DRAWER ──────────────────────────────────────────────────
  function renderCartDrawer() {
    const list = document.getElementById('drawer-cart-list');
    const empty = document.getElementById('drawer-empty-cart');
    const subtotalEl = document.getElementById('drawer-subtotal');
    const shippingEl = document.getElementById('drawer-shipping');
    const totalEl = document.getElementById('drawer-total');
    if (!list) return;

    const subtotal = state.cart.reduce((s, i) => s + i.price * i.quantity, 0);
    const shipping = subtotal >= 300000 || subtotal === 0 ? 0 : 25000;
    const total = subtotal + shipping;

    if (subtotalEl) subtotalEl.textContent = fmt(subtotal);
    if (shippingEl) shippingEl.textContent = shipping === 0 ? 'Miễn phí' : fmt(shipping);
    if (totalEl) totalEl.textContent = fmt(total);

    if (state.cart.length === 0) {
      list.innerHTML = '';
      if (empty) empty.style.display = 'flex';
      return;
    }
    if (empty) empty.style.display = 'none';
    list.innerHTML = state.cart.map(item => `
      <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
        <img src="${item.avatar}" alt="${item.name}"
             class="w-14 h-14 object-contain rounded bg-white p-1 shrink-0 border"
             onerror="this.src='https://cdnv2-tmdt.tgdd.vn/bhx/product-fe/cart/home/_next/public/static/images/default-image.svg'">
        <div class="flex-1 min-w-0">
          <h4 class="text-xs font-semibold text-gray-800 line-clamp-2 leading-snug">${item.name}</h4>
          <div class="text-[11px] text-gray-500">ĐVT: ${item.unit}</div>
          <div class="text-xs font-bold text-[#007E42]">${fmt(item.price)}</div>
        </div>
        <div class="flex items-center gap-1.5 shrink-0">
          <button onclick="window.__bhx_updateQty('${item.name}',-1)"
                  class="w-7 h-7 rounded-full border bg-white text-gray-700 font-bold hover:bg-gray-100 flex items-center justify-center text-base leading-none">−</button>
          <span class="text-xs font-bold w-5 text-center">${item.quantity}</span>
          <button onclick="window.__bhx_updateQty('${item.name}',1)"
                  class="w-7 h-7 rounded-full border bg-white text-gray-700 font-bold hover:bg-gray-100 flex items-center justify-center text-base leading-none">+</button>
        </div>
      </div>`).join('');
  }

  function setupCartDrawer() {
    const cartBtn = document.getElementById('btn-open-cart');
    const mobCartBtn = document.getElementById('btn-mobile-cart');
    const botCartBtn = document.getElementById('btn-bottom-cart');
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-overlay');
    const closeBtn = document.getElementById('cart-drawer-close');

    function openCart() { renderCartDrawer(); drawer.classList.remove('translate-x-full'); overlay.classList.remove('opacity-0', 'pointer-events-none'); overlay.classList.add('opacity-100'); }
    function closeCart() { drawer.classList.add('translate-x-full'); overlay.classList.add('opacity-0', 'pointer-events-none'); overlay.classList.remove('opacity-100'); }

    if (cartBtn) cartBtn.onclick = openCart;
    if (mobCartBtn) mobCartBtn.onclick = openCart;
    if (botCartBtn) botCartBtn.onclick = openCart;
    if (overlay) overlay.onclick = closeCart;
    if (closeBtn) closeBtn.onclick = closeCart;

    const checkoutBtn = document.getElementById('btn-checkout');
    if (checkoutBtn) checkoutBtn.onclick = () => {
      if (state.cart.length === 0) { showToast('Giỏ hàng trống!', 'Vui lòng chọn mua sản phẩm'); return; }
      closeCart(); openCheckout();
    };
  }

  // ─── CHECKOUT ─────────────────────────────────────────────────────
  function openCheckout() {
    const modal = document.getElementById('checkout-modal');
    if (!modal) return;
    const subtotal = state.cart.reduce((s, i) => s + i.price * i.quantity, 0);
    const shipping = subtotal >= 300000 ? 0 : 25000;
    document.getElementById('checkout-total-val').textContent = fmt(subtotal + shipping);
    document.getElementById('checkout-location-val').textContent = state.location;
    modal.classList.remove('hidden');
  }

  // ─── LOCATION MODAL ───────────────────────────────────────────────
  function setupLocation() {
    const btn = document.getElementById('btn_choose_location');
    const mobBtn = document.getElementById('btn-mobile-location');
    const botBtn = document.getElementById('btn-bottom-location');
    const modal = document.getElementById('location-modal');
    const closeBtn = document.getElementById('close-location-modal');
    const saveBtn = document.getElementById('save-location-btn');
    const locText = document.getElementById('header-location-text');
    const mobLocText = document.getElementById('mobile-location-text');

    const updateText = (val) => {
      if (locText) locText.textContent = val;
      if (mobLocText) mobLocText.textContent = val.split(',')[0] || val;
    };
    updateText(state.location);

    const openModal = () => modal && modal.classList.remove('hidden');
    if (btn) btn.onclick = openModal;
    if (mobBtn) mobBtn.onclick = openModal;
    if (botBtn) botBtn.onclick = openModal;
    if (closeBtn && modal) closeBtn.onclick = () => modal.classList.add('hidden');
    if (saveBtn && modal) saveBtn.onclick = () => {
      const city = document.getElementById('select-city')?.value || 'Hồ Chí Minh';
      const dist = document.getElementById('select-dist')?.value || 'Quận 1';
      const ward = document.getElementById('select-ward')?.value || 'Phường Bến Nghé';
      state.location = `${city}, ${dist}, ${ward}`;
      localStorage.setItem('bhx_location', state.location);
      updateText(state.location);
      modal.classList.add('hidden');
      showToast('Đã đổi vị trí giao hàng', state.location);
    };
  }

  // ─── SEARCH ───────────────────────────────────────────────────────
  function setupSearch() {
    const pairs = [
      { input: document.getElementById('header-search-input'), btn: document.getElementById('header-search-btn'), box: document.getElementById('search-suggest-box') },
      { input: document.getElementById('mobile-search-input'), btn: document.getElementById('mobile-search-btn'), box: document.getElementById('mobile-search-suggest-box') }
    ];

    pairs.forEach(({ input, btn, box }) => {
      if (!input || !box) return;

      input.addEventListener('input', e => {
        const q = e.target.value.trim().toLowerCase();
        state.searchQuery = q;
        pairs.forEach(p => { if (p.input && p.input !== input) p.input.value = e.target.value; });

        if (!q) { box.classList.add('hidden'); renderCategoryProducts(); return; }

        const all = Object.values(data.categories || {}).flat();
        const matches = all.filter(p => p.name.toLowerCase().includes(q)).slice(0, 8);
        if (matches.length > 0) {
          box.innerHTML = `
            <div class="p-2 border-b text-[11px] font-bold text-gray-500 uppercase bg-gray-50 tracking-wide">Sản phẩm gợi ý</div>
            ${matches.map(p => `
              <div class="flex items-center gap-3 p-2.5 hover:bg-[#F0FFF3] cursor-pointer border-b border-gray-50 transition-colors"
                   onclick="window.__bhx_showProductDetail('${encodeURIComponent(JSON.stringify(p))}')">
                <img src="${p.avatar}" class="w-10 h-10 object-contain rounded bg-gray-50 border shrink-0"
                     onerror="this.src='https://cdnv2-tmdt.tgdd.vn/bhx/product-fe/cart/home/_next/public/static/images/default-image.svg'">
                <div class="flex-1 min-w-0">
                  <div class="text-[12px] font-semibold text-gray-800 truncate">${p.name}</div>
                  <div class="text-[12px] font-bold text-[#007E42]">${fmt(p.price)}</div>
                </div>
              </div>`).join('')}`;
          box.classList.remove('hidden');
        } else {
          box.innerHTML = `<div class="p-4 text-center text-xs text-gray-500">Không tìm thấy "<b>${q}</b>"</div>`;
          box.classList.remove('hidden');
        }
        renderCategoryProducts();
      });

      if (btn) btn.onclick = () => { box.classList.add('hidden'); renderCategoryProducts(); };
      input.addEventListener('keydown', e => { if (e.key === 'Enter') { box.classList.add('hidden'); renderCategoryProducts(); } });
    });

    document.addEventListener('click', e => {
      pairs.forEach(({ input, box }) => {
        if (input && box && !input.contains(e.target) && !box.contains(e.target)) box.classList.add('hidden');
      });
    });
  }

  // ─── MODALS MISC ─────────────────────────────────────────────────
  function setupModals() {
    // Product modal close
    const pModal = document.getElementById('product-detail-modal');
    const pClose = document.getElementById('close-product-modal');
    if (pClose && pModal) pClose.onclick = () => pModal.classList.add('hidden');
    if (pModal) pModal.onclick = e => { if (e.target === pModal) pModal.classList.add('hidden'); };

    // Checkout modal
    const cModal = document.getElementById('checkout-modal');
    const cCancel = document.getElementById('btn-cancel-checkout');
    const cConfirm = document.getElementById('btn-confirm-order');
    const sModal = document.getElementById('order-success-modal');
    const sClose = document.getElementById('close-success-modal');

    if (cCancel && cModal) cCancel.onclick = () => cModal.classList.add('hidden');
    if (cConfirm && cModal && sModal) cConfirm.onclick = () => { cModal.classList.add('hidden'); sModal.classList.remove('hidden'); };
    if (sClose && sModal) sClose.onclick = () => { sModal.classList.add('hidden'); state.cart = []; saveCart(); renderCartDrawer(); };
  }

  // ─── INIT ─────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    renderSidebarMenu();
    renderStoryBadges();
    initBanners();
    renderTetTrungThu();
    renderSieuTietKiem();
    renderPromoBannerGrid();
    renderHomNayAnGi();
    initFlashSaleTimer();
    renderFlashSale();
    renderCategoryImageGrid();
    renderCategoryProducts();
    setupCartDrawer();
    setupLocation();
    setupModals();
    setupSearch();
    updateCartBadge();
  });

})();
