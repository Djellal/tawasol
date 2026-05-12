<script lang="ts">
	import { m } from '$lib/paraglide/messages.js';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<h1 class="text-2xl font-bold text-slate-900">{m.admin_dashboard()}</h1>

<div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
	<div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
		<div class="text-sm text-slate-500">{m.admin_total_complaints()}</div>
		<div class="mt-2 text-3xl font-bold text-slate-900">{data.stats.totalComplaints}</div>
	</div>
	<div class="rounded-xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
		<div class="text-sm text-amber-700">{m.admin_pending_complaints()}</div>
		<div class="mt-2 text-3xl font-bold text-amber-900">{data.stats.pendingComplaints}</div>
	</div>
	<div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
		<div class="text-sm text-slate-500">{m.admin_total_meetings()}</div>
		<div class="mt-2 text-3xl font-bold text-slate-900">{data.stats.totalMeetings}</div>
	</div>
	<div class="rounded-xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
		<div class="text-sm text-amber-700">{m.admin_pending_meetings()}</div>
		<div class="mt-2 text-3xl font-bold text-amber-900">{data.stats.pendingMeetings}</div>
	</div>
</div>
