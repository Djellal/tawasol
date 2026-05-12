<script lang="ts">
	import { resolve } from '$app/paths';
	import { m } from '$lib/paraglide/messages.js';
	import { MEETING_STATUSES } from '$lib/constants';
	import { departmentName, statusLabel, statusColor, formatDate } from '$lib/i18n';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<h1 class="text-2xl font-bold text-slate-900">{m.admin_meetings()}</h1>

<form method="get" class="mt-4 flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
	<label class="block">
		<span class="mb-1 block text-xs font-medium text-slate-600">{m.admin_filter_status()}</span>
		<select
			name="status"
			value={data.filters.status}
			class="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm"
		>
			<option value="">{m.admin_filter_all()}</option>
			{#each MEETING_STATUSES as s (s)}
				<option value={s}>{statusLabel(s)}</option>
			{/each}
		</select>
	</label>
	{#if !data.scoped}
		<label class="block">
			<span class="mb-1 block text-xs font-medium text-slate-600">{m.admin_filter_department()}</span>
			<select
				name="departmentId"
				value={data.filters.departmentId}
				class="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm"
			>
				<option value="">{m.admin_filter_all()}</option>
				{#each data.departments as d (d.id)}
					<option value={d.id}>{departmentName(d)}</option>
				{/each}
			</select>
		</label>
	{/if}
	<button
		type="submit"
		class="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
		>{m.admin_apply_filters()}</button
	>
</form>

<div class="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
	{#if data.rows.length === 0}
		<p class="p-8 text-center text-slate-500">{m.admin_no_records()}</p>
	{:else}
		<table class="w-full text-sm">
			<thead class="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
				<tr>
					<th class="px-4 py-3 text-start">{m.admin_tracking()}</th>
					<th class="px-4 py-3 text-start">{m.admin_subject()}</th>
					<th class="px-4 py-3 text-start">{m.department_label()}</th>
					<th class="px-4 py-3 text-start">{m.status_label()}</th>
					<th class="px-4 py-3 text-start">{m.created_at_label()}</th>
					<th class="px-4 py-3"></th>
				</tr>
			</thead>
			<tbody class="divide-y divide-slate-100">
				{#each data.rows as r (r.id)}
					<tr class="hover:bg-slate-50">
						<td class="px-4 py-3 font-mono text-xs">{r.trackingNumber}</td>
						<td class="px-4 py-3 font-medium text-slate-900">{r.subject}</td>
						<td class="px-4 py-3 text-slate-600">{departmentName(r.department)}</td>
						<td class="px-4 py-3">
							<span class="rounded-full px-2 py-0.5 text-xs {statusColor(r.status)}"
								>{statusLabel(r.status)}</span
							>
						</td>
						<td class="px-4 py-3 text-slate-500">{formatDate(r.createdAt)}</td>
						<td class="px-4 py-3 text-end">
							<a
								href={resolve('/admin/meetings/[id]', { id: r.id })}
								class="text-emerald-700 hover:underline">{m.admin_view()}</a
							>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
</div>
