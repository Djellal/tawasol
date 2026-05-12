<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import { departmentName, statusLabel, statusColor, formatDateTime } from '$lib/i18n';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="mx-auto max-w-3xl">
	<div class="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
		<h1 class="text-2xl font-bold text-slate-900">{m.track_title()}</h1>
		<p class="mt-2 text-sm text-slate-600">{m.track_desc()}</p>

		<form method="get" class="mt-6 flex gap-2">
			<input
				name="n"
				value={data.number}
				placeholder={m.track_input_placeholder()}
				class="flex-1 rounded-md border border-slate-300 bg-white px-3 py-2 font-mono shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
			/>
			<button
				type="submit"
				class="rounded-md bg-emerald-600 px-5 py-2 font-medium text-white transition hover:bg-emerald-700"
				>{m.track_submit()}</button
			>
		</form>
	</div>

	{#if data.searched}
		{#if 'complaint' in data && data.complaint}
			{@const c = data.complaint}
			<div class="mt-6 rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
				<div class="flex flex-wrap items-start justify-between gap-3">
					<div>
						<div class="text-xs uppercase tracking-wider text-slate-500">
							{m.complaint_label()} · <span class="font-mono">{c.trackingNumber}</span>
						</div>
						<h2 class="mt-1 text-xl font-semibold text-slate-900">{c.subject}</h2>
					</div>
					<span class="rounded-full px-3 py-1 text-sm {statusColor(c.status)}">
						{statusLabel(c.status)}
					</span>
				</div>
				<dl class="mt-4 grid gap-3 text-sm sm:grid-cols-2">
					<div>
						<dt class="text-slate-500">{m.department_label()}</dt>
						<dd class="font-medium">{departmentName(c.department)}</dd>
					</div>
					<div>
						<dt class="text-slate-500">{m.created_at_label()}</dt>
						<dd>{formatDateTime(c.createdAt)}</dd>
					</div>
				</dl>
				<p class="mt-4 whitespace-pre-line text-slate-700">{c.description}</p>

				<h3 class="mt-6 font-semibold text-slate-900">{m.responses_label()}</h3>
				{#if c.responses.length === 0}
					<p class="mt-2 text-sm text-slate-500">{m.no_responses()}</p>
				{:else}
					<ul class="mt-2 space-y-3">
						{#each c.responses as r (r.id)}
							<li class="rounded-lg border border-slate-200 bg-slate-50 p-3">
								<div class="text-xs text-slate-500">{formatDateTime(r.createdAt)}</div>
								<p class="mt-1 whitespace-pre-line text-slate-700">{r.message}</p>
							</li>
						{/each}
					</ul>
				{/if}
			</div>
		{:else if 'meeting' in data && data.meeting}
			{@const mtg = data.meeting}
			<div class="mt-6 rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
				<div class="flex flex-wrap items-start justify-between gap-3">
					<div>
						<div class="text-xs uppercase tracking-wider text-slate-500">
							{m.meeting_label()} · <span class="font-mono">{mtg.trackingNumber}</span>
						</div>
						<h2 class="mt-1 text-xl font-semibold text-slate-900">{mtg.subject}</h2>
					</div>
					<span class="rounded-full px-3 py-1 text-sm {statusColor(mtg.status)}">
						{statusLabel(mtg.status)}
					</span>
				</div>
				<dl class="mt-4 grid gap-3 text-sm sm:grid-cols-2">
					<div>
						<dt class="text-slate-500">{m.department_label()}</dt>
						<dd class="font-medium">{departmentName(mtg.department)}</dd>
					</div>
					<div>
						<dt class="text-slate-500">{m.created_at_label()}</dt>
						<dd>{formatDateTime(mtg.createdAt)}</dd>
					</div>
					{#if mtg.scheduledDate}
						<div>
							<dt class="text-slate-500">{m.status_scheduled()}</dt>
							<dd>{mtg.scheduledDate} {mtg.scheduledTime ?? ''}</dd>
						</div>
					{:else if mtg.proposedDate}
						<div>
							<dt class="text-slate-500">{m.form_proposed_date()}</dt>
							<dd>{mtg.proposedDate} {mtg.proposedTime ?? ''}</dd>
						</div>
					{/if}
				</dl>
				{#if mtg.reason}
					<p class="mt-4 whitespace-pre-line text-slate-700">{mtg.reason}</p>
				{/if}

				<h3 class="mt-6 font-semibold text-slate-900">{m.responses_label()}</h3>
				{#if mtg.responses.length === 0}
					<p class="mt-2 text-sm text-slate-500">{m.no_responses()}</p>
				{:else}
					<ul class="mt-2 space-y-3">
						{#each mtg.responses as r (r.id)}
							<li class="rounded-lg border border-slate-200 bg-slate-50 p-3">
								<div class="text-xs text-slate-500">{formatDateTime(r.createdAt)}</div>
								<p class="mt-1 whitespace-pre-line text-slate-700">{r.message}</p>
							</li>
						{/each}
					</ul>
				{/if}
			</div>
		{:else}
			<div class="mt-6 rounded-xl border border-rose-200 bg-rose-50 p-6 text-rose-800">
				{m.track_not_found()}
			</div>
		{/if}
	{/if}
</div>
