export type Status = 'offered' | 'accepted' | 'arrived' | 'driving' | 'completed' | 'declined';
export type Ride = { id: string; passenger: string; pickup: string; destination: string; bags: number; passengers: number; pin: string; status: Status };
export const samples: Ride[] = [
  { id: 'DEMO-001', passenger: 'Alex Morgan', pickup: 'Hilton Windhoek', destination: 'Hosea Kutako International Airport', bags: 3, passengers: 2, pin: '4821', status: 'offered' },
  { id: 'DEMO-002', passenger: 'Sam Taylor', pickup: 'Hosea Kutako International Airport', destination: 'Windhoek', bags: 2, passengers: 1, pin: '7392', status: 'offered' },
];
export function transition(ride: Ride, next: Status, pin?: string): Ride {
  const allowed: Partial<Record<Status, Status[]>> = { offered: ['accepted', 'declined'], accepted: ['arrived'], arrived: ['driving'], driving: ['completed'] };
  if (!allowed[ride.status]?.includes(next)) throw new Error('Action unavailable for this ride status.');
  if (next === 'driving' && pin !== ride.pin) throw new Error('PIN does not match. Check with your passenger.');
  return { ...ride, status: next };
}
