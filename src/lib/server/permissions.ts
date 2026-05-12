import { error, redirect } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { ROLES, type Role } from '$lib/server/auth';

export type SessionUser = {
	id: string;
	email: string;
	name: string;
	role: Role;
	departmentId?: string | null;
};

export function getUser(event: RequestEvent): SessionUser | null {
	const u = event.locals.user as unknown as SessionUser | undefined;
	return u ?? null;
}

export function requireUser(event: RequestEvent): SessionUser {
	const u = getUser(event);
	if (!u) throw redirect(302, '/auth/login');
	return u;
}

export function requireStaff(event: RequestEvent): SessionUser {
	const u = requireUser(event);
	if (
		u.role !== ROLES.SYSTEM_ADMIN &&
		u.role !== ROLES.DEPARTMENT_ADMIN &&
		u.role !== ROLES.STAFF
	) {
		throw error(403, 'unauthorized');
	}
	return u;
}

export function requireSystemAdmin(event: RequestEvent): SessionUser {
	const u = requireUser(event);
	if (u.role !== ROLES.SYSTEM_ADMIN) throw error(403, 'unauthorized');
	return u;
}

/**
 * Returns the department-id filter that should be applied to lists for the
 * given user. `null` means "no filter" (system admin sees everything).
 */
export function departmentScopeFor(user: SessionUser): string | null {
	if (user.role === ROLES.SYSTEM_ADMIN) return null;
	return user.departmentId ?? '__none__';
}

export function canAccessDepartment(user: SessionUser, departmentId: string): boolean {
	if (user.role === ROLES.SYSTEM_ADMIN) return true;
	return !!user.departmentId && user.departmentId === departmentId;
}
