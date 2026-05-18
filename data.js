// Mock data for Xếp hạng — DNXH Sống Tử Tế
// Public globals: AMBASSADORS, SUPPLIERS, CURRENT_USER_ID, compute(), formatVND(), CRITERIA

window.formatVND = (n) => n.toLocaleString('vi-VN');
window.formatPts = (n) => Math.round(n).toLocaleString('vi-VN');

window.CRITERIA = [
  { key: 'rev',    label: 'Doanh thu',       short: 'DT',     emoji: '💰', color: '#0d6b5e', hint: '100.000đ trực tiếp = 1đ · 100.000đ gián tiếp = 0.5đ' },
  { key: 'zoom',   label: 'Check-in Zoom',   short: 'Zoom',   emoji: '🎥', color: '#c98f1f', hint: 'Tự check-in = 20đ · Mời người khác = 10đ' },
  { key: 'f1',     label: 'Số lượng F1',     short: 'F1',     emoji: '👥', color: '#6d7be0', hint: 'Mời người trở thành F1 = 20đ/người' },
  { key: 'study',  label: 'Học tập',         short: 'Học',    emoji: '📘', color: '#b3743a', hint: 'Điểm thô lấy từ App học tập' },
  { key: 'rating', label: 'Đánh giá',        short: 'Sao',    emoji: '⭐', color: '#c95f3d', hint: '1 sao = 100đ · 5 sao = 500đ (trung bình cấp trên/cấp dưới)' },
];

// Each row: directRev / indirectRev in VND; zoomSelf / zoomInvite counts;
// f1 count; study (raw points from app); ratingAvg (0–5) + ratingCount
window.AMBASSADORS = [
  { id: 'a01', name: 'Lê Hoàng Anh',       region: 'Hà Nội',     directRev: 92_400_000, indirectRev: 48_300_000, zoomSelf: 6, zoomInvite: 11, f1: 5, study: 340, ratingAvg: 4.8, ratingCount: 14 },
  { id: 'a02', name: 'Trần Văn Hùng',      region: 'TP.HCM',     directRev: 78_900_000, indirectRev: 55_600_000, zoomSelf: 5, zoomInvite: 9,  f1: 4, study: 295, ratingAvg: 4.7, ratingCount: 12 },
  { id: 'a03', name: 'Nguyễn Thị Mai',     region: 'Đà Nẵng',    directRev: 65_200_000, indirectRev: 62_400_000, zoomSelf: 6, zoomInvite: 7,  f1: 5, study: 310, ratingAvg: 4.6, ratingCount: 13 },
  { id: 'a04', name: 'Đặng Minh Quân',     region: 'Hà Nội',     directRev: 58_100_000, indirectRev: 41_700_000, zoomSelf: 5, zoomInvite: 8,  f1: 3, study: 285, ratingAvg: 4.6, ratingCount: 10 },
  { id: 'a05', name: 'Phạm Thanh Trúc',    region: 'TP.HCM',     directRev: 51_800_000, indirectRev: 38_900_000, zoomSelf: 4, zoomInvite: 9,  f1: 4, study: 260, ratingAvg: 4.5, ratingCount: 11 },
  { id: 'a06', name: 'Hoàng Phương Linh',  region: 'Hải Phòng',  directRev: 47_300_000, indirectRev: 32_500_000, zoomSelf: 5, zoomInvite: 6,  f1: 3, study: 270, ratingAvg: 4.5, ratingCount: 9  },
  { id: 'a07', name: 'Nguyễn An Khánh',    region: 'Hà Nội',     directRev: 42_500_000, indirectRev: 28_300_000, zoomSelf: 4, zoomInvite: 7,  f1: 3, study: 245, ratingAvg: 4.4, ratingCount: 10, isMe: true },
  { id: 'a08', name: 'Vũ Thị Hồng',        region: 'Cần Thơ',    directRev: 38_700_000, indirectRev: 31_200_000, zoomSelf: 4, zoomInvite: 5,  f1: 3, study: 220, ratingAvg: 4.4, ratingCount: 8  },
  { id: 'a09', name: 'Bùi Đức Tài',        region: 'Nha Trang',  directRev: 35_900_000, indirectRev: 24_800_000, zoomSelf: 3, zoomInvite: 6,  f1: 2, study: 235, ratingAvg: 4.3, ratingCount: 9  },
  { id: 'a10', name: 'Ngô Quốc Bảo',       region: 'TP.HCM',     directRev: 32_100_000, indirectRev: 26_400_000, zoomSelf: 4, zoomInvite: 4,  f1: 2, study: 210, ratingAvg: 4.3, ratingCount: 8  },
  { id: 'a11', name: 'Lý Tuấn Kiệt',       region: 'Đà Nẵng',    directRev: 28_500_000, indirectRev: 22_100_000, zoomSelf: 3, zoomInvite: 5,  f1: 2, study: 195, ratingAvg: 4.2, ratingCount: 7  },
  { id: 'a12', name: 'Đỗ Thị Hà',          region: 'Hà Nội',     directRev: 25_800_000, indirectRev: 19_700_000, zoomSelf: 3, zoomInvite: 4,  f1: 2, study: 180, ratingAvg: 4.2, ratingCount: 6  },
  { id: 'a13', name: 'Phan Hải Yến',       region: 'Huế',        directRev: 22_400_000, indirectRev: 18_300_000, zoomSelf: 2, zoomInvite: 5,  f1: 1, study: 175, ratingAvg: 4.1, ratingCount: 7  },
  { id: 'a14', name: 'Trịnh Văn Đạt',      region: 'Hải Phòng',  directRev: 19_700_000, indirectRev: 14_500_000, zoomSelf: 3, zoomInvite: 3,  f1: 1, study: 160, ratingAvg: 4.0, ratingCount: 6  },
  { id: 'a15', name: 'Mai Thu Hằng',       region: 'Vũng Tàu',   directRev: 16_300_000, indirectRev: 12_800_000, zoomSelf: 2, zoomInvite: 3,  f1: 1, study: 145, ratingAvg: 4.0, ratingCount: 5  },
  { id: 'a16', name: 'Cao Ngọc Diệp',      region: 'TP.HCM',     directRev: 13_500_000, indirectRev: 10_400_000, zoomSelf: 2, zoomInvite: 2,  f1: 0, study: 130, ratingAvg: 3.9, ratingCount: 5  },
];

