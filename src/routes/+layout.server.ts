import { redirect } from '@sveltejs/kit';
import { count } from 'drizzle-orm';
import type { LayoutServerLoad } from './$types';
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';

export const load: LayoutServerLoad = async (event) => {
	// First-run wizard: if no users exist yet, redirect everywhere except /setup itself.
	if (!event.url.pathname.startsWith('/setup')) {
		const [row] = await db.select({ n: count() }).from(user);
		if (row.n === 0) throw redirect(302, '/setup');
	}

	const u = event.locals.user;
	return {
		user: u
			? {
					id: u.id,
					name: u.name,
					email: u.email,
					role: u.role,
					departmentId: u.departmentId ?? null
				}
			: null
	};
};
