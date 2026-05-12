import { error, fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import {
	meetingRequest,
	meetingResponse,
	MEETING_STATUSES,
	type MeetingStatus
} from '$lib/server/db/schema';
import { canAccessDepartment, requireStaff } from '$lib/server/permissions';

async function loadMeeting(id: string) {
	return db.query.meetingRequest.findFirst({
		where: eq(meetingRequest.id, id),
		with: {
			department: true,
			responses: { with: { author: true }, orderBy: (r, { asc }) => asc(r.createdAt) }
		}
	});
}

export const load: PageServerLoad = async (event) => {
	const user = requireStaff(event);
	const mtg = await loadMeeting(event.params.id);
	if (!mtg) throw error(404);
	if (!canAccessDepartment(user, mtg.departmentId)) throw error(403);
	return { meeting: mtg };
};

export const actions: Actions = {
	respond: async (event) => {
		const user = requireStaff(event);
		const mtg = await loadMeeting(event.params.id);
		if (!mtg) throw error(404);
		if (!canAccessDepartment(user, mtg.departmentId)) throw error(403);

		const fd = await event.request.formData();
		const message = fd.get('message')?.toString().trim() ?? '';
		if (!message) return fail(400, { message: 'empty_response' });

		await db.insert(meetingResponse).values({
			meetingId: mtg.id,
			authorUserId: user.id,
			message
		});
		await db
			.update(meetingRequest)
			.set({ updatedAt: new Date() })
			.where(eq(meetingRequest.id, mtg.id));

		throw redirect(303, event.url.pathname);
	},

	setStatus: async (event) => {
		const user = requireStaff(event);
		const mtg = await loadMeeting(event.params.id);
		if (!mtg) throw error(404);
		if (!canAccessDepartment(user, mtg.departmentId)) throw error(403);

		const fd = await event.request.formData();
		const status = fd.get('status')?.toString() ?? '';
		const scheduledDate = fd.get('scheduledDate')?.toString() || null;
		const scheduledTime = fd.get('scheduledTime')?.toString() || null;
		if (!(MEETING_STATUSES as readonly string[]).includes(status)) {
			return fail(400, { message: 'invalid_status' });
		}

		await db
			.update(meetingRequest)
			.set({
				status: status as MeetingStatus,
				scheduledDate: status === 'scheduled' ? scheduledDate : mtg.scheduledDate,
				scheduledTime: status === 'scheduled' ? scheduledTime : mtg.scheduledTime,
				archivedAt: status === 'archived' ? new Date() : null,
				updatedAt: new Date()
			})
			.where(eq(meetingRequest.id, mtg.id));

		throw redirect(303, event.url.pathname);
	}
};