window.SUPPLIERS = [
  { id: 's01', name: 'Mật Ong Hoa Cà Phê Tây Nguyên', region: 'Đắk Lắk',     directRev: 124_500_000, indirectRev: 38_200_000, zoomSelf: 5, zoomInvite: 8, f1: 6, study: 290, ratingAvg: 4.8, ratingCount: 18 },
  { id: 's02', name: 'Yến Sào Khánh Hòa',             region: 'Khánh Hòa',    directRev: 108_200_000, indirectRev: 42_100_000, zoomSelf: 6, zoomInvite: 6, f1: 5, study: 275, ratingAvg: 4.7, ratingCount: 16 },
  { id: 's03', name: 'Trà Sạch Mộc Châu',             region: 'Sơn La',       directRev: 89_700_000,  indirectRev: 36_800_000, zoomSelf: 5, zoomInvite: 7, f1: 5, study: 265, ratingAvg: 4.7, ratingCount: 15 },
  { id: 's04', name: 'Cà Phê Buôn Mê',                region: 'Đắk Lắk',      directRev: 76_400_000,  indirectRev: 41_500_000, zoomSelf: 4, zoomInvite: 8, f1: 4, study: 250, ratingAvg: 4.6, ratingCount: 14 },
  { id: 's05', name: 'Tinh Dầu Quế Trà My',           region: 'Quảng Nam',    directRev: 64_300_000,  indirectRev: 28_900_000, zoomSelf: 5, zoomInvite: 5, f1: 4, study: 240, ratingAvg: 4.6, ratingCount: 12 },
  { id: 's06', name: 'Hạt Điều Bình Phước',           region: 'Bình Phước',   directRev: 58_100_000,  indirectRev: 24_700_000, zoomSelf: 4, zoomInvite: 6, f1: 3, study: 220, ratingAvg: 4.5, ratingCount: 11 },
  { id: 's07', name: 'Sống Tử Tế Store',              region: 'Hà Nội',       directRev: 51_800_000,  indirectRev: 22_400_000, zoomSelf: 4, zoomInvite: 5, f1: 3, study: 215, ratingAvg: 4.5, ratingCount: 10, isMe: true },
  { id: 's08', name: 'Gốm Bát Tràng An Lạc',          region: 'Hà Nội',       directRev: 46_500_000,  indirectRev: 19_800_000, zoomSelf: 3, zoomInvite: 6, f1: 3, study: 200, ratingAvg: 4.4, ratingCount: 10 },
  { id: 's09', name: 'Nông Sản Sapa Xanh',            region: 'Lào Cai',      directRev: 41_200_000,  indirectRev: 17_500_000, zoomSelf: 4, zoomInvite: 4, f1: 2, study: 195, ratingAvg: 4.4, ratingCount: 9  },
  { id: 's10', name: 'Lúa Hữu Cơ Đồng Tháp',          region: 'Đồng Tháp',    directRev: 37_400_000,  indirectRev: 21_300_000, zoomSelf: 3, zoomInvite: 5, f1: 2, study: 180, ratingAvg: 4.3, ratingCount: 8  },
  { id: 's11', name: 'Rau Sạch Đà Lạt',               region: 'Lâm Đồng',     directRev: 33_800_000,  indirectRev: 14_900_000, zoomSelf: 3, zoomInvite: 4, f1: 2, study: 175, ratingAvg: 4.3, ratingCount: 8  },
  { id: 's12', name: 'Tiêu Đen Phú Quốc',             region: 'Kiên Giang',   directRev: 29_500_000,  indirectRev: 13_200_000, zoomSelf: 2, zoomInvite: 5, f1: 2, study: 160, ratingAvg: 4.2, ratingCount: 7  },
  { id: 's13', name: 'Nước Mắm Cát Hải',              region: 'Hải Phòng',    directRev: 26_300_000,  indirectRev: 11_700_000, zoomSelf: 3, zoomInvite: 3, f1: 1, study: 155, ratingAvg: 4.1, ratingCount: 6  },
  { id: 's14', name: 'Cá Khô Phan Thiết',             region: 'Bình Thuận',   directRev: 22_100_000,  indirectRev: 9_800_000,  zoomSelf: 2, zoomInvite: 3, f1: 1, study: 140, ratingAvg: 4.1, ratingCount: 6  },
  { id: 's15', name: 'Trà Shan Tuyết',                region: 'Hà Giang',     directRev: 18_500_000,  indirectRev: 8_400_000,  zoomSelf: 2, zoomInvite: 2, f1: 1, study: 130, ratingAvg: 4.0, ratingCount: 5  },
  { id: 's16', name: 'Bánh Tráng Tây Ninh',           region: 'Tây Ninh',     directRev: 14_200_000,  indirectRev: 6_700_000,  zoomSelf: 1, zoomInvite: 2, f1: 0, study: 115, ratingAvg: 3.9, ratingCount: 4  },
];

