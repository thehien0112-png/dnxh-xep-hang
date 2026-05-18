/* Xếp hạng — DNXH Sống Tử Tế
 * React app. Globals from data.js: AMBASSADORS, SUPPLIERS, CRITERIA, compute, scaleRow,
 * PERIOD_FACTOR, PERIOD_LABEL, PERIOD_RANGE, formatVND, formatPts.
 * Globals from tweaks-panel.jsx: TweaksPanel, useTweaks, TweakSection, TweakRadio.
 */

const { useState, useMemo, useEffect, useRef } = React;
const PersonDetail = window.PersonDetail;
const CompareDrawer = window.CompareDrawer;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "layout": "table",
  "sidebar_ctx": "ambassador"
}/*EDITMODE-END*/;

// ───────────────────────────── Sidebar ─────────────────────────────

const AMB_NAV = [
  { key: 'baocao',   label: 'Báo cáo',            icon: 'chart' },
  { key: 'cskh',     label: 'CSKH',               icon: 'headset' },
  { key: 'donhang',  label: 'Đơn hàng',           icon: 'cart' },
  { key: 'f1',       label: 'Danh sách F1',       icon: 'users' },
  { key: 'danhgia',  label: 'Đánh giá',           icon: 'star' },
  { key: 'tracuu',   label: 'Tra cứu khách hàng', icon: 'search-user' },
  { key: 'xephang',  label: 'Xếp hạng',           icon: 'trophy', isNew: true },
  { key: 'taikhoan', label: 'Tài khoản',          icon: 'user' },
];

const NCC_NAV = [
  { key: 'thongke',  label: 'Thống kê',         icon: 'chart' },
  { key: 'sanpham',  label: 'Sản phẩm',         icon: 'box' },
  { key: 'donhang',  label: 'Đơn hàng',         icon: 'cart' },
  { key: 'tra',      label: 'Yêu cầu trả hàng', icon: 'return' },
  { key: 'caidat',   label: 'Cài đặt',          icon: 'gear', expandable: true },
  { key: 'kho',      label: 'Kho hàng',         icon: 'warehouse' },
  { key: 'xephang',  label: 'Xếp hạng',         icon: 'trophy', isNew: true },
];

function Icon({ name, size = 18 }) {
  const s = { width: size, height: size, strokeWidth: 1.7, stroke: 'currentColor', fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (name) {
    case 'chart':       return <svg viewBox="0 0 24 24" {...s}><path d="M4 20h16M6 16V10M11 16V6M16 16v-4"/></svg>;
    case 'headset':     return <svg viewBox="0 0 24 24" {...s}><path d="M4 13a8 8 0 1116 0v4a3 3 0 01-3 3h-1v-7h4M4 13v4a3 3 0 003 3h1v-7H4"/></svg>;
    case 'cart':        return <svg viewBox="0 0 24 24" {...s}><circle cx="9" cy="20" r="1.4"/><circle cx="17" cy="20" r="1.4"/><path d="M3 4h2l2.5 11h11l2-8H6"/></svg>;
    case 'users':       return <svg viewBox="0 0 24 24" {...s}><circle cx="9" cy="9" r="3.2"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><path d="M16 11a3 3 0 100-6"/><path d="M21 20c0-2.6-1.7-4.8-4-5.6"/></svg>;
    case 'star':        return <svg viewBox="0 0 24 24" {...s}><path d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3 6.4 20.2l1.1-6.2L3 9.6l6.2-.9z"/></svg>;
    case 'search-user': return <svg viewBox="0 0 24 24" {...s}><circle cx="10" cy="9" r="3.2"/><path d="M4 19c.6-2.8 3-4.8 6-4.8s5.4 2 6 4.8"/><circle cx="17.5" cy="17.5" r="2.8"/><path d="M20 20l2 2"/></svg>;
    case 'trophy':      return <svg viewBox="0 0 24 24" {...s}><path d="M8 4h8v5a4 4 0 01-8 0V4z"/><path d="M8 6H5v2a3 3 0 003 3M16 6h3v2a3 3 0 01-3 3"/><path d="M10 15h4v3h-4zM8 21h8"/></svg>;
    case 'user':        return <svg viewBox="0 0 24 24" {...s}><circle cx="12" cy="8" r="3.5"/><path d="M5 20c0-3.9 3.1-7 7-7s7 3.1 7 7"/></svg>;
    case 'box':         return <svg viewBox="0 0 24 24" {...s}><path d="M3 7l9-4 9 4-9 4-9-4zM3 7v10l9 4M21 7v10l-9 4M12 11v10"/></svg>;
    case 'return':      return <svg viewBox="0 0 24 24" {...s}><path d="M4 8a8 8 0 0114 5M4 8l4-3M4 8l4 3M20 16a8 8 0 01-14-5M20 16l-4 3M20 16l-4-3"/></svg>;
    case 'gear':        return <svg viewBox="0 0 24 24" {...s}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 00.4 1.9l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.9-.4 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1-1.5 1.7 1.7 0 00-1.9.4l-.1.1A2 2 0 113.3 17.1l.1-.1a1.7 1.7 0 00.4-1.9 1.7 1.7 0 00-1.5-1H2a2 2 0 110-4h.1a1.7 1.7 0 001.5-1 1.7 1.7 0 00-.4-1.9l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.9.4h0a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.9-.4l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.4 1.9v0a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z"/></svg>;
    case 'warehouse':   return <svg viewBox="0 0 24 24" {...s}><path d="M3 10l9-5 9 5v10H3zM7 20v-6h10v6M7 14h10"/></svg>;
    case 'logout':      return <svg viewBox="0 0 24 24" {...s}><path d="M10 17l-5-5 5-5M5 12h12M14 4h4a2 2 0 012 2v12a2 2 0 01-2 2h-4"/></svg>;
    case 'check':       return <svg viewBox="0 0 24 24" {...s}><path d="M5 12l5 5L20 7"/></svg>;
    case 'chevron-down': return <svg viewBox="0 0 24 24" {...s}><path d="M6 9l6 6 6-6"/></svg>;
    case 'chevron-up':   return <svg viewBox="0 0 24 24" {...s}><path d="M6 15l6-6 6 6"/></svg>;
    case 'copy':        return <svg viewBox="0 0 24 24" {...s}><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 012-2h10"/></svg>;
    case 'download':    return <svg viewBox="0 0 24 24" {...s}><path d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16"/></svg>;
    case 'search':      return <svg viewBox="0 0 24 24" {...s}><circle cx="11" cy="11" r="6"/><path d="M20 20l-4.3-4.3"/></svg>;
    case 'cart-bag':    return <svg viewBox="0 0 24 24" {...s}><circle cx="9" cy="20" r="1.4"/><circle cx="17" cy="20" r="1.4"/><path d="M3 4h2l2.5 11h11l2-8H6"/></svg>;
    case 'sparkle':     return <svg viewBox="0 0 24 24" {...s}><path d="M12 3v6M12 15v6M3 12h6M15 12h6M5.6 5.6l4.2 4.2M14.2 14.2l4.2 4.2M5.6 18.4l4.2-4.2M14.2 9.8l4.2-4.2"/></svg>;
    default: return null;
  }
}

function Sidebar({ ctx }) {
  const isNcc = ctx === 'ncc';
  const nav = isNcc ? NCC_NAV : AMB_NAV;
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">
          <svg viewBox="0 0 32 32" width="32" height="32">
            <path d="M16 4 L28 24 L4 24 Z" fill="none" stroke="#0d6b5e" strokeWidth="2"/>
            <path d="M16 11 L23 22 L9 22 Z" fill="none" stroke="#0d6b5e" strokeWidth="1.5"/>
          </svg>
        </div>
        <div className="brand-text">
          <div className="brand-title">DNXH SỐNG TỬ TẾ</div>
          <div className="brand-sub">Xanh - Sạch - Sáng</div>
        </div>
      </div>

      {!isNcc && (
        <div className="user-block">
          <div className="user-avatar">A</div>
          <div className="user-meta">
            <div className="user-name">ADMIN Super</div>
            <div className="user-role">Tài khoản Đại sứ <span className="chev">⌄</span></div>
            <div className="user-balance">Số dư: <strong>635.773 đ</strong></div>
          </div>
        </div>
      )}

      {isNcc && (
        <div className="ncc-search">
          <Icon name="search" size={14}/>
          <span>Tìm kiếm</span>
        </div>
      )}

      <nav className="nav">
        {nav.map((item) => (
          <div
            key={item.key}
            className={'nav-item' + (item.key === 'xephang' ? ' nav-item--active' : '')}
          >
            <span className="nav-ico"><Icon name={item.icon}/></span>
            <span className="nav-label">{item.label}</span>
            {item.isNew && <span className="nav-pill">Mới</span>}
            {item.expandable && <span className="nav-chev">▾</span>}
          </div>
        ))}
      </nav>

      <div className="sidebar-foot">
        <div className="nav-item nav-item--muted">
          <span className="nav-ico"><Icon name="logout"/></span>
          <span className="nav-label">Đăng xuất</span>
        </div>
      </div>
    </aside>
  );
}

