import { DollarSign, CheckCircle2, MapPin, Calendar } from 'lucide-react';
import { ACTIVITY_TYPES, getTypeInfo } from '../utils/defaults';

export default function Summary({ days }) {
  const allActivities = days.flatMap(d => d.activities);
  const totalCost = allActivities.reduce((s, a) => s + (parseFloat(a.cost) || 0), 0);
  const bookedCount = allActivities.filter(a => a.booked).length;
  const daysWithActivities = days.filter(d => d.activities.length > 0).length;
  const locations = [...new Set(days.map(d => d.location).filter(Boolean))];

  const byType = ACTIVITY_TYPES.map(t => ({
    ...t,
    count: allActivities.filter(a => a.type === t.id).length,
  })).filter(t => t.count > 0);

  return (
    <div style={styles.wrap}>
      <h2 style={styles.title}>Trip Overview</h2>

      <div style={styles.stats}>
        <Stat icon={<Calendar size={18} color="#c1704a" />} label="Days planned" value={`${daysWithActivities} / 14`} />
        <Stat icon={<CheckCircle2 size={18} color="#4a7c59" />} label="Booked" value={`${bookedCount} / ${allActivities.length}`} />
        <Stat icon={<DollarSign size={18} color="#d4a843" />} label="Est. total" value={totalCost > 0 ? `$${totalCost.toFixed(0)}` : '—'} />
        <Stat icon={<MapPin size={18} color="#2a7f8f" />} label="Locations" value={locations.length > 0 ? locations.length : '—'} />
      </div>

      {locations.length > 0 && (
        <div style={styles.section}>
          <p style={styles.sectionLabel}>Locations</p>
          <div style={styles.tags}>
            {locations.map(l => (
              <span key={l} style={styles.tag}>{l}</span>
            ))}
          </div>
        </div>
      )}

      {byType.length > 0 && (
        <div style={styles.section}>
          <p style={styles.sectionLabel}>Activity breakdown</p>
          <div style={styles.breakdown}>
            {byType.map(t => (
              <div key={t.id} style={styles.breakItem}>
                <span style={styles.breakEmoji}>{t.emoji}</span>
                <div style={styles.breakBar}>
                  <div
                    style={{
                      ...styles.breakFill,
                      background: t.color,
                      width: `${(t.count / allActivities.length) * 100}%`,
                    }}
                  />
                </div>
                <span style={styles.breakLabel}>{t.label}</span>
                <span style={styles.breakCount}>{t.count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {allActivities.length === 0 && (
        <p style={styles.empty}>Start adding activities to see your trip summary here.</p>
      )}
    </div>
  );
}

function Stat({ icon, label, value }) {
  return (
    <div style={styles.statBox}>
      <div style={styles.statIcon}>{icon}</div>
      <div style={styles.statValue}>{value}</div>
      <div style={styles.statLabel}>{label}</div>
    </div>
  );
}

const styles = {
  wrap: {
    background: '#fff',
    borderRadius: 16,
    padding: '20px',
    boxShadow: '0 2px 12px rgba(44,36,23,0.08)',
    border: '1px solid #f0e8e0',
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 18,
    fontWeight: 700,
    color: '#2c2417',
    marginBottom: 16,
  },
  stats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 10,
  },
  statBox: {
    background: '#fdf6ef',
    borderRadius: 12,
    padding: '14px 12px',
    textAlign: 'center',
  },
  statIcon: {
    marginBottom: 6,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 700,
    color: '#2c2417',
    fontFamily: "'Playfair Display', serif",
    lineHeight: 1.2,
  },
  statLabel: {
    fontSize: 11,
    color: '#8a7060',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    fontWeight: 500,
    marginTop: 2,
  },
  section: {
    marginTop: 16,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: 600,
    color: '#8a7060',
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
    marginBottom: 8,
  },
  tags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    background: '#f5ede6',
    color: '#c1704a',
    borderRadius: 20,
    padding: '3px 10px',
    fontSize: 12,
    fontWeight: 500,
  },
  breakdown: {
    display: 'flex',
    flexDirection: 'column',
    gap: 7,
  },
  breakItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  breakEmoji: {
    fontSize: 15,
    width: 22,
    textAlign: 'center',
    flexShrink: 0,
  },
  breakBar: {
    flex: 1,
    height: 6,
    background: '#f0e8e0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  breakFill: {
    height: '100%',
    borderRadius: 3,
    transition: 'width 0.5s ease',
  },
  breakLabel: {
    fontSize: 12,
    color: '#5c4a35',
    minWidth: 60,
    flexShrink: 1,
  },
  breakCount: {
    fontSize: 13,
    fontWeight: 600,
    color: '#2c2417',
    minWidth: 16,
    textAlign: 'right',
  },
  empty: {
    fontSize: 13,
    color: '#b8a898',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 12,
  },
};
