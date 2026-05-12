import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { complaint, meetingRequest } from '$lib/server/db/schema';

export const load: PageServerLoad = async ({ url }) => {
	const number = url.searchParams.get('n')?.trim() ?? '';
	if (!number) return { searched: false, number: '' };

	if (number.startsWith('CMP')) {
		const c = await db.query.complaint.findFirst({
			where: eq(complaint.trackingNumber, number),
			with: {
				department: true,
				responses: { orderBy: (r, { asc }) => asc(r.createdAt) },
				attachments: true
			}
		});
		return {
			searched: true,
			number,
			kind: 'complaint' as const,
			complaint: c ?? null
		};
	}

	if (number.startsWith('MTG')) {
		const mtg = await db.query.meetingRequest.findFirst({
			where: eq(meetingRequest.trackingNumber, number),
			with: {
				department: true,
				responses: { orderBy: (r, { asc }) => asc(r.createdAt) }
			}
		});
		return {
			searched: true,
			number,
			kind: 'meeting' as const,
			meeting: mtg ?? null
		};
	}

	return { searched: true, number, notFound: true as const };
};
