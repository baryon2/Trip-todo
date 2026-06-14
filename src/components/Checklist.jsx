import { useState } from 'react';
import { Check, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

const DEFAULT_ITEMS = [
  { id: 'p1', text: 'Passport & visa documents', done: false },
  { id: 'p2', text: 'Travel insurance', done: false },
  { id: 'p3', text: 'Book flights', done: false },
  { id: 'p4', text: 'Book accommodation', done: false },
  { id: 'p5', text: 'Download offline maps (Google Maps / Maps.me)', done: false },
  { id: 'p6', text: 'Get travel adapter (Type C/F)', done: false },
  { id: 'p7', text: 'Local SIM card or data plan', done: false },
  { id: 'p8', text: 'Indonesian Rupiah cash', done: false },
  { id: 'p9', text: 'Sunscreen SPF 50+', done: false },
  { id: 'p10', text: 'Mosquito repellent', done: false },
  { id: 'p11', text: 'Light clothing & rain jacket', done: false },
  { id: 'p12', text: 'Temple sarong / sash', done: false },
];

export default function Checklist({ defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const [items, setItems] = useState(() => {
    const stored = localStorage.getItem('bali-checklist');
    if (stored) try { return JSON.parse(stored); } catch {}
    return DEFAULT_ITEMS;
  });
  const [newText, setNewText] = useState('');

  function save(updated) {
    setItems(updated);
    localStorage.setItem('bali-checklist', JSON.stringify(updated));
  }

  function toggle(id) {
    save(items.map(i => i.id === id ? { ...i, done: !i.done } : i));
  }

  function add() {
    if (!newText.trim()) return;
    const item = { id: `c-${Date.now()}`, text: newText.trim(), done: false };
    save([...items, item]);
    setNewText('');
  }

  function remove(id) {
    save(items.filter(i => i.id !== id));
  }

  const doneCount = items.filter(i => i.done).length;

  return (
    <div style={styles.wrap}>
      <button style={styles.header} onClick={() => setOpen(o => !o)}>
        <div>
          <span style={styles.title}>Pre-trip Checklist</span>
          <span style={styles.progress}>{doneCount}/{items.length} done</span>
        </div>
        {open ? <ChevronUp size={18} color="#8a7060" /> : <ChevronDown size={18} color="#8a7060" />}
      </button>

      {open && (
        <div style={styles.body} className="fade-in">
          <div style={styles.progressBar}>
            <div
              style={{
                ...styles.progressFill,
                width: items.length ? `${(doneCount / items.length) * 100}%` : '0%',
              }}
            />
          </div>
          <div style={styles.list}>
            {items.map(item => (
              <div key={item.id} style={styles.item}>
                <button
                  style={{ ...styles.checkbox, ...(item.done ? styles.checkboxDone : {}) }}
                  onClick={() => toggle(item.id)}
                >
                  {item.done && <Check size={12} color="#fff" />}
                </button>
                <span style={{ ...styles.itemText, ...(item.done ? styles.done : {}) }}>
                  {item.text}
                </span>
                <button style={styles.removeBtn} onClick={() => remove(item.id)}>
                  <Trash2 size={13} color="#c8b8a8" />
                </button>
              </div>
            ))}
          </div>
          <div style={styles.addRow}>
            <input
              style={styles.addInput}
              value={newText}
              onChange={e => setNewText(e.target.value)}
              placeholder="Add an item..."
              onKeyDown={e => e.key === 'Enter' && add()}
            />
            <button style={styles.addBtn} onClick={add}>
              <Plus size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  wrap: {
    background: '#fff',
    borderRadius: 16,
    boxShadow: '0 2px 12px rgba(44,36,23,0.08)',
    border: '1px solid #f0e8e0',
    overflow: 'hidden',
  },
  header: {
    width: '100%',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '16px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 16,
    fontWeight: 600,
    color: '#2c2417',
    marginRight: 10,
  },
  progress: {
    fontSize: 12,
    color: '#8a7060',
    background: '#f5ede6',
    borderRadius: 20,
    padding: '2px 8px',
  },
  body: {
    padding: '0 20px 16px',
    borderTop: '1px solid #f8f0e8',
  },
  progressBar: {
    height: 4,
    background: '#f0e8e0',
    borderRadius: 2,
    margin: '12px 0 14px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #4a7c59, #6ba87a)',
    borderRadius: 2,
    transition: 'width 0.4s ease',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '6px 0',
    minHeight: 44,
  },
  checkbox: {
    width: 28,
    height: 28,
    border: '2px solid #d0c0b0',
    borderRadius: 7,
    background: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'all 0.2s',
  },
  checkboxDone: {
    background: '#4a7c59',
    borderColor: '#4a7c59',
  },
  itemText: {
    fontSize: 13,
    color: '#2c2417',
    flex: 1,
    transition: 'color 0.2s',
  },
  done: {
    textDecoration: 'line-through',
    color: '#b8a898',
  },
  removeBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 3,
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
    opacity: 0.6,
  },
  addRow: {
    display: 'flex',
    gap: 8,
    marginTop: 12,
  },
  addInput: {
    flex: 1,
    border: '1.5px solid #e8ddd4',
    borderRadius: 10,
    padding: '7px 12px',
    fontSize: 13,
    color: '#2c2417',
    background: '#fdfaf7',
    outline: 'none',
    fontFamily: 'inherit',
  },
  addBtn: {
    background: '#c1704a',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    width: 44,
    height: 44,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
};
