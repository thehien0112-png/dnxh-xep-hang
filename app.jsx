/* Xếp hạng — DNXH Sống Tử Tế
 * React app. Globals from data.js: AMBASSADORS, SUPPLIERS, CRITERIA, compute, scaleRow,
 * PERIOD_FACTOR, PERIOD_LABEL, PERIOD_RANGE, formatVND, formatPts.
 * Globals from tweaks-panel.jsx: TweaksPanel, useTweaks, TweakSection, TweakRadio.
 */

const { useState, useMemo, useEffect, useRef } = React;
const PersonDetail = window.PersonDetail;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
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
  { key: 'xephang',  label: 'Xếp hạng',           icon: 'trophy' },
  { key: 'taikhoan', label: 'Tài khoản',          icon: 'user' },
];

const NCC_NAV = [
  { key: 'thongke',  label: 'Thống kê',         icon: 'chart' },
  { key: 'sanpham',  label: 'Sản phẩm',         icon: 'box' },
  { key: 'donhang',  label: 'Đơn hàng',         icon: 'cart' },
  { key: 'tra',      label: 'Yêu cầu trả hàng', icon: 'return' },
  { key: 'caidat',   label: 'Cài đặt',          icon: 'gear', expandable: true },
  { key: 'kho',      label: 'Kho hàng',         icon: 'warehouse' },
  { key: 'xephang',  label: 'Xếp hạng',         icon: 'trophy' },
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
    case 'download':    return <svg viewBox="0 0 24 24" {...s}><path d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16"/></svg>;
    case 'search':      return <svg viewBox="0 0 24 24" {...s}><circle cx="11" cy="11" r="6"/><path d="M20 20l-4.3-4.3"/></svg>;
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

function TopBar({ period, setPeriod }) {
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

// ───────────────────────────── Self summary ─────────────────────────────

function SelfSummary({ rows, mode, selectedCell, setSelectedCell }) {
  const me = rows.find(r => r.isMe);
  if (!me) return null;
  const ahead = rows.find(r => r.rank === me.rank - 1);
  const gap = ahead ? Math.round(ahead.pts.total - me.pts.total) : 0;

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

// ───────────────────────────── Leaderboard ─────────────────────────────

function Leaderboard({ rows, mode, headerExpanded, setHeaderExpanded, selectedCell, setSelectedCell }) {
  const me = rows.find(r => r.isMe);

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
      </div>

      <div className="board-table">
        <div className="row row-head">
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
          />
        ))}
      </div>

      {headerExpanded && <DetailPanel rows={rows} criterion={headerExpanded} mode={mode}/>}
    </div>
  );
}

function RowGroup({ r, mode, highlightKey, selectedCrit, onCellClick, onClose }) {
  return (
    <div className="row-wrap">
      <Row r={r} mode={mode} highlightKey={highlightKey}
        selectedCrit={selectedCrit} onCellClick={onCellClick}/>
      {selectedCrit && !r.isMe && (
        <PersonDetail person={r} criterion={selectedCrit} onClose={onClose}/>
      )}
    </div>
  );
}

function Row({ r, mode, highlightKey, selectedCrit, onCellClick, isPin }) {
  const c = r.pts;
  const medal = r.rank === 1 ? 'gold' : r.rank === 2 ? 'silver' : r.rank === 3 ? 'bronze' : null;
  return (
    <div className={'row' + (r.isMe ? ' row--me' : '') + (isPin ? ' row--pin' : '') + (selectedCrit ? ' row--expanded' : '')}>
      <div className="c-rank">
        {medal ? (
          <span className={'medal medal--' + medal}>{r.rank}</span>
        ) : (
          <span className="rank-num">{r.rank}</span>
        )}
      </div>
      <div className="c-name">
        <div className={'avatar avatar--' + (r.id.charCodeAt(2) % 5)}>{initials(r.name)}</div>
        <div className="name-meta">
          <div className="name-line">
            {r.name}
            {r.isMe && <span className="me-chip">Bạn</span>}
          </div>
        </div>
      </div>
      {CRITERIA.map(crit => (
        <CritCell key={crit.key}
          value={c[crit.key]}
          active={highlightKey === crit.key}
          selected={selectedCrit === crit.key}
          onClick={() => onCellClick(crit.key)}
        />
      ))}
      <div className="c-total">{formatPts(c.total)}<span className="unit">đ</span></div>
    </div>
  );
}

function CritCell({ value, active, selected, onClick }) {
  return (
    <button
      type="button"
      className={
        'c-crit cell-btn'
        + (active ? ' c-crit--active' : '')
        + (selected ? ' c-crit--selected' : '')
      }
      onClick={onClick}
      title="Bấm để xem chi tiết"
    >
      <span className="crit-val">{formatPts(value)}<span className="unit">đ</span></span>
    </button>
  );
}

function initials(n) {
  const parts = n.trim().split(/\s+/);
  return (parts[parts.length - 1][0] + (parts[0][0] || '')).toUpperCase();
}

// ───────────────────────────── Comparison detail panel (sort-by-criterion) ─────────────────────────────

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
  const midCols = Math.max(1, heads.length - 3);
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
  const max = Math.max(...sorted.map(r => r.study), 1);
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

// ───────────────────────────── App ─────────────────────────────

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const mode = t.sidebar_ctx === 'ncc' ? 'supplier' : 'ambassador';
  const [period, setPeriod] = useState('month');
  const [headerExpanded, setHeaderExpanded] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);

  const rows = useMemo(() => {
    const src = mode === 'ambassador' ? AMBASSADORS : SUPPLIERS;
    const f = PERIOD_FACTOR[period];
    const scaled = src.map(r => {
      const s = scaleRow(r, f);
      return { ...s, pts: compute(s) };
    });
    scaled.sort((a, b) => b.pts.total - a.pts.total);
    scaled.forEach((r, i) => { r.rank = i + 1; });
    return scaled;
  }, [mode, period]);

  useEffect(() => {
    setHeaderExpanded(null);
    setSelectedCell(null);
  }, [mode, period]);

  return (
    <div className={'shell' + (t.sidebar_ctx === 'ncc' ? ' shell--ncc' : '')}>
      <Sidebar ctx={t.sidebar_ctx}/>
      <main className="main">
        <TopBar period={period} setPeriod={setPeriod}/>
        <div className="content">
          <SelfSummary rows={rows} mode={mode}
            selectedCell={selectedCell} setSelectedCell={setSelectedCell}/>
          <Leaderboard
            rows={rows} mode={mode}
            headerExpanded={headerExpanded} setHeaderExpanded={setHeaderExpanded}
            selectedCell={selectedCell} setSelectedCell={setSelectedCell}
          />
        </div>
      </main>

      <TweaksPanel title="Tweaks" defaultPos={{ right: 20, bottom: 20 }}>
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

function StandaloneTweaksButton() {
  const [standalone, setStandalone] = useState(false);
  useEffect(() => {
    try {
      if (window.top === window.self) setStandalone(true);
    } catch (e) {
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
