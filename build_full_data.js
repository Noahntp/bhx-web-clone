const fs = require('fs');

const excelCats = JSON.parse(fs.readFileSync('excel_cats.json', 'utf8'));
const preserved = JSON.parse(fs.readFileSync('preserved_sections.json', 'utf8'));
const oldCats = preserved.oldCategories;

// Icons mapping for 14 main categories
const categoryIcons = [
  'https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8686/image-2453_202410151405041250.png', // 1. Thực phẩm đông mát - Tươi sống
  'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/6/image/2488/frame-127_202606091637580998.png', // 2. Đồ uống
  'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/6/image/7519/frame-1984079339_202606041334517558.png', // 3. Trà - Cà phê - Ngũ cốc
  'https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/7091/7091_202410101515241537.png', // 4. Sữa & chế phẩm
  'https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/7143/7143_202410110835348807.png', // 5. Bánh kẹo - Đồ ăn vặt
  'https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/7148/1990379_202410101528079106.png', // 6. Dầu ăn - Nước chấm - Gia vị
  'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2025/12/image/7149/sdasda_202512161029094498.png', // 7. Gạo - Bột - Đồ khô - Đồ hộp
  'https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/7147/image-523_202410101609435656.png', // 8. Mì - Miến - Cháo - Phở
  'https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/2515/2515_202410110851071914.png', // 9. Chăm sóc cá nhân
  'https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/7160/ve-sinh-nha-cua-202205261522333668-1_202410101522241129.png', // 10. Vệ sinh nhà cửa
  'https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/3185/120x120-24_202410101454508088.png', // 11. Đồ gia dụng
  'https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/8679/8679_202410150916053742.png', // 12. Văn phòng phẩm - Đồ chơi
  'https://cdnv2.tgdd.vn/bhx-static/bhx/Category/Images/10298/image-2460_202410151408073941.png', // 13. Đồ điện máy
  'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/9/image/menuheader/da-sach-da-xinh_202609221050095577.png' // 14. Thời trang
];

// Build menuV2
const menuV2 = excelCats.map((cat, idx) => ({
  id: String(cat.id || idx + 1),
  name: cat.name,
  icon: categoryIcons[idx] || categoryIcons[0],
  url: `danh-muc-${cat.id}`,
  note: cat.note || '',
  childrens: cat.subs.map((sub, sIdx) => ({
    id: `${cat.id}_${sIdx + 1}`,
    name: sub,
    url: `#`
  }))
}));

// Build menuHeader (story badges)
const menuHeader = excelCats.map((cat, idx) => ({
  id: cat.id,
  name: cat.name.split(' - ')[0].replace('&', 'và'),
  url: `#cat-${idx}`,
  icon: categoryIcons[idx] || categoryIcons[0]
}));

// Build products for all 14 categories
const productsData = {};

// 1. THỰC PHẨM ĐÔNG MÁT - TƯƠI SỐNG
productsData['THỰC PHẨM ĐÔNG MÁT - TƯƠI SỐNG'] = [
  ...(oldCats['Thịt, cá, trứng tươi sống'] || []),
  ...(oldCats['Rau, củ, nấm, trái cây'] || [])
].slice(0, 10);

// 2. ĐỒ UỐNG
productsData['ĐỒ UỐNG'] = [
  ...(oldCats['Bia, nước giải khát'] || []),
  ...(oldCats['Nước ngọt & Giải khát'] || [])
].slice(0, 10);

