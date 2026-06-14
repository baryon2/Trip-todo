import { useState } from 'react';
import { CalendarDays } from 'lucide-react';
import Header from './components/Header';
import DayCard from './components/DayCard';
import ActivityModal from './components/ActivityModal';
import CalendarDrawer from './components/CalendarDrawer';
import Summary from './components/Summary';
import Checklist from './components/Checklist';
import { getDefaultItinerary, saveItinerary, newActivity, formatDateShort } from './utils/defaults';
import './index.css';

export default function App() {
  const [itinerary, setItinerary] = useState(getDefaultItinerary);
  const [activeDay, setActiveDay] = useState(null);
  const [modal, setModal] = useState(null); // { dayIndex, activity }
  const [calendarOpen, setCalendarOpen] = useState(false);

  function update(updater) {
    setItinerary(prev => {
      const next = updater(prev);
      saveItinerary(next);
      return next;
    });
  }

  function handleHeaderUpdate({ tripName, startDate }) {
    update(prev => {
      const start = new Date(startDate + 'T00:00:00');
      const days = prev.days.map((d, i) => {
        const date = new Date(start);
        date.setDate(start.getDate() + i);
        return { ...d, date: date.toISOString().split('T')[0] };
      });
      return { ...prev, tripName, startDate, days };
    });
  }

  function openAddActivity(dayIndex) {
    setModal({ dayIndex, activity: newActivity() });
  }

  function openEditActivity(dayIndex, activity) {
    setModal({ dayIndex, activity: { ...activity } });
  }

  function handleSaveActivity(saved) {
    const { dayIndex } = modal;
    update(prev => {
      const days = prev.days.map((d, i) => {
        if (i !== dayIndex) return d;
        const exists = d.activities.findIndex(a => a.id === saved.id);
        const activities = exists >= 0
          ? d.activities.map(a => a.id === saved.id ? saved : a)
          : [...d.activities, saved];
        const sorted = [...activities].sort((a, b) => (a.time || '99:99').localeCompare(b.time || '99:99'));
        return { ...d, activities: sorted };
      });
      return { ...prev, days };
    });
    setModal(null);
  }

  function handleDeleteActivity(actId) {
    const { dayIndex } = modal;
    update(prev => ({
      ...prev,
      days: prev.days.map((d, i) =>
        i === dayIndex ? { ...d, activities: d.activities.filter(a => a.id !== actId) } : d
      ),
    }));
  }

  function handleUpdateDay(dayIndex, changes) {
    update(prev => ({
      ...prev,
      days: prev.days.map((d, i) => i === dayIndex ? { ...d, ...changes } : d),
    }));
  }

  const modalDay = modal ? itinerary.days[modal.dayIndex] : null;

  return (
    <div style={styles.app}>
      <Header
        tripName={itinerary.tripName}
        startDate={itinerary.startDate}
        onUpdate={handleHeaderUpdate}
      />

      <div className="app-layout">
        {/* Sidebar */}
        <aside className="app-sidebar">
          <Summary days={itinerary.days} />
          <Checklist />
          <QuickNav days={itinerary.days} activeDay={activeDay} onJump={setActiveDay} />
          <button style={styles.calendarBtn} onClick={() => setCalendarOpen(true)}>
            <CalendarDays size={18} />
            View Calendar
          </button>
        </aside>

        {/* Days */}
        <main className="app-main">
          <div style={styles.daysGrid}>
            {itinerary.days.map((day, idx) => (
              <DayCard
                key={day.id}
                day={day}
                dayIndex={idx}
                isActive={activeDay === idx}
                onToggle={() => setActiveDay(prev => prev === idx ? null : idx)}
                onAddActivity={openAddActivity}
                onEditActivity={act => openEditActivity(idx, act)}
                onUpdateDay={changes => handleUpdateDay(idx, changes)}
              />
            ))}
          </div>
        </main>
      </div>

      {calendarOpen && (
        <CalendarDrawer
          days={itinerary.days}
          startDate={itinerary.startDate}
          onJump={idx => setActiveDay(idx)}
          onClose={() => setCalendarOpen(false)}
        />
      )}

      {modal && (
        <ActivityModal
          activity={modal.activity}
          dayLabel={modalDay ? `Day ${modalDay.dayNumber} — ${formatDateShort(modalDay.date)}` : ''}
          onSave={handleSaveActivity}
          onDelete={modal.activity.title ? handleDeleteActivity : null}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}

function QuickNav({ days, activeDay, onJump }) {
  return (
    <div style={navStyles.wrap}>
      <p style={navStyles.label}>Quick Jump</p>
      <div className="quicknav-grid">
        {days.map((day, idx) => (
          <button
            key={day.id}
            style={{
              ...navStyles.btn,
              ...(activeDay === idx ? navStyles.btnActive : {}),
              ...(day.activities.length > 0 ? navStyles.btnFilled : {}),
            }}
            onClick={() => {
              onJump(prev => prev === idx ? null : idx);
              setTimeout(() => {
                document.getElementById(`day-card-${idx}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }, 50);
            }}
            title={`Day ${day.dayNumber}${day.location ? ' — ' + day.location : ''}`}
          >
            {day.dayNumber}
          </button>
        ))}
      </div>
    </div>
  );
}

const navStyles = {
  wrap: {
    background: '#fff',
    borderRadius: 16,
    padding: '16px 20px',
    boxShadow: '0 2px 12px rgba(44,36,23,0.08)',
    border: '1px solid #f0e8e0',
  },
  label: {
    fontSize: 11,
    fontWeight: 600,
    color: '#8a7060',
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
    marginBottom: 10,
  },
  btn: {
    border: '1.5px solid #e8ddd4',
    background: '#fdfaf7',
    borderRadius: 8,
    height: 44,
    fontSize: 13,
    fontWeight: 500,
    color: '#8a7060',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  btnActive: {
    background: '#c1704a',
    borderColor: '#c1704a',
    color: '#fff',
    fontWeight: 700,
  },
  btnFilled: {
    background: '#f5ede6',
    borderColor: '#d4a893',
    color: '#c1704a',
  },
};

const styles = {
  app: {
    minHeight: '100vh',
  },
  daysGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  calendarBtn: {
    width: '100%',
    minHeight: 48,
    background: 'linear-gradient(135deg, #c1704a, #a05a38)',
    color: '#fff',
    border: 'none',
    borderRadius: 14,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    boxShadow: '0 2px 12px rgba(193,112,74,0.3)',
    fontFamily: 'inherit',
  },
};
