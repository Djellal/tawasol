import { and, count, eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { complaint, meetingRequest } from '$lib/server/db/schema';
import { departmentScopeFor } from '$lib/server/permissions';

export const load: PageServerLoad = async (event) => {
	const u = event.locals.user!;
	const scope = departmentScopeFor({
		id: u.id,
		email: u.email,
		name: u.name,
		role: u.role,
		departmentId: u.departmentId ?? null
	});

	const cWhere = scope ? eq(complaint.departmentId, scope) : undefined;
	const mWhere = scope ? eq(meetingRequest.departmentId, scope) : undefined;

	const [totalComplaints] = await db.select({ n: count() }).from(complaint).where(cWhere);
	const [pendingComplaints] = await db
		.select({ n: count() })
		.from(complaint)
		.where(cWhere ? and(cWhere, eq(complaint.status, 'pending')) : eq(complaint.status, 'pending'));

	const [totalMeetings] = await db.select({ n: count() }).from(meetingRequest).where(mWhere);
	const [pendingMeetings] = await db
		.select({ n: count() })
		.from(meetingRequest)
		.where(
			mWhere ? and(mWhere, eq(meetingRequest.status, 'pending')) : eq(meetingRequest.status, 'pending')
		);

	return {
		stats: {
			totalComplaints: totalComplaints.n,
			pendingComplaints: pendingComplaints.n,
			totalMeetings: totalMeetings.n,
			pendingMeetings: pendingMeetings.n
		}
	};
};