// 3. TRÀ - CÀ PHÊ - NGŨ CỐC
productsData['TRÀ - CÀ PHÊ - NGŨ CỐC'] = [
  {
    name: 'Cà phê sữa hòa tan G7 3in1 Trung Nguyên hộp 18 gói',
    avatar: 'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/7/image/production/2026/7/image/Products/8781/333450/thit-heo-xay-cp-100g_202607300938128442.jpg',
    price: 58000,
    originalPrice: 65000,
    discountPercent: 11,
    unit: 'hộp'
  },
  {
    name: 'Cà phê sữa đá Nescafé 3in1 đậm đà hộp 20 gói',
    avatar: 'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/7/image/production/2026/7/image/Products/8781/283165/thit-heo-xay-cp-khay-200g_202607300939001657.jpg',
    price: 62000,
    originalPrice: 70000,
    discountPercent: 11,
    unit: 'hộp'
  },
  {
    name: 'Cà phê phin Trung Nguyên Sáng Tạo 1 gói 340g',
    avatar: 'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/7/image/production/2026/7/image/Products/8781/275804/ba-roi-heo-nhap-khau_202607130947458793.jpg',
    price: 65000,
    originalPrice: 72000,
    discountPercent: 10,
    unit: 'gói'
  },
  {
    name: 'Trà túi lọc Lipton nhãn vàng hộp 25 gói x 2g',
    avatar: 'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/7/image/production/2026/7/image/Products/8788/366365/tao-gala-mini-tui-800g_202607161559592238.jpg',
    price: 38000,
    originalPrice: 42000,
    discountPercent: 10,
    unit: 'hộp'
  },
  {
    name: 'Ngũ cốc dinh dưỡng Canxi Kachi bịch 20 gói x 25g',
    avatar: 'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/8/image/production/2026/8/image/Products/8788/5368223/luu-ngot-tu-xuyen_202608130111186053.jpg',
    price: 56000,
    originalPrice: 64000,
    discountPercent: 12,
    unit: 'bịch'
  },
  {
    name: 'Yến mạch nguyên chất Quaker Oats hộp 450g',
    avatar: 'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/7/image/production/2026/7/image/Products/8788/5367299/nho-do-nhap-khau_202607231308359257.jpg',
    price: 68000,
    originalPrice: 78000,
    discountPercent: 13,
    unit: 'hộp'
  },
  {
    name: 'Trà Ô long túi lọc Phúc Long hộp 25 gói',
    avatar: 'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/7/image/production/2026/7/image/Products/8781/313899/da-mo-heo_202607140912162139.jpg',
    price: 42000,
    originalPrice: 48000,
    discountPercent: 12,
    unit: 'hộp'
  },
  {
    name: 'Cà phê đen hòa tan Nescafé Red Cup hũ 100g',
    avatar: 'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/7/image/production/2026/7/image/Products/8781/333450/thit-heo-xay-cp-100g_202607300938128442.jpg',
    price: 75000,
    originalPrice: 85000,
    discountPercent: 12,
    unit: 'hũ'
  }
];

// 4. SỮA & CHẾ PHẨM TỪ SỮA
productsData['SỮA & CHẾ PHẨM TỪ SỮA'] = [
  ...(oldCats['Sữa tươi, sữa chua'] || []),
  {
    name: 'Phô mai Con Bò Cười hộp 8 miếng 112g',
    avatar: 'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/7/image/production/2026/7/image/Products/8781/283165/thit-heo-xay-cp-khay-200g_202607300939001657.jpg',
    price: 38000,
    originalPrice: 42000,
    discountPercent: 10,
    unit: 'hộp'
  },
  {
    name: 'Sữa đặc có đường Ông Thọ nhãn đỏ lon 380g',
    avatar: 'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/7/image/production/2026/7/image/Products/8781/275804/ba-roi-heo-nhap-khau_202607130947458793.jpg',
    price: 26000,
    originalPrice: 29000,
    discountPercent: 10,
    unit: 'lon'
  }
].slice(0, 10);

// 5. BÁNH KẸO - ĐỒ ĂN VẶT
productsData['BÁNH KẸO - ĐỒ ĂN VẶT'] = [
  ...(oldCats['Bánh kẹo, đồ ăn vặt'] || []),
  {
    name: 'Bánh Chocopie Orion hộp 12 cái 360g',
    avatar: 'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/7/image/production/2026/7/image/Products/8788/366365/tao-gala-mini-tui-800g_202607161559592238.jpg',
    price: 54000,
    originalPrice: 60000,
    discountPercent: 10,
    unit: 'hộp'
  },
  {
    name: 'Bánh quy dinh dưỡng AFC vị rau cải hộp 200g',
    avatar: 'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/8/image/production/2026/8/image/Products/8788/5368223/luu-ngot-tu-xuyen_202608130111186053.jpg',
    price: 32000,
    originalPrice: 36000,
    discountPercent: 11,
    unit: 'hộp'
  }
].slice(0, 10);