window.compute = function compute(p) {
  const ptRevDirect = p.directRev / 100_000;
  const ptRevIndirect = (p.indirectRev / 100_000) * 0.5;
  const ptRev = ptRevDirect + ptRevIndirect;
  const ptZoomSelf = p.zoomSelf * 20;
  const ptZoomInvite = p.zoomInvite * 10;
  const ptZoom = ptZoomSelf + ptZoomInvite;
  const ptF1 = p.f1 * 20;
  const ptStudy = p.study;
  const ptRating = Math.round(p.ratingAvg * 100);
  const total = ptRev + ptZoom + ptF1 + ptStudy + ptRating;
  return {
    rev: ptRev, revDirect: ptRevDirect, revIndirect: ptRevIndirect,
    zoom: ptZoom, zoomSelf: ptZoomSelf, zoomInvite: ptZoomInvite,
    f1: ptF1,
    study: ptStudy,
    rating: ptRating,
    total,
  };
};

// Period multipliers — mock the same data scaled by period selection
window.PERIOD_FACTOR = { day: 0.06, week: 0.25, month: 1.0, year: 9.4 };
window.PERIOD_LABEL = { day: 'Hôm nay', week: 'Tuần này', month: 'Tháng này', year: 'Năm nay' };
window.PERIOD_RANGE = {
  day:   '17/05/2026',
  week:  '11/05 – 17/05/2026',
  month: '01/05 – 17/05/2026',
  year:  '01/01 – 17/05/2026',
};

