import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { meetingRequest } from '$lib/server/db/schema';
import { generateTrackingNumber } from '$lib/server/tracking';

export const load: PageServerLoad = async () => {
	const departments = await db.query.department.findMany({ orderBy: (d, { asc }) => asc(d.nameAr) });
	return { departments };
};

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const fullName = formData.get('fullName')?.toString().trim() ?? '';
		const email = formData.get('email')?.toString().trim() || null;
		const phone = formData.get('phone')?.toString().trim() || null;
		const subject = formData.get('subject')?.toString().trim() ?? '';
		const reason = formData.get('reason')?.toString().trim() || null;
		const departmentId = formData.get('departmentId')?.toString() ?? '';
		const proposedDate = formData.get('proposedDate')?.toString() || null;
		const proposedTime = formData.get('proposedTime')?.toString() || null;

		if (!fullName || !subject || !departmentId) return fail(400, { message: 'missing_fields' });

		const trackingNumber = generateTrackingNumber('MTG');

		await db.insert(meetingRequest).values({
			trackingNumber,
			fullName,
			email,
			phone,
			subject,
			reason,
			departmentId,
			proposedDate,
			proposedTime,
			citizenUserId: event.locals.user?.id ?? null
		});

		throw redirect(302, `/meetings/submitted?n=${encodeURIComponent(trackingNumber)}`);
	}
};