// 6. DẦU ĂN - NƯỚC CHẤM - GIA VỊ
productsData['DẦU ĂN - NƯỚC CHẤM - GIA VỊ'] = [
  ...(oldCats['Dầu ăn, nước mắm, gia vị'] || []),
  ...(oldCats['Nước mắm & Gia vị'] || [])
].slice(0, 10);

// 7. GẠO - BỘT - ĐỒ KHÔ - ĐỒ HỘP
productsData['GẠO - BỘT - ĐỒ KHÔ - ĐỒ HỘP'] = [
  {
    name: 'Gạo ST25 Ông Cua lúa tôm đặc sản túi 5kg',
    avatar: 'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/7/image/production/2026/7/image/Products/8788/5367299/nho-do-nhap-khau_202607231308359257.jpg',
    price: 185000,
    originalPrice: 210000,
    discountPercent: 12,
    unit: 'túi'
  },
  {
    name: 'Gạo thơm thượng hạng Jasmine A An túi 5kg',
    avatar: 'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/7/image/production/2026/7/image/Products/8781/313899/da-mo-heo_202607140912162139.jpg',
    price: 135000,
    originalPrice: 155000,
    discountPercent: 13,
    unit: 'túi'
  },
  {
    name: 'Bột mì đa dụng cao cấp Meizan gói 1kg',
    avatar: 'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/7/image/production/2026/7/image/Products/8781/333450/thit-heo-xay-cp-100g_202607300938128442.jpg',
    price: 24000,
    originalPrice: 28000,
    discountPercent: 14,
    unit: 'gói'
  },
  {
    name: 'Cá nục sốt cà chua Ba Cô Gái lon 155g',
    avatar: 'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/7/image/production/2026/7/image/Products/8781/283165/thit-heo-xay-cp-khay-200g_202607300939001657.jpg',
    price: 17500,
    originalPrice: 20000,
    discountPercent: 12,
    unit: 'lon'
  },
  {
    name: 'Pate gan heo Hạ Long lon 150g',
    avatar: 'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/7/image/production/2026/7/image/Products/8781/275804/ba-roi-heo-nhap-khau_202607130947458793.jpg',
    price: 22000,
    originalPrice: 25000,
    discountPercent: 12,
    unit: 'lon'
  },
  {
    name: 'Xúc xích tiệt trùng heo Vissan gói 5 cây 175g',
    avatar: 'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/7/image/production/2026/7/image/Products/8788/366365/tao-gala-mini-tui-800g_202607161559592238.jpg',
    price: 26000,
    originalPrice: 30000,
    discountPercent: 13,
    unit: 'gói'
  },
  {
    name: 'Thịt heo hầm xay Spam Classic lon 340g',
    avatar: 'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/8/image/production/2026/8/image/Products/8788/5368223/luu-ngot-tu-xuyen_202608130111186053.jpg',
    price: 85000,
    originalPrice: 99000,
    discountPercent: 14,
    unit: 'lon'
  },
  {
    name: 'Bánh tráng cuốn chả giò Mikiri xấp 30 cái',
    avatar: 'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/7/image/production/2026/7/image/Products/8788/5367299/nho-do-nhap-khau_202607231308359257.jpg',
    price: 12000,
    originalPrice: 15000,
    discountPercent: 20,
    unit: 'xấp'
  }
];

// 8. MÌ - MIẾN - CHÁO - PHỞ
productsData['MÌ - MIẾN - CHÁO - PHỞ'] = (oldCats['Mì, miến, phở ăn liền'] || []).slice(0, 10);

