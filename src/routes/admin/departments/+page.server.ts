import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { department } from '$lib/server/db/schema';
import { requireSystemAdmin } from '$lib/server/permissions';

export const load: PageServerLoad = async (event) => {
	requireSystemAdmin(event);
	const departments = await db.query.department.findMany({
		orderBy: (d, { asc }) => asc(d.nameAr)
	});
	return { departments };
};

export const actions: Actions = {
	create: async (event) => {
		requireSystemAdmin(event);
		const fd = await event.request.formData();
		const nameAr = fd.get('nameAr')?.toString().trim() ?? '';
		const nameFr = fd.get('nameFr')?.toString().trim() ?? '';
		const nameEn = fd.get('nameEn')?.toString().trim() ?? '';
		const description = fd.get('description')?.toString().trim() || null;
		if (!nameAr || !nameFr || !nameEn) return fail(400, { message: 'missing_fields' });

		await db.insert(department).values({ nameAr, nameFr, nameEn, description });
		throw redirect(303, event.url.pathname);
	},

	update: async (event) => {
		requireSystemAdmin(event);
		const fd = await event.request.formData();
		const id = fd.get('id')?.toString() ?? '';
		const nameAr = fd.get('nameAr')?.toString().trim() ?? '';
		const nameFr = fd.get('nameFr')?.toString().trim() ?? '';
		const nameEn = fd.get('nameEn')?.toString().trim() ?? '';
		const description = fd.get('description')?.toString().trim() || null;
		if (!id || !nameAr || !nameFr || !nameEn) return fail(400, { message: 'missing_fields' });

		await db
			.update(department)
			.set({ nameAr, nameFr, nameEn, description })
			.where(eq(department.id, id));
		throw redirect(303, event.url.pathname);
	},

	delete: async (event) => {
		requireSystemAdmin(event);
		const fd = await event.request.formData();
		const id = fd.get('id')?.toString() ?? '';
		if (!id) return fail(400);
		try {
			await db.delete(department).where(eq(department.id, id));
		} catch {
			return fail(400, { message: 'department_in_use' });
		}
		throw redirect(303, event.url.pathname);
	}
};
