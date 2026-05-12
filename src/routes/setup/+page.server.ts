import { fail, redirect } from '@sveltejs/kit';
import { count, eq } from 'drizzle-orm';
import { APIError } from 'better-auth/api';
import type { Actions, PageServerLoad } from './$types';
import { auth } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { department, user } from '$lib/server/db/schema';

async function userCount(): Promise<number> {
	const [row] = await db.select({ n: count() }).from(user);
	return row.n;
}

export const load: PageServerLoad = async () => {
	const total = await userCount();
	if (total > 0) throw redirect(302, '/');
	return {};
};

export const actions: Actions = {
	default: async (event) => {
		// Hard guard: only allowed when no users exist yet.
		const total = await userCount();
		if (total > 0) throw redirect(302, '/');

		const fd = await event.request.formData();
		const name = fd.get('name')?.toString().trim() ?? '';
		const email = fd.get('email')?.toString().trim() ?? '';
		const password = fd.get('password')?.toString() ?? '';

		if (!name || !email || password.length < 8) {
			return fail(400, { message: 'invalid_input' });
		}

		try {
			await auth.api.signUpEmail({
				body: { name, email, password },
				headers: event.request.headers
			});
		} catch (err) {
			if (err instanceof APIError) return fail(400, { message: err.message });
			return fail(500, { message: 'unexpected_error' });
		}

		await db.update(user).set({ role: 'system_admin' }).where(eq(user.email, email));

		// Seed default departments if none exist.
		const existingDepts = await db.select().from(department).limit(1);
		if (existingDepts.length === 0) {
			await db.insert(department).values([
				{
					nameAr: 'الإدارة العامة',
					nameFr: 'Direction générale',
					nameEn: 'General administration'
				},
				{
					nameAr: 'الموارد البشرية',
					nameFr: 'Ressources humaines',
					nameEn: 'Human resources'
				},
				{
					nameAr: 'الخدمات للمواطنين',
					nameFr: 'Services aux citoyens',
					nameEn: 'Citizen services'
				},
				{
					nameAr: 'المالية والمحاسبة',
					nameFr: 'Finances et comptabilité',
					nameEn: 'Finance and accounting'
				}
			]);
		}

		throw redirect(303, '/admin');
	}
};