// 9. CHĂM SÓC CÁ NHÂN
productsData['CHĂM SÓC CÁ NHÂN'] = [
  {
    name: 'Dầu gội Clear thảo dược sạch gàu chai 630g',
    avatar: 'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/7/image/production/2026/7/image/Products/8781/313899/da-mo-heo_202607140912162139.jpg',
    price: 185000,
    originalPrice: 215000,
    discountPercent: 14,
    unit: 'chai'
  },
  {
    name: 'Sữa tắm Lifebuoy bảo vệ vượt trội chai 850g',
    avatar: 'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/7/image/production/2026/7/image/Products/8781/333450/thit-heo-xay-cp-100g_202607300938128442.jpg',
    price: 172000,
    originalPrice: 198000,
    discountPercent: 13,
    unit: 'chai'
  },
  {
    name: 'Kem đánh răng Closeup bạc hà thơm mát tuýp 230g',
    avatar: 'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/7/image/production/2026/7/image/Products/8781/283165/thit-heo-xay-cp-khay-200g_202607300939001657.jpg',
    price: 42000,
    originalPrice: 48000,
    discountPercent: 12,
    unit: 'tuýp'
  },
  {
    name: 'Bàn chải đánh răng Oral-B siêu mềm mảnh lông tơ',
    avatar: 'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/7/image/production/2026/7/image/Products/8781/275804/ba-roi-heo-nhap-khau_202607130947458793.jpg',
    price: 28000,
    originalPrice: 35000,
    discountPercent: 20,
    unit: 'cây'
  },
  {
    name: 'Nước rửa tay Lifebuoy kháng khuẩn chai 500ml',
    avatar: 'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/7/image/production/2026/7/image/Products/8788/366365/tao-gala-mini-tui-800g_202607161559592238.jpg',
    price: 75000,
    originalPrice: 89000,
    discountPercent: 16,
    unit: 'chai'
  },
  {
    name: 'Lốc 10 cuộn giấy vệ sinh Paseo 3 lớp cao cấp có lõi',
    avatar: 'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/8/image/production/2026/8/image/Products/8788/5368223/luu-ngot-tu-xuyen_202608130111186053.jpg',
    price: 89000,
    originalPrice: 105000,
    discountPercent: 15,
    unit: 'lốc'
  },
  {
    name: 'Khăn ướt em bé kháng khuẩn không mùi gói 100 miếng',
    avatar: 'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/7/image/production/2026/7/image/Products/8788/5367299/nho-do-nhap-khau_202607231308359257.jpg',
    price: 29000,
    originalPrice: 36000,
    discountPercent: 19,
    unit: 'gói'
  },
  {
    name: 'Nước súc miệng diệt khuẩn Listerine Cool Mint chai 500ml',
    avatar: 'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/7/image/production/2026/7/image/Products/8781/313899/da-mo-heo_202607140912162139.jpg',
    price: 98000,
    originalPrice: 115000,
    discountPercent: 15,
    unit: 'chai'
  }
];

// 10. VỆ SINH NHÀ CỬA
productsData['VỆ SINH NHÀ CỬA'] = [
  ...(oldCats['Vệ sinh nhà cửa, giặt xả'] || []),
  ...(oldCats['Nước rửa chén & Tẩy rửa'] || [])
].slice(0, 10);

