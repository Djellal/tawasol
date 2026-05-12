import { getLocale } from '$lib/paraglide/runtime';
import { m } from '$lib/paraglide/messages.js';
import type { ComplaintStatus, MeetingStatus } from '$lib/constants';

type AnyDept = { nameAr: string; nameFr: string; nameEn: string };

export function departmentName(d: AnyDept | null | undefined): string {
	if (!d) return '';
	const locale = getLocale();
	if (locale === 'ar') return d.nameAr;
	if (locale === 'fr') return d.nameFr;
	return d.nameEn;
}

export function statusLabel(status: ComplaintStatus | MeetingStatus): string {
	switch (status) {
		case 'pending':
			return m.status_pending();
		case 'in_progress':
			return m.status_in_progress();
		case 'responded':
			return m.status_responded();
		case 'scheduled':
			return m.status_scheduled();
		case 'rejected':
			return m.status_rejected();
		case 'closed':
			return m.status_closed();
		case 'archived':
			return m.status_archived();
	}
}

export function statusColor(status: ComplaintStatus | MeetingStatus): string {
	switch (status) {
		case 'pending':
			return 'bg-amber-100 text-amber-800';
		case 'in_progress':
			return 'bg-blue-100 text-blue-800';
		case 'responded':
		case 'scheduled':
			return 'bg-emerald-100 text-emerald-800';
		case 'rejected':
			return 'bg-rose-100 text-rose-800';
		case 'closed':
			return 'bg-slate-200 text-slate-800';
		case 'archived':
			return 'bg-slate-100 text-slate-600';
	}
}

export function roleLabel(role: string): string {
	switch (role) {
		case 'system_admin':
			return m.role_system_admin();
		case 'department_admin':
			return m.role_department_admin();
		case 'staff':
			return m.role_staff();
		default:
			return m.role_citizen();
	}
}

export function formatDate(value: Date | string | number | null | undefined): string {
	if (!value) return '';
	const d = value instanceof Date ? value : new Date(value);
	const locale = getLocale();
	const tag = locale === 'ar' ? 'ar' : locale === 'fr' ? 'fr-FR' : 'en-US';
	return d.toLocaleDateString(tag, { year: 'numeric', month: 'short', day: 'numeric' });
}

export function formatDateTime(value: Date | string | number | null | undefined): string {
	if (!value) return '';
	const d = value instanceof Date ? value : new Date(value);
	const locale = getLocale();
	const tag = locale === 'ar' ? 'ar' : locale === 'fr' ? 'fr-FR' : 'en-US';
	return d.toLocaleString(tag, {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	});
}
