import { error, fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import {
	complaint,
	complaintResponse,
	COMPLAINT_STATUSES,
	type ComplaintStatus
} from '$lib/server/db/schema';
import { canAccessDepartment, requireStaff } from '$lib/server/permissions';

async function loadComplaint(id: string) {
	const c = await db.query.complaint.findFirst({
		where: eq(complaint.id, id),
		with: {
			department: true,
			attachments: true,
			responses: { with: { author: true }, orderBy: (r, { asc }) => asc(r.createdAt) }
		}
	});
	return c;
}

export const load: PageServerLoad = async (event) => {
	const user = requireStaff(event);
	const c = await loadComplaint(event.params.id);
	if (!c) throw error(404);
	if (!canAccessDepartment(user, c.departmentId)) throw error(403);
	return { complaint: c };
};

export const actions: Actions = {
	respond: async (event) => {
		const user = requireStaff(event);
		const c = await loadComplaint(event.params.id);
		if (!c) throw error(404);
		if (!canAccessDepartment(user, c.departmentId)) throw error(403);

		const fd = await event.request.formData();
		const message = fd.get('message')?.toString().trim() ?? '';
		if (!message) return fail(400, { message: 'empty_response' });

		await db.insert(complaintResponse).values({
			complaintId: c.id,
			authorUserId: user.id,
			message
		});
		// Mark as responded if still pending
		if (c.status === 'pending' || c.status === 'in_progress') {
			await db
				.update(complaint)
				.set({ status: 'responded', updatedAt: new Date() })
				.where(eq(complaint.id, c.id));
		} else {
			await db.update(complaint).set({ updatedAt: new Date() }).where(eq(complaint.id, c.id));
		}

		throw redirect(303, event.url.pathname);
	},

	setStatus: async (event) => {
		const user = requireStaff(event);
		const c = await loadComplaint(event.params.id);
		if (!c) throw error(404);
		if (!canAccessDepartment(user, c.departmentId)) throw error(403);

		const fd = await event.request.formData();
		const status = fd.get('status')?.toString() ?? '';
		if (!(COMPLAINT_STATUSES as readonly string[]).includes(status)) {
			return fail(400, { message: 'invalid_status' });
		}

		await db
			.update(complaint)
			.set({
				status: status as ComplaintStatus,
				archivedAt: status === 'archived' ? new Date() : null,
				updatedAt: new Date()
			})
			.where(eq(complaint.id, c.id));

		throw redirect(303, event.url.pathname);
	}
};