// 11. ĐỒ GIA DỤNG
productsData['ĐỒ GIA DỤNG'] = [
  {
    name: 'Màng bọc thực phẩm PE Ringo 30cm x 50m kèm dao cắt',
    avatar: 'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/7/image/production/2026/7/image/Products/8781/333450/thit-heo-xay-cp-100g_202607300938128442.jpg',
    price: 28000,
    originalPrice: 35000,
    discountPercent: 20,
    unit: 'cuộn'
  },
  {
    name: 'Túi đựng rác tự hủy sinh học 3 cuộn 55x65cm tiện lợi',
    avatar: 'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/7/image/production/2026/7/image/Products/8781/283165/thit-heo-xay-cp-khay-200g_202607300939001657.jpg',
    price: 45000,
    originalPrice: 55000,
    discountPercent: 18,
    unit: 'lốc'
  },
  {
    name: 'Chảo chống dính vân đá đáy từ Sunhouse 26cm',
    avatar: 'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/7/image/production/2026/7/image/Products/8781/275804/ba-roi-heo-nhap-khau_202607130947458793.jpg',
    price: 145000,
    originalPrice: 189000,
    discountPercent: 23,
    unit: 'cái'
  },
  {
    name: 'Nồi inox 3 đáy nắp kính cao cấp Fivestar 20cm',
    avatar: 'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/7/image/production/2026/7/image/Products/8788/366365/tao-gala-mini-tui-800g_202607161559592238.jpg',
    price: 185000,
    originalPrice: 230000,
    discountPercent: 20,
    unit: 'cái'
  },
  {
    name: 'Bình giữ nhiệt inox 304 Lock&Lock 500ml giữ nóng 12h',
    avatar: 'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/8/image/production/2026/8/image/Products/8788/5368223/luu-ngot-tu-xuyen_202608130111186053.jpg',
    price: 220000,
    originalPrice: 280000,
    discountPercent: 21,
    unit: 'cái'
  },
  {
    name: 'Khăn tắm cotton cao cấp xuất khẩu 70x140cm siêu thấm hút',
    avatar: 'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/7/image/production/2026/7/image/Products/8788/5367299/nho-do-nhap-khau_202607231308359257.jpg',
    price: 69000,
    originalPrice: 89000,
    discountPercent: 22,
    unit: 'cái'
  },
  {
    name: 'Bộ 10 đôi đũa tre tự nhiên cao cấp sấy tiệt trùng',
    avatar: 'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/7/image/production/2026/7/image/Products/8781/313899/da-mo-heo_202607140912162139.jpg',
    price: 35000,
    originalPrice: 45000,
    discountPercent: 22,
    unit: 'bộ'
  },
  {
    name: 'Găng tay cao su gia dụng bảo hộ da tay cỡ M',
    avatar: 'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/7/image/production/2026/7/image/Products/8781/333450/thit-heo-xay-cp-100g_202607300938128442.jpg',
    price: 22000,
    originalPrice: 28000,
    discountPercent: 21,
    unit: 'đôi'
  }
];

// 12. VĂN PHÒNG PHẨM - ĐỒ CHƠI TRẺ EM
productsData['VĂN PHÒNG PHẨM - ĐỒ CHƠI TRẺ EM'] = [
  {
    name: 'Hộp 20 cây bút bi Thiên Long 0.5mm mực xanh viết êm',
    avatar: 'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/7/image/production/2026/7/image/Products/8781/283165/thit-heo-xay-cp-khay-200g_202607300939001657.jpg',
    price: 75000,
    originalPrice: 90000,
    discountPercent: 17,
    unit: 'hộp'
  },
  {
    name: 'Cuộn băng keo OPP trong dán thùng bản 4.8cm dài 200 yard',
    avatar: 'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/7/image/production/2026/7/image/Products/8781/275804/ba-roi-heo-nhap-khau_202607130947458793.jpg',
    price: 28000,
    originalPrice: 35000,
    discountPercent: 20,
    unit: 'cuộn'
  },
  {
    name: 'Bút dạ quang highlight 4 màu Pastel Deli chống lóa',
    avatar: 'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/7/image/production/2026/7/image/Products/8788/366365/tao-gala-mini-tui-800g_202607161559592238.jpg',
    price: 32000,
    originalPrice: 40000,
    discountPercent: 20,
    unit: 'vỉ'
  },
  {
    name: 'Bộ 12 màu đất nặn bột mì an toàn cho bé phát triển sáng tạo',
    avatar: 'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/8/image/production/2026/8/image/Products/8788/5368223/luu-ngot-tu-xuyen_202608130111186053.jpg',
    price: 45000,
    originalPrice: 55000,
    discountPercent: 18,
    unit: 'bộ'
  },
  {
    name: 'Bộ xếp hình Lego khối lớn sáng tạo 80 chi tiết cho bé',
    avatar: 'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/7/image/production/2026/7/image/Products/8788/5367299/nho-do-nhap-khau_202607231308359257.jpg',
    price: 120000,
    originalPrice: 150000,
    discountPercent: 20,
    unit: 'bộ'
  },
  {
    name: 'Bộ 5 xe ô tô mô hình mini chạy trớn kim loại siêu bền',
    avatar: 'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/7/image/production/2026/7/image/Products/8781/313899/da-mo-heo_202607140912162139.jpg',
    price: 85000,
    originalPrice: 110000,
    discountPercent: 23,
    unit: 'bộ'
  },
  {
    name: 'Xấp bao thư trắng chuẩn bưu điện cỡ 12x18cm 50 cái',
    avatar: 'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/7/image/production/2026/7/image/Products/8781/333450/thit-heo-xay-cp-100g_202607300938128442.jpg',
    price: 15000,
    originalPrice: 20000,
    discountPercent: 25,
    unit: 'xấp'
  },
  {
    name: 'Hộp 12 cây bút chì gỗ 2B Deli kèm gôm tẩy mềm',
    avatar: 'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/7/image/production/2026/7/image/Products/8781/283165/thit-heo-xay-cp-khay-200g_202607300939001657.jpg',
    price: 38000,
    originalPrice: 48000,
    discountPercent: 21,
    unit: 'hộp'
  }
];

