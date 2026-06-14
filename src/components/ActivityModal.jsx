import { useState } from 'react';
import { X, ExternalLink, Check } from 'lucide-react';
import { ACTIVITY_TYPES, getTypeInfo } from '../utils/defaults';

export default function ActivityModal({ activity, dayLabel, onSave, onDelete, onClose }) {
  const [form, setForm] = useState({ ...activity });

  function set(field, value) {
    setForm(f => ({ ...f, [field]: value }));
  }

  function handleSave() {
    if (!form.title.trim()) return;
    onSave(form);
  }

  const typeInfo = getTypeInfo(form.type);

  return (
    <div style={styles.backdrop} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={styles.modal} className="fade-in">
        <div style={{ ...styles.modalHeader, background: typeInfo.color }}>
          <div>
            <div style={styles.modalEmoji}>{typeInfo.emoji}</div>
            <p style={styles.modalDayLabel}>{dayLabel}</p>
          </div>
          <button style={styles.closeBtn} onClick={onClose}><X size={18} /></button>
        </div>

        <div style={styles.body}>
          {/* Title */}
          <label style={styles.label}>Activity Title *</label>
          <input
            style={styles.input}
            value={form.title}
            onChange={e => set('title', e.target.value)}
            placeholder="e.g. Sunrise hike at Mount Batur"
            autoFocus
          />

          {/* Type + Time row */}
          <div style={styles.row}>
            <div style={{ flex: 1 }}>
              <label style={styles.label}>Type</label>
              <select style={styles.select} value={form.type} onChange={e => set('type', e.target.value)}>
                {ACTIVITY_TYPES.map(t => (
                  <option key={t.id} value={t.id}>{t.emoji} {t.label}</option>
                ))}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={styles.label}>Time</label>
              <input
                type="time"
                style={styles.input}
                value={form.time}
                onChange={e => set('time', e.target.value)}
              />
            </div>
          </div>

          {/* Location */}
          <label style={styles.label}>Location / Place</label>
          <input
            style={styles.input}
            value={form.location}
            onChange={e => set('location', e.target.value)}
            placeholder="e.g. Mount Batur, Kintamani"
          />

          {/* Cost + Link row */}
          <div style={styles.row}>
            <div style={{ flex: 1 }}>
              <label style={styles.label}>Estimated Cost (USD)</label>
              <input
                style={styles.input}
                value={form.cost}
                onChange={e => set('cost', e.target.value)}
                placeholder="e.g. 25"
                type="number"
                min="0"
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={styles.label}>Booking / Link</label>
              <input
                style={styles.input}
                value={form.link}
                onChange={e => set('link', e.target.value)}
                placeholder="URL or reference"
              />
            </div>
          </div>

          {/* Notes */}
          <label style={styles.label}>Notes</label>
          <textarea
            style={{ ...styles.input, ...styles.textarea }}
            value={form.notes}
            onChange={e => set('notes', e.target.value)}
            placeholder="Tips, reminders, or anything useful..."
            rows={3}
          />

          {/* Booked toggle */}
          <label style={styles.checkRow}>
            <div
              style={{ ...styles.checkbox, ...(form.booked ? styles.checkboxOn : {}) }}
              onClick={() => set('booked', !form.booked)}
            >
              {form.booked && <Check size={13} color="#fff" />}
            </div>
            <span style={styles.checkLabel}>Booked / Confirmed</span>
          </label>
        </div>

        <div style={styles.footer}>
          {onDelete && (
            <button style={styles.deleteBtn} onClick={() => { onDelete(form.id); onClose(); }}>
              Delete
            </button>
          )}
          <div style={styles.footerRight}>
            <button style={styles.cancelBtn} onClick={onClose}>Cancel</button>
            <button
              style={{ ...styles.saveBtn, opacity: form.title.trim() ? 1 : 0.5 }}
              onClick={handleSave}
              disabled={!form.title.trim()}
            >
              Save Activity
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  backdrop: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(44,36,23,0.5)',
    backdropFilter: 'blur(4px)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
  },
  modal: {
    background: '#fff',
    borderRadius: 20,
    width: '100%',
    maxWidth: 520,
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 24px 64px rgba(44,36,23,0.25)',
    animation: 'modalIn 0.2s ease',
  },
  modalHeader: {
    padding: '20px 20px 16px',
    borderRadius: '20px 20px 0 0',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  modalEmoji: {
    fontSize: 28,
    marginBottom: 4,
  },
  modalDayLabel: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
    fontWeight: 500,
  },
  closeBtn: {
    background: 'rgba(255,255,255,0.2)',
    border: 'none',
    borderRadius: 8,
    color: '#fff',
    width: 32,
    height: 32,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    padding: '20px 20px 8px',
  },
  label: {
    display: 'block',
    fontSize: 12,
    fontWeight: 600,
    color: '#8a7060',
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
    marginBottom: 6,
    marginTop: 14,
  },
  input: {
    width: '100%',
    border: '1.5px solid #e8ddd4',
    borderRadius: 10,
    padding: '9px 12px',
    fontSize: 14,
    color: '#2c2417',
    background: '#fdfaf7',
    outline: 'none',
    transition: 'border-color 0.2s',
    fontFamily: 'inherit',
  },
  select: {
    width: '100%',
    border: '1.5px solid #e8ddd4',
    borderRadius: 10,
    padding: '9px 12px',
    fontSize: 14,
    color: '#2c2417',
    background: '#fdfaf7',
    outline: 'none',
    fontFamily: 'inherit',
    cursor: 'pointer',
  },
  textarea: {
    resize: 'vertical',
    minHeight: 72,
  },
  row: {
    display: 'flex',
    gap: 12,
  },
  checkRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginTop: 16,
    cursor: 'pointer',
    userSelect: 'none',
  },
  checkbox: {
    width: 22,
    height: 22,
    border: '2px solid #c8b8a8',
    borderRadius: 6,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
    flexShrink: 0,
  },
  checkboxOn: {
    background: '#4a7c59',
    borderColor: '#4a7c59',
  },
  checkLabel: {
    fontSize: 14,
    color: '#5c4a35',
  },
  footer: {
    padding: '16px 20px',
    borderTop: '1px solid #f0e8e0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  footerRight: {
    display: 'flex',
    gap: 8,
    marginLeft: 'auto',
  },
  saveBtn: {
    background: '#c1704a',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    padding: '9px 20px',
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  cancelBtn: {
    background: 'transparent',
    color: '#8a7060',
    border: '1.5px solid #e0d4c8',
    borderRadius: 10,
    padding: '9px 16px',
    fontSize: 14,
    cursor: 'pointer',
  },
  deleteBtn: {
    background: 'transparent',
    color: '#c0392b',
    border: '1.5px solid #f0c8c0',
    borderRadius: 10,
    padding: '9px 16px',
    fontSize: 14,
    cursor: 'pointer',
  },
};
