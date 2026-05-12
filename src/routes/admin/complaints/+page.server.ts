import { and, desc, eq, type SQL } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { complaint, COMPLAINT_STATUSES, type ComplaintStatus } from '$lib/server/db/schema';
import { departmentScopeFor } from '$lib/server/permissions';

export const load: PageServerLoad = async (event) => {
	const u = event.locals.user!;
	const scope = departmentScopeFor({
		id: u.id,
		email: u.email,
		name: u.name,
		role: u.role,
		departmentId: u.departmentId ?? null
	});

	const status = event.url.searchParams.get('status');
	const departmentId = event.url.searchParams.get('departmentId');

	const conditions: SQL[] = [];
	if (scope) conditions.push(eq(complaint.departmentId, scope));
	else if (departmentId) conditions.push(eq(complaint.departmentId, departmentId));
	if (status && (COMPLAINT_STATUSES as readonly string[]).includes(status)) {
		conditions.push(eq(complaint.status, status as ComplaintStatus));
	}

	const where = conditions.length ? and(...conditions) : undefined;

	const rows = await db.query.complaint.findMany({
		where,
		with: { department: true },
		orderBy: desc(complaint.createdAt),
		limit: 200
	});

	const departments = scope
		? []
		: await db.query.department.findMany({ orderBy: (d, { asc }) => asc(d.nameAr) });

	return {
		rows,
		departments,
		filters: { status: status ?? '', departmentId: departmentId ?? '' },
		scoped: !!scope
	};
};
