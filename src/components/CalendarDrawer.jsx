import { X, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useState, useRef } from 'react';
import DayCard from './DayCard';

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

export default function CalendarDrawer({
  days, startDate,
  onAddActivity, onEditActivity, onUpdateDay,
  onClose,
}) {
  const tripStart = new Date(startDate + 'T00:00:00');
  const [viewYear, setViewYear] = useState(tripStart.getFullYear());
  const [viewMonth, setViewMonth] = useState(tripStart.getMonth());
  const [activeDay, setActiveDay] = useState(null);
  const drawerBodyRef = useRef(null);

  const tripMap = {};
  days.forEach((d, idx) => {
    if (d.date) tripMap[d.date] = { dayIndex: idx, dayNumber: d.dayNumber, actCount: d.activities.length };
  });

  const cells = buildMonth(viewYear, viewMonth);
  const todayStr = new Date().toISOString().split('T')[0];

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  }

  function handleCalendarDay(day) {
    if (!day) return;
    const dateStr = `${viewYear}-${pad(viewMonth + 1)}-${pad(day)}`;
    const info = tripMap[dateStr];
    if (!info) return;
    setActiveDay(info.dayIndex);
    setTimeout(() => {
      drawerBodyRef.current
        ?.querySelector(`#drawer-day-${info.dayIndex}`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 40);
  }

  const monthName = new Date(viewYear, viewMonth, 1)
    .toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div style={s.backdrop} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={s.drawer}>
        {/* Sticky header inside drawer */}
        <div style={s.stickyHead}>
          <div style={s.handle} />

          <div style={s.header}>
            <span style={s.headerTitle}>Itinerary</span>
            <button style={s.closeBtn} onClick={onClose}><X size={18} /></button>
          </div>

          {/* Month nav */}
          <div style={s.monthNav}>
            <button style={s.navBtn} onClick={prevMonth}><ChevronLeft size={17} /></button>
            <span style={s.monthLabel}>{monthName}</span>
            <button style={s.navBtn} onClick={nextMonth}><ChevronRight size={17} /></button>
          </div>

          {/* Day-of-week labels */}
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
              const hasAct = info && info.actCount > 0;
              const isSelected = info && activeDay === info.dayIndex;

              return (
                <button
                  key={i}
                  onClick={() => handleCalendarDay(day)}
                  disabled={!isTrip}
                  style={{
                    ...s.cell,
                    ...(isTrip ? s.cellTrip : s.cellOther),
                    ...(hasAct ? s.cellActive : {}),
                    ...(isToday && !isTrip ? s.cellToday : {}),
                    ...(isSelected ? s.cellSelected : {}),
                    cursor: isTrip ? 'pointer' : 'default',
                  }}
                >
                  <span style={s.cellDay}>{day}</span>
                  {isTrip && (
                    <span style={{ ...s.tripNum, opacity: hasAct ? 0.9 : 0.7 }}>
                      {info.dayNumber}
                    </span>
                  )}
                  {hasAct && (
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

          {/* Legend */}
          <div style={s.legend}>
            <span style={s.legendItem}><span style={{ ...s.dot, background: '#c1704a' }} /> Trip day</span>
            <span style={s.legendItem}><span style={{ ...s.dot, background: '#4a7c59' }} /> Has activities</span>
            <span style={s.legendItem}>
              {days.filter(d => d.activities.length > 0).length}/14 days planned
            </span>
          </div>

          <div style={s.divider} />
        </div>

        {/* Scrollable day cards section */}
        <div style={s.cardsSection} ref={drawerBodyRef}>
          {days.map((day, idx) => (
            <div key={day.id} id={`drawer-day-${idx}`} style={s.cardWrap}>
              <DayCard
                day={day}
                dayIndex={idx}
                isActive={activeDay === idx}
                onToggle={() => setActiveDay(prev => prev === idx ? null : idx)}
                onAddActivity={onAddActivity}
                onEditActivity={act => onEditActivity(idx, act)}
                onUpdateDay={changes => onUpdateDay(idx, changes)}
              />
            </div>
          ))}
          <div style={s.bottomPad} />
        </div>
      </div>
    </div>
  );
}

const s = {
  backdrop: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(44,36,23,0.45)',
    backdropFilter: 'blur(4px)',
    zIndex: 900,
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  drawer: {
    background: '#fdf6ef',
    borderRadius: '24px 24px 0 0',
    width: '100%',
    maxWidth: 680,
    height: '95vh',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 -8px 48px rgba(44,36,23,0.22)',
    overflow: 'hidden',
    animation: 'modalIn 0.28s cubic-bezier(.32,.72,0,1)',
  },
  stickyHead: {
    background: '#fff',
    flexShrink: 0,
    borderBottom: '1px solid #f0e8e0',
  },
  handle: {
    width: 40,
    height: 4,
    background: '#e0d4c8',
    borderRadius: 2,
    margin: '10px auto 0',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 20px 6px',
  },
  headerTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 20,
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
  monthNav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '2px 16px 6px',
  },
  navBtn: {
    background: '#f5ede6',
    border: 'none',
    borderRadius: 8,
    width: 32,
    height: 32,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#c1704a',
  },
  monthLabel: {
    fontWeight: 700,
    fontSize: 14,
    color: '#2c2417',
  },
  dowRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    padding: '0 10px',
  },
  dowCell: {
    textAlign: 'center',
    fontSize: 10,
    fontWeight: 600,
    color: '#b8a898',
    textTransform: 'uppercase',
    letterSpacing: '0.4px',
    padding: '2px 0',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: 2,
    padding: '2px 10px 8px',
  },
  cell: {
    borderRadius: 8,
    minHeight: 44,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    gap: 1,
    padding: '3px 1px',
  },
  cellOther: { background: 'none', color: '#c8b8a8' },
  cellToday: { background: '#f5ede6', color: '#c1704a' },
  cellTrip: { background: '#c1704a', color: '#fff' },
  cellActive: { background: '#4a7c59' },
  cellSelected: { outline: '2px solid #2c2417', outlineOffset: 1 },
  cellDay: { fontSize: 13, fontWeight: 600, lineHeight: 1 },
  tripNum: {
    fontSize: 9,
    fontWeight: 500,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 1,
  },
  dots: { display: 'flex', gap: 2, marginTop: 1 },
  actDot: {
    width: 3,
    height: 3,
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.7)',
    display: 'inline-block',
  },
  legend: {
    display: 'flex',
    gap: 14,
    padding: '4px 12px 8px',
    flexWrap: 'wrap',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    fontSize: 11,
    color: '#8a7060',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    display: 'inline-block',
    flexShrink: 0,
  },
  divider: {
    height: 1,
    background: '#f0e8e0',
  },
  cardsSection: {
    flex: 1,
    overflowY: 'auto',
    padding: '12px 12px 0',
  },
  cardWrap: {
    marginBottom: 10,
  },
  bottomPad: {
    height: 'calc(24px + env(safe-area-inset-bottom, 0px))',
  },
};
