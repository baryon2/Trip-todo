import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const DOW = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function buildMonth(year, month) {
  const firstDow = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = Array(firstDow).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function pad(n) { return String(n).padStart(2, '0'); }

export default function CalendarDrawer({ days, startDate, onJump, onClose }) {
  const tripStart = new Date(startDate + 'T00:00:00');
  const initialMonth = tripStart.getMonth();
  const initialYear = tripStart.getFullYear();

  const [viewYear, setViewYear] = useState(initialYear);
  const [viewMonth, setViewMonth] = useState(initialMonth);

  // Build lookup: "YYYY-MM-DD" → { dayIndex, dayNumber, actCount }
  const tripMap = {};
  days.forEach((d, idx) => {
    if (d.date) {
      tripMap[d.date] = {
        dayIndex: idx,
        dayNumber: d.dayNumber,
        actCount: d.activities.length,
        booked: d.activities.filter(a => a.booked).length,
      };
    }
  });

  const cells = buildMonth(viewYear, viewMonth);

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  }

  function handleDayClick(day) {
    if (!day) return;
    const dateStr = `${viewYear}-${pad(viewMonth + 1)}-${pad(day)}`;
    const info = tripMap[dateStr];
    if (!info) return;
    onJump(info.dayIndex);
    onClose();
    setTimeout(() => {
      document.getElementById(`day-card-${info.dayIndex}`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 60);
  }

  const monthName = new Date(viewYear, viewMonth, 1)
    .toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Today string for highlighting
  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div style={s.backdrop} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={s.drawer} className="fade-in">
        {/* Drag handle for mobile */}
        <div style={s.handle} />

        {/* Header */}
        <div style={s.header}>
          <span style={s.headerTitle}>Trip Calendar</span>
          <button style={s.closeBtn} onClick={onClose}><X size={18} /></button>
        </div>

        {/* Legend */}
        <div style={s.legend}>
          <span style={s.legendItem}><span style={{ ...s.dot, background: '#c1704a' }} /> Trip day</span>
          <span style={s.legendItem}><span style={{ ...s.dot, background: '#4a7c59' }} /> Has activities</span>
        </div>

        {/* Month nav */}
        <div style={s.monthNav}>
          <button style={s.navBtn} onClick={prevMonth}><ChevronLeft size={18} /></button>
          <span style={s.monthLabel}>{monthName}</span>
          <button style={s.navBtn} onClick={nextMonth}><ChevronRight size={18} /></button>
        </div>

        {/* Day-of-week row */}
        <div style={s.dowRow}>
          {DOW.map(d => <span key={d} style={s.dowCell}>{d}</span>)}
        </div>

        {/* Calendar grid */}
        <div style={s.grid}>
          {cells.map((day, i) => {
            if (!day) return <div key={i} />;
            const dateStr = `${viewYear}-${pad(viewMonth + 1)}-${pad(day)}`;
            const info = tripMap[dateStr];
            const isToday = dateStr === todayStr;
            const isTrip = !!info;
            const hasActivities = info && info.actCount > 0;

            return (
              <button
                key={i}
                style={{
                  ...s.cell,
                  ...(isTrip ? s.cellTrip : s.cellOther),
                  ...(hasActivities ? s.cellActive : {}),
                  ...(isToday && !isTrip ? s.cellToday : {}),
                  cursor: isTrip ? 'pointer' : 'default',
                }}
                onClick={() => handleDayClick(day)}
                disabled={!isTrip}
                title={info ? `Day ${info.dayNumber}${info.actCount ? ` — ${info.actCount} activities` : ''}` : undefined}
              >
                <span style={s.cellDay}>{day}</span>
                {isTrip && (
                  <span style={{ ...s.dayNum, color: hasActivities ? '#fff' : 'rgba(255,255,255,0.8)' }}>
                    {info.dayNumber}
                  </span>
                )}
                {hasActivities && (
                  <div style={s.dots}>
                    {Array.from({ length: Math.min(info.actCount, 4) }).map((_, di) => (
                      <span key={di} style={s.actDot} />
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Trip range summary */}
        <div style={s.footer}>
          <div style={s.tripRange}>
            <span style={s.rangeLabel}>Trip:</span>
            <span style={s.rangeVal}>
              {formatRange(days[0]?.date, days[13]?.date)}
            </span>
          </div>
          <div style={s.tripStats}>
            {days.filter(d => d.activities.length > 0).length} of 14 days planned
          </div>
        </div>
      </div>
    </div>
  );
}

function formatRange(start, end) {
  if (!start || !end) return '';
  const s = new Date(start + 'T00:00:00');
  const e = new Date(end + 'T00:00:00');
  const opts = { month: 'short', day: 'numeric' };
  return `${s.toLocaleDateString('en-US', opts)} – ${e.toLocaleDateString('en-US', { ...opts, year: 'numeric' })}`;
}

const s = {
  backdrop: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(44,36,23,0.4)',
    backdropFilter: 'blur(3px)',
    zIndex: 900,
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  drawer: {
    background: '#fff',
    borderRadius: '24px 24px 0 0',
    width: '100%',
    maxWidth: 420,
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 -8px 40px rgba(44,36,23,0.2)',
    paddingBottom: 'env(safe-area-inset-bottom, 0px)',
  },
  handle: {
    width: 40,
    height: 4,
    background: '#e0d4c8',
    borderRadius: 2,
    margin: '12px auto 0',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 20px 8px',
  },
  headerTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 18,
    fontWeight: 700,
    color: '#2c2417',
  },
  closeBtn: {
    background: '#f5ede6',
    border: 'none',
    borderRadius: 10,
    width: 36,
    height: 36,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#8a7060',
  },
  legend: {
    display: 'flex',
    gap: 16,
    padding: '0 20px 10px',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    fontSize: 12,
    color: '#8a7060',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: '50%',
    display: 'inline-block',
  },
  monthNav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '4px 16px 10px',
  },
  navBtn: {
    background: '#f5ede6',
    border: 'none',
    borderRadius: 8,
    width: 36,
    height: 36,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#c1704a',
  },
  monthLabel: {
    fontWeight: 700,
    fontSize: 15,
    color: '#2c2417',
  },
  dowRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    padding: '0 12px',
    marginBottom: 4,
  },
  dowCell: {
    textAlign: 'center',
    fontSize: 11,
    fontWeight: 600,
    color: '#b8a898',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    padding: '4px 0',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: 3,
    padding: '0 12px 12px',
  },
  cell: {
    borderRadius: 10,
    minHeight: 52,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    gap: 1,
    padding: '4px 2px',
    position: 'relative',
  },
  cellOther: {
    background: 'none',
    color: '#c0b0a0',
  },
  cellToday: {
    background: '#f5ede6',
    color: '#c1704a',
  },
  cellTrip: {
    background: '#c1704a',
    color: '#fff',
  },
  cellActive: {
    background: '#4a7c59',
  },
  cellDay: {
    fontSize: 14,
    fontWeight: 600,
    lineHeight: 1,
  },
  dayNum: {
    fontSize: 9,
    fontWeight: 500,
    letterSpacing: '0.3px',
    lineHeight: 1,
  },
  dots: {
    display: 'flex',
    gap: 2,
    marginTop: 1,
  },
  actDot: {
    width: 4,
    height: 4,
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.7)',
    display: 'inline-block',
  },
  footer: {
    borderTop: '1px solid #f0e8e0',
    padding: '12px 20px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 6,
  },
  tripRange: {
    display: 'flex',
    gap: 6,
    alignItems: 'center',
  },
  rangeLabel: {
    fontSize: 12,
    color: '#8a7060',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  rangeVal: {
    fontSize: 13,
    color: '#2c2417',
    fontWeight: 500,
  },
  tripStats: {
    fontSize: 12,
    color: '#8a7060',
  },
};
