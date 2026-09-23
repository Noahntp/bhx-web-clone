const fs = require('fs');
const vm = require('vm');

const existingCode = fs.readFileSync('data.js', 'utf8');
const ctx = { window: {} };
vm.createContext(ctx);
vm.runInContext(existingCode, ctx);
const oldData = ctx.window.BHX_DATA;

const catMeta = [
  { id: 1, slug: 'thuc-pham-dong-mat', name: 'THỰC PHẨM ĐÔNG MÁT - TƯƠI SỐNG', banner: 'https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8686/image-2453_202410151405041250.png', brands: ['C.P', 'Vissan', 'G Kitchen', 'MeatDeli', 'Đà Lạt GAP'] },
  { id: 2, slug: 'do-uong', name: 'ĐỒ UỐNG', banner: 'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/6/image/2488/frame-127_202606091637580998.png', brands: ['Coca-Cola', 'Pepsi', 'Heineken', 'Tiger', 'Aquafina', 'Redbull'] },
  { id: 3, slug: 'tra-ca-phe-ngu-coc', name: 'TRÀ - CÀ PHÊ - NGŨ CỐC', banner: 'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/6/image/7519/frame-1984079339_202606041334517558.png', brands: ['Trung Nguyên', 'Nescafé', 'Lipton', 'Phúc Long', 'Quaker'] },
  { id: 4, slug: 'sua-che-pham', name: 'SỮA & CHẾ PHẨM TỪ SỮA', banner: 'https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/7091/7091_202410101515241537.png', brands: ['Vinamilk', 'TH True Milk', 'Nutifood', 'Con Bò Cười', 'Ông Thọ'] },
  { id: 5, slug: 'banh-keo-an-vat', name: 'BÁNH KẸO - ĐỒ ĂN VẶT', banner: 'https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/7143/7143_202410110835348807.png', brands: ['Orion', 'Kinh Đô', 'Oishi', 'Lay\'s', 'Chupa Chups'] },
  { id: 6, slug: 'dau-an-gia-vi', name: 'DẦU ĂN - NƯỚC CHẤM - GIA VỊ', banner: 'https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/7148/1990379_202410101528079106.png', brands: ['Simply', 'Chinsu', 'Nam Ngư', 'Maggi', 'Knorr', 'Aji-ngon'] },
  { id: 7, slug: 'gao-bot-do-kho', name: 'GẠO - BỘT - ĐỒ KHÔ - ĐỒ HỘP', banner: 'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2025/12/image/7149/sdasda_202512161029094498.png', brands: ['ST25 Ông Cua', 'A An', 'Meizan', 'Ba Cô Gái', 'Hạ Long'] },
  { id: 8, slug: 'mi-mien-chao-pho', name: 'MÌ - MIẾN - CHÁO - PHỞ', banner: 'https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/7147/image-523_202410101609435656.png', brands: ['Hảo Hảo', 'Omachi', 'Kokomi', 'Đệ Nhất', 'Cung Đình'] },
  { id: 9, slug: 'cham-soc-ca-nhan', name: 'CHĂM SÓC CÁ NHÂN', banner: 'https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/2515/2515_202410110851071914.png', brands: ['Clear', 'Head & Shoulders', 'Pantene', 'Colgate', 'P/S', 'Lifebuoy'] },
  { id: 10, slug: 've-sinh-nha-cua', name: 'VỆ SINH NHÀ CỬA', banner: 'https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/7160/ve-sinh-nha-cua-202205261522333668-1_202410101522241129.png', brands: ['Omo', 'Ariel', 'Comfort', 'Downy', 'Sunlight', 'Vim'] },
  { id: 11, slug: 'do-gia-dung', name: 'ĐỒ GIA DỤNG', banner: 'https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/3185/120x120-24_202410101454508088.png', brands: ['Sunhouse', 'Lock&Lock', 'Duy Tân', 'Inochi', 'Tefal'] },
  { id: 12, slug: 'van-phong-pham', name: 'VĂN PHÒNG PHẨM - ĐỒ CHƠI TRẺ EM', banner: 'https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8679/8679_202410150916053742.png', brands: ['Thiên Long', 'Deli', 'Bến Nghé', 'Hồng Hà', 'Double A'] },
  { id: 13, slug: 'do-dien-may', name: 'ĐỒ ĐIỆN MÁY', banner: 'https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/10298/image-2460_202410151408073941.png', brands: ['Panasonic', 'Sharp', 'Sunhouse', 'Comet', 'Senko'] },
  { id: 14, slug: 'thoi-trang', name: 'THỜI TRANG', banner: 'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/9/image/menuheader/da-sach-da-xinh_202609221050095577.png', brands: ['Chợ Giá Rẻ Fashion', 'Biti\'s', 'An Phước', 'Việt Tiến'] }
];