// 13. ĐỒ ĐIỆN MÁY
productsData['ĐỒ ĐIỆN MÁY'] = [
  {
    name: 'Ấm đun nước siêu tốc inox Sunhouse 1.8L 1500W',
    avatar: 'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/7/image/production/2026/7/image/Products/8781/275804/ba-roi-heo-nhap-khau_202607130947458793.jpg',
    price: 165000,
    originalPrice: 210000,
    discountPercent: 21,
    unit: 'cái'
  },
  {
    name: 'Nồi cơm điện nắp gài Sharp 1.8L lòng nồi chống dính',
    avatar: 'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/7/image/production/2026/7/image/Products/8788/366365/tao-gala-mini-tui-800g_202607161559592238.jpg',
    price: 490000,
    originalPrice: 590000,
    discountPercent: 17,
    unit: 'cái'
  },
  {
    name: 'Máy sấy tóc Bluestone 1800W tạo ion chống xơ rối',
    avatar: 'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/8/image/production/2026/8/image/Products/8788/5368223/luu-ngot-tu-xuyen_202608130111186053.jpg',
    price: 250000,
    originalPrice: 320000,
    discountPercent: 22,
    unit: 'cái'
  },
  {
    name: 'Ổ cắm điện đa năng Comet 4 lỗ cắm 3 cổng sạc USB',
    avatar: 'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/7/image/production/2026/7/image/Products/8788/5367299/nho-do-nhap-khau_202607231308359257.jpg',
    price: 115000,
    originalPrice: 145000,
    discountPercent: 21,
    unit: 'cái'
  },
  {
    name: 'Vỉ 4 viên pin tiểu AA Panasonic Alkaline bền bỉ',
    avatar: 'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/7/image/production/2026/7/image/Products/8781/313899/da-mo-heo_202607140912162139.jpg',
    price: 38000,
    originalPrice: 48000,
    discountPercent: 21,
    unit: 'vỉ'
  },
  {
    name: 'Quạt bàn mini Senko siêu êm tiết kiệm điện B102',
    avatar: 'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/7/image/production/2026/7/image/Products/8781/333450/thit-heo-xay-cp-100g_202607300938128442.jpg',
    price: 210000,
    originalPrice: 260000,
    discountPercent: 19,
    unit: 'cái'
  },
  {
    name: 'Bàn ủi khô chống dính Tefal công suất 1200W',
    avatar: 'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/7/image/production/2026/7/image/Products/8781/283165/thit-heo-xay-cp-khay-200g_202607300939001657.jpg',
    price: 280000,
    originalPrice: 350000,
    discountPercent: 20,
    unit: 'cái'
  },
  {
    name: 'Nồi lẩu điện đa năng nắp kính Lock&Lock 3.5L',
    avatar: 'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/7/image/production/2026/7/image/Products/8781/275804/ba-roi-heo-nhap-khau_202607130947458793.jpg',
    price: 520000,
    originalPrice: 650000,
    discountPercent: 20,
    unit: 'cái'
  }
];

