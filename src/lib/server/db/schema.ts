import { relations, sql } from 'drizzle-orm';
import { integer, sqliteTable, text, index } from 'drizzle-orm/sqlite-core';
import { user } from './auth.schema';

/* ----------------------------- Departments ----------------------------- */

export const department = sqliteTable('department', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	nameAr: text('name_ar').notNull(),
	nameFr: text('name_fr').notNull(),
	nameEn: text('name_en').notNull(),
	description: text('description'),
	createdAt: integer('created_at', { mode: 'timestamp_ms' })
		.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
		.notNull()
});

/* ------------------------------ Complaints ----------------------------- */

import { COMPLAINT_STATUSES, MEETING_STATUSES, type ComplaintStatus, type MeetingStatus } from '$lib/constants';
export { COMPLAINT_STATUSES, MEETING_STATUSES, type ComplaintStatus, type MeetingStatus };

export const complaint = sqliteTable(
	'complaint',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		trackingNumber: text('tracking_number').notNull().unique(),
		fullName: text('full_name').notNull(),
		email: text('email'),
		phone: text('phone'),
		subject: text('subject').notNull(),
		description: text('description').notNull(),
		departmentId: text('department_id')
			.notNull()
			.references(() => department.id, { onDelete: 'restrict' }),
		status: text('status').$type<ComplaintStatus>().notNull().default('pending'),
		citizenUserId: text('citizen_user_id').references(() => user.id, { onDelete: 'set null' }),
		createdAt: integer('created_at', { mode: 'timestamp_ms' })
			.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
			.notNull(),
		updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
			.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
			.$onUpdate(() => new Date())
			.notNull(),
		archivedAt: integer('archived_at', { mode: 'timestamp_ms' })
	},
	(t) => [
		index('complaint_department_idx').on(t.departmentId),
		index('complaint_status_idx').on(t.status),
		index('complaint_citizen_idx').on(t.citizenUserId)
	]
);

export const complaintAttachment = sqliteTable(
	'complaint_attachment',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		complaintId: text('complaint_id')
			.notNull()
			.references(() => complaint.id, { onDelete: 'cascade' }),
		filename: text('filename').notNull(),
		mimeType: text('mime_type').notNull(),
		size: integer('size').notNull(),
		path: text('path').notNull(),
		createdAt: integer('created_at', { mode: 'timestamp_ms' })
			.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
			.notNull()
	},
	(t) => [index('complaint_attachment_complaint_idx').on(t.complaintId)]
);

export const complaintResponse = sqliteTable(
	'complaint_response',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		complaintId: text('complaint_id')
			.notNull()
			.references(() => complaint.id, { onDelete: 'cascade' }),
		authorUserId: text('author_user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'restrict' }),
		message: text('message').notNull(),
		createdAt: integer('created_at', { mode: 'timestamp_ms' })
			.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
			.notNull()
	},
	(t) => [index('complaint_response_complaint_idx').on(t.complaintId)]
);

/* --------------------------- Meeting requests --------------------------- */

export const meetingRequest = sqliteTable(
	'meeting_request',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		trackingNumber: text('tracking_number').notNull().unique(),
		fullName: text('full_name').notNull(),
		email: text('email'),
		phone: text('phone'),
		subject: text('subject').notNull(),
		reason: text('reason'),
		departmentId: text('department_id')
			.notNull()
			.references(() => department.id, { onDelete: 'restrict' }),
		proposedDate: text('proposed_date'),
		proposedTime: text('proposed_time'),
		scheduledDate: text('scheduled_date'),
		scheduledTime: text('scheduled_time'),
		status: text('status').$type<MeetingStatus>().notNull().default('pending'),
		citizenUserId: text('citizen_user_id').references(() => user.id, { onDelete: 'set null' }),
		createdAt: integer('created_at', { mode: 'timestamp_ms' })
			.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
			.notNull(),
		updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
			.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
			.$onUpdate(() => new Date())
			.notNull(),
		archivedAt: integer('archived_at', { mode: 'timestamp_ms' })
	},
	(t) => [
		index('meeting_department_idx').on(t.departmentId),
		index('meeting_status_idx').on(t.status),
		index('meeting_citizen_idx').on(t.citizenUserId)
	]
);

export const meetingResponse = sqliteTable(
	'meeting_response',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		meetingId: text('meeting_id')
			.notNull()
			.references(() => meetingRequest.id, { onDelete: 'cascade' }),
		authorUserId: text('author_user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'restrict' }),
		message: text('message').notNull(),
		createdAt: integer('created_at', { mode: 'timestamp_ms' })
			.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
			.notNull()
	},
	(t) => [index('meeting_response_meeting_idx').on(t.meetingId)]
);

/* ------------------------------ Relations ------------------------------ */

export const departmentRelations = relations(department, ({ many }) => ({
	complaints: many(complaint),
	meetings: many(meetingRequest),
	users: many(user)
}));

export const complaintRelations = relations(complaint, ({ one, many }) => ({
	department: one(department, {
		fields: [complaint.departmentId],
		references: [department.id]
	}),
	citizen: one(user, {
		fields: [complaint.citizenUserId],
		references: [user.id]
	}),
	responses: many(complaintResponse),
	attachments: many(complaintAttachment)
}));

export const complaintResponseRelations = relations(complaintResponse, ({ one }) => ({
	complaint: one(complaint, {
		fields: [complaintResponse.complaintId],
		references: [complaint.id]
	}),
	author: one(user, {
		fields: [complaintResponse.authorUserId],
		references: [user.id]
	})
}));

export const complaintAttachmentRelations = relations(complaintAttachment, ({ one }) => ({
	complaint: one(complaint, {
		fields: [complaintAttachment.complaintId],
		references: [complaint.id]
	})
}));

export const meetingRequestRelations = relations(meetingRequest, ({ one, many }) => ({
	department: one(department, {
		fields: [meetingRequest.departmentId],
		references: [department.id]
	}),
	citizen: one(user, {
		fields: [meetingRequest.citizenUserId],
		references: [user.id]
	}),
	responses: many(meetingResponse)
}));

export const meetingResponseRelations = relations(meetingResponse, ({ one }) => ({
	meeting: one(meetingRequest, {
		fields: [meetingResponse.meetingId],
		references: [meetingRequest.id]
	}),
	author: one(user, {
		fields: [meetingResponse.authorUserId],
		references: [user.id]
	})
}));

export * from './auth.schema';