// Enrich menuV2 with slug
const updatedMenuV2 = oldData.menuV2.map((m, idx) => {
  const meta = catMeta[idx] || catMeta[0];
  return {
    ...m,
    slug: meta.slug,
    url: `#/danh-muc/${meta.slug}`,
    brands: meta.brands,
    childrens: (m.childrens || []).map((c, cIdx) => ({
      ...c,
      slug: `${meta.slug}-${cIdx + 1}`,
      url: `#/danh-muc/${meta.slug}?sub=${encodeURIComponent(c.name)}`
    }))
  };
});

// Enrich menuHeader (Story badges)
const updatedMenuHeader = oldData.menuHeader.map((b, idx) => {
  const meta = catMeta[idx] || catMeta[0];
  return {
    ...b,
    slug: meta.slug,
    url: `#/danh-muc/${meta.slug}`
  };
});

// Update homNayAnGi with exact user dishes + video + recipes + ingredients
const updatedHomNayAnGi = {
  title: "HÔM NAY ĂN GÌ?",
  subtitle: "(Hàng tươi sống không hài lòng 1 đổi 2)",
  tabs: oldData.homNayAnGi ? oldData.homNayAnGi.tabs : [
    { name: "Món mặn", active: true, discount: "" },
    { name: "Xào, luộc", active: false, discount: "5K" },
    { name: "Món canh", active: false, discount: "35%" },
    { name: "Rau sống", active: false, discount: "35%" },
    { name: "Trái Cây", active: false, discount: "25%" },
    { name: "Tráng miệng", active: false, discount: "50%" }
  ],
  recipes: [
    {
      id: "suon-nuong-pepsi",
      name: "Sườn nướng Pepsi",
      image: "assets/recipes/suon-nuong-pepsi-food.png",
      video: "assets/videos/suon-nuong-pepsi.webm",
      time: "35 phút",
      servings: "3 - 4 người",
      difficulty: "Dễ",
      desc: "Sườn non ướp đẫm sốt Pepsi sánh mịn, nướng xém cạnh thơm lừng, thịt mềm ngọt đậm đà khó cưỡng.",
      steps: [
        "Sơ chế sườn non: Chặt miếng vừa ăn, rửa sạch với nước muối loãng rồi chần sơ qua nước sôi.",
        "Ướp sườn: Cho 1 lon Pepsi, 2 muỗng dầu hào, 1 muỗng nước mắm, hành tỏi băm nhuyễn và hạt nêm vào ướp trong 45 phút.",
        "Nướng sườn: Làm nóng nồi chiên không dầu ở 180°C trong 5 phút. Cho sườn vào nướng 15 phút mỗi mặt, phết thêm sốt ướp cho sườn bóng đẹp."
      ],
      ingredients: [
        { name: "Sườn non heo C.P tươi (khay 500g)", price: 89000, unit: "khay", avatar: "https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/7/image/production/2026/7/image/Products/8781/275804/ba-roi-heo-nhap-khau_202607130947458793.jpg" },
        { name: "Nước ngọt Pepsi Cola lon 320ml", price: 11000, unit: "lon", avatar: "assets/brands/pepsi.svg" },
        { name: "Tỏi băm nhuyễn hũ 100g", price: 12000, unit: "hũ", avatar: "https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/7/image/production/2026/7/image/Products/8781/333450/thit-heo-xay-cp-100g_202607300938128442.jpg" },
        { name: "Hành tím băm sẵn hũ 100g", price: 12000, unit: "hũ", avatar: "https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/7/image/production/2026/7/image/Products/8781/313899/da-mo-heo_202607140912162139.jpg" },
        { name: "Dầu hào Maggi hảo hạng chai 350g", price: 24500, unit: "chai", avatar: "https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/8/image/production/2026/8/image/Products/8788/5368223/luu-ngot-tu-xuyen_202608130111186053.jpg" },
        { name: "Hạt nêm Knorr thịt thăn xương ống 400g", price: 36000, unit: "gói", avatar: "assets/brands/knorr.svg" }
      ]
    },
    {
      id: "ga-chien-nuoc-mam",
      name: "Gà chiên nước mắm",
      image: "assets/recipes/ga-chien-nuoc-mam-food.png",
      video: "assets/videos/ga-chien-nuoc-mam.webm",
      time: "25 phút",
      servings: "3 - 4 người",
      difficulty: "Dễ",
      desc: "Cánh gà chiên giòn rụm bên ngoài, mọng nước bên trong, áo lớp sốt nước mắm tỏi ớt kẹo ngọt thơm nức mũi.",
      steps: [
        "Sơ chế gà: Rửa sạch cánh gà bằng muối và gừng, khía nhẹ mặt trong để ngấm gia vị.",
        "Chiên gà: Lăn gà qua lớp bột chiên giòn mỏng, thả vào chảo dầu nóng chiên vàng giòn rồi vớt ra ráo dầu.",
        "Đảo sốt nước mắm: Phi thơm tỏi ớt băm, thêm 2 muỗng nước mắm, 2 muỗng đường, 1 muỗng tương ớt đảo keo lại rồi trút gà vào lắc đều."
      ],
      ingredients: [
        { name: "Cánh gà tươi C.P làm sạch khay 500g", price: 52000, unit: "khay", avatar: "https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/7/image/production/2026/7/image/Products/8781/283165/thit-heo-xay-cp-khay-200g_202607300939001657.jpg" },
        { name: "Nước mắm Nam Ngư Đệ Nhị chai 900ml", price: 32000, unit: "chai", avatar: "https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/7/image/production/2026/7/image/Products/8788/366365/tao-gala-mini-tui-800g_202607161559592238.jpg" },
        { name: "Tỏi cô đơn Lý Sơn túi 200g", price: 28000, unit: "túi", avatar: "https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/7/image/production/2026/7/image/Products/8781/313899/da-mo-heo_202607140912162139.jpg" },
        { name: "Ớt sừng đỏ cay nồng gói 100g", price: 8000, unit: "gói", avatar: "https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/8/image/production/2026/8/image/Products/8788/5368223/luu-ngot-tu-xuyen_202608130111186053.jpg" },
        { name: "Bột chiên giòn Meizan gói 150g", price: 11000, unit: "gói", avatar: "https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/7/image/production/2026/7/image/Products/8788/5367299/nho-do-nhap-khau_202607231308359257.jpg" },
        { name: "Đường tinh luyện cao cấp Biên Hòa 1kg", price: 28500, unit: "gói", avatar: "https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/7/image/production/2026/7/image/Products/8781/333450/thit-heo-xay-cp-100g_202607300938128442.jpg" }
      ]
    },
    {
      id: "ca-basa-kho-to",
      name: "Cá basa kho tộ",
      image: "assets/recipes/ca-basa-kho-to-food.png",
      video: "assets/videos/ca-basa-kho-to.webm",
      time: "30 phút",
      servings: "2 - 3 người",
      difficulty: "Dễ",
      desc: "Cá basa kho tộ béo ngậy, thịt cá săn chắc thấm đẫm nước màu dừa, tiêu đen cay nồng ăn cùng cơm nóng.",
      steps: [
        "Sơ chế cá basa: Rửa cá với nước cốt chanh để khử tanh, để ráo nước.",
        "Tẩm ướp: Ướp cá với nước mắm, tiêu, hành tím, ớt xắt lát và nước màu dừa trong 20 phút.",
        "Kho tộ: Đun tộ đất sôi bùng, hạ lửa riu riu kho 25 phút cho nước cạn sệt, rắc hành lá và tiêu xay."
      ],
      ingredients: [
        { name: "Cá basa cắt khúc tươi làm sạch khay 400g", price: 42000, unit: "khay", avatar: "https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/7/image/production/2026/7/image/Products/8781/333450/thit-heo-xay-cp-100g_202607300938128442.jpg" },
        { name: "Nước hàng / Nước màu dừa Bến Tre 150ml", price: 16000, unit: "chai", avatar: "https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/7/image/production/2026/7/image/Products/8788/366365/tao-gala-mini-tui-800g_202607161559592238.jpg" },
        { name: "Hành lá & ngò rí tươi bó 100g", price: 7000, unit: "bó", avatar: "https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/8/image/production/2026/8/image/Products/8788/5368223/luu-ngot-tu-xuyen_202608130111186053.jpg" },
        { name: "Tiêu đen hạt xay Đắk Lắk hũ 50g", price: 22000, unit: "hũ", avatar: "https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/7/image/production/2026/7/image/Products/8781/275804/ba-roi-heo-nhap-khau_202607130947458793.jpg" },
        { name: "Nước mắm Chinsu Cá Hồi chai 500ml", price: 46000, unit: "chai", avatar: "https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/7/image/production/2026/7/image/Products/8781/313899/da-mo-heo_202607140912162139.jpg" }
      ]
    },
    {
      id: "ga-kho-sa",
      name: "Gà kho sả",
      image: "assets/recipes/ga-kho-sa-food.png",
      video: "assets/videos/ga-kho-sa.webm",
      time: "30 phút",
      servings: "3 - 4 người",
      difficulty: "Dễ",
      desc: "Thịt gà ta săn chắc kho quyện mùi thơm nồng đặc trưng của sả cây băm nhuyễn và ớt hiểm cay the bắt cơm.",
      steps: [
        "Sơ chế gà: Chặt gà miếng vừa ăn, ướp với sả băm, tỏi, nước mắm, bột nghệ và hạt nêm.",
        "Xào săn: Phi thơm sả ớt trong chảo dầu, trút gà vào xào săn lửa lớn.",
        "Kho liu riu: Thêm một chén nước nhỏ, đậy nắp kho nhỏ lửa 20 phút cho nước keo lại óng vàng."
      ],
      ingredients: [
        { name: "Má đùi gà tươi C.P khay 500g", price: 46000, unit: "khay", avatar: "https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/7/image/production/2026/7/image/Products/8781/283165/thit-heo-xay-cp-khay-200g_202607300939001657.jpg" },
        { name: "Sả cây tươi băm sẵn hũ 100g", price: 9000, unit: "hũ", avatar: "https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/8/image/production/2026/8/image/Products/8788/5368223/luu-ngot-tu-xuyen_202608130111186053.jpg" },
        { name: "Nước tương Maggi Đậm Đặc chai 700ml", price: 27000, unit: "chai", avatar: "https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/7/image/production/2026/7/image/Products/8788/366365/tao-gala-mini-tui-800g_202607161559592238.jpg" },
        { name: "Dầu đậu nành nguyên chất Simply 1 lít", price: 58000, unit: "chai", avatar: "https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/7/image/production/2026/7/image/Products/8781/275804/ba-roi-heo-nhap-khau_202607130947458793.jpg" },
        { name: "Ớt hiểm tươi xanh đỏ gói 50g", price: 5000, unit: "gói", avatar: "https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/7/image/production/2026/7/image/Products/8781/333450/thit-heo-xay-cp-100g_202607300938128442.jpg" }
      ]
    },
    {
      id: "ca-loc-kho-to",
      name: "Cá lóc kho tộ",
      image: "assets/recipes/ca-loc-kho-to-food.png",
      video: "assets/videos/ca-loc-kho-to.webm",
      time: "35 phút",
      servings: "3 - 4 người",
      difficulty: "Dễ",
      desc: "Món ngon đồng quê trứ danh miền Tây với cá lóc đồng ngọt thịt, kho tiêu trong tộ đất keo sánh đậm đà.",
      steps: [
        "Sơ chế cá lóc: Làm sạch vảy cá, cắt khúc vừa ăn, rửa sạch với muối và rượu trắng.",
        "Xếp tộ: Lót dưới đáy tộ ít thịt ba chỉ và đầu hành, xếp cá lên trên, rưới nước sốt ướp.",
        "Kho tộ: Kho lửa vừa đến khi sôi thì hạ nhỏ lửa, kho khoảng 30 phút cho nước keo sánh lại, rắc hành ngò và tiêu."
      ],
      ingredients: [
        { name: "Cá lóc bông cắt khúc khay 500g", price: 68000, unit: "khay", avatar: "https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/7/image/production/2026/7/image/Products/8781/313899/da-mo-heo_202607140912162139.jpg" },
        { name: "Thịt ba rọi rút sườn C.P khay 300g", price: 48000, unit: "khay", avatar: "https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/7/image/production/2026/7/image/Products/8781/275804/ba-roi-heo-nhap-khau_202607130947458793.jpg" },
        { name: "Ớt chỉ thiên đỏ cay nồng gói 50g", price: 5000, unit: "gói", avatar: "https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/8/image/production/2026/8/image/Products/8788/5368223/luu-ngot-tu-xuyen_202608130111186053.jpg" },
        { name: "Nước mắm Phú Quốc Thuận Phát 40 độ đạm 490ml", price: 55000, unit: "chai", avatar: "https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/7/image/production/2026/7/image/Products/8788/366365/tao-gala-mini-tui-800g_202607161559592238.jpg" },
        { name: "Rau răm & thì là tươi bó 100g", price: 6500, unit: "bó", avatar: "https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/7/image/production/2026/7/image/Products/8788/5367299/nho-do-nhap-khau_202607231308359257.jpg" }
      ]
    }
  ]
};

