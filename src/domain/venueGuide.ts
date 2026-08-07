import {Venue} from './catalogue';

export type GuideCategory = 'All' | 'Dining' | 'Entertainment' | 'Services';

export function categoryFor(venue: Venue): Exclude<GuideCategory, 'All'> {
  if (venue.id === 'ocean' || venue.id === 'lounge') {return 'Dining';}
  if (venue.id === 'casino' || venue.id === 'pool') {return 'Entertainment';}
  return 'Services';
}

function toMinutes(hour: number, minute: number, period: string) {
  const normalized = hour % 12 + (period === 'PM' ? 12 : 0);
  return normalized * 60 + minute;
}

export function isOpenNow(hours: string, date = new Date()) {
  if (hours === 'Open 24 Hours') {return true;}
  const match = hours.match(/(\d{1,2}):(\d{2}) (AM|PM) .+ (\d{1,2}):(\d{2}) (AM|PM)/);
  if (!match) {return false;}
  const start = toMinutes(Number(match[1]), Number(match[2]), match[3]);
  const end = toMinutes(Number(match[4]), Number(match[5]), match[6]);
  const now = date.getHours() * 60 + date.getMinutes();
  return end <= start ? now >= start || now < end : now >= start && now < end;
}

export function mapsUrl(venue: Venue) {
  return `https://maps.apple.com/?q=${encodeURIComponent(`${venue.name}, Casino Nova Scotia Halifax`)}`;
}
