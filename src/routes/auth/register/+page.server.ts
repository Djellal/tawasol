import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { auth } from '$lib/server/auth';
import { APIError } from 'better-auth/api';
import { m } from '$lib/paraglide/messages.js';

export const load: PageServerLoad = (event) => {
	if (event.locals.user) throw redirect(302, '/');
	return {};
};

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const name = formData.get('name')?.toString() ?? '';
		const email = formData.get('email')?.toString() ?? '';
		const password = formData.get('password')?.toString() ?? '';

		try {
			await auth.api.signUpEmail({
				body: { name, email, password },
				headers: event.request.headers
			});
		} catch (err) {
			if (err instanceof APIError)
				return fail(400, { message: err.message || m.register_failed() });
			return fail(500, { message: m.register_failed() });
		}

		throw redirect(302, '/');
	}
};