// Now enrich categories products: make sure each category has subCategory, brand, rating, soldCount, isFastDelivery
const updatedCategories = {};
for (const [catName, prods] of Object.entries(oldData.categories)) {
  const meta = catMeta.find(m => m.name === catName) || { brands: ['Chợ Giá Rẻ'] };
  const menuEntry = updatedMenuV2.find(m => m.name === catName);
  const subCats = menuEntry ? menuEntry.childrens.map(c => c.name) : ['Sản phẩm phổ biến'];

  updatedCategories[catName] = prods.map((p, idx) => {
    const brand = meta.brands[idx % meta.brands.length];
    const sub = subCats[idx % subCats.length];
    return {
      ...p,
      id: `${meta.slug || 'sp'}_${idx + 1}`,
      brand: brand,
      subCategory: sub,
      isFastDelivery: true,
      rating: (4.7 + (idx % 4) * 0.1).toFixed(1),
      soldCount: (idx + 1) * 37 + 50
    };
  });
}

const finalData = {
  ...oldData,
  menuHeader: updatedMenuHeader,
  menuV2: updatedMenuV2,
  homNayAnGi: updatedHomNayAnGi,
  categories: updatedCategories,
  catMeta: catMeta
};

const fileContent = `// Dữ liệu Chợ Giá Rẻ chuẩn hóa theo DANH MỤC SẢN PHẨM.xlsx\nwindow.BHX_DATA = ${JSON.stringify(finalData, null, 2)};\n`;
fs.writeFileSync('data.js', fileContent, 'utf8');
console.log('Successfully updated data.js with video recipes, slugs, subcategories and brands!');
