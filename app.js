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

  function addToCart(product, qty = 1) {
    if (!product) return;
    qty = Math.max(1, parseInt(qty, 10) || 1);
    const existing = state.cart.find(i => i.name === product.name);
    if (existing) { existing.quantity += qty; }
    else { state.cart.push({ name: product.name, avatar: product.avatar, price: product.price, unit: product.unit || 'gói', quantity: qty }); }
    saveCart();
    showToast(qty > 1 ? `Đã thêm ${qty} sản phẩm vào giỏ` : 'Đã thêm vào giỏ hàng', product.name);
  }

  function updateCartQuantity(name, delta) {
    const item = state.cart.find(i => i.name === name);
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) state.cart = state.cart.filter(i => i.name !== name);
    saveCart();
    renderCartDrawer();
  }

  window.__bhx_addCart = (enc, qty = 1) => {
    try {
      const p = typeof enc === 'string' ? JSON.parse(decodeURIComponent(enc)) : enc;
      addToCart(p, qty);
    } catch (e) { }
  };
  window.__bhx_updateQty = (name, delta) => updateCartQuantity(name, delta);

  // Quick view modal
  window.__bhx_showQuickView = (enc) => {
    try {
      const p = typeof enc === 'string' ? JSON.parse(decodeURIComponent(enc)) : enc;
      state.activeModalProduct = p;
      const modal = document.getElementById('product-detail-modal');
      if (!modal) return;
      document.getElementById('detail-modal-img').src = p.avatar;
      document.getElementById('detail-modal-title').textContent = p.name;
      document.getElementById('detail-modal-price').textContent = fmt(p.price);
      document.getElementById('detail-modal-unit').textContent = p.unit || 'gói';
      const op = document.getElementById('detail-modal-orig-price');
      if (op) { op.textContent = p.originalPrice > p.price ? fmt(p.originalPrice) : ''; op.style.display = p.originalPrice > p.price ? 'inline' : 'none'; }
      const discountTag = document.getElementById('detail-modal-discount-tag');
      if (discountTag) {
        if (p.discountPercent > 0) {
          discountTag.textContent = `-${p.discountPercent}%`;
          discountTag.style.display = 'inline-block';
        } else {
          discountTag.style.display = 'none';
        }
      }
      const addBtn = document.getElementById('detail-modal-add-btn');
      if (addBtn) addBtn.onclick = () => { addToCart(p, 1); modal.classList.add('hidden'); };
      modal.classList.remove('hidden');
    } catch (e) { }
  };

  // Navigates directly to full Product Detail Page
  window.__bhx_showProductDetail = (enc) => {
    try {
      const p = typeof enc === 'string' ? JSON.parse(decodeURIComponent(enc)) : enc;
      navigateToProduct(p);
    } catch (e) {
      console.error('Error navigating to product:', e);
    }
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

  // ─── CART BADGE & TOTALS ──────────────────────────────────────────
  function updateCartBadge() {
    const total = state.cart.reduce((s, i) => s + i.quantity, 0);
    const subtotal = state.cart.reduce((s, i) => s + (i.price * i.quantity), 0);
    const badge = document.getElementById('cart-badge');
    const mobBadge = document.getElementById('mobile-cart-badge');
    const botBadge = document.getElementById('bottom-cart-badge');
    const floatBadge = document.getElementById('floating-cart-badge');
    const drawerCount = document.getElementById('drawer-cart-count');
    const headerTotal = document.getElementById('cart-header-total');
    const floatTotal = document.getElementById('floating-cart-total');

    if (badge) { badge.textContent = total; badge.style.display = total > 0 ? 'flex' : 'none'; }
    if (mobBadge) { mobBadge.textContent = total; mobBadge.style.display = total > 0 ? 'flex' : 'none'; }
    if (botBadge) { botBadge.textContent = total; botBadge.style.display = total > 0 ? 'flex' : 'none'; }
    if (floatBadge) { floatBadge.textContent = total; floatBadge.style.display = total > 0 ? 'flex' : 'none'; }
    if (drawerCount) drawerCount.textContent = `(${total})`;
    if (headerTotal) headerTotal.textContent = fmt(subtotal);
    if (floatTotal) floatTotal.textContent = fmt(subtotal);
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
          <div class="w-[24px] h-[24px] rounded-full bg-[#EF5121]/10 flex items-center justify-center shrink-0 text-[#EF5121]">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
          </div>
        `;
        return `
          <div class="relative group/m">
            <a href="#cat-${idx}"
               class="flex items-center justify-between px-3 py-[9px] text-[13px] text-[#333] 
                      hover:bg-[#FFF5F0] hover:text-[#EF5121] border-b border-[#f3f4f7] transition-colors cursor-pointer">
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
              <div class="hidden group-hover/m:flex absolute left-full top-0 w-[min(540px,calc(100vw-300px))] bg-white border border-gray-200 
                          shadow-2xl rounded-r-2xl z-[100] p-4 min-h-[300px] max-h-[520px] overflow-y-auto flex-col gap-3 border-l-4 border-[#EF5121]">
                <div class="text-[14px] font-bold text-[#EF5121] border-b border-orange-100 pb-2.5 flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <img src="${menu.icon}" alt="" class="w-5 h-5 object-contain" onerror="this.style.display='none'">
                    <span>${menu.name}</span>
                  </div>
                  <a href="#cat-${idx}" class="text-xs text-gray-500 font-normal hover:text-[#EF5121]">Xem tất cả &rarr;</a>
                </div>
                <div class="grid grid-cols-2 gap-2">
                  ${menu.childrens.map(child => `
                    <a href="#cat-${idx}" class="flex items-center gap-2.5 p-2 rounded-xl bg-gray-50/80 hover:bg-[#FFF5F0] border border-gray-100 hover:border-orange-200 text-gray-800 hover:text-[#EF5121] transition-all group/item shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                      <div class="w-10 h-10 rounded-lg bg-white p-1 border border-gray-200 shrink-0 flex items-center justify-center overflow-hidden group-hover/item:scale-105 transition-transform">
                        <img src="${child.icon || menu.icon}" class="w-full h-full object-contain" alt="${child.name}" onerror="this.src='${menu.icon}'">
                      </div>
                      <span class="text-[12px] font-medium leading-snug line-clamp-2">${child.name}</span>
                    </a>`).join('')}
                </div>
              </div>` : ''}
          </div>`;
      }).join('');
    }

    // ─── BHX MOBILE CATEGORY MENU (2-column layout + Green header) ───
    const mobileSidebar = document.getElementById('mobile-cat-sidebar');
    const mobileContent = document.getElementById('mobile-cat-content');
    const searchInput = document.getElementById('mobile-category-search');
    const searchClear = document.getElementById('mobile-category-search-clear');
    const btnHome = document.getElementById('mobile-category-home');

    let currentActiveCat = 'hot'; // 'hot' or integer index 0..N

    const formatCategoryShortName = (name) => {
      if (!name) return '';
      const n = name.trim();
      if (n.includes('THỰC PHẨM ĐÔNG MÁT')) return 'Thực phẩm đông mát';
      if (n.includes('TRÀ - CÀ PHÊ')) return 'Trà, cà phê';
      if (n.includes('SỮA & CHẾ PHẨM')) return 'Sữa các loại';
      if (n.includes('BÁNH KẸO - ĐỒ ĂN VẶT')) return 'Bánh kẹo';
      if (n.includes('DẦU ĂN - NƯỚC CHẤM')) return 'Dầu ăn, gia vị';
      if (n.includes('GẠO - BỘT - ĐỒ KHÔ')) return 'Gạo, đồ khô';
      if (n.includes('MÌ - MIẾN - CHÁO')) return 'Mì, miến, cháo';
      if (n.includes('CHĂM SÓC CÁ NHÂN')) return 'Chăm sóc cá nhân';
      if (n.includes('VỆ SINH NHÀ CỬA')) return 'Vệ sinh nhà cửa';
      if (n.includes('ĐỒ GIA DỤNG')) return 'Đồ gia dụng';
      if (n.includes('VĂN PHÒNG PHẨM')) return 'Văn phòng phẩm';
      if (n.includes('ĐỒ ĐIỆN MÁY')) return 'Đồ điện máy';
      if (n.includes('THỜI TRANG')) return 'Thời trang';
      return n;
    };

    // Hot promotion categories
    const hotPromoItems = [
      {
        name: 'Thịt heo - bò - gà tươi',
        icon: 'https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8686/image-2453_202410151405041250.png',
        targetIdx: 0,
        badge: 'Giảm 25%'
      },
      {
        name: 'Rau củ - Trái cây tươi',
        icon: 'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/7/image/production/2026/7/image/Products/8788/5367299/nho-do-nhap-khau_202607231308359257.jpg',
        targetIdx: 0,
        badge: 'Tươi mỗi ngày'
      },
      {
        name: 'Bia - Nước ngọt xả kho',
        icon: 'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/6/image/2488/frame-127_202606091637580998.png',
        targetIdx: 1,
        badge: 'Giảm sâu'
      },
      {
        name: 'Sữa tươi & Sữa chua',
        icon: 'https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/7091/7091_202410101515241537.png',
        targetIdx: 3,
        badge: 'Mua 1 tặng 1'
      },
      {
        name: 'Dầu ăn & Gia vị giá sốc',
        icon: 'https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/7148/1990379_202410101528079106.png',
        targetIdx: 5,
        badge: 'Trợ giá 20%'
      },
      {
        name: 'Gạo ngon & Đồ khô',
        icon: 'https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/2513/gao_202511010303353277.png',
        targetIdx: 6,
        badge: 'Bình ổn'
      },
      {
        name: 'Mì ăn liền thùng giá rẻ',
        icon: 'https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/7147/image-523_202410101609435656.png',
        targetIdx: 7,
        badge: 'Ưu đãi sốc'
      },
      {
        name: 'Nước giặt & Xả vải',
        icon: 'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/9/image/production/2026/9/image/Products/2464/5368613/nuoc-giat-ariel-cua-tren-huong-downy-nang-som-tui-405kg_202609161016208803.jpg',
        targetIdx: 9,
        badge: 'Giảm 35%'
      },
      {
        name: 'Nước rửa chén & Lau nhà',
        icon: 'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/8/image/production/2026/8/image/Products/2387/5368052/combo-nuoc-rua-chen-sunlight-3-1kg-va-lau-san-sunlight-2-7kg_202608051050022660.jpg',
        targetIdx: 9,
        badge: 'Combo rẻ'
      },
      {
        name: 'Sữa tắm & Dầu gội',
        icon: 'https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/2515/2515_202410110851071914.png',
        targetIdx: 8,
        badge: 'Sale 40%'
      },
      {
        name: 'Bánh kẹo & Ăn vặt',
        icon: 'https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/7143/7143_202410110835348807.png',
        targetIdx: 4,
        badge: 'Mua 2 tính 1'
      },
      {
        name: 'Đồ gia dụng nhà bếp',
        icon: 'https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/3185/120x120-24_202410101454508088.png',
        targetIdx: 10,
        badge: 'Giảm 50%'
      }
    ];

    function renderMobileSidebar() {
      if (!mobileSidebar) return;
      const isHotActive = currentActiveCat === 'hot';
      
      let html = `
        <div onclick="window.__bhx_switchMobileCategory('hot')"
             class="flex flex-col items-center justify-center p-2.5 text-center cursor-pointer transition-colors border-b border-gray-200/80 relative
                    ${isHotActive ? 'bg-white text-red-600 font-bold border-l-4 border-red-500 shadow-xs' : 'bg-[#F4F6F8] text-gray-700 hover:bg-gray-100 border-l-4 border-transparent'}">
          <div class="relative w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center font-black text-xs shadow-xs mb-1">
            %
          </div>
          <div class="text-[11px] font-bold text-red-600 leading-tight">Khuyến mãi Hot</div>
          <div class="text-[9px] text-gray-400 font-normal mt-0.5 leading-tight">(1.840 sp)</div>
        </div>
      `;

      menus.forEach((menu, idx) => {
        const isActive = currentActiveCat === idx;
        const shortName = formatCategoryShortName(menu.name);
        html += `
          <div onclick="window.__bhx_switchMobileCategory(${idx})"
               class="flex flex-col items-center justify-center p-2 text-center cursor-pointer transition-all border-b border-gray-200/60 relative
                      ${isActive ? 'bg-white text-[#007E42] font-semibold border-l-4 border-[#007E42] shadow-xs' : 'bg-[#F4F6F8] text-gray-700 hover:bg-gray-100 border-l-4 border-transparent'}">
            <div class="w-10 h-10 mb-1 flex items-center justify-center shrink-0">
              <img src="${menu.icon}" alt="${menu.name}" class="w-full h-full object-contain ${isActive ? 'scale-105' : ''} transition-transform"
                   onerror="this.src='https://cdnv2-tmdt.tgdd.vn/bhx/product-fe/cart/home/_next/public/static/images/default-image.svg'">
            </div>
            <span class="text-[11px] leading-[13px] line-clamp-2 max-w-[85px]">${shortName}</span>
          </div>
        `;
      });

      mobileSidebar.innerHTML = html;
    }

    function renderMobileContent(searchQuery = '') {
      if (!mobileContent) return;

      const cleanStr = s => (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
      const q = cleanStr(searchQuery);

      if (q) {
        // Collect all subcategories across all menus
        const allSubs = [];
        menus.forEach((m, mIdx) => {
          (m.childrens || []).forEach(c => {
            allSubs.push({
              name: c.name,
              icon: c.icon || m.icon,
              parentIdx: mIdx,
              parentName: m.name
            });
          });
        });

        const matches = allSubs.filter(s => cleanStr(s.name).includes(q) || cleanStr(s.parentName).includes(q));

        if (matches.length === 0) {
          mobileContent.innerHTML = `
            <div class="py-12 flex flex-col items-center justify-center text-gray-400 text-center">
              <svg class="w-12 h-12 mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <div class="text-xs font-medium text-gray-600 mb-1">Không tìm thấy nhóm hàng "${searchQuery}"</div>
              <div class="text-[11px] text-gray-400">Vui lòng thử tìm kiếm bằng từ khóa khác</div>
            </div>
          `;
          return;
        }

        mobileContent.innerHTML = `
          <div class="text-[11px] text-gray-500 font-medium mb-3 flex items-center justify-between pb-1 border-b border-gray-100">
            <span>Kết quả tìm kiếm (${matches.length})</span>
          </div>
          <div class="grid grid-cols-3 gap-x-2 gap-y-3.5">
            ${matches.map(c => `
              <div class="flex flex-col items-center text-center cursor-pointer group active:scale-95 transition-all"
                   onclick="window.__bhx_selectMobileSubcategory(${c.parentIdx}, '${c.name.replace(/'/g, "\\'")}')">
                <div class="w-[66px] h-[66px] xs:w-[72px] xs:h-[72px] rounded-2xl bg-[#F0FDF4] border border-[#DCFCE7] flex items-center justify-center p-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] group-hover:border-[#86EFAC] group-hover:shadow transition-all">
                  <img src="${c.icon}" alt="${c.name}" class="w-full h-full object-contain group-hover:scale-105 transition-transform"
                       onerror="this.src='https://cdnv2-tmdt.tgdd.vn/bhx/product-fe/cart/home/_next/public/static/images/default-image.svg'">
                </div>
                <span class="text-[11px] text-gray-800 font-medium leading-[14px] mt-1.5 line-clamp-2 max-w-[85px] group-hover:text-[#007E42] transition-colors">
                  ${c.name}
                </span>
                <span class="text-[9px] text-gray-400 truncate max-w-[80px] mt-0.5">${formatCategoryShortName(c.parentName)}</span>
              </div>
            `).join('')}
          </div>
        `;
        return;
      }

      // If Hot Deals is active
      if (currentActiveCat === 'hot') {
        mobileContent.innerHTML = `
          <div class="text-[12px] font-bold text-red-600 mb-2.5 flex items-center gap-1.5 pb-1 border-b border-gray-100">
            <span class="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            <span>Khuyến Mãi Nổi Bật Hôm Nay</span>
          </div>
          <div class="grid grid-cols-3 gap-x-2 gap-y-3.5">
            ${hotPromoItems.map(item => `
              <div class="flex flex-col items-center text-center cursor-pointer group active:scale-95 transition-all relative"
                   onclick="window.__bhx_selectMobileSubcategory(${item.targetIdx}, '${item.name.replace(/'/g, "\\'")}')">
                <div class="w-[66px] h-[66px] xs:w-[72px] xs:h-[72px] rounded-2xl bg-[#FFF5F5] border border-red-100 flex items-center justify-center p-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] group-hover:border-red-300 group-hover:shadow transition-all relative">
                  <span class="absolute -top-1.5 -right-1 bg-red-600 text-white font-bold text-[8px] px-1 py-[1px] rounded-full shadow-xs">
                    ${item.badge}
                  </span>
                  <img src="${item.icon}" alt="${item.name}" class="w-full h-full object-contain group-hover:scale-105 transition-transform"
                       onerror="this.src='https://cdnv2-tmdt.tgdd.vn/bhx/product-fe/cart/home/_next/public/static/images/default-image.svg'">
                </div>
                <span class="text-[11px] text-gray-800 font-medium leading-[14px] mt-1.5 line-clamp-2 max-w-[85px] group-hover:text-red-600 transition-colors">
                  ${item.name}
                </span>
              </div>
            `).join('')}
          </div>
        `;
        return;
      }

      // Normal category selected
      const currentMenu = menus[currentActiveCat];
      if (!currentMenu) return;
      const subcategories = currentMenu.childrens || [];

      mobileContent.innerHTML = `
        <div class="text-[12px] font-bold text-gray-800 mb-2.5 flex items-center justify-between pb-1.5 border-b border-gray-100">
          <span class="truncate max-w-[180px]">${currentMenu.name}</span>
          <span class="text-[11px] text-gray-400 font-normal shrink-0">${subcategories.length} nhóm hàng</span>
        </div>
        <div class="grid grid-cols-3 gap-x-2 gap-y-3.5">
          ${subcategories.map(c => `
            <div class="flex flex-col items-center text-center cursor-pointer group active:scale-95 transition-all"
                 onclick="window.__bhx_selectMobileSubcategory(${currentActiveCat}, '${c.name.replace(/'/g, "\\'")}')">
              <div class="w-[66px] h-[66px] xs:w-[72px] xs:h-[72px] rounded-2xl bg-[#F0FDF4] border border-[#DCFCE7] flex items-center justify-center p-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] group-hover:border-[#86EFAC] group-hover:shadow transition-all">
                <img src="${c.icon || currentMenu.icon}" alt="${c.name}" class="w-full h-full object-contain group-hover:scale-105 transition-transform"
                     onerror="this.src='${currentMenu.icon || 'https://cdnv2-tmdt.tgdd.vn/bhx/product-fe/cart/home/_next/public/static/images/default-image.svg'}'">
              </div>
              <span class="text-[11px] xs:text-[11.5px] text-gray-800 font-medium leading-[14px] mt-1.5 line-clamp-2 max-w-[85px] group-hover:text-[#007E42] transition-colors">
                ${c.name}
              </span>
            </div>
          `).join('')}
        </div>
      `;
    }

    window.__bhx_switchMobileCategory = (catKey) => {
      currentActiveCat = catKey;
      if (searchInput) searchInput.value = '';
      if (searchClear) searchClear.classList.add('hidden');
      renderMobileSidebar();
      renderMobileContent();
      if (mobileContent) mobileContent.scrollTop = 0;
    };

    window.__bhx_selectMobileSubcategory = (catIdx, subName) => {
      window.__bhx_closeMobileDrawer();
      if (catIdx === 'hot') {
        const flashSale = document.getElementById('flash-sale');
        if (flashSale) {
          flashSale.scrollIntoView({ behavior: 'smooth', block: 'start' });
          return;
        }
      }
      const targetSec = document.getElementById(`cat-${catIdx}`);
      if (targetSec) {
        targetSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (subName) {
        window.__bhx_scrollCategoryByName(subName);
      }
    };

    if (searchInput) {
      searchInput.oninput = (e) => {
        const val = e.target.value.trim();
        if (val) {
          if (searchClear) searchClear.classList.remove('hidden');
        } else {
          if (searchClear) searchClear.classList.add('hidden');
        }
        renderMobileContent(val);
      };
    }

    if (searchClear) {
      searchClear.onclick = () => {
        if (searchInput) {
          searchInput.value = '';
          searchInput.focus();
        }
        searchClear.classList.add('hidden');
        renderMobileContent();
      };
    }

    if (btnHome) {
      btnHome.onclick = () => {
        window.__bhx_closeMobileDrawer();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      };
    }

    // Initial render of mobile drawer
    renderMobileSidebar();
    renderMobileContent();

    // Setup mobile drawer events
    window.__bhx_closeMobileDrawer = () => {
      const d = document.getElementById('mobile-category-drawer');
      const o = document.getElementById('mobile-category-overlay');
      if (d) d.classList.add('-translate-x-full');
      if (o) { o.classList.add('opacity-0', 'pointer-events-none'); o.classList.remove('opacity-100'); }
      document.body.style.overflow = '';
    };

    window.__bhx_openMobileDrawer = () => {
      const d = document.getElementById('mobile-category-drawer');
      const o = document.getElementById('mobile-category-overlay');
      if (d) d.classList.remove('-translate-x-full');
      if (o) { o.classList.remove('opacity-0', 'pointer-events-none'); o.classList.add('opacity-100'); }
      document.body.style.overflow = 'hidden';
      if (searchInput) searchInput.value = '';
      if (searchClear) searchClear.classList.add('hidden');
      renderMobileSidebar();
      renderMobileContent();
    };

    window.__bhx_toggleMobileSub = () => {};

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

  // ─── STORY BADGES (Lướt mượt mà, kéo chuột, lăn chuột, nút cuộn trái/phải) ────
  window.__bhx_scrollCategoryByName = (name) => {
    if (!name) return;
    if (window.location.hash.startsWith('#/san-pham/') || window.location.hash.startsWith('#/product/')) {
      window.location.hash = '#/';
      setTimeout(() => {
        window.__bhx_scrollCategoryByName(name);
      }, 120);
      return;
    }
    if (name.includes('TRUNG THU')) {
      const tet = document.getElementById('tet-trung-thu-section');
      if (tet) { tet.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
    }
    const keys = Object.keys(data.categories || {});
    const clean = (s) => (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
    const cleanTarget = clean(name);
    const words = cleanTarget.split(/\s+/).filter(w => w.length > 2);

    let foundIdx = -1;
    for (let i = 0; i < keys.length; i++) {
      const k = clean(keys[i]);
      if (k.includes(cleanTarget) || cleanTarget.includes(k) || words.some(w => k.includes(w))) {
        foundIdx = i;
        break;
      }
    }

    if (foundIdx >= 0) {
      const el = document.getElementById(`cat-${foundIdx}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
    const cat0 = document.getElementById('cat-0');
    if (cat0) cat0.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  function renderStoryBadges() {
    const track = document.getElementById('story-badges-track');
    if (!track) return;
    const badges = data.menuHeader || [];

    track.innerHTML = badges.map(b => `
      <a href="javascript:void(0)"
         onclick="window.__bhx_onBadgeClick(event, '${b.name.replace(/'/g, "\\'")}')"
         class="cate_name w-20 mr-2 flex cursor-pointer flex-col items-center justify-start px-1 py-1 
                hover:bg-[#FFF5F0] hover:text-[#EF5121] rounded-xl transition-all shrink-0 group select-none">
        <div class="relative mb-1 mx-auto flex items-center justify-center p-1 rounded-xl bg-gray-50 group-hover:bg-white group-hover:shadow-sm border border-transparent group-hover:border-orange-100 transition-all" style="width:62px;height:62px">
          <img alt="${b.name}"
               width="56" height="56"
               class="object-contain w-14 h-14 group-hover:scale-105 transition-transform"
               src="${b.icon}"
               onerror="this.src='https://cdnv2-tmdt.tgdd.vn/bhx/product-fe/cart/home/_next/public/static/images/default-image.svg'">
        </div>
        <div class="flex h-[32px] items-start">
          <div class="leading-[15px] text-[12px] font-medium text-gray-700 group-hover:text-[#EF5121] line-clamp-2 text-center transition-colors">${b.name}</div>
        </div>
      </a>`).join('');

    const prevWrap = document.getElementById('story-badges-prev-wrap');
    const nextWrap = document.getElementById('story-badges-next-wrap');
    const prevBtn = document.getElementById('story-badges-prev');
    const nextBtn = document.getElementById('story-badges-next');

    function updateNavButtons() {
      if (!track) return;
      const sl = track.scrollLeft;
      const maxScroll = track.scrollWidth - track.clientWidth;
      if (prevWrap) {
        if (sl > 10) {
          prevWrap.classList.remove('hidden');
          prevWrap.classList.add('flex');
        } else {
          prevWrap.classList.add('hidden');
          prevWrap.classList.remove('flex');
        }
      }
      if (nextWrap) {
        if (maxScroll > 10 && sl < maxScroll - 10) {
          nextWrap.classList.remove('hidden');
          nextWrap.classList.add('flex');
        } else {
          nextWrap.classList.add('hidden');
          nextWrap.classList.remove('flex');
        }
      }
    }

    if (prevBtn) {
      prevBtn.onclick = (e) => {
        e.preventDefault();
        track.scrollBy({ left: -320, behavior: 'smooth' });
      };
    }

    if (nextBtn) {
      nextBtn.onclick = (e) => {
        e.preventDefault();
        track.scrollBy({ left: 320, behavior: 'smooth' });
      };
    }

    track.addEventListener('scroll', updateNavButtons, { passive: true });
    window.addEventListener('resize', updateNavButtons);

    // Mouse drag to scroll
    let isDown = false;
    let startX = 0;
    let scrollStart = 0;
    let hasDragged = false;

    track.addEventListener('mousedown', (e) => {
      isDown = true;
      hasDragged = false;
      startX = e.pageX - track.offsetLeft;
      scrollStart = track.scrollLeft;
    });

    window.addEventListener('mouseup', () => {
      if (isDown) {
        isDown = false;
        setTimeout(() => { hasDragged = false; }, 60);
      }
    });

    track.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - track.offsetLeft;
      const walk = (x - startX) * 1.5;
      if (Math.abs(walk) > 5) hasDragged = true;
      track.scrollLeft = scrollStart - walk;
    });

    // Horizontal scroll on mouse wheel
    track.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        const canLeft = track.scrollLeft > 0 && e.deltaY < 0;
        const canRight = track.scrollLeft < track.scrollWidth - track.clientWidth && e.deltaY > 0;
        if (canLeft || canRight) {
          e.preventDefault();
          track.scrollLeft += e.deltaY * 0.9;
        }
      }
    }, { passive: false });

    window.__bhx_onBadgeClick = (e, name) => {
      if (hasDragged) {
        e.preventDefault();
        return;
      }
      window.__bhx_scrollCategoryByName(name);
    };

    setTimeout(updateNavButtons, 200);
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
        <div class="product-card group bg-white rounded-xl p-2 xs:p-2.5 sm:p-3 border border-gray-100 hover:border-orange-300 flex flex-col justify-between relative shadow-xs">
          <div class="absolute top-2 left-2 z-[2] bg-red-600 text-white font-black text-[10px] xs:text-[11px] px-1.5 py-[2px] rounded tag-discount-blink shadow-sm">
            -${p.discountPercent}%
          </div>
          <div class="absolute top-2 right-2 z-[2] bg-[#007E42] text-white font-semibold text-[9px] px-1.5 py-[2px] rounded shadow-2xs">
            Giao 2h
          </div>
          <div class="relative w-full aspect-square overflow-hidden rounded-lg mb-2 cursor-pointer bg-gray-50 flex items-center justify-center"
               onclick="window.__bhx_showProductDetail('${encodeURIComponent(JSON.stringify(p))}')">
            <img src="${p.avatar}" alt="${p.name}"
                 class="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                 onerror="this.src='https://cdnv2-tmdt.tgdd.vn/bhx/product-fe/cart/home/_next/public/static/images/default-image.svg'">
          </div>
          <div class="flex-1">
            <h3 class="text-[12px] font-medium text-gray-800 line-clamp-2 leading-snug mb-1 cursor-pointer hover:text-[#EF5121]"
                onclick="window.__bhx_showProductDetail('${encodeURIComponent(JSON.stringify(p))}')">${p.name}</h3>
            <div class="text-[11px] text-gray-400 mb-1">ĐVT: ${p.unit}</div>
            <div class="flex items-baseline gap-1.5 mb-1.5">
              <span class="text-[15px] xs:text-[16px] sm:text-[18px] font-black text-[#EF5121] tracking-tight">${fmt(p.price)}</span>
              ${p.originalPrice > p.price ? `<span class="text-[11px] text-gray-400 line-through">${fmt(p.originalPrice)}</span>` : ''}
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
                    class="w-full bg-[#007E42] hover:bg-[#006133] text-white font-bold text-xs py-1.5 rounded-full flex items-center justify-center gap-1 shadow-sm transition-all active:scale-95">
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
              <span class="w-1.5 h-5 bg-[#EF5121] rounded-full inline-block"></span>
              <h2 class="text-[15px] font-bold text-gray-900 uppercase tracking-tight">${title}</h2>
              <span class="text-[11px] bg-orange-50 text-[#EF5121] font-semibold px-2 py-0.5 rounded-full border border-orange-100">${items.length} sp</span>
            </div>
            <a href="javascript:void(0)" class="text-[12px] text-[#EF5121] font-semibold hover:underline flex items-center gap-0.5">
              Xem tất cả <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </a>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-[1px] bg-gray-100">
            ${shown.map(p => {
              const inCart = state.cart.find(c => c.name === p.name);
              return `
                <div class="product-card group bg-white p-2 xs:p-2.5 sm:p-3 flex flex-col justify-between relative hover:z-[3]">
                  ${p.discountPercent > 0 ? `
                    <div class="absolute top-2 left-2 z-[2] bg-red-600 text-white font-black text-[10px] xs:text-[11px] px-1.5 py-[2px] rounded tag-discount-blink shadow-sm">
                      -${p.discountPercent}%
                    </div>` : ''}
                  <div class="absolute top-2 right-2 z-[2] bg-emerald-600 text-white text-[9px] font-semibold px-1 py-[1px] rounded">
                    Giao 2h
                  </div>
                  <div class="relative w-full aspect-square overflow-hidden rounded-lg mb-2 cursor-pointer bg-gray-50 flex items-center justify-center"
                       onclick="window.__bhx_showProductDetail('${encodeURIComponent(JSON.stringify(p))}')">
                    <img src="${p.avatar}" alt="${p.name}"
                         class="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                         onerror="this.src='https://cdnv2-tmdt.tgdd.vn/bhx/product-fe/cart/home/_next/public/static/images/default-image.svg'">
                  </div>
                  <div class="flex-1">
                    <h3 class="text-[12px] font-medium text-gray-800 line-clamp-2 leading-snug mb-1 cursor-pointer hover:text-[#EF5121]"
                        onclick="window.__bhx_showProductDetail('${encodeURIComponent(JSON.stringify(p))}')">${p.name}</h3>
                    <div class="text-[11px] text-gray-400 mb-1">ĐVT: ${p.unit || 'gói'}</div>
                    <div class="flex items-baseline gap-1.5 mb-2">
                      <span class="text-[15px] xs:text-[16px] sm:text-[18px] font-black text-[#EF5121] tracking-tight">${fmt(p.price)}</span>
                      ${p.originalPrice > p.price ? `<span class="text-[11px] text-gray-400 line-through">${fmt(p.originalPrice)}</span>` : ''}
                    </div>
                  </div>
                  ${inCart ? `
                    <div class="flex items-center justify-between border border-green-600 rounded-full px-2 py-1 bg-[#F0FFF3]">
                      <button onclick="window.__bhx_updateQty('${p.name}',-1)" class="w-6 h-6 rounded-full bg-white text-green-700 font-bold hover:bg-green-100 flex items-center justify-center text-sm">−</button>
                      <span class="text-xs font-bold text-green-800">${inCart.quantity}</span>
                      <button onclick="window.__bhx_updateQty('${p.name}',1)" class="w-6 h-6 rounded-full bg-[#007E42] text-white font-bold hover:bg-green-700 flex items-center justify-center text-sm">+</button>
                    </div>` : `
                    <button onclick="window.__bhx_addCart('${encodeURIComponent(JSON.stringify(p))}')"
                            class="w-full bg-[#007E42] hover:bg-[#006133] text-white font-bold text-[11px] py-1.5 rounded-full flex items-center justify-center gap-1 shadow-sm transition-all active:scale-95">
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
              <!-- Product image -->
              <div class="relative bg-white flex items-center justify-center" style="height:130px"
                   onclick="window.__bhx_showProductDetail('${encodeURIComponent(JSON.stringify(p))}')">
                ${p.badge ? `<div class="absolute top-2 left-2 z-[2] bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded">${p.badge}</div>` : ''}
                ${p.discountPercent > 0 ? `<div class="absolute top-2 right-2 z-[2] bg-red-600 text-white text-[10px] font-black px-1.5 py-[2px] rounded tag-discount-blink shadow">-${p.discountPercent}%</div>` : ''}
                <img src="${p.avatar}" alt="${p.name}"
                     class="w-full h-full object-contain p-2 hover:scale-105 transition-transform duration-300"
                     onerror="this.onerror=null;this.style='background:#f3f4f7;padding:8px';this.src='https://cdnv2-tmdt.tgdd.vn/bhx/product-fe/cart/home/_next/public/static/images/default-image.svg'">
              </div>
              <!-- Bill promo banner -->
              ${p.bill ? `<div class="bg-[#B71C1C] text-white text-[9px] font-bold px-2 py-1 text-center leading-tight">${p.bill}</div>` : ''}
              <!-- Info -->
              <div class="p-2.5 flex-1 flex flex-col justify-between">
                <div>
                  <div class="text-[12px] font-medium text-gray-800 line-clamp-2 leading-snug mb-1 hover:text-[#EF5121]"
                       onclick="window.__bhx_showProductDetail('${encodeURIComponent(JSON.stringify(p))}')">${p.name}</div>
                  <div class="text-[11px] text-gray-400 mb-1">${p.unit}</div>
                  <div class="flex items-baseline gap-1 mb-1">
                    <span class="text-[16px] font-black text-[#EF5121]">${fmt(p.price)}</span>
                    ${p.originalPrice > p.price ? `<span class="text-[10px] text-gray-400 line-through">${fmt(p.originalPrice)}</span>` : ''}
                  </div>
                  ${p.promo ? `<div class="text-[11px] font-bold text-[#F8A61A] mb-2">${p.promo}</div>` : ''}
                </div>
                <button onclick="window.__bhx_addCart('${encodeURIComponent(JSON.stringify(p))}')"
                        class="mt-2 w-full py-1.5 text-[12px] font-bold text-[#007E42] border border-[#007E42]
                               rounded hover:bg-[#007E42] hover:text-white transition-all active:scale-95 shadow-xs">
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
          <div class="px-3 py-2 border-b border-yellow-200/50 flex items-center gap-3 sm:gap-4 overflow-x-auto bhx-scroll" style="background:#FFFDE7;scrollbar-width:none">
            ${row.map(brand => {
              const bName = typeof brand === 'string' ? brand : (brand && brand.name ? brand.name : '');
              const bLogo = typeof brand === 'object' && brand && brand.logo ? brand.logo : '';
              if (bLogo) {
                return `
                  <div class="h-6 sm:h-7 px-1.5 flex items-center justify-center shrink-0 hover:scale-105 transition-transform cursor-pointer"
                       onclick="window.__bhx_searchBrand('${bName.replace(/'/g, "\\'")}')" title="${bName}">
                    <img src="${bLogo}" alt="${bName}" class="h-5 sm:h-6 w-auto max-w-[75px] sm:max-w-[85px] object-contain"
                         onerror="this.style.display='none';this.nextElementSibling.style.display='inline'">
                    <span class="text-[11px] font-bold text-gray-700 whitespace-nowrap" style="display:none">${bName}</span>
                  </div>`;
              }
              return `
                <span class="text-[11px] font-bold text-gray-700 whitespace-nowrap shrink-0 px-1 cursor-pointer hover:text-[#EF5121]"
                      onclick="window.__bhx_searchBrand('${bName.replace(/'/g, "\\'")}')">${bName}</span>`;
            }).join('<span class="text-gray-300 shrink-0 select-none">|</span>')}
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

  window.__bhx_searchBrand = (name) => {
    if (!name) return;
    const input = document.getElementById('header-search-input');
    if (input) {
      input.value = name;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

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
          ${recipes.map((r, ri) => `
            <div class="relative overflow-hidden cursor-pointer group bg-white flex flex-col justify-between" style="aspect-ratio:1/1"
                 onclick="window.__bhx_showRecipe(${ri})">
              <div class="flex-1 overflow-hidden relative">
                <img src="${r.image}" alt="${r.name}"
                     class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                     onerror="this.onerror=null;this.src='https://cdnv2-tmdt.tgdd.vn/bhx/product-fe/cart/home/_next/public/static/images/default-image.svg'">
              </div>
              <div class="bg-white/95 py-1.5 px-2 border-t border-gray-100 flex items-center justify-between">
                <div class="text-[11px] font-medium text-gray-800 truncate flex-1 pr-1" title="${r.name}">${r.name}</div>
                <div class="text-[9px] sm:text-[10px] font-bold text-[#007E42] uppercase tracking-tight shrink-0 bg-green-50 px-1.5 py-0.5 rounded border border-green-200">MUA LIỀN</div>
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

  // ─── RECIPE & INGREDIENTS MODAL ──────────────────────────────────────
  window.__bhx_showRecipe = (idx) => {
    const d = data.homNayAnGi;
    if (!d || !d.recipes || !d.recipes[idx]) return;
    const r = d.recipes[idx];
    const modal = document.getElementById('recipe-modal');
    const content = document.getElementById('recipe-modal-content');
    if (!modal || !content) return;

    const ingTotal = (r.ingredients || []).reduce((s, item) => s + (item.price || 0), 0);

    content.innerHTML = `
      <div class="space-y-4">
        <!-- Top header -->
        <div class="flex flex-col sm:flex-row gap-4 items-center sm:items-start pb-4 border-b border-gray-100">
          <div class="w-full sm:w-44 h-40 rounded-xl overflow-hidden bg-gray-100 shrink-0 mx-auto">
            <img src="${r.image}" alt="${r.name}" class="w-full h-full object-cover" onerror="this.src='https://cdnv2-tmdt.tgdd.vn/bhx/product-fe/cart/home/_next/public/static/images/default-image.svg'">
          </div>
          <div class="flex-1 min-w-0">
            <span class="inline-block bg-emerald-50 text-[#007E42] border border-emerald-200 text-[11px] font-bold px-2 py-0.5 rounded-full mb-1">
              Món ngon mỗi ngày
            </span>
            <h3 class="text-base sm:text-lg font-black text-gray-900 leading-tight mb-1.5">${r.name}</h3>
            <p class="text-xs text-gray-600 leading-relaxed mb-3">${r.desc || ''}</p>
            <div class="flex flex-wrap items-center gap-2 text-xs text-gray-700">
              <span class="flex items-center gap-1 font-medium bg-gray-100 px-2 py-1 rounded-lg">⏱️ ${r.time || '30 phút'}</span>
              <span class="flex items-center gap-1 font-medium bg-gray-100 px-2 py-1 rounded-lg">👥 ${r.servings || '2 - 3 người'}</span>
              <span class="flex items-center gap-1 font-medium bg-gray-100 px-2 py-1 rounded-lg">⭐ Độ khó: <b>${r.difficulty || 'Dễ'}</b></span>
            </div>
          </div>
        </div>

        <!-- Recipe Steps -->
        ${r.steps && r.steps.length ? `
          <div>
            <h4 class="font-bold text-xs sm:text-sm text-gray-900 uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <span>🍳</span> Các bước thực hiện
            </h4>
            <div class="space-y-2">
              ${r.steps.map((st, i) => `
                <div class="flex items-start gap-2.5 text-xs text-gray-700 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                  <span class="w-5 h-5 rounded-full bg-[#007E42] text-white font-bold flex items-center justify-center shrink-0 text-[11px]">${i + 1}</span>
                  <span class="leading-relaxed flex-1">${st}</span>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Ingredients List -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <h4 class="font-bold text-xs sm:text-sm text-gray-900 uppercase tracking-wide flex items-center gap-1.5">
              <span>🛒</span> Nguyên liệu cần mua (${(r.ingredients || []).length})
            </h4>
            <span class="text-xs text-gray-500">Tạm tính: <b class="text-[#EF5121] font-bold">${fmt(ingTotal)}</b></span>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[220px] overflow-y-auto bhx-scroll pr-1">
            ${(r.ingredients || []).map(item => `
              <div class="flex items-center justify-between gap-2 p-2 rounded-xl bg-gray-50 border border-gray-100">
                <img src="${item.avatar}" alt="${item.name}" class="w-10 h-10 object-contain rounded bg-white p-0.5 shrink-0 border" onerror="this.src='https://cdnv2-tmdt.tgdd.vn/bhx/product-fe/cart/home/_next/public/static/images/default-image.svg'">
                <div class="flex-1 min-w-0">
                  <div class="text-xs font-semibold text-gray-800 line-clamp-1">${item.name}</div>
                  <div class="text-[11px] font-bold text-[#EF5121]">${fmt(item.price)}</div>
                </div>
                <button type="button" class="px-2.5 py-1 bg-[#007E42] hover:bg-[#006133] text-white text-[11px] font-bold rounded-lg shadow-2xs active:scale-95 transition-transform"
                        onclick="window.__bhx_addCart('${encodeURIComponent(JSON.stringify(item))}')">
                  + Mua
                </button>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Add All Ingredients Button -->
        <button type="button"
                class="w-full bg-[#EF5121] hover:bg-[#D84214] text-white font-bold py-3 rounded-xl text-xs sm:text-sm uppercase tracking-wide shadow flex items-center justify-center gap-2 active:scale-98 transition-all"
                onclick="window.__bhx_addAllIngredients(${idx})">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
          Thêm tất cả nguyên liệu vào giỏ (${fmt(ingTotal)})
        </button>
      </div>
    `;

    modal.classList.remove('hidden');
  };

  window.__bhx_addAllIngredients = (idx) => {
    const d = data.homNayAnGi;
    if (!d || !d.recipes || !d.recipes[idx]) return;
    const r = d.recipes[idx];
    (r.ingredients || []).forEach(item => addToCart(item));
    const modal = document.getElementById('recipe-modal');
    if (modal) modal.classList.add('hidden');
    showToast('Đã thêm đủ nguyên liệu vào giỏ!', r.name);
  };

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
    const floatCartBtn = document.getElementById('floating-cart-widget');
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-overlay');
    const closeBtn = document.getElementById('cart-drawer-close');

    function openCart() { renderCartDrawer(); drawer.classList.remove('translate-x-full'); overlay.classList.remove('opacity-0', 'pointer-events-none'); overlay.classList.add('opacity-100'); }
    function closeCart() { drawer.classList.add('translate-x-full'); overlay.classList.add('opacity-0', 'pointer-events-none'); overlay.classList.remove('opacity-100'); }

    if (cartBtn) cartBtn.onclick = openCart;
    if (mobCartBtn) mobCartBtn.onclick = openCart;
    if (botCartBtn) botCartBtn.onclick = openCart;
    if (floatCartBtn) floatCartBtn.onclick = openCart;
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

  // ─── SEARCH (BHX: gợi ý xu hướng & sản phẩm thiết yếu khi bấm/focus) ────────
  const POPULAR_SEARCH_KEYWORDS = [
    'Mì Hảo Hảo', 'Trứng gà', 'Dầu ăn Simply', 'Gạo ST25', 'Sữa tươi', 'Bia Tiger', 'Nước mắm Nam Ngư', 'Ba rọi heo'
  ];

  function getEssentialSuggestions() {
    const all = Object.values(data.categories || {}).flat();
    const staples = [
      all.find(p => p.name.includes('Hảo Hảo')),
      all.find(p => p.name.includes('Ba rọi') || p.name.includes('heo')),
      all.find(p => p.name.includes('Nutimilk') || p.name.includes('TH true MILK') || p.name.includes('Vinamilk')),
      all.find(p => p.name.includes('Nam Ngư') || p.name.includes('nước mắm')),
      all.find(p => p.name.includes('Meizan') || p.name.includes('Simply')),
      all.find(p => p.name.includes('ST25') || p.name.includes('Gạo'))
    ].filter(Boolean);

    return staples.length >= 4 ? staples : (data.flashSale || []).slice(0, 6);
  }

  function renderSearchDefaultPanel(box) {
    const essentials = getEssentialSuggestions();
    box.innerHTML = `
      <div class="p-3 bg-gradient-to-r from-orange-50/80 to-amber-50/60 border-b border-orange-100">
        <div class="flex items-center gap-1.5 text-[11px] font-black text-gray-800 uppercase tracking-wide mb-2.5">
          <span class="text-orange-500">🔥</span> Xu hướng tìm kiếm
        </div>
        <div class="flex flex-wrap gap-1.5">
          ${POPULAR_SEARCH_KEYWORDS.map(kw => `
            <button type="button" class="text-[12px] bg-white hover:bg-[#FFF5F0] hover:text-[#EF5121] hover:border-orange-300 text-gray-700 px-2.5 py-1 rounded-full border border-gray-200 transition-all font-medium flex items-center gap-1 cursor-pointer shadow-2xs active:scale-95"
                    onclick="window.__bhx_searchKeyword('${kw}')">
              <svg class="w-3 h-3 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              <span>${kw}</span>
            </button>
          `).join('')}
        </div>
      </div>
      <div class="p-3 bg-white">
        <div class="flex items-center justify-between px-1 mb-2.5">
          <div class="flex items-center gap-1.5 text-[12px] font-black text-[#EF5121] uppercase tracking-wide">
            <span>⚡</span> Sản phẩm thiết yếu gợi ý
          </div>
          <span class="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">Giao siêu tốc 2h</span>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-1">
          ${essentials.map(p => `
            <div class="flex items-center gap-2.5 p-2 rounded-xl bg-gray-50/80 hover:bg-[#FFF5F0] border border-gray-100 hover:border-orange-200 transition-all group/item cursor-pointer relative shadow-2xs"
                 onclick="window.__bhx_showProductDetail('${encodeURIComponent(JSON.stringify(p))}')">
              <div class="w-12 h-12 rounded-lg bg-white p-1 border border-gray-200 shrink-0 flex items-center justify-center overflow-hidden">
                <img src="${p.avatar}" class="w-full h-full object-contain group-hover/item:scale-105 transition-transform" alt="${p.name}" onerror="this.src='https://cdnv2-tmdt.tgdd.vn/bhx/product-fe/cart/home/_next/public/static/images/default-image.svg'">
              </div>
              <div class="flex-1 min-w-0 pr-7">
                <div class="text-[12px] font-medium text-gray-800 line-clamp-1 leading-tight group-hover/item:text-[#EF5121]">${p.name}</div>
                <div class="flex items-baseline gap-1 mt-1">
                  <span class="text-[14px] font-black text-[#EF5121]">${fmt(p.price)}</span>
                  ${p.originalPrice > p.price ? `<span class="text-[10px] text-gray-400 line-through">${fmt(p.originalPrice)}</span>` : ''}
                </div>
              </div>
              <button type="button" class="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#EF5121] hover:bg-[#D84214] text-white flex items-center justify-center shadow font-bold text-xs active:scale-90 transition-transform"
                      title="Thêm vào giỏ"
                      onclick="event.stopPropagation(); window.__bhx_addCart('${encodeURIComponent(JSON.stringify(p))}')">
                +
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    box.classList.remove('hidden');
  }

  function renderSearchResults(box, matches, q) {
    if (matches.length > 0) {
      box.innerHTML = `
        <div class="p-2.5 border-b text-[11px] font-bold text-gray-500 uppercase bg-gray-50 tracking-wide flex items-center justify-between">
          <span>Kết quả cho: "<b class="text-gray-800">${q}</b>"</span>
          <span class="text-[#EF5121] font-bold">${matches.length} sản phẩm</span>
        </div>
        <div class="divide-y divide-gray-100 max-h-[350px] overflow-y-auto">
          ${matches.map(p => `
            <div class="flex items-center gap-3 p-2.5 hover:bg-[#FFF5F0] cursor-pointer transition-colors relative"
                 onclick="window.__bhx_showProductDetail('${encodeURIComponent(JSON.stringify(p))}')">
              <img src="${p.avatar}" class="w-12 h-12 object-contain rounded-lg bg-white p-1 border border-gray-100 shrink-0"
                   onerror="this.src='https://cdnv2-tmdt.tgdd.vn/bhx/product-fe/cart/home/_next/public/static/images/default-image.svg'">
              <div class="flex-1 min-w-0 pr-8">
                <div class="text-[12px] font-semibold text-gray-800 truncate hover:text-[#EF5121]">${p.name}</div>
                <div class="text-[10px] text-gray-400 mt-0.5">ĐVT: ${p.unit || 'gói'}</div>
                <div class="flex items-baseline gap-1.5 mt-0.5">
                  <span class="text-[15px] font-black text-[#EF5121]">${fmt(p.price)}</span>
                  ${p.originalPrice > p.price ? `<span class="text-[11px] text-gray-400 line-through">${fmt(p.originalPrice)}</span>` : ''}
                  ${p.discountPercent > 0 ? `<span class="text-[10px] font-black text-red-600 bg-red-50 px-1 rounded tag-discount-blink">-${p.discountPercent}%</span>` : ''}
                </div>
              </div>
              <button type="button" class="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-[#EF5121] hover:bg-[#D84214] text-white flex items-center justify-center shadow font-bold text-xs shrink-0 active:scale-90 transition-transform"
                      title="Thêm vào giỏ"
                      onclick="event.stopPropagation(); window.__bhx_addCart('${encodeURIComponent(JSON.stringify(p))}')">
                +
              </button>
            </div>
          `).join('')}
        </div>
      `;
      box.classList.remove('hidden');
    } else {
      box.innerHTML = `
        <div class="p-6 text-center text-xs text-gray-500">
          <div class="text-3xl mb-2">🔍</div>
          <div>Không tìm thấy sản phẩm nào với từ khóa "<b>${q}</b>"</div>
          <div class="mt-3 text-[11px] text-gray-400">Gợi ý từ khóa: <a href="javascript:void(0)" onclick="window.__bhx_searchKeyword('Hảo Hảo')" class="text-[#EF5121] underline font-bold">Hảo Hảo</a>, <a href="javascript:void(0)" onclick="window.__bhx_searchKeyword('Gạo')" class="text-[#EF5121] underline font-bold">Gạo</a>, <a href="javascript:void(0)" onclick="window.__bhx_searchKeyword('Dầu ăn')" class="text-[#EF5121] underline font-bold">Dầu ăn</a></div>
        </div>
      `;
      box.classList.remove('hidden');
    }
  }

  function setupSearch() {
    const pairs = [
      { input: document.getElementById('header-search-input'), btn: document.getElementById('header-search-btn'), box: document.getElementById('search-suggest-box') },
      { input: document.getElementById('mobile-search-input'), btn: document.getElementById('mobile-search-btn'), box: document.getElementById('mobile-search-suggest-box') }
    ];

    window.__bhx_searchKeyword = (kw) => {
      state.searchQuery = kw.toLowerCase();
      pairs.forEach(p => {
        if (p.input) p.input.value = kw;
        if (p.box) p.box.classList.add('hidden');
      });
      renderCategoryProducts();
      const firstCat = document.getElementById('cat-0');
      if (firstCat) firstCat.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    pairs.forEach(({ input, btn, box }) => {
      if (!input || !box) return;

      input.addEventListener('focus', () => {
        if (!input.value.trim()) {
          renderSearchDefaultPanel(box);
        }
      });

      input.addEventListener('click', () => {
        if (!input.value.trim()) {
          renderSearchDefaultPanel(box);
        }
      });

      input.addEventListener('input', e => {
        const q = e.target.value.trim().toLowerCase();
        state.searchQuery = q;
        pairs.forEach(p => { if (p.input && p.input !== input) p.input.value = e.target.value; });

        if (!q) {
          renderSearchDefaultPanel(box);
          renderCategoryProducts();
          return;
        }

        const all = Object.values(data.categories || {}).flat();
        const matches = all.filter(p => p.name.toLowerCase().includes(q)).slice(0, 10);
        renderSearchResults(box, matches, q);
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
    // Product modal close & view full page
    const pModal = document.getElementById('product-detail-modal');
    const pClose = document.getElementById('close-product-modal');
    const pViewPage = document.getElementById('detail-modal-view-page-btn');
    if (pClose && pModal) pClose.onclick = () => pModal.classList.add('hidden');
    if (pModal) pModal.onclick = e => { if (e.target === pModal) pModal.classList.add('hidden'); };
    if (pViewPage) {
      pViewPage.onclick = () => {
        if (state.activeModalProduct) {
          if (pModal) pModal.classList.add('hidden');
          navigateToProduct(state.activeModalProduct);
        }
      };
    }

    // Recipe modal close
    const rModal = document.getElementById('recipe-modal');
    const rClose = document.getElementById('close-recipe-modal');
    if (rClose && rModal) rClose.onclick = () => rModal.classList.add('hidden');
    if (rModal) rModal.onclick = e => { if (e.target === rModal) rModal.classList.add('hidden'); };

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

  // ─── PRODUCT DETAIL PAGE & SPA ROUTER ─────────────────────────────
  function slugify(s) {
    return (s || '').toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[đĐ]/g, "d")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function getProductCategory(product) {
    if (!product) return 'Thực phẩm & Nhu yếu phẩm';
    for (const [catName, items] of Object.entries(data.categories || {})) {
      if (items.some(item => item.name === product.name || (product.id && item.id === product.id))) {
        return catName;
      }
    }
    return 'Thực phẩm & Nhu yếu phẩm';
  }

  function findProduct(identifier) {
    if (!identifier) return null;
    const decoded = decodeURIComponent(identifier).trim();
    const allCats = Object.values(data.categories || {}).flat();
    const all = [...allCats, ...(data.flashSale || [])];

    // 1. Match by exact ID
    let found = all.find(p => p.id === decoded || p.id === identifier);
    if (found) return found;

    // 2. Match by Slug
    found = all.find(p => slugify(p.name) === decoded || slugify(p.name) === identifier);
    if (found) return found;

    // 3. Match by Name
    found = all.find(p => p.name.toLowerCase() === decoded.toLowerCase());
    if (found) return found;

    // 4. Partial match
    found = all.find(p => p.name.toLowerCase().includes(decoded.toLowerCase()));
    return found || null;
  }

  function getRelatedProducts(product, limit = 5) {
    const catName = getProductCategory(product);
    const items = (data.categories[catName] || []).filter(item => item.name !== product.name);
    if (items.length >= limit) return items.slice(0, limit);
    const all = Object.values(data.categories || {}).flat().filter(item => item.name !== product.name);
    return all.slice(0, limit);
  }

  function navigateToProduct(product) {
    if (!product) return;
    const pModal = document.getElementById('product-detail-modal');
    if (pModal) pModal.classList.add('hidden');
    const suggestBoxes = document.querySelectorAll('#search-suggest-box, #mobile-search-suggest-box');
    suggestBoxes.forEach(b => b.classList.add('hidden'));
    document.body.classList.remove('overflow-hidden');

    state.activeProduct = product;
    const slug = product.id || slugify(product.name);
    window.location.hash = `#/san-pham/${slug}`;
  }

  window.__bhx_navigateToHome = () => {
    window.location.hash = '#/';
  };

  window.__bhx_navigateToProduct = (p) => {
    navigateToProduct(p);
  };

  window.__bhx_shareProduct = (name) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Đã sao chép liên kết sản phẩm', name);
    } else {
      showToast('Chia sẻ sản phẩm', name);
    }
  };

  window.__bhx_toggleFav = (btn) => {
    if (btn) {
      const isFav = btn.getAttribute('data-fav') === 'true';
      btn.setAttribute('data-fav', String(!isFav));
      btn.innerHTML = !isFav ? '<span class="text-red-500">❤️</span> <span class="text-red-600 font-bold">Đã thích</span>' : '<span class="text-red-500">🤍</span> <span>Yêu thích</span>';
      showToast(!isFav ? 'Đã thêm vào yêu thích' : 'Đã bỏ yêu thích', '');
    }
  };

  function renderProductDetailPage(p) {
    const container = document.getElementById('product-detail-layout');
    if (!container) return;

    if (!p) {
      container.innerHTML = `
        <div class="max-w-screen-xl mx-auto px-4 py-16 text-center">
          <div class="text-5xl mb-4">🔍</div>
          <h2 class="text-xl font-bold text-gray-800 mb-2">Không tìm thấy thông tin sản phẩm</h2>
          <p class="text-gray-500 text-sm mb-6">Sản phẩm này có thể đã hết hàng hoặc đường dẫn không chính xác.</p>
          <button onclick="window.__bhx_navigateToHome()"
                  class="bg-[#EF5121] hover:bg-[#D84214] text-white font-bold py-2.5 px-6 rounded-full text-sm shadow-md transition-all active:scale-95 cursor-pointer">
            Quay về trang chủ
          </button>
        </div>
      `;
      return;
    }

    const catName = getProductCategory(p);
    const related = getRelatedProducts(p, 5);
    const discount = p.discountPercent || (p.originalPrice > p.price ? Math.round((1 - p.price / p.originalPrice) * 100) : 0);
    const origPrice = p.originalPrice || (discount > 0 ? Math.round(p.price / (1 - discount / 100)) : p.price);
    const savings = origPrice > p.price ? (origPrice - p.price) : 0;
    const rating = p.rating || '4.8';
    const sold = p.soldCount || p.sold || 142;
    const brand = p.brand || 'Bách Hóa Xanh';
    const sku = p.id || ('BHX-' + Math.abs(p.name.split('').reduce((a, c) => (a << 5) - a + c.charCodeAt(0), 0) % 900000 + 100000));

    container.innerHTML = `
      <div class="max-w-screen-xl mx-auto px-2.5 sm:px-4 py-3 md:py-4">

        <!-- 1. BREADCRUMBS & TOP NAV -->
        <div class="mb-3.5 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
          <div class="flex items-center gap-1.5 flex-wrap">
            <button onclick="window.__bhx_navigateToHome()"
                    type="button"
                    class="inline-flex items-center gap-1 font-bold text-gray-700 hover:text-[#EF5121] bg-white px-2.5 py-1.5 rounded-lg border border-gray-200 hover:border-orange-300 shadow-2xs transition-all active:scale-95 cursor-pointer">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
              <span>Trang chủ</span>
            </button>
            <span class="text-gray-300">/</span>
            <a href="javascript:void(0)" onclick="window.__bhx_scrollCategoryByName('${catName.replace(/'/g, "\\'")}')"
               class="hover:text-[#EF5121] hover:underline font-medium text-gray-600 transition-colors">${catName}</a>
            ${p.subCategory ? `<span class="text-gray-300">/</span><span class="text-gray-600 font-medium">${p.subCategory}</span>` : ''}
            <span class="text-gray-300">/</span>
            <span class="text-gray-900 font-bold truncate max-w-[160px] xs:max-w-[220px] sm:max-w-[340px] md:max-w-[460px]">${p.name}</span>
          </div>

          <div class="flex items-center gap-2">
            <button onclick="window.__bhx_shareProduct('${p.name.replace(/'/g, "\\'")}')"
                    type="button"
                    class="inline-flex items-center gap-1 text-[11px] font-semibold text-gray-600 hover:text-[#EF5121] bg-white px-2.5 py-1.5 rounded-lg border border-gray-200 hover:border-orange-300 shadow-2xs transition-all cursor-pointer">
              <svg class="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
              <span>Chia sẻ</span>
            </button>
            <button onclick="window.__bhx_toggleFav(this)"
                    type="button"
                    class="inline-flex items-center gap-1 text-[11px] font-semibold text-gray-600 hover:text-red-500 bg-white px-2.5 py-1.5 rounded-lg border border-gray-200 hover:border-red-200 shadow-2xs transition-all cursor-pointer">
              <span class="text-red-500">❤️</span>
              <span>Yêu thích</span>
            </button>
          </div>
        </div>

        <!-- 2. MAIN PRODUCT CARD (2 columns) -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-4">
          <div class="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-start">

            <!-- LEFT COLUMN: Gallery & Assurances (5 cols) -->
            <div class="md:col-span-5 lg:col-span-5 flex flex-col">
              <!-- Main Image Display -->
              <div class="relative w-full aspect-square bg-[#F9FAFB] rounded-2xl border border-gray-100 p-4 flex items-center justify-center overflow-hidden group/img select-none">
                ${discount > 0 ? `
                  <div class="absolute top-3 left-3 z-10 bg-red-600 text-white font-black text-xs sm:text-sm px-2.5 py-1 rounded-lg tag-discount-blink shadow-md">
                    -${discount}%
                  </div>` : ''}
                <div class="absolute top-3 right-3 z-10 bg-emerald-600 text-white font-bold text-[10px] sm:text-xs px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                  <span>⚡</span> Giao 2h
                </div>

                <img id="pdetail-main-img"
                     src="${p.avatar}"
                     alt="${p.name}"
                     class="max-w-full max-h-full object-contain transition-all duration-300 group-hover/img:scale-105"
                     onerror="this.src='https://cdnv2-tmdt.tgdd.vn/bhx/product-fe/cart/home/_next/public/static/images/default-image.svg'">

                <div class="absolute bottom-2.5 left-2.5 bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span>🥬</span> 100% Tươi ngon
                </div>
              </div>

              <!-- Thumbnails -->
              <div class="flex items-center gap-2 mt-3 overflow-x-auto pb-1" style="scrollbar-width:none">
                <button type="button"
                        onclick="document.getElementById('pdetail-main-img').src='${p.avatar}'; document.querySelectorAll('.pdetail-thumb-btn').forEach((b,idx)=>b.classList.toggle('border-[#EF5121]', idx===0));"
                        class="pdetail-thumb-btn w-16 h-16 rounded-xl border-2 border-[#EF5121] p-1 bg-gray-50 hover:border-[#EF5121] shrink-0 transition-all cursor-pointer flex items-center justify-center">
                  <img src="${p.avatar}" alt="thumbnail 1" class="w-full h-full object-contain" onerror="this.src='https://cdnv2-tmdt.tgdd.vn/bhx/product-fe/cart/home/_next/public/static/images/default-image.svg'">
                </button>
                <div class="w-16 h-16 rounded-xl border border-dashed border-gray-300 p-1 bg-gray-50 shrink-0 flex flex-col items-center justify-center text-[10px] text-gray-500 font-bold leading-tight text-center">
                  <span>🛡️</span>
                  <span>VietGAP</span>
                </div>
                <div class="w-16 h-16 rounded-xl border border-dashed border-gray-300 p-1 bg-gray-50 shrink-0 flex flex-col items-center justify-center text-[10px] text-gray-500 font-bold leading-tight text-center">
                  <span>❄️</span>
                  <span>Kho lạnh</span>
                </div>
                <div class="w-16 h-16 rounded-xl border border-dashed border-gray-300 p-1 bg-gray-50 shrink-0 flex flex-col items-center justify-center text-[10px] text-gray-500 font-bold leading-tight text-center">
                  <span>🚚</span>
                  <span>Giao 2h</span>
                </div>
              </div>

              <!-- 4 Trust Commitments -->
              <div class="mt-5 grid grid-cols-2 gap-2 text-xs text-gray-700 bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-100">
                <div class="flex items-center gap-2">
                  <span class="text-base text-[#007E42]">🛡️</span>
                  <span class="text-[11px] font-semibold leading-tight">100% Chính hãng tươi mới</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-base text-[#EF5121]">⚡</span>
                  <span class="text-[11px] font-semibold leading-tight">Giao nhanh trong 2 giờ</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-base text-blue-600">🔄</span>
                  <span class="text-[11px] font-semibold leading-tight">Không hài lòng 1 đổi 2</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-base text-cyan-600">❄️</span>
                  <span class="text-[11px] font-semibold leading-tight">Bảo quản lạnh tiêu chuẩn</span>
                </div>
              </div>
            </div>

            <!-- RIGHT COLUMN: Purchase Box & Information (7 cols) -->
            <div class="md:col-span-7 lg:col-span-7 flex flex-col">
              
              <!-- Brand & SKU -->
              <div class="flex flex-wrap items-center gap-2 mb-2">
                <span class="inline-block bg-blue-50 text-[#234090] text-xs font-bold px-2.5 py-0.5 rounded-md border border-blue-100">
                  Thương hiệu: <span class="underline">${brand}</span>
                </span>
                <span class="text-xs text-gray-400 font-mono">Mã SP: #${sku}</span>
              </div>

              <!-- Product Title -->
              <h1 class="text-xl sm:text-2xl font-black text-gray-900 leading-snug mb-2.5">
                ${p.name}
              </h1>

              <!-- Rating & Sold stats -->
              <div class="flex items-center gap-3 text-xs text-gray-600 mb-3.5 pb-3 border-b border-gray-100">
                <div class="flex items-center gap-1 text-amber-500 font-bold">
                  <span>⭐⭐⭐⭐⭐</span>
                  <span class="text-gray-900 font-black ml-0.5">${rating}</span>
                </div>
                <span class="text-gray-300">|</span>
                <span class="text-gray-600 hover:text-[#EF5121] cursor-pointer">184 đánh giá</span>
                <span class="text-gray-300">|</span>
                <span class="text-gray-600">Đã bán <b class="text-gray-900 font-bold">${sold}</b></span>
              </div>

              <!-- Price Box -->
              <div class="bg-gradient-to-r from-[#FFF5F0] via-[#FFF9F5] to-white p-4 sm:p-5 rounded-2xl border border-orange-200/80 mb-4 shadow-2xs">
                <div class="flex flex-wrap items-baseline gap-2.5 sm:gap-3">
                  <span id="pdetail-unit-price" class="text-[28px] sm:text-[34px] font-black text-[#EF5121] tracking-tight leading-none">
                    ${fmt(p.price)}
                  </span>
                  ${origPrice > p.price ? `
                    <span class="text-sm sm:text-base text-gray-400 line-through">
                      ${fmt(origPrice)}
                    </span>
                    <span class="bg-red-600 text-white font-black text-xs px-2 py-0.5 rounded tag-discount-blink">
                      -${discount}%
                    </span>
                    <span class="text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded border border-emerald-200">
                      Tiết kiệm ${fmt(savings)}
                    </span>
                  ` : ''}
                </div>
                <div class="text-[11px] text-gray-500 mt-1.5 flex items-center gap-1">
                  <span>✓</span> Giá đã bao gồm thuế GTGT (VAT) & đảm bảo chất lượng
                </div>

                <!-- Promotions & Vouchers -->
                <div class="mt-3.5 pt-3 border-t border-orange-100/80 space-y-2">
                  <div class="text-xs font-bold text-gray-800 uppercase tracking-wide flex items-center gap-1.5">
                    <span class="text-orange-500">🎁</span> Ưu Đãi Áp Dụng Hôm Nay:
                  </div>
                  <div class="flex items-start gap-2 text-xs text-gray-700 bg-white/80 p-2 rounded-lg border border-orange-100">
                    <span class="text-red-500 font-bold shrink-0">🎟️</span>
                    <span>Nhập mã <b class="text-[#EF5121] bg-orange-100 px-1 py-0.5 rounded font-mono">BHXTUOI15</b> giảm thêm 15.000₫ cho đơn hàng thực phẩm từ 200.000₫</span>
                  </div>
                  <div class="flex items-start gap-2 text-xs text-gray-700 bg-white/80 p-2 rounded-lg border border-orange-100">
                    <span class="text-emerald-600 font-bold shrink-0">🚚</span>
                    <span>Miễn phí vận chuyển tận nhà cho tất cả đơn hàng từ 300.000₫</span>
                  </div>
                </div>
              </div>

              <!-- Unit & Quantity Stepper -->
              <div class="space-y-3 mb-5">
                <div class="flex items-center gap-3">
                  <span class="text-xs sm:text-sm font-semibold text-gray-700">Đơn vị tính:</span>
                  <span class="inline-block bg-gray-100 text-gray-900 font-bold text-xs sm:text-sm px-3 py-1 rounded-lg border border-gray-200">
                    ${p.unit || 'gói'}
                  </span>
                </div>

                <div class="flex items-center gap-4 flex-wrap">
                  <span class="text-xs sm:text-sm font-semibold text-gray-700">Số lượng:</span>
                  <div class="flex items-center border-2 border-gray-300 rounded-xl overflow-hidden bg-white shadow-2xs">
                    <button type="button"
                            id="pdetail-qty-minus"
                            class="w-9 h-9 flex items-center justify-center text-gray-700 hover:bg-gray-100 font-bold text-base transition-colors cursor-pointer select-none">
                      −
                    </button>
                    <input type="number"
                           id="pdetail-qty-input"
                           value="1"
                           min="1"
                           max="99"
                           class="w-12 h-9 text-center font-bold text-sm text-gray-900 focus:outline-none border-x border-gray-200 bg-white">
                    <button type="button"
                            id="pdetail-qty-plus"
                            class="w-9 h-9 flex items-center justify-center text-gray-700 hover:bg-gray-100 font-bold text-base transition-colors cursor-pointer select-none">
                      +
                    </button>
                  </div>
                  <div class="text-xs text-gray-500">
                    Tạm tính: <b id="pdetail-total-price" class="text-base font-black text-[#EF5121] ml-1">${fmt(p.price)}</b>
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="flex flex-col sm:flex-row gap-3 mb-5">
                <!-- Add to cart -->
                <button type="button"
                        id="pdetail-btn-add"
                        class="flex-1 bg-[#EF5121] hover:bg-[#D84214] text-white font-extrabold text-sm sm:text-base py-3.5 px-5 rounded-xl shadow-lg shadow-orange-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                  </svg>
                  <span>THÊM VÀO GIỎ HÀNG</span>
                </button>

                <!-- Buy now -->
                <button type="button"
                        id="pdetail-btn-buy"
                        class="flex-1 bg-[#007E42] hover:bg-[#006133] text-white font-extrabold text-sm sm:text-base py-3.5 px-5 rounded-xl shadow-lg shadow-green-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer">
                  <span>⚡ MUA NGAY - GIAO 2H</span>
                </button>
              </div>

              <!-- Delivery location summary -->
              <div class="bg-gray-50 rounded-xl p-3 border border-gray-150 flex items-start gap-2.5 text-xs text-gray-700">
                <span class="text-base text-[#EF5121] shrink-0 mt-0.5">📍</span>
                <div class="flex-1 min-w-0">
                  <div>Giao đến: <b class="text-gray-900" id="pdetail-loc-text">${state.location}</b>
                    <button type="button" onclick="document.getElementById('btn_choose_location')?.click()" class="text-[#EF5121] underline font-bold ml-1 cursor-pointer">Đổi địa chỉ</button>
                  </div>
                  <div class="text-[11px] text-gray-500 mt-0.5">Dự kiến nhận hàng trước <b>21:00 hôm nay</b> nếu đặt ngay bây giờ.</div>
                </div>
              </div>

            </div>
          </div>
        </div>

        <!-- 3. SPECIFICATIONS & PRODUCT DESCRIPTION -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-4">
          <!-- Specifications Table (7 cols) -->
          <div class="lg:col-span-7 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5">
            <h3 class="text-sm sm:text-base font-black text-gray-900 uppercase tracking-wide mb-3 flex items-center gap-2 pb-2.5 border-b border-gray-100">
              <span class="w-1.5 h-4.5 bg-[#007E42] rounded-full inline-block"></span>
              <span>Thông tin chi tiết sản phẩm</span>
            </h3>

            <div class="divide-y divide-gray-100 text-xs">
              <div class="py-2.5 flex justify-between gap-4">
                <span class="text-gray-500 shrink-0 w-36">Tên sản phẩm</span>
                <span class="font-bold text-gray-800 text-right">${p.name}</span>
              </div>
              <div class="py-2.5 flex justify-between gap-4 bg-gray-50/60 px-2 rounded-lg">
                <span class="text-gray-500 shrink-0 w-36">Thương hiệu</span>
                <span class="font-bold text-[#234090] text-right">${brand}</span>
              </div>
              <div class="py-2.5 flex justify-between gap-4">
                <span class="text-gray-500 shrink-0 w-36">Danh mục</span>
                <span class="font-semibold text-gray-800 text-right">${catName}</span>
              </div>
              <div class="py-2.5 flex justify-between gap-4 bg-gray-50/60 px-2 rounded-lg">
                <span class="text-gray-500 shrink-0 w-36">Đơn vị tính / Quy cách</span>
                <span class="font-semibold text-gray-800 text-right">${p.unit || 'gói'}</span>
              </div>
              <div class="py-2.5 flex justify-between gap-4">
                <span class="text-gray-500 shrink-0 w-36">Nơi sản xuất</span>
                <span class="font-semibold text-gray-800 text-right">Việt Nam</span>
              </div>
              <div class="py-2.5 flex justify-between gap-4 bg-gray-50/60 px-2 rounded-lg">
                <span class="text-gray-500 shrink-0 w-36">Hạn sử dụng</span>
                <span class="font-semibold text-gray-800 text-right">Xem trên bao bì (Luôn có date mới nhất trong ngày)</span>
              </div>
              <div class="py-2.5 flex justify-between gap-4">
                <span class="text-gray-500 shrink-0 w-36">Thành phần</span>
                <span class="text-gray-700 text-right">100% nguyên liệu tươi sạch chuẩn chất lượng Bách Hóa Xanh</span>
              </div>
              <div class="py-2.5 flex justify-between gap-4 bg-gray-50/60 px-2 rounded-lg">
                <span class="text-gray-500 shrink-0 w-36">Bảo quản</span>
                <span class="text-gray-700 text-right">Nhiệt độ thích hợp theo hướng dẫn trên bao bì</span>
              </div>
            </div>
          </div>

          <!-- Description & Cooking Highlights (5 cols) -->
          <div class="lg:col-span-5 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5 flex flex-col justify-between">
            <div>
              <h3 class="text-sm sm:text-base font-black text-gray-900 uppercase tracking-wide mb-3 flex items-center gap-2 pb-2.5 border-b border-gray-100">
                <span class="w-1.5 h-4.5 bg-[#EF5121] rounded-full inline-block"></span>
                <span>Đặc điểm nổi bật & Cam kết</span>
              </h3>
              <div class="text-xs text-gray-700 space-y-2.5 leading-relaxed">
                <p>
                  Sản phẩm <b>${p.name}</b> được cung cấp bởi thương hiệu uy tín <b>${brand}</b>, được kiểm tra nghiêm ngặt về độ tươi ngon, nguồn gốc xuất xứ và an toàn vệ sinh thực phẩm trước khi giao đến tay người tiêu dùng.
                </p>
                <div class="bg-amber-50/80 p-3 rounded-xl border border-amber-200/70 space-y-1 text-[11px] text-amber-900">
                  <div class="font-bold flex items-center gap-1"><span>✨</span> Cam kết chuẩn Bách Hóa Xanh:</div>
                  <div>• Hàng tươi sống mới mỗi ngày, không để lưu kho qua đêm</div>
                  <div>• Không chất bảo quản độc hại, tuân thủ an toàn VietGAP</div>
                  <div>• Nếu hàng giao không tươi hoặc lỗi, hỗ trợ đổi 1 đổi 2 tận cửa</div>
                </div>
              </div>
            </div>

            <!-- Gợi ý món ngon -->
            <div class="mt-4 pt-3 border-t border-gray-100 bg-[#F0FFF3] p-3 rounded-xl border border-green-200">
              <div class="text-xs font-bold text-[#007E42] mb-1 flex items-center gap-1">
                <span>🍳</span> Gợi ý món ngon từ nguyên liệu này:
              </div>
              <div class="text-[11px] text-gray-700 leading-snug">
                Thích hợp chế biến các món xào, nấu canh, kho hoặc làm món ngon gia đình. Xem ngay mục <b>"Hôm Nay Ăn Gì?"</b> tại trang chủ để nhận công thức chi tiết!
              </div>
            </div>
          </div>
        </div>

        <!-- 4. CUSTOMER REVIEWS -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5 mb-4">
          <h3 class="text-sm sm:text-base font-black text-gray-900 uppercase tracking-wide mb-3 flex items-center gap-2 pb-2.5 border-b border-gray-100">
            <span class="w-1.5 h-4.5 bg-yellow-400 rounded-full inline-block"></span>
            <span>Đánh giá từ khách hàng (${rating} ⭐)</span>
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center pb-4 border-b border-gray-100">
            <!-- Score summary -->
            <div class="md:col-span-4 flex flex-col items-center justify-center p-3 bg-gray-50 rounded-xl text-center">
              <div class="text-3xl sm:text-4xl font-black text-amber-500 leading-none">${rating}</div>
              <div class="text-xs text-amber-500 mt-1">⭐⭐⭐⭐⭐</div>
              <div class="text-xs text-gray-500 mt-0.5">184 lượt nhận xét đánh giá</div>
            </div>
            <!-- Progress bars -->
            <div class="md:col-span-8 space-y-1.5 text-xs text-gray-600">
              <div class="flex items-center gap-2">
                <span class="w-10">5 ⭐</span>
                <div class="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div class="h-full bg-amber-400 rounded-full" style="width: 88%"></div>
                </div>
                <span class="w-10 text-right font-medium">88%</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-10">4 ⭐</span>
                <div class="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div class="h-full bg-amber-400 rounded-full" style="width: 9%"></div>
                </div>
                <span class="w-10 text-right font-medium">9%</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-10">3 ⭐</span>
                <div class="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div class="h-full bg-amber-400 rounded-full" style="width: 2%"></div>
                </div>
                <span class="w-10 text-right font-medium">2%</span>
              </div>
            </div>
          </div>

          <!-- Reviews list -->
          <div class="divide-y divide-gray-100 mt-2">
            <div class="py-3">
              <div class="flex items-center justify-between mb-1">
                <div class="flex items-center gap-2">
                  <span class="w-7 h-7 rounded-full bg-orange-100 text-[#EF5121] font-bold text-xs flex items-center justify-center">M</span>
                  <span class="font-bold text-xs text-gray-800">Mai Thị Hoa</span>
                  <span class="bg-green-50 text-[#007E42] text-[10px] font-semibold px-1.5 py-0.2 rounded border border-green-200">Đã mua tại Bách Hóa Xanh</span>
                </div>
                <span class="text-[11px] text-gray-400">Hôm qua</span>
              </div>
              <div class="text-xs text-amber-500 mb-1">⭐⭐⭐⭐⭐</div>
              <p class="text-xs text-gray-700 leading-relaxed">Sản phẩm rất tươi ngon, giao hàng siêu nhanh chỉ trong 45 phút, shipper thân thiện nhiệt tình. Sẽ ủng hộ lâu dài!</p>
            </div>
            <div class="py-3">
              <div class="flex items-center justify-between mb-1">
                <div class="flex items-center gap-2">
                  <span class="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">T</span>
                  <span class="font-bold text-xs text-gray-800">Trần Quốc Tuấn</span>
                  <span class="bg-green-50 text-[#007E42] text-[10px] font-semibold px-1.5 py-0.2 rounded border border-green-200">Đã mua tại Bách Hóa Xanh</span>
                </div>
                <span class="text-[11px] text-gray-400">3 ngày trước</span>
              </div>
              <div class="text-xs text-amber-500 mb-1">⭐⭐⭐⭐⭐</div>
              <p class="text-xs text-gray-700 leading-relaxed">Đóng gói sạch sẽ, hàng date mới trong ngày. Giá hợp lý hơn mua ngoài siêu thị khác.</p>
            </div>
          </div>
        </div>

        <!-- 5. RELATED PRODUCTS -->
        ${related.length > 0 ? `
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5 mb-4">
            <div class="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
              <h3 class="text-sm sm:text-base font-black text-gray-900 uppercase tracking-wide flex items-center gap-2">
                <span class="w-1.5 h-4.5 bg-[#EF5121] rounded-full inline-block"></span>
                <span>Sản phẩm tương tự cùng nhóm hàng</span>
              </h3>
              <a href="javascript:void(0)" onclick="window.__bhx_scrollCategoryByName('${catName.replace(/'/g, "\\'")}')" class="text-xs text-[#EF5121] font-bold hover:underline">
                Xem tất cả ➔
              </a>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3">
              ${related.map(item => `
                <div class="product-card group bg-white p-2.5 rounded-xl border border-gray-100 hover:border-orange-200 hover:shadow-md flex flex-col justify-between transition-all">
                  <div class="relative w-full aspect-square overflow-hidden rounded-lg mb-2 cursor-pointer bg-gray-50 flex items-center justify-center"
                       onclick="window.__bhx_showProductDetail('${encodeURIComponent(JSON.stringify(item))}')">
                    ${item.discountPercent > 0 ? `
                      <span class="absolute top-1 left-1 z-2 bg-red-600 text-white font-black text-[10px] px-1 py-0.5 rounded tag-discount-blink">
                        -${item.discountPercent}%
                      </span>` : ''}
                    <img src="${item.avatar}" alt="${item.name}"
                         class="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                         onerror="this.src='https://cdnv2-tmdt.tgdd.vn/bhx/product-fe/cart/home/_next/public/static/images/default-image.svg'">
                  </div>
                  <div class="flex-1">
                    <h4 class="text-xs font-semibold text-gray-800 line-clamp-2 leading-snug mb-1 cursor-pointer hover:text-[#EF5121]"
                        onclick="window.__bhx_showProductDetail('${encodeURIComponent(JSON.stringify(item))}')">${item.name}</h4>
                    <div class="text-[10px] text-gray-400 mb-1">ĐVT: ${item.unit || 'gói'}</div>
                    <div class="flex items-baseline gap-1 mb-2">
                      <span class="text-sm sm:text-base font-black text-[#EF5121]">${fmt(item.price)}</span>
                      ${item.originalPrice > item.price ? `<span class="text-[10px] text-gray-400 line-through">${fmt(item.originalPrice)}</span>` : ''}
                    </div>
                  </div>
                  <button type="button"
                          onclick="window.__bhx_addCart('${encodeURIComponent(JSON.stringify(item))}')"
                          class="w-full bg-[#007E42] hover:bg-[#006133] text-white font-bold text-xs py-1.5 rounded-lg flex items-center justify-center gap-1 shadow-2xs active:scale-95 transition-transform cursor-pointer">
                    + Chọn mua
                  </button>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

      </div>
    `;

    // ── Bind events on product detail page ──
    const qtyInput = document.getElementById('pdetail-qty-input');
    const minusBtn = document.getElementById('pdetail-qty-minus');
    const plusBtn = document.getElementById('pdetail-qty-plus');
    const totalPriceEl = document.getElementById('pdetail-total-price');
    const addBtn = document.getElementById('pdetail-btn-add');
    const buyBtn = document.getElementById('pdetail-btn-buy');

    let currentQty = 1;
    function updateQtyDisplay(q) {
      currentQty = Math.max(1, Math.min(99, q));
      if (qtyInput) qtyInput.value = currentQty;
      if (totalPriceEl) totalPriceEl.textContent = fmt(p.price * currentQty);
    }

    if (minusBtn) minusBtn.onclick = () => updateQtyDisplay(currentQty - 1);
    if (plusBtn) plusBtn.onclick = () => updateQtyDisplay(currentQty + 1);
    if (qtyInput) {
      qtyInput.onchange = () => updateQtyDisplay(parseInt(qtyInput.value, 10) || 1);
    }

    if (addBtn) {
      addBtn.onclick = () => {
        addToCart(p, currentQty);
      };
    }

    if (buyBtn) {
      buyBtn.onclick = () => {
        addToCart(p, currentQty);
        openCheckout();
      };
    }

    // ── Sticky Mobile Action Bar ──
    createStickyMobileBar(p, () => currentQty);
  }

  function createStickyMobileBar(p, getQty) {
    let bar = document.getElementById('pdetail-mobile-bar');
    if (bar) bar.remove();

    bar = document.createElement('div');
    bar.id = 'pdetail-mobile-bar';
    bar.className = 'fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 z-50 flex lg:hidden items-center justify-between px-3 py-2 shadow-[0_-4px_16px_rgba(0,0,0,0.12)] select-none pb-[calc(8px+env(safe-area-inset-bottom,0px))]';
    bar.innerHTML = `
      <div class="flex items-center gap-2">
        <a href="#/" class="flex flex-col items-center justify-center text-gray-600 hover:text-[#EF5121] px-1.5 py-1">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
          <span class="text-[9px] font-bold">Trang chủ</span>
        </a>
        <button id="pdetail-sticky-cart-btn" class="flex flex-col items-center justify-center text-gray-600 hover:text-[#EF5121] px-1.5 py-1 relative">
          <div class="relative">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
            <span class="bottom-cart-badge-clone absolute -top-1.5 -right-2.5 bg-red-600 text-white text-[9px] font-black rounded-full min-w-[16px] h-[16px] flex items-center justify-center leading-none px-0.5" style="${state.cart.length ? '' : 'display:none'}">
              ${state.cart.reduce((s, i) => s + i.quantity, 0)}
            </span>
          </div>
          <span class="text-[9px] font-bold">Giỏ hàng</span>
        </button>
      </div>

      <div class="flex items-center gap-1.5 flex-1 justify-end ml-2">
        <button id="pdetail-sticky-add-btn"
                type="button"
                class="flex-1 max-w-[140px] bg-[#EF5121] active:bg-[#D84214] text-white font-black text-xs py-2.5 px-2 rounded-xl shadow flex items-center justify-center gap-1 active:scale-95 transition-transform cursor-pointer">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
          <span>Thêm giỏ</span>
        </button>
        <button id="pdetail-sticky-buy-btn"
                type="button"
                class="flex-1 max-w-[140px] bg-[#007E42] active:bg-[#006133] text-white font-black text-xs py-2.5 px-2 rounded-xl shadow flex items-center justify-center gap-1 active:scale-95 transition-transform cursor-pointer">
          <span>⚡ Mua ngay</span>
        </button>
      </div>
    `;

    document.body.appendChild(bar);

    const stickyCart = document.getElementById('pdetail-sticky-cart-btn');
    const stickyAdd = document.getElementById('pdetail-sticky-add-btn');
    const stickyBuy = document.getElementById('pdetail-sticky-buy-btn');

    if (stickyCart) stickyCart.onclick = () => {
      renderCartDrawer();
      const drawer = document.getElementById('cart-drawer');
      const overlay = document.getElementById('cart-overlay');
      if (drawer) drawer.classList.remove('translate-x-full');
      if (overlay) { overlay.classList.remove('opacity-0', 'pointer-events-none'); overlay.classList.add('opacity-100'); }
    };

    if (stickyAdd) stickyAdd.onclick = () => {
      const q = getQty();
      addToCart(p, q);
      const badges = document.querySelectorAll('.bottom-cart-badge-clone');
      badges.forEach(b => {
        b.textContent = state.cart.reduce((s, i) => s + i.quantity, 0);
        b.style.display = 'flex';
      });
    };

    if (stickyBuy) stickyBuy.onclick = () => {
      const q = getQty();
      addToCart(p, q);
      openCheckout();
    };
  }

  function handleRoute() {
    const hash = window.location.hash || '';
    const mainLayout = document.getElementById('main-layout');
    const catLayout = document.getElementById('category-layout');
    const detailLayout = document.getElementById('product-detail-layout');
    const sidebarAside = document.getElementById('sidebar-aside');
    const mobBottomNav = document.getElementById('mobile-bottom-nav');

    if (hash.startsWith('#/san-pham/') || hash.startsWith('#/product/')) {
      const identifier = hash.replace(/^#(?:(?:\/san-pham\/)|(?:\/product\/))/, '');
      let product = state.activeProduct;
      if (!product || (product.id !== identifier && slugify(product.name) !== identifier)) {
        product = findProduct(identifier);
      }

      if (mainLayout) mainLayout.classList.add('hidden');
      if (catLayout) catLayout.classList.add('hidden');
      if (detailLayout) detailLayout.classList.remove('hidden');
      if (sidebarAside) sidebarAside.classList.add('lg:hidden');
      if (mobBottomNav) mobBottomNav.classList.add('hidden');

      renderProductDetailPage(product);
      window.scrollTo({ top: 0, behavior: 'instant' });
    } else {
      if (mainLayout) mainLayout.classList.remove('hidden');
      if (catLayout) catLayout.classList.add('hidden');
      if (detailLayout) detailLayout.classList.add('hidden');
      if (sidebarAside) sidebarAside.classList.remove('lg:hidden');
      if (mobBottomNav) mobBottomNav.classList.remove('hidden');

      const stickyMobileBar = document.getElementById('pdetail-mobile-bar');
      if (stickyMobileBar) stickyMobileBar.remove();
    }
  }

  function initRouter() {
    window.addEventListener('hashchange', handleRoute);
    window.addEventListener('popstate', handleRoute);
    handleRoute();
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
    initRouter();
  });

})();
