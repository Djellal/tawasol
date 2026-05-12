import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { user, department } from '$lib/server/db/schema';
import { requireSystemAdmin } from '$lib/server/permissions';
import { ROLES, type Role } from '$lib/server/auth';

const ROLE_VALUES = Object.values(ROLES) as readonly string[];

export const load: PageServerLoad = async (event) => {
	requireSystemAdmin(event);
	const users = await db.select().from(user).orderBy(user.createdAt);
	const departments = await db.select().from(department).orderBy(department.nameAr);
	return { users, departments };
};

export const actions: Actions = {
	default: async (event) => {
		requireSystemAdmin(event);
		const fd = await event.request.formData();
		const id = fd.get('id')?.toString() ?? '';
		const role = fd.get('role')?.toString() ?? '';
		const departmentId = fd.get('departmentId')?.toString() || null;
		if (!id || !ROLE_VALUES.includes(role)) return fail(400, { message: 'invalid_input' });

		await db
			.update(user)
			.set({
				role: role as Role,
				departmentId: role === 'citizen' ? null : departmentId
			})
			.where(eq(user.id, id));

		throw redirect(303, event.url.pathname);
	}
};
