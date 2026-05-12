/** Generate a short, easy-to-read tracking number. */
export function generateTrackingNumber(prefix: 'CMP' | 'MTG'): string {
	const year = new Date().getFullYear();
	const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
	return `${prefix}-${year}-${rand}`;
}
