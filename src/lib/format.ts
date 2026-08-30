const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

/** "2025-06" → "Jun 2025". A null end date reads as "present". */
function month(value: string | null): string {
  if (!value) return 'present';
  const [year, m] = value.split('-');
  return m ? `${MONTHS[Number(m) - 1]} ${year}` : year;
}

export function period(start: string, end: string | null): string {
  return `${month(start)} — ${month(end)}`;
}
