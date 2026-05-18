/* Per-person detail panels — appears inline below the clicked row.
 * Exposes window.PersonDetail. Uses globals: CRITERIA, formatVND, formatPts,
 * getOrderDetails, getZoomDetails, getF1Details, getStudyDetails, getRatingDetails, Stars.
 */

const { useMemo: _useMemo } = React;

function _Stars({ value }) {
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

function PersonOrders({ person }) {
  const orders = _useMemo(() => getOrderDetails(person), [person.id, person.directRev, person.indirectRev]);
  const direct = orders.filter(o => o.type === 'direct');
  const indirect = orders.filter(o => o.type === 'indirect');
  const totalD = direct.reduce((s, o) => s + o.amount, 0);
  const totalI = indirect.reduce((s, o) => s + o.amount, 0);
  const ptD = totalD / 100_000;
  const ptI = totalI / 100_000 * 0.5;

  return (
    <div className="pd-body">
      <div className="pd-stats">
        <div className="pd-stat">
          <div className="pd-stat-lab">DT trực tiếp</div>
          <div className="pd-stat-val">{formatVND(totalD)}<span className="unit">đ</span></div>
          <div className="pd-stat-sub">{direct.length} đơn · quy đổi <span className="pts">{formatPts(ptD)} đ</span></div>
        </div>
        <div className="pd-stat">
          <div className="pd-stat-lab">DT gián tiếp</div>
          <div className="pd-stat-val">{formatVND(totalI)}<span className="unit">đ</span></div>
          <div className="pd-stat-sub">{indirect.length} đơn · quy đổi (×0.5) <span className="pts">{formatPts(ptI)} đ</span></div>
        </div>
        <div className="pd-stat pd-stat--total">
          <div className="pd-stat-lab">Tổng điểm Doanh thu</div>
          <div className="pd-stat-val pd-stat-val--accent">{formatPts(ptD + ptI)}<span className="unit">đ</span></div>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="pd-empty">📭 Chưa có đơn hàng nào trong kỳ này.</div>
      ) : (
        <div className="pd-table pd-table--orders">
          <div className="pd-th">
            <div>Mã đơn</div>
            <div>Ngày</div>
            <div>Khách hàng</div>
            <div>Sản phẩm trong đơn</div>
            <div className="ta-c">Loại</div>
            <div className="ta-r">Số tiền</div>
            <div className="ta-r">Điểm</div>
          </div>
          {orders.map(o => (
            <div key={o.orderId} className="pd-tr">
              <div className="mono">#{o.orderId}</div>
              <div>{o.date}</div>
              <div>{o.customer}</div>
              <div className="pd-prods">
                <ul className="pd-prod-list">
                  {o.items.map((it, idx) => (
                    <li key={idx}>
                      <span className="pd-prod-name">{it.product}</span>
                      <span className="pd-prod-qty">×{it.qty}</span>
                      <span className="pd-prod-sub mono">{formatVND(it.subtotal)}đ</span>
                    </li>
                  ))}
                </ul>
                {o.referrer && <div className="pd-ref">qua {o.referrer}</div>}
              </div>
              <div className="ta-c">
                <span className={'tag tag--' + o.type}>{o.type === 'direct' ? 'Trực tiếp' : 'Gián tiếp'}</span>
              </div>
              <div className="ta-r mono">{formatVND(o.amount)} đ</div>
              <div className="ta-r pts">+{formatPts(o.points)} đ</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PersonZoom({ person }) {
  const { self, invited } = _useMemo(() => getZoomDetails(person), [person.id, person.zoomSelf, person.zoomInvite]);

  return (
    <div className="pd-body">
      <div className="pd-stats">
        <div className="pd-stat">
          <div className="pd-stat-lab">🎥 Tự check-in</div>
          <div className="pd-stat-val">{self.length}<span className="unit">lần</span></div>
          <div className="pd-stat-sub">× 20 đ = <span className="pts">{self.length * 20} đ</span></div>
        </div>
        <div className="pd-stat">
          <div className="pd-stat-lab">📣 Mời người khác check-in</div>
          <div className="pd-stat-val">{invited.length}<span className="unit">người</span></div>
          <div className="pd-stat-sub">× 10 đ = <span className="pts">{invited.length * 10} đ</span></div>
        </div>
        <div className="pd-stat pd-stat--total">
          <div className="pd-stat-lab">Tổng điểm Zoom</div>
          <div className="pd-stat-val pd-stat-val--accent">{self.length * 20 + invited.length * 10}<span className="unit">đ</span></div>
        </div>
      </div>

      <div className="pd-section-h">🎥 Bản thân check-in vào Zoom</div>
      {self.length === 0 ? (
        <div className="pd-empty">📭 Chưa có buổi nào.</div>
      ) : (
        <div className="pd-table pd-table--zoom-self">
          <div className="pd-th">
            <div>Ngày</div>
            <div>Phiên Zoom</div>
            <div className="ta-c">Giờ check-in</div>
            <div className="ta-c">Thời lượng</div>
            <div className="ta-r">Điểm</div>
          </div>
          {self.map((s, i) => (
            <div key={i} className="pd-tr">
              <div>{s.date}</div>
              <div>{s.session}</div>
              <div className="ta-c mono">{s.checkInTime}</div>
              <div className="ta-c">{s.duration} phút</div>
              <div className="ta-r pts">+20 đ</div>
            </div>
          ))}
        </div>
      )}

      <div className="pd-section-h pd-section-h--mt">📣 Mời người khác check-in</div>
      {invited.length === 0 ? (
        <div className="pd-empty">📭 Chưa mời ai trong kỳ này.</div>
      ) : (
        <div className="pd-table pd-table--zoom-invited">
          <div className="pd-th">
            <div>Ngày</div>
            <div>Người được mời</div>
            <div className="ta-c">Vai trò</div>
            <div>Phiên Zoom</div>
            <div className="ta-r">Điểm</div>
          </div>
          {invited.map((s, i) => (
            <div key={i} className="pd-tr">
              <div>{s.date}</div>
              <div>{s.invitee}</div>
              <div className="ta-c">
                <span className={'tag tag--' + (s.role === 'F1' ? 'f1' : 'guest')}>{s.role}</span>
              </div>
              <div>{s.session}</div>
              <div className="ta-r pts">+10 đ</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PersonF1({ person }) {
  const list = _useMemo(() => getF1Details(person), [person.id, person.f1]);
  const totalRev = list.reduce((s, x) => s + x.revContrib, 0);
  const totalOrders = list.reduce((s, x) => s + x.orders, 0);

  return (
    <div className="pd-body">
      <div className="pd-stats">
        <div className="pd-stat">
          <div className="pd-stat-lab">👥 Số F1 mời được</div>
          <div className="pd-stat-val">{list.length}<span className="unit">người</span></div>
          <div className="pd-stat-sub">× 20 đ = <span className="pts">{list.length * 20} đ</span></div>
        </div>
        <div className="pd-stat">
          <div className="pd-stat-lab">DT từ F1 đóng góp</div>
          <div className="pd-stat-val">{formatVND(totalRev)}<span className="unit">đ</span></div>
          <div className="pd-stat-sub">{totalOrders} đơn từ tuyến dưới</div>
        </div>
        <div className="pd-stat pd-stat--total">
          <div className="pd-stat-lab">Tổng điểm F1</div>
          <div className="pd-stat-val pd-stat-val--accent">{list.length * 20}<span className="unit">đ</span></div>
        </div>
      </div>

      {list.length === 0 ? (
        <div className="pd-empty">📭 Chưa mời được F1 nào trong kỳ.</div>
      ) : (
        <div className="pd-table pd-table--f1">
          <div className="pd-th">
            <div>F1</div>
            <div>Ngày tham gia</div>
            <div>Trạng thái</div>
            <div className="ta-c">Đơn hàng</div>
            <div className="ta-r">DT đóng góp</div>
            <div className="ta-r">Điểm</div>
          </div>
          {list.map((f, i) => (
            <div key={i} className="pd-tr">
              <div className="pd-f1-name">
                <div className={'avatar avatar--' + (i % 5)} style={{ width: 26, height: 26, fontSize: 11 }}>
                  {f.name.split(' ').slice(-1)[0][0]}
                </div>
                <span>{f.name}</span>
              </div>
              <div>{f.joinedDate}</div>
              <div>
                <span className={'tag tag--' + (f.status === 'Đang hoạt động' ? 'active' : 'new')}>
                  {f.status === 'Đang hoạt động' ? '● ' : '○ '}{f.status}
                </span>
              </div>
              <div className="ta-c">{f.orders}</div>
              <div className="ta-r mono">{formatVND(f.revContrib)} đ</div>
              <div className="ta-r pts">+20 đ</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PersonStudy({ person }) {
  const list = _useMemo(() => getStudyDetails(person), [person.id, person.study]);
  const total = list.reduce((s, x) => s + x.score, 0);

  return (
    <div className="pd-body">
      <div className="pd-stats">
        <div className="pd-stat">
          <div className="pd-stat-lab">📘 Khoá đã hoàn thành</div>
          <div className="pd-stat-val">{list.length}<span className="unit">khoá</span></div>
          <div className="pd-stat-sub">Lấy điểm trực tiếp từ App học tập</div>
        </div>
        <div className="pd-stat pd-stat--total">
          <div className="pd-stat-lab">Tổng điểm Học tập</div>
          <div className="pd-stat-val pd-stat-val--accent">{formatPts(total)}<span className="unit">đ</span></div>
        </div>
      </div>

      {list.length === 0 ? (
        <div className="pd-empty">📭 Chưa hoàn thành khoá học nào.</div>
      ) : (
        <div className="pd-courses">
          {list.map((c, i) => (
            <div key={i} className="pd-course">
              <div className="pd-course-h">
                <div className="pd-course-name">
                  <span className="pd-course-emoji">📘</span>
                  <span>{c.course}</span>
                </div>
                <div className="pd-course-pts pts">+{c.score} đ</div>
              </div>
              <div className="pd-course-bar">
                <div className="pd-course-bar-fill" style={{ width: (c.progress * 100) + '%' }}/>
              </div>
              <div className="pd-course-meta">
                <span>{c.score} / {c.maxScore} điểm</span>
                <span className="dot">·</span>
                <span>Hoàn thành {c.completedDate}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PersonRating({ person }) {
  const { list, breakdown } = _useMemo(() => getRatingDetails(person), [person.id, person.ratingCount, person.ratingAvg]);
  const totalPoints = Math.round(person.ratingAvg * 100);
  const max = Math.max(1, ...breakdown.map(b => b.count));

  return (
    <div className="pd-body">
      <div className="pd-rating-top">
        <div className="pd-rating-avg">
          <div className="pd-rating-num">{person.ratingAvg.toFixed(1)}</div>
          <_Stars value={person.ratingAvg}/>
          <div className="pd-rating-count">
            {person.ratingCount} đánh giá · điểm trung bình ×100 = <span className="pts">{totalPoints} đ</span>
          </div>
        </div>
        <div className="pd-rating-breakdown">
          {breakdown.map(b => (
            <div key={b.stars} className="pd-rating-row">
              <div className="pd-rating-rk">{b.stars}★</div>
              <div className="pd-rating-rb">
                <div className="pd-rating-rb-fill" style={{ width: (b.count / max * 100) + '%' }}/>
              </div>
              <div className="pd-rating-rc">{b.count}</div>
            </div>
          ))}
        </div>
      </div>

      {list.length === 0 ? (
        <div className="pd-empty">📭 Chưa có đánh giá nào.</div>
      ) : (
        <div className="pd-reviews">
          {list.map((r, i) => (
            <div key={i} className="pd-review">
              <div className="pd-review-h">
                <div className="pd-review-from-wrap">
                  <div className={'avatar avatar--' + (i % 5)} style={{ width: 32, height: 32, fontSize: 12 }}>
                    {r.reviewer.split(' ').slice(-1)[0][0]}
                  </div>
                  <div>
                    <div className="pd-review-from">{r.reviewer}</div>
                    <div className="pd-review-meta">
                      {r.reviewerRole}
                      <span className="dot">·</span>
                      <span className={'tag tag--' + (r.role === 'Cấp trên' ? 'sup' : 'sub')}>{r.role}</span>
                      <span className="dot">·</span>
                      {r.date}
                    </div>
                  </div>
                </div>
                <div className="pd-review-stars"><_Stars value={r.stars}/></div>
              </div>
              {r.comment && <div className="pd-review-comment">"{r.comment}"</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

window.PersonDetail = function PersonDetail({ person, criterion, onClose }) {
  const c = CRITERIA.find(x => x.key === criterion);
  function onPrint() {
    document.body.classList.add('printing-pd');
    document.body.setAttribute('data-print-person', person.name);
    document.body.setAttribute('data-print-crit', c.label);
    setTimeout(() => {
      window.print();
      setTimeout(() => {
        document.body.classList.remove('printing-pd');
        document.body.removeAttribute('data-print-person');
        document.body.removeAttribute('data-print-crit');
      }, 200);
    }, 50);
  }
  return (
    <div className="pd" data-pd-active="true" onClick={(e) => e.stopPropagation()}>
      <div className="pd-head">
        <div className="pd-title">
          <span className="pd-emoji">{c.emoji}</span>
          <div className="pd-titles">
            <div className="pd-h">Chi tiết {c.label}</div>
            <div className="pd-sub">của <strong>{person.name}</strong></div>
          </div>
        </div>
        <div className="pd-actions">
          <button className="pd-print" onClick={onPrint} title="In / xuất PDF báo cáo">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9V3h12v6M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v7H6z"/>
            </svg>
            In PDF
          </button>
          <button className="pd-close" onClick={onClose} title="Đóng">✕</button>
        </div>
      </div>
      {criterion === 'rev' && <PersonOrders person={person}/>}
      {criterion === 'zoom' && <PersonZoom person={person}/>}
      {criterion === 'f1' && <PersonF1 person={person}/>}
      {criterion === 'study' && <PersonStudy person={person}/>}
      {criterion === 'rating' && <PersonRating person={person}/>}
    </div>
  );
};
