import { useState } from 'react';
import { Palmtree, Edit2, Check, X } from 'lucide-react';

export default function Header({ tripName, startDate, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(tripName);
  const [date, setDate] = useState(startDate);

  function save() {
    onUpdate({ tripName: name, startDate: date });
    setEditing(false);
  }

  function cancel() {
    setName(tripName);
    setDate(startDate);
    setEditing(false);
  }

  return (
    <header style={styles.header}>
      <div style={styles.overlay} />
      <div style={styles.content}>
        <div style={styles.iconRow}>
          <Palmtree size={32} color="#fff" />
        </div>
        {editing ? (
          <div style={styles.editRow}>
            <input
              style={styles.nameInput}
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Trip name"
              autoFocus
            />
            <input
              type="date"
              style={styles.dateInput}
              value={date}
              onChange={e => setDate(e.target.value)}
            />
            <div style={styles.editBtns}>
              <button style={styles.iconBtn} onClick={save}><Check size={18} /></button>
              <button style={{ ...styles.iconBtn, ...styles.cancelBtn }} onClick={cancel}><X size={18} /></button>
            </div>
          </div>
        ) : (
          <div style={styles.titleRow}>
            <div>
              <h1 style={styles.title}>{tripName}</h1>
              <p style={styles.subtitle}>
                {formatHeaderDate(startDate)} &mdash; 14 days in paradise
              </p>
            </div>
            <button style={styles.editBtn} onClick={() => setEditing(true)} title="Edit trip details">
              <Edit2 size={16} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

function formatHeaderDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

const styles = {
  header: {
    position: 'relative',
    background: 'linear-gradient(135deg, #c1704a 0%, #8f4a2a 40%, #2a7f8f 100%)',
    padding: '48px 24px 40px',
    textAlign: 'center',
    overflow: 'hidden',
  },
  overlay: {
    position: 'absolute',
    inset: 0,
    background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.04\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
    opacity: 0.6,
  },
  content: {
    position: 'relative',
    zIndex: 1,
    maxWidth: 800,
    margin: '0 auto',
  },
  iconRow: {
    marginBottom: 12,
    opacity: 0.9,
  },
  titleRow: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    gap: 12,
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 'clamp(28px, 5vw, 48px)',
    fontWeight: 700,
    color: '#fff',
    letterSpacing: '-0.5px',
    textShadow: '0 2px 8px rgba(0,0,0,0.2)',
    lineHeight: 1.15,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: 400,
    letterSpacing: '0.5px',
  },
  editBtn: {
    background: 'rgba(255,255,255,0.15)',
    border: '1px solid rgba(255,255,255,0.3)',
    borderRadius: 8,
    color: '#fff',
    width: 34,
    height: 34,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 8,
    transition: 'background 0.2s',
  },
  editRow: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10,
  },
  nameInput: {
    background: 'rgba(255,255,255,0.2)',
    border: '1px solid rgba(255,255,255,0.4)',
    borderRadius: 10,
    color: '#fff',
    fontSize: 22,
    fontFamily: "'Playfair Display', serif",
    fontWeight: 700,
    padding: '8px 16px',
    textAlign: 'center',
    outline: 'none',
    width: '100%',
    maxWidth: 400,
  },
  dateInput: {
    background: 'rgba(255,255,255,0.2)',
    border: '1px solid rgba(255,255,255,0.4)',
    borderRadius: 10,
    color: '#fff',
    fontSize: 14,
    padding: '6px 12px',
    outline: 'none',
  },
  editBtns: {
    display: 'flex',
    gap: 8,
  },
  iconBtn: {
    background: 'rgba(255,255,255,0.2)',
    border: '1px solid rgba(255,255,255,0.4)',
    borderRadius: 8,
    color: '#fff',
    width: 36,
    height: 36,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtn: {
    background: 'rgba(220,50,50,0.3)',
  },
};
