export const COMPLAINT_STATUSES = [
	'pending',
	'in_progress',
	'responded',
	'closed',
	'archived'
] as const;
export type ComplaintStatus = (typeof COMPLAINT_STATUSES)[number];

export const MEETING_STATUSES = [
	'pending',
	'in_progress',
	'scheduled',
	'rejected',
	'closed',
	'archived'
] as const;
export type MeetingStatus = (typeof MEETING_STATUSES)[number];

export const ROLES = {
	SYSTEM_ADMIN: 'system_admin',
	DEPARTMENT_ADMIN: 'department_admin',
	STAFF: 'staff',
	CITIZEN: 'citizen'
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
