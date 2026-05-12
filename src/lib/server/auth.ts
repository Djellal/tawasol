import { betterAuth } from 'better-auth/minimal';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { env } from '$env/dynamic/private';
import { getRequestEvent } from '$app/server';
import { db } from '$lib/server/db';

export const auth = betterAuth({
	baseURL: env.ORIGIN,
	secret: env.BETTER_AUTH_SECRET,
	database: drizzleAdapter(db, { provider: 'sqlite' }),
	emailAndPassword: { enabled: true, autoSignIn: true },
	user: {
		additionalFields: {
			role: {
				type: 'string',
				defaultValue: 'citizen',
				input: false
			},
			departmentId: {
				type: 'string',
				required: false,
				input: false
			},
			phone: {
				type: 'string',
				required: false,
				input: true
			}
		}
	},
	plugins: [
		sveltekitCookies(getRequestEvent) // make sure this is the last plugin in the array
	]
});

export { ROLES, type Role } from '$lib/constants';
