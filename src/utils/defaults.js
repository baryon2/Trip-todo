export const BALI_REGIONS = [
  'Seminyak', 'Kuta', 'Legian', 'Canggu', 'Ubud', 'Tegallalang',
  'Uluwatu', 'Jimbaran', 'Sanur', 'Nusa Dua', 'Amed', 'Lovina',
  'Sidemen', 'Munduk', 'Pemuteran', 'Nusa Penida', 'Nusa Lembongan',
];

export const ACTIVITY_TYPES = [
  { id: 'explore', label: 'Explore', color: '#4a7c59', emoji: '🗺️' },
  { id: 'food', label: 'Food & Drink', color: '#c1704a', emoji: '🍜' },
  { id: 'beach', label: 'Beach', color: '#3da0b5', emoji: '🏖️' },
  { id: 'culture', label: 'Culture', color: '#d4a843', emoji: '🛕' },
  { id: 'adventure', label: 'Adventure', color: '#7c4a8f', emoji: '🧗' },
  { id: 'relax', label: 'Relax & Spa', color: '#8f6a4a', emoji: '🧘' },
  { id: 'shopping', label: 'Shopping', color: '#a05a38', emoji: '🛍️' },
  { id: 'transport', label: 'Transport', color: '#6a7a8f', emoji: '🚗' },
  { id: 'accommodation', label: 'Accommodation', color: '#5c8f5c', emoji: '🏨' },
  { id: 'other', label: 'Other', color: '#8a8080', emoji: '📌' },
];

const TRIP_START = new Date('2026-07-01');

function generateDays() {
  const days = [];
  for (let i = 0; i < 14; i++) {
    const date = new Date(TRIP_START);
    date.setDate(TRIP_START.getDate() + i);
    days.push({
      id: `day-${i + 1}`,
      dayNumber: i + 1,
      date: date.toISOString().split('T')[0],
      location: '',
      accommodation: '',
      notes: '',
      activities: [],
    });
  }
  return days;
}

export function getDefaultItinerary() {
  const stored = localStorage.getItem('bali-itinerary');
  if (stored) {
    try { return JSON.parse(stored); } catch { /* fall through */ }
  }
  return {
    tripName: 'Bali Adventure',
    startDate: TRIP_START.toISOString().split('T')[0],
    days: generateDays(),
  };
}

export function saveItinerary(data) {
  localStorage.setItem('bali-itinerary', JSON.stringify(data));
}

export function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

export function formatDateShort(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

export function getTypeInfo(typeId) {
  return ACTIVITY_TYPES.find(t => t.id === typeId) || ACTIVITY_TYPES[ACTIVITY_TYPES.length - 1];
}

export function newActivity() {
  return {
    id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    time: '',
    title: '',
    type: 'explore',
    location: '',
    notes: '',
    booked: false,
    cost: '',
    link: '',
  };
}
