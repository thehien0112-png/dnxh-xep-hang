/* Compare drawer + radar chart for multi-select comparison.
 * Exposes window.CompareDrawer. Uses CRITERIA, formatPts, getTier from globals.
 */

const _COMPARE_COLORS = ['#0d6b5e', '#c95f3d', '#6d7be0', '#c98f1f'];

function _RadarChart({ people, max }) {
  const size = 360;
  const center = size / 2;
  const radius = size * 0.36;
  const angles = [0, 1, 2, 3, 4].map(i => (i * 72 - 90) * Math.PI / 180);

  function point(value, i) {
    const r = (value / max) * radius;
    return [center + r * Math.cos(angles[i]), center + r * Math.sin(angles[i])];
  }

  const gridLevels = [0.25, 0.5, 0.75, 1.0];

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="radar-svg">
      {/* concentric grid pentagons */}
      {gridLevels.map((lvl, gi) => {
        const pts = angles.map((a) => {
          const r = lvl * radius;
          return `${center + r * Math.cos(a)},${center + r * Math.sin(a)}`;
        }).join(' ');
        return (
          <polygon key={gi} points={pts}
            fill={gi === 0 ? '#f8faf9' : 'none'}
            stroke="#e4e7ec" strokeWidth="1"/>
        );
      })}

      {/* axes */}
      {angles.map((a, i) => (
        <line key={'ax' + i}
          x1={center} y1={center}
          x2={center + radius * Math.cos(a)}
          y2={center + radius * Math.sin(a)}
          stroke="#e4e7ec" strokeWidth="1"/>
      ))}

      {/* polygons per person */}
      {people.map((p, idx) => {
        const pts = CRITERIA.map((c, i) => {
          const [x, y] = point(p.pts[c.key], i);
          return `${x},${y}`;
        }).join(' ');
        const color = _COMPARE_COLORS[idx % _COMPARE_COLORS.length];
        return (
          <g key={p.id}>
            <polygon points={pts} fill={color} fillOpacity="0.13" stroke={color} strokeWidth="2.5" strokeLinejoin="round"/>
            {CRITERIA.map((c, i) => {
              const [x, y] = point(p.pts[c.key], i);
              return <circle key={c.key} cx={x} cy={y} r="4" fill={color} stroke="white" strokeWidth="1.5"/>;
            })}
          </g>
        );
      })}

      {/* axis labels */}
      {CRITERIA.map((c, i) => {
        const r = radius * 1.18;
        const a = angles[i];
        const x = center + r * Math.cos(a);
        const y = center + r * Math.sin(a);
        const isTop = a < -Math.PI / 4 && a > -3 * Math.PI / 4;
        return (
          <g key={c.key}>
            <text x={x} y={y - 4} fontSize="14" textAnchor="middle">{c.emoji}</text>
            <text x={x} y={y + 12} fontSize="11" fontWeight="600" fill="#5b6573" textAnchor="middle">
              {c.short}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

window.CompareDrawer = function CompareDrawer({ people, onClose, onRemove }) {
  if (!people.length) return null;
  // Compute max per criterion across selected people for fair scale
  const max = Math.max(...people.flatMap(p => CRITERIA.map(c => p.pts[c.key])), 1);

  // Per-criterion comparison: who leads each one
  const leaders = {};
  for (const c of CRITERIA) {
    const top = people.reduce((a, b) => a.pts[c.key] > b.pts[c.key] ? a : b);
    leaders[c.key] = top.id;
  }

  return (
    <div className="cmp-backdrop" onClick={onClose}>
      <div className="cmp-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="cmp-head">
          <div>
            <div className="cmp-h">So sánh {people.length} {people.length > 1 ? 'người' : 'người'}</div>
            <div className="cmp-sub">Radar chart 5 tiêu chí · bấm × trên chip để bỏ một người</div>
          </div>
          <button className="cmp-close" onClick={onClose} title="Đóng">✕</button>
        </div>

        <div className="cmp-chips">
          {people.map((p, idx) => (
            <div key={p.id} className="cmp-chip" style={{ '--c': _COMPARE_COLORS[idx % _COMPARE_COLORS.length] }}>
              <span className="cmp-chip-dot"/>
              <span className="cmp-chip-name">
                #{p.rank} · {p.name}
                {p.isMe && <span className="me-chip">Bạn</span>}
              </span>
              <button className="cmp-chip-x" onClick={() => onRemove(p.id)} title="Bỏ khỏi so sánh">✕</button>
            </div>
          ))}
        </div>

        <div className="cmp-body">
          <div className="cmp-chart">
            <_RadarChart people={people} max={max}/>
          </div>

          <div className="cmp-stats" style={{ '--cmp-cols': people.length }}>
            <div className="cmp-stats-h">
              <div>Tiêu chí</div>
              {people.map((p, idx) => (
                <div key={p.id} className="cmp-stats-person" style={{ '--c': _COMPARE_COLORS[idx % _COMPARE_COLORS.length] }}>
                  <span className="cmp-chip-dot"/>
                  {p.name.split(' ').slice(-2).join(' ')}
                </div>
              ))}
            </div>
            {CRITERIA.map(c => (
              <div key={c.key} className="cmp-stats-row">
                <div className="cmp-stats-lab">
                  <span>{c.emoji}</span> {c.label}
                </div>
                {people.map((p, idx) => {
                  const v = p.pts[c.key];
                  const pct = max > 0 ? v / max : 0;
                  const isLeader = leaders[c.key] === p.id && people.length > 1;
                  return (
                    <div key={p.id} className={'cmp-stats-cell' + (isLeader ? ' cmp-stats-cell--leader' : '')}>
                      <div className="cmp-stats-bar" style={{
                        '--c': _COMPARE_COLORS[idx % _COMPARE_COLORS.length],
                        '--w': (pct * 100) + '%'
                      }}/>
                      <div className="cmp-stats-val">
                        {formatPts(v)}<span className="unit">đ</span>
                        {isLeader && <span className="cmp-leader" title="Cao nhất">★</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
            <div className="cmp-stats-row cmp-stats-row--total">
              <div className="cmp-stats-lab">Tổng điểm</div>
              {people.map((p, idx) => (
                <div key={p.id} className="cmp-stats-cell">
                  <div className="cmp-stats-val cmp-stats-val--total">
                    {formatPts(p.pts.total)}<span className="unit">đ</span>
                  </div>
                  <div className="cmp-stats-sub">
                    <span className="tier-badge tier-badge--sm" style={{ '--tc': getTier(p.pts.total).color, '--tb': getTier(p.pts.total).soft }}>
                      {getTier(p.pts.total).emoji} {getTier(p.pts.total).label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