// ───────────────────────── Per-person detail generators ─────────────────────────

const CUSTOMERS = [
  'Phạm Thị Lan', 'Trần Quốc Việt', 'Lê Minh Tâm', 'Đỗ Hồng Vân',
  'Nguyễn Hữu Phúc', 'Bùi Thanh Hà', 'Vũ Quang Huy', 'Hoàng Mỹ Linh',
  'Lý Văn Bình', 'Phan Bảo Trân', 'Trịnh Như Quỳnh', 'Mai Đức Lương',
  'Cao Thu Hằng', 'Đào Văn Khoa', 'Nguyễn Hồng Nhung', 'Lê Quốc Đạt',
  'Phạm Bá Hùng', 'Vũ Thuỳ Dương', 'Hoàng Tấn Phát', 'Trần Mỹ Duyên',
];
const PRODUCTS = [
  { name: 'Mật ong rừng Tây Nguyên 500ml',    unit: 165_000 },
  { name: 'Trà shan tuyết cổ thụ 200g',        unit: 285_000 },
  { name: 'Gạo lứt huyết rồng 5kg',            unit: 245_000 },
  { name: 'Yến sào tinh chế hộp 100g',         unit: 1_850_000 },
  { name: 'Tinh dầu quế Trà My 10ml',          unit: 145_000 },
  { name: 'Cà phê Arabica rang xay 250g',      unit: 175_000 },
  { name: 'Hạt điều rang muối 500g',           unit: 195_000 },
  { name: 'Tiêu đen Phú Quốc 250g',            unit: 115_000 },
  { name: 'Nước mắm cá cơm Cát Hải 500ml',     unit: 95_000 },
  { name: 'Bánh tráng phơi sương Tây Ninh',    unit: 65_000 },
  { name: 'Rau hữu cơ Đà Lạt combo tuần',      unit: 285_000 },
  { name: 'Trà xanh Thái Nguyên 100g',         unit: 125_000 },
];
const ZOOM_SESSIONS = [
  'Họp đào tạo đại sứ tuần 19',
  'Sharing: Bán hàng qua livestream',
  'Demo sản phẩm mới — Mật ong rừng',
  'Workshop xây dựng đội ngũ F1',
  'Họp tổng kết tháng 04/2026',
  'Q&A với Ban giám đốc',
  'Đào tạo CSKH cơ bản',
  'Sharing: Kỹ năng tư vấn khách hàng',
  'Họp định hướng Q2/2026',
];
const COURSES = [
  { name: 'Triết lý Sống Tử Tế',           max: 100 },
  { name: 'Kỹ năng bán hàng cơ bản',       max: 80  },
  { name: 'Nắm bắt sản phẩm hữu cơ',       max: 60  },
  { name: 'CSKH chuyên nghiệp',            max: 50  },
  { name: 'Xây dựng đội ngũ F1',           max: 70  },
  { name: 'Livestream bán hàng',           max: 40  },
  { name: 'Quản lý đơn hàng & tồn kho',    max: 30  },
];
const REVIEWERS_SUP = [
  'Ông Nguyễn Văn Hùng',
  'Bà Trần Bích Hằng',
  'Ông Lê Quang Vinh',
  'Bà Phạm Thanh Hoà',
];
const REVIEWERS_SUP_ROLE = {
  'Ông Nguyễn Văn Hùng': 'Giám đốc',
  'Bà Trần Bích Hằng': 'Phó giám đốc',
  'Ông Lê Quang Vinh': 'Quản lý vùng',
  'Bà Phạm Thanh Hoà': 'Trưởng phòng đào tạo',
};
const RATING_COMMENTS = [
  'Tận tâm với khách hàng, phản hồi nhanh.',
  'Năng nổ trong các buổi đào tạo nội bộ.',
  'Chia sẻ kinh nghiệm rất hữu ích cho team.',
  'Hoàn thành mục tiêu doanh thu vượt kỳ vọng.',
  'Hỗ trợ đồng đội nhiệt tình, đúng giờ.',
  'Cần cải thiện thời gian phản hồi cuối tuần.',
  'Giữ tinh thần tích cực kể cả khi áp lực.',
  'Tư vấn sản phẩm chính xác, có chiều sâu.',
  '',
];
const REGIONS = ['Hà Nội', 'TP.HCM', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ', 'Nha Trang', 'Huế', 'Vũng Tàu', 'Lâm Đồng', 'Đắk Lắk'];

function seedRand(seed) {
  let s = seed || 1;
  return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
}
function hashId(id) {
  let h = 17;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % 1e7;
  return h;
}
function pick(rand, arr) { return arr[Math.floor(rand() * arr.length)]; }
function dayStr(d) { return d.toString().padStart(2, '0') + '/05/2026'; }

window.getOrderDetails = function (person) {
  const rand = seedRand(hashId(person.id));
  const orders = [];
  let nextId = 47000 + (hashId(person.id) % 2000);

  function gen(rem, type) {
    while (rem > 600_000) {
      const prod = pick(rand, PRODUCTS);
      const qty = 1 + Math.floor(rand() * 6);
      const amount = prod.unit * qty;
      if (amount > rem * 1.2) {
        // single small order
        const small = prod.unit * Math.max(1, Math.min(qty, Math.ceil(rem / prod.unit)));
        const day = 1 + Math.floor(rand() * 17);
        orders.push({
          orderId: 'OD' + (nextId++),
          dayKey: day, date: dayStr(day),
          customer: pick(rand, CUSTOMERS),
          product: prod.name,
          qty: Math.ceil(small / prod.unit),
          amount: small,
          type,
          points: type === 'direct' ? small / 100_000 : small / 100_000 * 0.5,
          referrer: type === 'indirect' ? 'F1 — ' + pick(rand, CUSTOMERS).split(' ').slice(-1)[0] : null,
        });
        rem -= small;
        if (rem < prod.unit) break;
      } else {
        const day = 1 + Math.floor(rand() * 17);
        orders.push({
          orderId: 'OD' + (nextId++),
          dayKey: day, date: dayStr(day),
          customer: pick(rand, CUSTOMERS),
          product: prod.name,
          qty,
          amount,
          type,
          points: type === 'direct' ? amount / 100_000 : amount / 100_000 * 0.5,
          referrer: type === 'indirect' ? 'F1 — ' + pick(rand, CUSTOMERS).split(' ').slice(-1)[0] : null,
        });
        rem -= amount;
      }
    }
  }

  gen(person.directRev, 'direct');
  gen(person.indirectRev, 'indirect');
  orders.sort((a, b) => b.dayKey - a.dayKey);
  return orders;
};

window.getZoomDetails = function (person) {
  const rand = seedRand(hashId(person.id) + 7);
  const self = [];
  for (let i = 0; i < person.zoomSelf; i++) {
    const day = 1 + Math.floor(rand() * 17);
    self.push({
      session: pick(rand, ZOOM_SESSIONS),
      date: dayStr(day), dayKey: day,
      duration: 30 + Math.floor(rand() * 75),
      checkInTime: (8 + Math.floor(rand() * 12)) + ':' + (Math.floor(rand() * 6)) + '0',
      points: 20,
    });
  }
  const invited = [];
  for (let i = 0; i < person.zoomInvite; i++) {
    const day = 1 + Math.floor(rand() * 17);
    invited.push({
      invitee: pick(rand, CUSTOMERS),
      role: rand() > 0.45 ? 'F1' : 'Khách',
      session: pick(rand, ZOOM_SESSIONS),
      date: dayStr(day), dayKey: day,
      points: 10,
    });
  }
  self.sort((a, b) => b.dayKey - a.dayKey);
  invited.sort((a, b) => b.dayKey - a.dayKey);
  return { self, invited };
};

window.getF1Details = function (person) {
  const rand = seedRand(hashId(person.id) + 11);
  const list = [];
  for (let i = 0; i < person.f1; i++) {
    const day = 1 + Math.floor(rand() * 17);
    list.push({
      name: pick(rand, CUSTOMERS),
      region: pick(rand, REGIONS),
      joinedDate: dayStr(day), dayKey: day,
      status: rand() > 0.25 ? 'Đang hoạt động' : 'Mới gia nhập',
      orders: Math.floor(rand() * 9),
      revContrib: Math.floor(rand() * 28) * 1_000_000 + 500_000,
      points: 20,
    });
  }
  list.sort((a, b) => b.dayKey - a.dayKey);
  return list;
};

window.getStudyDetails = function (person) {
  const rand = seedRand(hashId(person.id) + 13);
  const shuffled = [...COURSES].sort(() => rand() - 0.5);
  const list = [];
  let rem = person.study;
  for (const c of shuffled) {
    if (rem <= 5) break;
    const target = Math.min(rem, Math.round(c.max * (0.55 + rand() * 0.55)));
    const score = Math.max(5, Math.min(c.max, target));
    const day = 1 + Math.floor(rand() * 17);
    list.push({
      course: c.name,
      completedDate: dayStr(day), dayKey: day,
      score, maxScore: c.max,
      progress: Math.min(1, score / c.max),
    });
    rem -= score;
  }
  list.sort((a, b) => b.dayKey - a.dayKey);
  return list;
};

window.getRatingDetails = function (person) {
  const rand = seedRand(hashId(person.id) + 17);
  const list = [];
  const supCount = Math.max(1, Math.ceil(person.ratingCount * 0.35));
  const subCount = Math.max(0, person.ratingCount - supCount);

  // Subordinate reviewer pool drawn from CUSTOMERS for variety
  const subPool = [];
  for (let i = 0; i < subCount; i++) subPool.push(pick(rand, CUSTOMERS));

  function genStars() {
    const dev = (rand() - 0.5) * 0.8;
    return Math.max(1, Math.min(5, Math.round(person.ratingAvg + dev)));
  }

  for (let i = 0; i < supCount; i++) {
    const reviewer = pick(rand, REVIEWERS_SUP);
    const stars = genStars();
    const day = 1 + Math.floor(rand() * 17);
    list.push({
      reviewer,
      reviewerRole: REVIEWERS_SUP_ROLE[reviewer],
      role: 'Cấp trên',
      stars,
      date: dayStr(day), dayKey: day,
      comment: rand() > 0.35 ? pick(rand, RATING_COMMENTS) : '',
    });
  }
  for (let i = 0; i < subCount; i++) {
    const stars = genStars();
    const day = 1 + Math.floor(rand() * 17);
    list.push({
      reviewer: subPool[i],
      reviewerRole: 'F1',
      role: 'Cấp dưới',
      stars,
      date: dayStr(day), dayKey: day,
      comment: rand() > 0.5 ? pick(rand, RATING_COMMENTS) : '',
    });
  }
  list.sort((a, b) => b.dayKey - a.dayKey);

  // breakdown by stars
  const breakdown = [5, 4, 3, 2, 1].map(s => ({
    stars: s,
    count: list.filter(r => r.stars === s).length,
  }));
  return { list, breakdown };
};

window.scaleRow = function scaleRow(p, factor) {
  return {
    ...p,
    directRev: Math.round(p.directRev * factor),
    indirectRev: Math.round(p.indirectRev * factor),
    zoomSelf: Math.max(0, Math.round(p.zoomSelf * factor)),
    zoomInvite: Math.max(0, Math.round(p.zoomInvite * factor)),
    f1: Math.max(0, Math.round(p.f1 * factor)),
    study: Math.round(p.study * factor),
    // ratingAvg stays the same regardless of period
  };
};

// ───────────────────────── Tiers, badges, deltas, percentile ─────────────────────────

window.TIERS = [
  { key: 'platinum', label: 'Bạch kim', min: 2200, color: '#6d7be0', soft: '#e9ecfa', emoji: '💠' },
  { key: 'gold',     label: 'Vàng',    min: 1500, color: '#c98f1f', soft: '#fbf2d9', emoji: '🥇' },
  { key: 'silver',   label: 'Bạc',     min: 800,  color: '#7c8595', soft: '#eef0f3', emoji: '🥈' },
  { key: 'bronze',   label: 'Đồng',    min: 0,    color: '#b3743a', soft: '#f5e5d4', emoji: '🥉' },
];

window.getTier = function (points) {
  for (const t of TIERS) if (points >= t.min) return t;
  return TIERS[TIERS.length - 1];
};

window.getNextTier = function (points) {
  // Iterate from lowest tier upward; return the first tier above current points.
  for (let i = TIERS.length - 1; i >= 0; i--) {
    if (points < TIERS[i].min) {
      const next = TIERS[i];
      const cur = i + 1 < TIERS.length ? TIERS[i + 1] : null;
      const base = cur ? cur.min : 0;
      const progress = (points - base) / (next.min - base);
      return { next, current: cur, need: next.min - points, progress: Math.max(0, Math.min(1, progress)) };
    }
  }
  return null; // already at top tier
};

window.getDelta = function (person, currentRank, total) {
  // Deterministic ±3 variance based on id hash → mock previous-period rank.
  const v = (hashId(person.id) % 7) - 3; // -3..+3
  const prev = Math.max(1, Math.min(total, currentRank + v));
  return prev - currentRank; // positive = moved up
};

window.getBadges = function (person, rows) {
  const badges = [];

  if (person.rank === 1) badges.push({ emoji: '🏆', label: 'Top 1', cls: 'gold' });

  // Best on each criterion (only mark if person actually leads)
  for (const c of CRITERIA) {
    let topVal = -1, topId = null;
    for (const r of rows) {
      if (r.pts[c.key] > topVal) { topVal = r.pts[c.key]; topId = r.id; }
    }
    if (topId === person.id && topVal > 0 && person.rank > 1) {
      badges.push({ emoji: c.emoji, label: 'Số 1 ' + c.label, cls: 'crit' });
    }
  }

  // Streak (deterministic mock)
  const streak = (hashId(person.id) >> 3) % 6;
  if (streak >= 3 && person.rank <= 6) {
    badges.push({ emoji: '🔥', label: streak + ' tuần liền top 6', cls: 'streak' });
  }

  // New member (mock for lower ranks)
  if (person.rank >= 13 && (hashId(person.id) % 4 === 0)) {
    badges.push({ emoji: '🌱', label: 'Mới gia nhập', cls: 'new' });
  }

  return badges.slice(0, 2);
};

window.getPercentile = function (rows, critKey, value) {
  if (!rows.length) return 0;
  const sorted = rows.map(r => r.pts[critKey]).sort((a, b) => a - b);
  const max = sorted[sorted.length - 1];
  if (max <= 0) return 0;
  return value / max; // 0..1, normalized to max
};
