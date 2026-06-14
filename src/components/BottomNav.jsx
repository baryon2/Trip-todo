import { LayoutDashboard, CalendarDays, ListChecks } from 'lucide-react';

const TABS = [
  { id: 'overview',   label: 'Overview',  Icon: LayoutDashboard },
  { id: 'itinerary',  label: 'Itinerary', Icon: CalendarDays },
  { id: 'checklist',  label: 'Checklist', Icon: ListChecks },
];

export default function BottomNav({ active, onChange }) {
  return (
    <nav style={s.nav}>
      {TABS.map(({ id, label, Icon }) => {
        const isActive = active === id;
        return (
          <button key={id} style={s.tab} onClick={() => onChange(id)}>
            <div style={{ ...s.iconWrap, ...(isActive ? s.iconWrapActive : {}) }}>
              <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} color={isActive ? '#fff' : '#8a7060'} />
            </div>
            <span style={{ ...s.label, ...(isActive ? s.labelActive : {}) }}>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}

const s = {
  nav: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    background: '#fff',
    borderTop: '1px solid #f0e8e0',
    display: 'flex',
    alignItems: 'stretch',
    zIndex: 800,
    paddingBottom: 'env(safe-area-inset-bottom, 0px)',
    boxShadow: '0 -4px 20px rgba(44,36,23,0.08)',
  },
  tab: {
    flex: 1,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    padding: '10px 4px 8px',
    fontFamily: 'inherit',
    minHeight: 60,
  },
  iconWrap: {
    width: 40,
    height: 32,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.2s',
  },
  iconWrapActive: {
    background: '#c1704a',
  },
  label: {
    fontSize: 11,
    fontWeight: 500,
    color: '#b8a898',
    letterSpacing: '0.2px',
    lineHeight: 1,
  },
  labelActive: {
    color: '#c1704a',
    fontWeight: 700,
  },
};
