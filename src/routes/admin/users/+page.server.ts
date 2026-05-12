import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { user, department } from '$lib/server/db/schema';
import { requireSystemAdmin } from '$lib/server/permissions';
import { auth, ROLES, type Role } from '$lib/server/auth';

const ROLE_VALUES = Object.values(ROLES) as readonly string[];

export const load: PageServerLoad = async (event) => {
	requireSystemAdmin(event);
	const users = await db.select().from(user).orderBy(user.createdAt);
	const departments = await db.select().from(department).orderBy(department.nameAr);
	return { users, departments };
};

export const actions: Actions = {
	update: async (event) => {
		requireSystemAdmin(event);
		const fd = await event.request.formData();
		const id = fd.get('id')?.toString() ?? '';
		const name = fd.get('name')?.toString() ?? '';
		const role = fd.get('role')?.toString() ?? '';
		const departmentId = fd.get('departmentId')?.toString() || null;

		if (!id || !ROLE_VALUES.includes(role)) return fail(400, { message: 'invalid_input' });

		await db
			.update(user)
			.set({
				name: name || undefined,
				role: role as Role,
				departmentId: role === 'citizen' ? null : departmentId
			})
			.where(eq(user.id, id));

		return { success: true };
	},

	create: async (event) => {
		requireSystemAdmin(event);
		const fd = await event.request.formData();
		const name = fd.get('name')?.toString() ?? '';
		const email = fd.get('email')?.toString() ?? '';
		const password = fd.get('password')?.toString() ?? '';
		const role = fd.get('role')?.toString() ?? 'citizen';
		const departmentId = fd.get('departmentId')?.toString() || null;

		if (!name || !email || !password) {
			return fail(400, { message: 'missing_fields' });
		}

		try {
			await auth.api.createUser({
				headers: event.request.headers,
				body: {
					name,
					email,
					password,
					role: role as Role,
					departmentId: role === 'citizen' ? null : departmentId
				}
			});
		} catch (e: any) {
			return fail(400, { message: e.message || 'failed_to_create' });
		}

		return { success: true };
	},

	delete: async (event) => {
		requireSystemAdmin(event);
		const fd = await event.request.formData();
		const id = fd.get('id')?.toString() ?? '';

		if (!id) return fail(400, { message: 'missing_id' });

		// Prevent self-deletion
		if (id === event.locals.user?.id) {
			return fail(400, { message: 'cannot_delete_self' });
		}

		try {
			await auth.api.deleteUser({
				headers: event.request.headers,
				body: { userId: id }
			});
		} catch (e: any) {
			return fail(400, { message: e.message || 'failed_to_delete' });
		}

		return { success: true };
	}
};
