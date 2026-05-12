import { fail, redirect } from '@sveltejs/kit';
import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { complaint, complaintAttachment, department } from '$lib/server/db/schema';
import { generateTrackingNumber } from '$lib/server/tracking';

const UPLOAD_DIR = path.join(process.cwd(), 'static', 'uploads');
const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5MB

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
		const description = formData.get('description')?.toString().trim() ?? '';
		const departmentId = formData.get('departmentId')?.toString() ?? '';

		if (!fullName || !subject || !description || !departmentId) {
			return fail(400, { message: 'missing_fields' });
		}

		const trackingNumber = generateTrackingNumber('CMP');

		const inserted = await db
			.insert(complaint)
			.values({
				trackingNumber,
				fullName,
				email,
				phone,
				subject,
				description,
				departmentId,
				citizenUserId: event.locals.user?.id ?? null
			})
			.returning();

		const created = inserted[0];

		// Optional attachments
		const files = formData.getAll('attachments').filter((f): f is File => f instanceof File && f.size > 0);
		if (files.length) {
			await mkdir(UPLOAD_DIR, { recursive: true });
			for (const file of files) {
				if (file.size > MAX_FILE_BYTES) continue;
				const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
				const stored = `${crypto.randomUUID()}-${safeName}`;
				const target = path.join(UPLOAD_DIR, stored);
				const buffer = Buffer.from(await file.arrayBuffer());
				await writeFile(target, buffer);
				await db.insert(complaintAttachment).values({
					complaintId: created.id,
					filename: file.name,
					mimeType: file.type || 'application/octet-stream',
					size: file.size,
					path: `/uploads/${stored}`
				});
			}
		}

		throw redirect(302, `/complaints/submitted?n=${encodeURIComponent(trackingNumber)}`);
	}
};