// 14. THỜI TRANG
productsData['THỜI TRANG'] = [
  {
    name: 'Áo thun nam Cotton 100% cổ tròn co giãn 4 chiều mát lạnh',
    avatar: 'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/7/image/production/2026/7/image/Products/8788/366365/tao-gala-mini-tui-800g_202607161559592238.jpg',
    price: 89000,
    originalPrice: 120000,
    discountPercent: 26,
    unit: 'cái'
  },
  {
    name: 'Combo 3 quần lót sợi tre kháng khuẩn thoáng mát',
    avatar: 'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/8/image/production/2026/8/image/Products/8788/5368223/luu-ngot-tu-xuyen_202608130111186053.jpg',
    price: 95000,
    originalPrice: 130000,
    discountPercent: 27,
    unit: 'combo'
  },
  {
    name: 'Dép xốp đi trong nhà chống trượt siêu êm nhẹ chân',
    avatar: 'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/7/image/production/2026/7/image/Products/8788/5367299/nho-do-nhap-khau_202607231308359257.jpg',
    price: 35000,
    originalPrice: 49000,
    discountPercent: 29,
    unit: 'đôi'
  },
  {
    name: 'Dép quai ngang Unisex thời trang chống trơn trượt',
    avatar: 'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/7/image/production/2026/7/image/Products/8781/313899/da-mo-heo_202607140912162139.jpg',
    price: 49000,
    originalPrice: 69000,
    discountPercent: 29,
    unit: 'đôi'
  },
  {
    name: 'Túi vải Canvas thời trang đi chợ bảo vệ môi trường',
    avatar: 'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/7/image/production/2026/7/image/Products/8781/333450/thit-heo-xay-cp-100g_202607300938128442.jpg',
    price: 39000,
    originalPrice: 55000,
    discountPercent: 29,
    unit: 'cái'
  },
  {
    name: 'Nón kết thể thao lưỡi trai Unisex chống nắng phong cách',
    avatar: 'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/7/image/production/2026/7/image/Products/8781/283165/thit-heo-xay-cp-khay-200g_202607300939001657.jpg',
    price: 55000,
    originalPrice: 75000,
    discountPercent: 27,
    unit: 'cái'
  },
  {
    name: 'Bộ đồ thun lanh mặc nhà thoáng mát mùa hè nhiều họa tiết',
    avatar: 'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/7/image/production/2026/7/image/Products/8781/275804/ba-roi-heo-nhap-khau_202607130947458793.jpg',
    price: 115000,
    originalPrice: 155000,
    discountPercent: 26,
    unit: 'bộ'
  },
  {
    name: 'Balo vải dù đa năng chống thấm nước du lịch đi học',
    avatar: 'https://cdnv2.tgdd.vn/bhx-static/bhx/production/2026/7/image/production/2026/7/image/Products/8788/366365/tao-gala-mini-tui-800g_202607161559592238.jpg',
    price: 145000,
    originalPrice: 195000,
    discountPercent: 26,
    unit: 'cái'
  }
];

// Fallback images in case any CDN URL fails
for (const [catName, prodList] of Object.entries(productsData)) {
  prodList.forEach(p => {
    if (!p.avatar) {
      p.avatar = 'https://cdnv2-tmdt.tgdd.vn/bhx/product-fe/cart/home/_next/public/static/images/default-image.svg';
    }
  });
}

// Full output object
const fullData = {
  menuHeader: menuHeader,
  menuV2: menuV2,
  banners: preserved.banners,
  flashSale: preserved.flashSale,
  categories: productsData,
  tetTrungThu: preserved.tetTrungThu,
  sieuTietKiem: preserved.sieuTietKiem,
  promoBannerGrid: preserved.promoBannerGrid,
  categoryImageGrid: preserved.categoryImageGrid,
  homNayAnGi: preserved.homNayAnGi
};

const jsContent = `// Dữ liệu Chợ Giá Rẻ chuẩn hóa theo DANH MỤC SẢN PHẨM.xlsx\nwindow.BHX_DATA = ${JSON.stringify(fullData, null, 2)};\n`;
fs.writeFileSync('data.js', jsContent, 'utf8');
console.log('Successfully generated new data.js!');
