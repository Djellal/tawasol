import type { Session } from 'better-auth/minimal';
import type { Role } from '$lib/constants';

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			user?: {
				id: string;
				email: string;
				name: string;
				role: Role;
				departmentId?: string | null;
				phone?: string | null;
			};
			session?: Session;
		}

		// interface Error {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