// ───────────────────────────── Top bar ─────────────────────────────

function TopBar({ ctx, period, setPeriod }) {
  return (
    <div className="topbar">
      <div className="topbar-left">
        <h1 className="page-title">Xếp hạng</h1>
        <span className="topbar-sub">{PERIOD_LABEL[period]} · {PERIOD_RANGE[period]}</span>
      </div>
      <div className="topbar-right">
        <PeriodSelect value={period} onChange={setPeriod}/>
        <button className="btn btn-primary"><Icon name="download" size={14}/> Xuất báo cáo</button>
      </div>
    </div>
  );
}

function PeriodSelect({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const fn = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);
  const opts = [
    { k: 'day',   label: 'Hôm nay' },
    { k: 'week',  label: 'Tuần này' },
    { k: 'month', label: 'Tháng này' },
    { k: 'year',  label: 'Năm nay' },
  ];
  return (
    <div className="period-select" ref={ref}>
      <button className="period-btn" onClick={() => setOpen(o => !o)}>
        {PERIOD_LABEL[value]}
        <Icon name="chevron-down" size={14}/>
      </button>
      {open && (
        <div className="period-menu">
          {opts.map(o => (
            <button
              key={o.k}
              className={'period-opt' + (o.k === value ? ' period-opt--active' : '')}
              onClick={() => { onChange(o.k); setOpen(false); }}
            >
              {o.label}
              {o.k === value && <Icon name="check" size={14}/>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ───────────────────────────── Mode tabs + scoring legend ─────────────────────────────

function ModeTabs({ mode, setMode }) {
  return (
    <div className="mode-tabs">
      <button
        className={'mode-tab' + (mode === 'ambassador' ? ' mode-tab--active' : '')}
        onClick={() => setMode('ambassador')}
      >
        <span className="mode-tab-ico">🤝</span>
        <span className="mode-tab-text">
          <span className="mode-tab-title">Đại sứ <span className="vs">vs</span> Đại sứ</span>
          <span className="mode-tab-sub">Bảng xếp hạng nội bộ đại sứ</span>
        </span>
      </button>
      <button
        className={'mode-tab' + (mode === 'supplier' ? ' mode-tab--active' : '')}
        onClick={() => setMode('supplier')}
      >
        <span className="mode-tab-ico">🏪</span>
        <span className="mode-tab-text">
          <span className="mode-tab-title">NCC <span className="vs">vs</span> NCC</span>
          <span className="mode-tab-sub">Bảng xếp hạng nhà cung cấp</span>
        </span>
      </button>
    </div>
  );
}

function ScoringLegend() {
  const [open, setOpen] = useState(false);
  return (
    <div className={'legend' + (open ? ' legend--open' : '')}>
      <button className="legend-head" onClick={() => setOpen(o => !o)}>
        <span className="legend-title">
          <Icon name="sparkle" size={14}/>
          Công thức tính điểm
        </span>
        <span className="legend-toggle">
          {open ? 'Thu gọn' : 'Xem chi tiết'}
          <Icon name={open ? 'chevron-up' : 'chevron-down'} size={14}/>
        </span>
      </button>
      {open && (
        <div className="legend-body">
          <div className="legend-card">
            <div className="legend-ix">1</div>
            <div className="legend-name">💰 Doanh thu</div>
            <div className="legend-rule">100.000đ <em>trực tiếp</em> = 1đ</div>
            <div className="legend-rule">100.000đ <em>gián tiếp</em> = 0.5đ</div>
          </div>
          <div className="legend-card">
            <div className="legend-ix">2</div>
            <div className="legend-name">🎥 Check-in Zoom</div>
            <div className="legend-rule">Tự check-in = 20đ</div>
            <div className="legend-rule">Mời người khác = 10đ</div>
          </div>
          <div className="legend-card">
            <div className="legend-ix">3</div>
            <div className="legend-name">👥 Số lượng F1</div>
            <div className="legend-rule">Mời F1 mới = 20đ / người</div>
          </div>
          <div className="legend-card">
            <div className="legend-ix">4</div>
            <div className="legend-name">📘 Học tập</div>
            <div className="legend-rule">Điểm thô lấy từ App</div>
          </div>
          <div className="legend-card">
            <div className="legend-ix">5</div>
            <div className="legend-name">⭐ Đánh giá cấp trên/dưới</div>
            <div className="legend-rule">1 sao = 100đ … 5 sao = 500đ</div>
          </div>
        </div>
      )}
    </div>
  );
}

// ───────────────────────────── Toolbar (search, filter, compare bar) ─────────────────────────────

function Toolbar({ searchQ, setSearchQ, totalCount, filteredCount }) {
  const isFiltering = !!searchQ;
  return (
    <div className="toolbar card">
      <div className="toolbar-search">
        <Icon name="search" size={16}/>
        <input
          type="text"
          placeholder="Tìm theo tên…"
          value={searchQ}
          onChange={(e) => setSearchQ(e.target.value)}
        />
        {searchQ && (
          <button className="toolbar-search-x" onClick={() => setSearchQ('')} title="Xoá tìm kiếm">✕</button>
        )}
      </div>

      <div className="toolbar-count">
        {isFiltering ? (
          <span>Hiển thị <strong>{filteredCount}</strong> / {totalCount}</span>
        ) : (
          <span>Tổng <strong>{totalCount}</strong></span>
        )}
        {isFiltering && (
          <button className="toolbar-clear" onClick={() => setSearchQ('')}>
            Bỏ lọc
          </button>
        )}
      </div>
    </div>
  );
}

function EmptyState({ onClear }) {
  return (
    <div className="empty-state card">
      <div className="empty-emoji">📭</div>
      <div className="empty-h">Không tìm thấy ai phù hợp</div>
      <div className="empty-sub">Thử thay đổi từ khoá tìm kiếm.</div>
      <button className="btn btn-primary-outline" onClick={onClear}>Bỏ tất cả bộ lọc</button>
    </div>
  );
}

function CompareBar({ count, onClear, onOpen }) {
  const canCompare = count >= 2;
  return (
    <div className="cmp-bar">
      <div className="cmp-bar-text">
        <span className="cmp-bar-count">{count}</span>
        <span>{count === 1 ? 'người được chọn' : 'người được chọn'} để so sánh</span>
        {!canCompare && <span className="cmp-bar-hint">· Chọn ≥ 2 người để mở so sánh</span>}
      </div>
      <div className="cmp-bar-actions">
        <button className="cmp-bar-clear" onClick={onClear}>Bỏ chọn</button>
        <button className="cmp-bar-open" onClick={onOpen} disabled={!canCompare}>
          So sánh {count} người
        </button>
      </div>
    </div>
  );
}

function DeltaIndicator({ delta }) {
  if (delta === 0) return <span className="delta delta--same" title="Giữ nguyên vị trí">→</span>;
  if (delta > 0) return <span className="delta delta--up" title={`Lên ${delta} bậc so với kỳ trước`}>↑{delta}</span>;
  return <span className="delta delta--down" title={`Tụt ${Math.abs(delta)} bậc so với kỳ trước`}>↓{Math.abs(delta)}</span>;
}

function CompareCheckbox({ checked, onChange, disabled }) {
  return (
    <button
      type="button"
      className={'cmp-cb' + (checked ? ' cmp-cb--on' : '') + (disabled ? ' cmp-cb--disabled' : '')}
      onClick={(e) => { e.stopPropagation(); onChange(); }}
      title={disabled ? 'Đã chọn tối đa 4 người' : (checked ? 'Bỏ chọn so sánh' : 'Thêm vào so sánh')}
      aria-checked={checked}
      role="checkbox"
    >
      {checked && <svg viewBox="0 0 16 16" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8l3.5 3.5L13 5"/></svg>}
    </button>
  );
}

function TierBadge({ tier, size = 'sm' }) {
  return (
    <span className={'tier-badge tier-badge--' + size} style={{ '--tc': tier.color, '--tb': tier.soft }}>
      <span className="tier-badge-em">{tier.emoji}</span>
      <span className="tier-badge-lab">{tier.label}</span>
    </span>
  );
}

function BadgeChips({ badges }) {
  if (!badges || badges.length === 0) return null;
  return (
    <div className="badges">
      {badges.map((b, i) => (
        <span key={i} className={'badge badge--' + b.cls} title={b.label}>
          <span className="badge-em">{b.emoji}</span>
          <span className="badge-lab">{b.label}</span>
        </span>
      ))}
    </div>
  );
}

function CompLegend() {
  return (
    <div className="comp-legend" title="Mỗi ô được tô màu theo % đóng góp vào tổng điểm — từ mạnh nhất (xanh) đến yếu nhất (đỏ).">
      <span className="comp-legend-label">Trong dòng:</span>
      <span className="comp-legend-item"><span className="comp-legend-dot dot-rank-1"/><span>Mạnh nhất</span></span>
      <span className="comp-legend-item"><span className="comp-legend-dot dot-rank-2"/></span>
      <span className="comp-legend-item"><span className="comp-legend-dot dot-rank-3"/></span>
      <span className="comp-legend-item"><span className="comp-legend-dot dot-rank-4"/></span>
      <span className="comp-legend-item"><span className="comp-legend-dot dot-rank-5"/><span>Yếu nhất</span></span>
    </div>
  );
}

// ───────────────────────────── Leaderboard (table) ─────────────────────────────

function Leaderboard({ rows, allRows, mode, headerExpanded, setHeaderExpanded, selectedCell, setSelectedCell,
  compareSelected, onToggleCompare }) {
  const me = rows.find(r => r.isMe);
  const compareFull = compareSelected && compareSelected.length >= 4;

  function onCellClick(rowId, crit) {
    if (selectedCell && selectedCell.rowId === rowId && selectedCell.criterion === crit) {
      setSelectedCell(null);
    } else {
      setSelectedCell({ rowId, criterion: crit });
    }
  }

  return (
    <div className="board card">
      <div className="board-head">
        <div className="board-title">
          <span className="board-h">Bảng xếp hạng — {mode === 'ambassador' ? 'Đại sứ' : 'NCC'}</span>
          <span className="board-sub">{rows.length} {mode === 'ambassador' ? 'đại sứ' : 'nhà cung cấp'}</span>
        </div>
        <CompLegend/>
      </div>

      <div className="board-table">
        <div className="row row-head">
          <div className="c-check"/>
          <div className="c-rank">#</div>
          <div className="c-name">Tên</div>
          {CRITERIA.map(c => (
            <button
              key={c.key}
              className={'c-crit head-btn' + (headerExpanded === c.key ? ' head-btn--active' : '')}
              onClick={() => setHeaderExpanded(headerExpanded === c.key ? null : c.key)}
              title={c.hint}
            >
              <span className="head-emoji">{c.emoji}</span>
              <span className="head-label">{c.label}</span>
              <span className="head-chev">{headerExpanded === c.key ? '▲' : '▾'}</span>
            </button>
          ))}
          <div className="c-total">Tổng</div>
        </div>

        {rows.map((r) => (
          <RowGroup
            key={r.id} r={r} mode={mode}
            highlightKey={headerExpanded}
            selectedCrit={selectedCell && selectedCell.rowId === r.id ? selectedCell.criterion : null}
            onCellClick={(crit) => onCellClick(r.id, crit)}
            onClose={() => setSelectedCell(null)}
            compareSelected={compareSelected}
            onToggleCompare={onToggleCompare}
            compareFull={compareFull}
          />
        ))}
      </div>

      {me && !(selectedCell && selectedCell.rowId === me.id) && (
        <div className="me-pin">
          <div className="me-pin-label">Vị trí của bạn</div>
          <Row r={me} mode={mode} highlightKey={headerExpanded}
            selectedCrit={null}
            onCellClick={(crit) => onCellClick(me.id, crit)}
            compareSelected={compareSelected}
            onToggleCompare={onToggleCompare}
            compareFull={compareFull}
            isPin/>
        </div>
      )}

      {headerExpanded && <DetailPanel rows={allRows || rows} criterion={headerExpanded} mode={mode}/>}
    </div>
  );
}

function RowGroup({ r, mode, highlightKey, selectedCrit, onCellClick, onClose,
  compareSelected, onToggleCompare, compareFull }) {
  return (
    <div className="row-wrap">
      <Row r={r} mode={mode} highlightKey={highlightKey}
        selectedCrit={selectedCrit} onCellClick={onCellClick}
        compareSelected={compareSelected} onToggleCompare={onToggleCompare}
        compareFull={compareFull}/>
      {selectedCrit && !r.isMe && (
        <PersonDetail person={r} criterion={selectedCrit} onClose={onClose}/>
      )}
    </div>
  );
}

function Row({ r, mode, highlightKey, selectedCrit, onCellClick, isPin,
  compareSelected, onToggleCompare, compareFull }) {
  const c = r.pts;
  const medal = r.rank === 1 ? 'gold' : r.rank === 2 ? 'silver' : r.rank === 3 ? 'bronze' : null;
  const isSelected = compareSelected && compareSelected.includes(r.id);
  return (
    <div className={
      'row'
      + (r.isMe ? ' row--me' : '')
      + (isPin ? ' row--pin' : '')
      + (selectedCrit ? ' row--expanded' : '')
      + (isSelected ? ' row--cmp' : '')
    }>
      <div className="c-check">
        <CompareCheckbox
          checked={isSelected}
          disabled={!isSelected && compareFull}
          onChange={() => onToggleCompare && onToggleCompare(r.id)}
        />
      </div>
      <div className="c-rank">
        {medal ? (
          <span className={'medal medal--' + medal}>{r.rank}</span>
        ) : (
          <span className="rank-num">{r.rank}</span>
        )}
        <DeltaIndicator delta={r.delta || 0}/>
      </div>
      <div className="c-name">
        <div className={'avatar avatar--' + (r.id.charCodeAt(2) % 5)}>{initials(r.name)}</div>
        <div className="name-meta">
          <div className="name-line">
            {r.name}
            {r.isMe && <span className="me-chip">Bạn</span>}
          </div>
          <BadgeChips badges={r.badges}/>
        </div>
      </div>
      {CRITERIA.map(crit => (
        <CritCell key={crit.key}
          value={c[crit.key]}
          pct={r.cellPct ? r.cellPct[crit.key] : 0}
          rank={r.cellRank ? r.cellRank[crit.key] : 3}
          active={highlightKey === crit.key}
          selected={selectedCrit === crit.key}
          onClick={() => onCellClick(crit.key)}
        />
      ))}
      <div className="c-total">
        <div className="total-num">{formatPts(c.total)}<span className="unit">đ</span></div>
        {r.tier && <TierBadge tier={r.tier} size="xs"/>}
      </div>
    </div>
  );
}

function CritCell({ value, pct, rank, active, selected, onClick }) {
  const p = Math.round(pct || 0);
  return (
    <button
      type="button"
      className={
        'c-crit cell-btn'
        + ' cell-rank-' + (rank || 3)
        + (active ? ' c-crit--active' : '')
        + (selected ? ' c-crit--selected' : '')
      }
      onClick={onClick}
      title={`Chiếm ${p}% tổng điểm · xếp hạng ${rank}/5 trong dòng · bấm để xem chi tiết`}
    >
      <span className="crit-val">{formatPts(value)}<span className="unit">đ</span></span>
      <span className="crit-pct">{p}%</span>
    </button>
  );
}

function initials(n) {
  const parts = n.trim().split(/\s+/);
  return (parts[parts.length - 1][0] + (parts[0][0] || '')).toUpperCase();
}

// ───────────────────────────── Detail expand panels ─────────────────────────────

function DetailPanel({ rows, criterion, mode }) {
  const c = CRITERIA.find(x => x.key === criterion);
  const sorted = [...rows].sort((a, b) => b.pts[criterion] - a.pts[criterion]);

  return (
    <div className="detail">
      <div className="detail-head">
        <div className="detail-title">
          <span className="detail-emoji">{c.emoji}</span>
          <span>
            <div className="detail-h">Chi tiết: {c.label}</div>
            <div className="detail-rule">{c.hint}</div>
          </span>
        </div>
        <div className="detail-meta">
          Sắp xếp theo điểm <strong>{c.label}</strong>
        </div>
      </div>

      {criterion === 'rev' && <RevDetail sorted={sorted}/>}
      {criterion === 'zoom' && <ZoomDetail sorted={sorted}/>}
      {criterion === 'f1' && <F1Detail sorted={sorted}/>}
      {criterion === 'study' && <StudyDetail sorted={sorted}/>}
      {criterion === 'rating' && <RatingDetail sorted={sorted}/>}
    </div>
  );
}

function DetailTable({ heads, rows }) {
  const midCols = Math.max(1, heads.length - 3); // subtract rank, name, total
  return (
    <div className="detail-table" style={{ '--cols': midCols }}>
      <div className="d-head">
        {heads.map((h, i) => <div key={i} className={'d-cell d-cell--' + (h.cls || 'num')}>{h.label}</div>)}
      </div>
      {rows.map((r, i) => (
        <div key={i} className={'d-row' + (r.isMe ? ' d-row--me' : '')}>
          {r.cells.map((cell, j) => (
            <div key={j} className={'d-cell d-cell--' + (heads[j].cls || 'num')}>{cell}</div>
          ))}
        </div>
      ))}
    </div>
  );
}

function RevDetail({ sorted }) {
  const heads = [
    { label: '#', cls: 'rank' },
    { label: 'Tên', cls: 'name' },
    { label: 'DT trực tiếp', cls: 'num' },
    { label: 'Quy đổi', cls: 'num' },
    { label: 'DT gián tiếp', cls: 'num' },
    { label: 'Quy đổi', cls: 'num' },
    { label: 'Tổng điểm DT', cls: 'total' },
  ];
  const rows = sorted.map((r, i) => ({
    isMe: r.isMe,
    cells: [
      <span className="rank-num">{i + 1}</span>,
      <span className="name-inline">{r.name}{r.isMe && <span className="me-chip">Bạn</span>}</span>,
      formatVND(r.directRev) + ' đ',
      <span className="pts">{formatPts(r.pts.revDirect)} đ</span>,
      formatVND(r.indirectRev) + ' đ',
      <span className="pts">{formatPts(r.pts.revIndirect)} đ</span>,
      <strong>{formatPts(r.pts.rev)} đ</strong>,
    ],
  }));
  return <DetailTable heads={heads} rows={rows}/>;
}

function ZoomDetail({ sorted }) {
  const heads = [
    { label: '#', cls: 'rank' },
    { label: 'Tên', cls: 'name' },
    { label: 'Tự check-in', cls: 'num' },
    { label: 'Quy đổi', cls: 'num' },
    { label: 'Người được mời', cls: 'num' },
    { label: 'Quy đổi', cls: 'num' },
    { label: 'Tổng điểm Zoom', cls: 'total' },
  ];
  const rows = sorted.map((r, i) => ({
    isMe: r.isMe,
    cells: [
      <span className="rank-num">{i + 1}</span>,
      <span className="name-inline">{r.name}{r.isMe && <span className="me-chip">Bạn</span>}</span>,
      r.zoomSelf + ' lần',
      <span className="pts">{r.pts.zoomSelf} đ</span>,
      r.zoomInvite + ' người',
      <span className="pts">{r.pts.zoomInvite} đ</span>,
      <strong>{r.pts.zoom} đ</strong>,
    ],
  }));
  return <DetailTable heads={heads} rows={rows}/>;
}

function F1Detail({ sorted }) {
  const heads = [
    { label: '#', cls: 'rank' },
    { label: 'Tên', cls: 'name' },
    { label: 'F1 mời được', cls: 'num' },
    { label: 'Hệ số', cls: 'num' },
    { label: 'Tổng điểm F1', cls: 'total' },
  ];
  const rows = sorted.map((r, i) => ({
    isMe: r.isMe,
    cells: [
      <span className="rank-num">{i + 1}</span>,
      <span className="name-inline">{r.name}{r.isMe && <span className="me-chip">Bạn</span>}</span>,
      r.f1 + ' người',
      '× 20 đ',
      <strong>{r.pts.f1} đ</strong>,
    ],
  }));
  return <DetailTable heads={heads} rows={rows}/>;
}

function StudyDetail({ sorted }) {
  const max = Math.max(...sorted.map(r => r.study));
  const heads = [
    { label: '#', cls: 'rank' },
    { label: 'Tên', cls: 'name' },
    { label: 'Tiến độ học', cls: 'bar' },
    { label: 'Điểm App', cls: 'total' },
  ];
  const rows = sorted.map((r, i) => ({
    isMe: r.isMe,
    cells: [
      <span className="rank-num">{i + 1}</span>,
      <span className="name-inline">{r.name}{r.isMe && <span className="me-chip">Bạn</span>}</span>,
      <div className="bar-wrap"><div className="bar-fill" style={{ width: (r.study / max * 100) + '%' }}/></div>,
      <strong>{formatPts(r.study)} đ</strong>,
    ],
  }));
  return <DetailTable heads={heads} rows={rows}/>;
}

function RatingDetail({ sorted }) {
  const heads = [
    { label: '#', cls: 'rank' },
    { label: 'Tên', cls: 'name' },
    { label: 'Sao trung bình', cls: 'stars' },
    { label: 'Số đánh giá', cls: 'num' },
    { label: 'Tổng điểm', cls: 'total' },
  ];
  const rows = sorted.map((r, i) => ({
    isMe: r.isMe,
    cells: [
      <span className="rank-num">{i + 1}</span>,
      <span className="name-inline">{r.name}{r.isMe && <span className="me-chip">Bạn</span>}</span>,
      <Stars value={r.ratingAvg}/>,
      r.ratingCount + ' lượt',
      <strong>{r.pts.rating} đ</strong>,
    ],
  }));
  return <DetailTable heads={heads} rows={rows}/>;
}

function Stars({ value }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  return (
    <span className="stars">
      {[0,1,2,3,4].map(i => {
        const cls = i < full ? 'star star--full' : (i === full && half ? 'star star--half' : 'star star--empty');
        return <span key={i} className={cls}>★</span>;
      })}
      <span className="stars-val">{value.toFixed(1)}</span>
    </span>
  );
}

// ───────────────────────────── Self summary card ─────────────────────────────

function SelfSummary({ rows, mode, selectedCell, setSelectedCell }) {
  const me = rows.find(r => r.isMe);
  if (!me) return null;
  const ahead = rows.find(r => r.rank === me.rank - 1);
  const gap = ahead ? Math.round(ahead.pts.total - me.pts.total) : 0;
  const tier = me.tier;
  const nextTier = getNextTier(me.pts.total);
  const delta = me.delta || 0;

  function onMiniClick(crit) {
    if (selectedCell && selectedCell.rowId === me.id && selectedCell.criterion === crit) {
      setSelectedCell(null);
    } else {
      setSelectedCell({ rowId: me.id, criterion: crit });
    }
  }
  const openCrit = selectedCell && selectedCell.rowId === me.id ? selectedCell.criterion : null;

  return (
    <>
      <div className="self-card card">
        <div className="self-left">
          <div className="self-rank-chip">
            <div className="self-rank-num">#{me.rank}</div>
            <div className="self-rank-of">/ {rows.length}</div>
          </div>
          <div>
            <div className="self-label">Vị trí của bạn ở bảng {mode === 'ambassador' ? 'Đại sứ' : 'NCC'}</div>
            <div className="self-name">{me.name}</div>
            <div className="self-meta">
              {tier && <TierBadge tier={tier} size="sm"/>}
              <DeltaIndicator delta={delta}/>
              <span className="self-meta-txt">
                {delta > 0 ? 'Lên ' + delta + ' bậc so với kỳ trước'
                  : delta < 0 ? 'Tụt ' + Math.abs(delta) + ' bậc so với kỳ trước'
                  : 'Giữ nguyên vị trí'}
              </span>
            </div>
          </div>
        </div>
        <div className="self-mid">
          <div className="self-stat">
            <div className="self-stat-num">{formatPts(me.pts.total)}<span className="unit">đ</span></div>
            <div className="self-stat-lab">Tổng điểm</div>
          </div>
          {ahead && (
            <div className="self-stat self-stat--gap">
              <div className="self-stat-num">+{formatPts(gap)}<span className="unit">đ</span></div>
              <div className="self-stat-lab">để vượt <strong>{ahead.name}</strong></div>
            </div>
          )}
          {nextTier && (
            <div className="self-tier-progress">
              <div className="self-tier-bar">
                <div className="self-tier-fill" style={{ width: (nextTier.progress * 100) + '%' }}/>
              </div>
              <div className="self-tier-meta">
                Còn <strong>{formatPts(nextTier.need)}đ</strong> nữa lên <span className="self-tier-name" style={{ color: nextTier.next.color }}>{nextTier.next.emoji} {nextTier.next.label}</span>
              </div>
            </div>
          )}
        </div>
        <div className="self-right">
          {CRITERIA.map(c => (
            <button
              key={c.key}
              type="button"
              className={'self-mini self-mini-btn' + (openCrit === c.key ? ' self-mini-btn--active' : '')}
              onClick={() => onMiniClick(c.key)}
              title={`Xem chi tiết ${c.label}`}
            >
              <div className="self-mini-ico">{c.emoji}</div>
              <div className="self-mini-num">{formatPts(me.pts[c.key])}</div>
              <div className="self-mini-lab">{c.short}</div>
              <div className="self-mini-chev">{openCrit === c.key ? '▴' : '▾'}</div>
            </button>
          ))}
        </div>
      </div>

      {openCrit && (
        <PersonDetail
          person={me}
          criterion={openCrit}
          onClose={() => setSelectedCell(null)}
        />
      )}
    </>
  );
}

// ───────────────────────────── Podium (alt layout) ─────────────────────────────

function Podium({ rows, allRows, mode, headerExpanded, setHeaderExpanded, selectedCell, setSelectedCell,
  compareSelected, onToggleCompare }) {
  const [first, second, third] = rows;
  const rest = rows.slice(3);
  const me = rows.find(r => r.isMe);
  const compareFull = compareSelected && compareSelected.length >= 4;

  function onCellClick(rowId, crit) {
    if (selectedCell && selectedCell.rowId === rowId && selectedCell.criterion === crit) {
      setSelectedCell(null);
    } else {
      setSelectedCell({ rowId, criterion: crit });
    }
  }

  const top3 = [first, second, third].filter(Boolean);
  const top3Open = top3.find(r => selectedCell && selectedCell.rowId === r.id);

  return (
    <>
      <div className="podium-3">
        <PodiumSpot
          r={second} place={2}
          onCellClick={onCellClick}
          selectedCrit={selectedCell && selectedCell.rowId === (second && second.id) ? selectedCell.criterion : null}
          compareSelected={compareSelected} onToggleCompare={onToggleCompare} compareFull={compareFull}
        />
        <PodiumSpot
          r={first} place={1}
          onCellClick={onCellClick}
          selectedCrit={selectedCell && selectedCell.rowId === (first && first.id) ? selectedCell.criterion : null}
          compareSelected={compareSelected} onToggleCompare={onToggleCompare} compareFull={compareFull}
        />
        <PodiumSpot
          r={third} place={3}
          onCellClick={onCellClick}
          selectedCrit={selectedCell && selectedCell.rowId === (third && third.id) ? selectedCell.criterion : null}
          compareSelected={compareSelected} onToggleCompare={onToggleCompare} compareFull={compareFull}
        />
      </div>

      {top3Open && !top3Open.isMe && (
        <PersonDetail
          person={top3Open}
          criterion={selectedCell.criterion}
          onClose={() => setSelectedCell(null)}
        />
      )}

      <div className="board card">
        <div className="board-head">
          <div className="board-title">
            <span className="board-h">Vị trí 4 – {rows.length}</span>
            <span className="board-sub">{rest.length} {mode === 'ambassador' ? 'đại sứ' : 'nhà cung cấp'}</span>
          </div>
          <CompLegend/>
        </div>

        <div className="board-table">
          <div className="row row-head">
            <div className="c-check"/>
            <div className="c-rank">#</div>
            <div className="c-name">Tên</div>
            {CRITERIA.map(c => (
              <button
                key={c.key}
                className={'c-crit head-btn' + (headerExpanded === c.key ? ' head-btn--active' : '')}
                onClick={() => setHeaderExpanded(headerExpanded === c.key ? null : c.key)}
                title={c.hint}
              >
                <span className="head-emoji">{c.emoji}</span>
                <span className="head-label">{c.label}</span>
                <span className="head-chev">{headerExpanded === c.key ? '▲' : '▾'}</span>
              </button>
            ))}
            <div className="c-total">Tổng</div>
          </div>

          {rest.map(r => (
            <RowGroup
              key={r.id} r={r} mode={mode}
              highlightKey={headerExpanded}
              selectedCrit={selectedCell && selectedCell.rowId === r.id ? selectedCell.criterion : null}
              onCellClick={(crit) => onCellClick(r.id, crit)}
              onClose={() => setSelectedCell(null)}
              compareSelected={compareSelected} onToggleCompare={onToggleCompare}
              compareFull={compareFull}
            />
          ))}
        </div>

        {me && me.rank > 3 && !(selectedCell && selectedCell.rowId === me.id) && (
          <div className="me-pin">
            <div className="me-pin-label">Vị trí của bạn</div>
            <Row r={me} mode={mode} highlightKey={headerExpanded}
              selectedCrit={null}
              onCellClick={(crit) => onCellClick(me.id, crit)}
              compareSelected={compareSelected} onToggleCompare={onToggleCompare}
              compareFull={compareFull}
              isPin/>
          </div>
        )}

        {headerExpanded && <DetailPanel rows={allRows || rows} criterion={headerExpanded} mode={mode}/>}
      </div>
    </>
  );
}

function PodiumSpot({ r, place, onCellClick, selectedCrit,
  compareSelected, onToggleCompare, compareFull }) {
  if (!r) return <div className="podium-spot podium-spot--empty"/>;
  const medals = { 1: 'gold', 2: 'silver', 3: 'bronze' };
  const isSelected = compareSelected && compareSelected.includes(r.id);
  return (
    <div className={'podium-spot podium-spot--p' + place + (r.isMe ? ' podium-spot--me' : '') + (isSelected ? ' podium-spot--cmp' : '')}>
      <div className="podium-spot-cb">
        <CompareCheckbox
          checked={isSelected}
          disabled={!isSelected && compareFull}
          onChange={() => onToggleCompare && onToggleCompare(r.id)}
        />
      </div>
      <div className="podium-spot-top">
        <div className={'podium-medal medal medal--' + medals[place]}>{place}</div>
        <div className={'avatar avatar--lg avatar--' + (r.id.charCodeAt(2) % 5)}>{initials(r.name)}</div>
      </div>
      <div className="podium-name">
        {r.name}
        {r.isMe && <span className="me-chip">Bạn</span>}
      </div>
      <div className="podium-pts-row">
        <div className="podium-pts">
          {formatPts(r.pts.total)}<span className="unit">đ</span>
        </div>
        <DeltaIndicator delta={r.delta || 0}/>
      </div>
      {r.tier && (
        <div className="podium-tier"><TierBadge tier={r.tier} size="md"/></div>
      )}
      <BadgeChips badges={r.badges}/>
      <div className="podium-crits">
        {CRITERIA.map(c => (
          <button
            key={c.key}
            type="button"
            className={'podium-crit' + (selectedCrit === c.key ? ' podium-crit--selected' : '')}
            onClick={() => onCellClick(r.id, c.key)}
            title={c.label + ' — bấm để xem chi tiết'}
          >
            <span className="podium-crit-ico">{c.emoji}</span>
            <span className="podium-crit-val">{formatPts(r.pts[c.key])}<span className="unit">đ</span></span>
            <span className="podium-crit-lab">{c.short}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ───────────────────────────── App ─────────────────────────────

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const mode = t.sidebar_ctx === 'ncc' ? 'supplier' : 'ambassador';
  const [period, setPeriod] = useState('month');
  const [headerExpanded, setHeaderExpanded] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);

  // Search
  const [searchQ, setSearchQ] = useState('');

  // Compare (multi-select)
  const [compareSelected, setCompareSelected] = useState([]);
  const [compareOpen, setCompareOpen] = useState(false);

  const rows = useMemo(() => {
    const src = mode === 'ambassador' ? AMBASSADORS : SUPPLIERS;
    const f = PERIOD_FACTOR[period];
    const scaled = src.map(r => {
      const s = scaleRow(r, f);
      return { ...s, pts: compute(s) };
    });
    scaled.sort((a, b) => b.pts.total - a.pts.total);
    scaled.forEach((r, i) => { r.rank = i + 1; });
    // Attach per-row computed bits.
    // cellRank[crit] = 1..5, vị trí của tiêu chí này trong dòng (1 = % cao nhất).
    // cellPct[crit] = % đóng góp vào tổng điểm (0..100). 5 ô của 1 dòng = 100%.
    scaled.forEach(r => {
      r.cellPct = {};
      for (const c of CRITERIA) {
        r.cellPct[c.key] = r.pts.total > 0 ? r.pts[c.key] / r.pts.total * 100 : 0;
      }
      const ranked = [...CRITERIA].sort((a, b) => r.pts[b.key] - r.pts[a.key]);
      r.cellRank = {};
      ranked.forEach((c, i) => { r.cellRank[c.key] = i + 1; });
      r.delta = getDelta(r, r.rank, scaled.length);
      r.tier = getTier(r.pts.total);
    });
    // Badges depend on full set + rank already assigned
    scaled.forEach(r => { r.badges = getBadges(r, scaled); });
    return scaled;
  }, [mode, period]);

  const filteredRows = useMemo(() => {
    const q = searchQ.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(r => r.name.toLowerCase().includes(q));
  }, [rows, searchQ]);

  function onToggleCompare(rowId) {
    setCompareSelected(prev => {
      if (prev.includes(rowId)) return prev.filter(x => x !== rowId);
      if (prev.length >= 4) return prev;
      return [...prev, rowId];
    });
  }

  // reset expand + compare when switching mode/period
  useEffect(() => {
    setHeaderExpanded(null);
    setSelectedCell(null);
    setCompareSelected([]);
    setCompareOpen(false);
  }, [mode, period]);

  const comparePeople = useMemo(
    () => rows.filter(r => compareSelected.includes(r.id))
              .sort((a, b) => compareSelected.indexOf(a.id) - compareSelected.indexOf(b.id)),
    [rows, compareSelected]
  );

  return (
    <div className={'shell' + (t.sidebar_ctx === 'ncc' ? ' shell--ncc' : '')}>
      <Sidebar ctx={t.sidebar_ctx}/>
      <main className="main">
        <TopBar ctx={t.sidebar_ctx} period={period} setPeriod={setPeriod}/>
        <div className="content">
          <SelfSummary rows={rows} mode={mode}
            selectedCell={selectedCell} setSelectedCell={setSelectedCell}/>
          <Toolbar
            searchQ={searchQ} setSearchQ={setSearchQ}
            totalCount={rows.length}
            filteredCount={filteredRows.length}
          />
          {filteredRows.length === 0 ? (
            <EmptyState onClear={() => setSearchQ('')}/>
          ) : t.layout === 'table' ? (
            <Leaderboard
              rows={filteredRows} allRows={rows} mode={mode}
              headerExpanded={headerExpanded} setHeaderExpanded={setHeaderExpanded}
              selectedCell={selectedCell} setSelectedCell={setSelectedCell}
              compareSelected={compareSelected} onToggleCompare={onToggleCompare}
            />
          ) : (
            <Podium
              rows={filteredRows} allRows={rows} mode={mode}
              headerExpanded={headerExpanded} setHeaderExpanded={setHeaderExpanded}
              selectedCell={selectedCell} setSelectedCell={setSelectedCell}
              compareSelected={compareSelected} onToggleCompare={onToggleCompare}
            />
          )}
        </div>
      </main>

      {compareSelected.length > 0 && (
        <CompareBar
          count={compareSelected.length}
          onClear={() => setCompareSelected([])}
          onOpen={() => setCompareOpen(true)}
        />
      )}

      {compareOpen && CompareDrawer && (
        <CompareDrawer
          people={comparePeople}
          onClose={() => setCompareOpen(false)}
          onRemove={(id) => setCompareSelected(prev => prev.filter(x => x !== id))}
        />
      )}

      <TweaksPanel title="Tweaks" defaultPos={{ right: 20, bottom: 20 }}>
        <TweakSection title="Layout">
          <TweakRadio
            label="Kiểu hiển thị"
            value={t.layout}
            options={[
              { value: 'table',  label: 'Bảng đầy đủ' },
              { value: 'podium', label: 'Podium top 3' },
            ]}
            onChange={v => setTweak('layout', v)}
          />
        </TweakSection>
        <TweakSection title="Sidebar context">
          <TweakRadio
            label="Hệ thống"
            value={t.sidebar_ctx}
            options={[
              { value: 'ambassador', label: 'Đại sứ' },
              { value: 'ncc',        label: 'NCC' },
            ]}
            onChange={v => setTweak('sidebar_ctx', v)}
          />
        </TweakSection>
      </TweaksPanel>

      <StandaloneTweaksButton/>
    </div>
  );
}

// Floating "Tuỳ chỉnh" button — appears only when the page is served standalone
// (e.g. GitHub Pages), where the host's edit-mode toggle isn't available.
function StandaloneTweaksButton() {
  const [standalone, setStandalone] = useState(false);
  useEffect(() => {
    try {
      if (window.top === window.self) setStandalone(true);
    } catch (e) {
      // cross-origin frame access throws — assume standalone
      setStandalone(true);
    }
  }, []);
  if (!standalone) return null;
  return (
    <button
      className="standalone-tweaks-btn"
      onClick={() => window.postMessage({ type: '__activate_edit_mode' }, '*')}
      title="Mở bảng tuỳ chỉnh hiển thị"
    >
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.7 1.7 0 00.4 1.9l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.9-.4 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1-1.5 1.7 1.7 0 00-1.9.4l-.1.1A2 2 0 113.3 17.1l.1-.1a1.7 1.7 0 00.4-1.9 1.7 1.7 0 00-1.5-1H2a2 2 0 110-4h.1a1.7 1.7 0 001.5-1 1.7 1.7 0 00-.4-1.9l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.9.4h.1a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.9-.4l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.4 1.9v.1a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z"/>
      </svg>
      Tuỳ chỉnh
    </button>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
