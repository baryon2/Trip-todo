import { useState } from 'react';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import ItineraryView from './components/ItineraryView';
import ActivityModal from './components/ActivityModal';
import Summary from './components/Summary';
import Checklist from './components/Checklist';
import { getDefaultItinerary, saveItinerary, newActivity, formatDateShort } from './utils/defaults';
import './index.css';

export default function App() {
  const [itinerary, setItinerary] = useState(getDefaultItinerary);
  const [tab, setTab] = useState('overview');
  const [modal, setModal] = useState(null);

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
    <div style={s.app}>
      <Header
        tripName={itinerary.tripName}
        startDate={itinerary.startDate}
        onUpdate={handleHeaderUpdate}
      />

      <div style={s.content}>
        {tab === 'overview' && (
          <div className="fade-in home-layout">
            <Summary days={itinerary.days} />
            <QuickNav days={itinerary.days} onJumpToItinerary={() => setTab('itinerary')} />
          </div>
        )}

        {tab === 'itinerary' && (
          <div className="fade-in">
            <ItineraryView
              days={itinerary.days}
              startDate={itinerary.startDate}
              onAddActivity={openAddActivity}
              onEditActivity={openEditActivity}
              onUpdateDay={handleUpdateDay}
            />
          </div>
        )}

        {tab === 'checklist' && (
          <div className="fade-in home-layout">
            <Checklist defaultOpen />
          </div>
        )}
      </div>

      <BottomNav active={tab} onChange={setTab} />

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

function QuickNav({ days, onJumpToItinerary }) {
  return (
    <div style={nav.wrap}>
      <p style={nav.label}>Quick Jump — tap a day to open itinerary</p>
      <div className="quicknav-grid">
        {days.map((day, idx) => (
          <button
            key={day.id}
            style={{ ...nav.btn, ...(day.activities.length > 0 ? nav.btnFilled : {}) }}
            onClick={onJumpToItinerary}
            title={`Day ${day.dayNumber}${day.location ? ' — ' + day.location : ''}`}
          >
            {day.dayNumber}
          </button>
        ))}
      </div>
    </div>
  );
}

const nav = {
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
  },
  btnFilled: {
    background: '#f5ede6',
    borderColor: '#d4a893',
    color: '#c1704a',
    fontWeight: 700,
  },
};

const s = {
  app: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: 1,
    paddingBottom: 'calc(70px + env(safe-area-inset-bottom, 0px))',
  },
};
