import { useState, useEffect } from 'react';
import { Plus, MapPin, Home, ChevronDown, ChevronUp, Clock, CheckCircle2, Circle, Edit2, Trash2 } from 'lucide-react';
import { formatDate, getTypeInfo } from '../utils/defaults';

export default function DayCard({ day, dayIndex, onAddActivity, onEditActivity, onUpdateDay, isActive, onToggle }) {
  const [editingDay, setEditingDay] = useState(false);
  const [location, setLocation] = useState(day.location);
  const [accommodation, setAccommodation] = useState(day.accommodation);
  const [notes, setNotes] = useState(day.notes);

  useEffect(() => {
    if (!editingDay) {
      setLocation(day.location);
      setAccommodation(day.accommodation);
      setNotes(day.notes);
    }
  }, [day.location, day.accommodation, day.notes, editingDay]);

  function saveDay() {
    onUpdateDay({ location, accommodation, notes });
    setEditingDay(false);
  }

  const totalCost = day.activities.reduce((sum, a) => sum + (parseFloat(a.cost) || 0), 0);
  const bookedCount = day.activities.filter(a => a.booked).length;

  return (
    <div id={`day-card-${dayIndex}`} style={styles.card}>
      {/* Day Header */}
      <button style={styles.header} onClick={onToggle}>
        <div style={styles.dayBadge}>
          <span style={styles.dayNum}>{day.dayNumber}</span>
          <span style={styles.dayOf}>of 14</span>
        </div>
        <div style={styles.headerInfo}>
          <div style={styles.headerTop}>
            <span style={styles.dateStr}>{formatDate(day.date)}</span>
            {day.activities.length > 0 && (
              <span style={styles.actCount}>{day.activities.length} {day.activities.length === 1 ? 'activity' : 'activities'}</span>
            )}
          </div>
          {day.location && (
            <div style={styles.locationRow}>
              <MapPin size={13} color="#c1704a" />
              <span style={styles.locationText}>{day.location}</span>
            </div>
          )}
          {day.activities.length > 0 && (
            <div style={styles.statsRow}>
              {bookedCount > 0 && (
                <span style={styles.stat}>
                  <CheckCircle2 size={12} color="#4a7c59" />
                  {bookedCount} booked
                </span>
              )}
              {totalCost > 0 && (
                <span style={styles.stat}>≈ ${totalCost.toFixed(0)}</span>
              )}
            </div>
          )}
        </div>
        <div style={styles.chevron}>
          {isActive ? <ChevronUp size={20} color="#8a7060" /> : <ChevronDown size={20} color="#8a7060" />}
        </div>
      </button>

      {/* Expanded Content */}
      {isActive && (
        <div style={styles.body} className="fade-in">
          {/* Day meta */}
          {editingDay ? (
            <div style={styles.metaEdit}>
              <input
                style={styles.metaInput}
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="📍 Location / Area (e.g. Ubud)"
              />
              <input
                style={styles.metaInput}
                value={accommodation}
                onChange={e => setAccommodation(e.target.value)}
                placeholder="🏨 Accommodation"
              />
              <textarea
                style={{ ...styles.metaInput, ...styles.metaTextarea }}
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Day notes..."
                rows={2}
              />
              <div style={styles.metaActions}>
                <button style={styles.saveDayBtn} onClick={saveDay}>Save</button>
                <button style={styles.cancelDayBtn} onClick={() => setEditingDay(false)}>Cancel</button>
              </div>
            </div>
          ) : (
            <div style={styles.meta}>
              <div style={styles.metaContent}>
                {day.location && (
                  <div style={styles.metaRow}>
                    <MapPin size={14} color="#c1704a" />
                    <span>{day.location}</span>
                  </div>
                )}
                {day.accommodation && (
                  <div style={styles.metaRow}>
                    <Home size={14} color="#4a7c59" />
                    <span>{day.accommodation}</span>
                  </div>
                )}
                {day.notes && (
                  <p style={styles.dayNotes}>{day.notes}</p>
                )}
                {!day.location && !day.accommodation && !day.notes && (
                  <span style={styles.emptyMeta}>No day details yet</span>
                )}
              </div>
              <button style={styles.editDayBtn} onClick={() => setEditingDay(true)}>
                <Edit2 size={13} />
              </button>
            </div>
          )}

          {/* Activities */}
          <div style={styles.activities}>
            {day.activities.length === 0 && (
              <p style={styles.emptyActivities}>No activities yet — add your first one!</p>
            )}
            {day.activities.map((act, idx) => (
              <ActivityItem
                key={act.id}
                activity={act}
                onEdit={() => onEditActivity(act)}
              />
            ))}
          </div>

          {/* Add button */}
          <button style={styles.addBtn} onClick={() => onAddActivity(dayIndex)}>
            <Plus size={16} />
            Add Activity
          </button>
        </div>
      )}
    </div>
  );
}

