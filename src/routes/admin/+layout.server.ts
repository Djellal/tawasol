import type { LayoutServerLoad } from './$types';
import { requireStaff } from '$lib/server/permissions';

export const load: LayoutServerLoad = (event) => {
	const user = requireStaff(event);
	return {
		adminUser: {
			id: user.id,
			name: user.name,
			role: user.role,
			departmentId: user.departmentId ?? null
		}
	};
};
