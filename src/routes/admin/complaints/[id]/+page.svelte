<script lang="ts">
	import { enhance } from '$app/forms';
	import { m } from '$lib/paraglide/messages.js';
	import { COMPLAINT_STATUSES } from '$lib/constants';
	import { departmentName, statusLabel, statusColor, formatDateTime } from '$lib/i18n';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const c = $derived(data.complaint);
</script>

<div class="grid gap-6 lg:grid-cols-[1fr_320px]">
	<div class="space-y-6">
		<div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
			<div class="flex flex-wrap items-start justify-between gap-3">
				<div>
					<div class="text-xs uppercase tracking-wider text-slate-500">
						{m.complaint_label()} · <span class="font-mono">{c.trackingNumber}</span>
					</div>
					<h1 class="mt-1 text-xl font-semibold text-slate-900">{c.subject}</h1>
				</div>
				<span class="rounded-full px-3 py-1 text-sm {statusColor(c.status)}">{statusLabel(c.status)}</span>
			</div>
			<dl class="mt-4 grid gap-3 text-sm sm:grid-cols-2">
				<div>
					<dt class="text-slate-500">{m.form_full_name()}</dt>
					<dd class="font-medium">{c.fullName}</dd>
				</div>
				<div>
					<dt class="text-slate-500">{m.department_label()}</dt>
					<dd class="font-medium">{departmentName(c.department)}</dd>
				</div>
				{#if c.email}
					<div>
						<dt class="text-slate-500">{m.form_email()}</dt>
						<dd>{c.email}</dd>
					</div>
				{/if}
				{#if c.phone}
					<div>
						<dt class="text-slate-500">{m.form_phone()}</dt>
						<dd>{c.phone}</dd>
					</div>
				{/if}
				<div>
					<dt class="text-slate-500">{m.created_at_label()}</dt>
					<dd>{formatDateTime(c.createdAt)}</dd>
				</div>
				<div>
					<dt class="text-slate-500">{m.updated_at_label()}</dt>
					<dd>{formatDateTime(c.updatedAt)}</dd>
				</div>
			</dl>
			<div class="prose prose-slate mt-4 max-w-none text-slate-700">
				{@html c.description}
			</div>

			{#if c.attachments.length > 0}
				<ul class="mt-4 flex flex-wrap gap-2">
					{#each c.attachments as a (a.id)}
						<li>
							<a
								href={a.path}
								target="_blank"
								rel="noopener"
								class="rounded-md border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-700 hover:bg-slate-100"
								>{a.filename}</a
							>
						</li>
					{/each}
				</ul>
			{/if}
		</div>

		<div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
			<h2 class="font-semibold text-slate-900">{m.responses_label()}</h2>
			{#if c.responses.length === 0}
				<p class="mt-2 text-sm text-slate-500">{m.no_responses()}</p>
			{:else}
				<ul class="mt-3 space-y-3">
					{#each c.responses as r (r.id)}
						<li class="rounded-lg border border-slate-200 bg-slate-50 p-3">
							<div class="text-xs text-slate-500">
								{r.author?.name ?? ''} · {formatDateTime(r.createdAt)}
							</div>
							<p class="mt-1 whitespace-pre-line text-slate-700">{r.message}</p>
						</li>
					{/each}
				</ul>
			{/if}

			<form method="post" action="?/respond" use:enhance class="mt-4 space-y-2">
				<textarea
					name="message"
					rows="4"
					required
					placeholder={m.admin_response_placeholder()}
					class="w-full rounded-md border border-slate-300 bg-white px-3 py-2 shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
				></textarea>
				<button
					type="submit"
					class="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
					>{m.admin_response_send()}</button
				>
			</form>
		</div>
	</div>

	<aside class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
		<h2 class="font-semibold text-slate-900">{m.admin_change_status()}</h2>
		<form method="post" action="?/setStatus" use:enhance class="mt-3 space-y-2">
			<select
				name="status"
				value={c.status}
				class="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm"
			>
				{#each COMPLAINT_STATUSES as s (s)}
					<option value={s}>{statusLabel(s)}</option>
				{/each}
			</select>
			<button
				type="submit"
				class="w-full rounded-md bg-slate-800 px-3 py-2 text-sm font-medium text-white hover:bg-slate-900"
				>{m.dept_save()}</button
			>
		</form>
	</aside>
</div>