function ActivityItem({ activity, onEdit }) {
  const info = getTypeInfo(activity.type);
  return (
    <div style={{ ...styles.actItem, borderLeft: `3px solid ${info.color}` }} onClick={onEdit}>
      <div style={styles.actLeft}>
        <span style={styles.actEmoji}>{info.emoji}</span>
        <div>
          <div style={styles.actTitle}>
            {activity.booked && <CheckCircle2 size={13} color="#4a7c59" style={{ marginRight: 4, verticalAlign: 'middle' }} />}
            {activity.title}
          </div>
          <div style={styles.actMeta}>
            {activity.time && (
              <span style={styles.actMetaItem}>
                <Clock size={11} color="#8a7060" /> {formatTime(activity.time)}
              </span>
            )}
            {activity.location && (
              <span style={styles.actMetaItem}>
                <MapPin size={11} color="#8a7060" /> {activity.location}
              </span>
            )}
            {activity.cost && (
              <span style={styles.actMetaItem}>${activity.cost}</span>
            )}
          </div>
        </div>
      </div>
      <button style={styles.actEditBtn} onClick={e => { e.stopPropagation(); onEdit(); }}>
        <Edit2 size={13} color="#8a7060" />
      </button>
    </div>
  );
}

function formatTime(t) {
  if (!t) return '';
  const [h, m] = t.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
}

const styles = {
  card: {
    background: '#fff',
    borderRadius: 16,
    boxShadow: '0 2px 12px rgba(44,36,23,0.08)',
    overflow: 'hidden',
    border: '1px solid #f0e8e0',
  },
  header: {
    width: '100%',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '16px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    textAlign: 'left',
    transition: 'background 0.15s',
  },
  dayBadge: {
    minWidth: 52,
    height: 52,
    background: 'linear-gradient(135deg, #c1704a, #a05a38)',
    borderRadius: 12,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  dayNum: {
    color: '#fff',
    fontWeight: 700,
    fontSize: 18,
    lineHeight: 1,
    fontFamily: "'Playfair Display', serif",
  },
  dayOf: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 10,
    fontWeight: 500,
  },
  headerInfo: {
    flex: 1,
    minWidth: 0,
  },
  headerTop: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
    marginBottom: 2,
  },
  dateStr: {
    fontWeight: 600,
    fontSize: 15,
    color: '#2c2417',
  },
  actCount: {
    fontSize: 12,
    color: '#8a7060',
    background: '#f5ede6',
    borderRadius: 20,
    padding: '1px 8px',
  },
  locationRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  locationText: {
    fontSize: 13,
    color: '#c1704a',
    fontWeight: 500,
  },
  statsRow: {
    display: 'flex',
    gap: 10,
    marginTop: 4,
  },
  stat: {
    fontSize: 12,
    color: '#8a7060',
    display: 'flex',
    alignItems: 'center',
    gap: 3,
  },
  chevron: {
    flexShrink: 0,
  },
  body: {
    padding: '0 20px 20px',
    borderTop: '1px solid #f8f0e8',
  },
  meta: {
    display: 'flex',
    gap: 8,
    padding: '12px 0 10px',
    alignItems: 'flex-start',
  },
  metaContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 13,
    color: '#5c4a35',
  },
  dayNotes: {
    fontSize: 13,
    color: '#8a7060',
    fontStyle: 'italic',
    marginTop: 2,
  },
  emptyMeta: {
    fontSize: 13,
    color: '#b8a898',
    fontStyle: 'italic',
  },
  editDayBtn: {
    background: 'none',
    border: '1px solid #e8ddd4',
    borderRadius: 8,
    color: '#8a7060',
    width: 30,
    height: 30,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  metaEdit: {
    padding: '12px 0 8px',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  metaInput: {
    border: '1.5px solid #e8ddd4',
    borderRadius: 10,
    padding: '8px 12px',
    fontSize: 13,
    color: '#2c2417',
    background: '#fdfaf7',
    outline: 'none',
    fontFamily: 'inherit',
    width: '100%',
  },
  metaTextarea: {
    resize: 'vertical',
  },
  metaActions: {
    display: 'flex',
    gap: 8,
  },
  saveDayBtn: {
    background: '#4a7c59',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    padding: '7px 16px',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
  },
  cancelDayBtn: {
    background: 'transparent',
    color: '#8a7060',
    border: '1px solid #e0d4c8',
    borderRadius: 8,
    padding: '7px 14px',
    fontSize: 13,
    cursor: 'pointer',
  },
  activities: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    marginTop: 4,
  },
  emptyActivities: {
    fontSize: 13,
    color: '#b8a898',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: '12px 0',
  },
  actItem: {
    background: '#fdfaf7',
    borderRadius: 10,
    padding: '10px 12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer',
    transition: 'background 0.15s',
    gap: 8,
  },
  actLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    minWidth: 0,
  },
  actEmoji: {
    fontSize: 18,
    flexShrink: 0,
  },
  actTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: '#2c2417',
    marginBottom: 2,
    display: 'flex',
    alignItems: 'center',
  },
  actMeta: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
  },
  actMetaItem: {
    fontSize: 12,
    color: '#8a7060',
    display: 'flex',
    alignItems: 'center',
    gap: 3,
  },
  actEditBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 4,
    borderRadius: 6,
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
  },
};
