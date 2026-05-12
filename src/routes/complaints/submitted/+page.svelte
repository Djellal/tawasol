<script lang="ts">
	import { resolve } from '$app/paths';
	import { m } from '$lib/paraglide/messages.js';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div class="mx-auto max-w-xl rounded-xl border border-emerald-200 bg-emerald-50 p-8 text-center shadow-sm">
	<div class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white">
		<svg class="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
			<path d="M5 12l4 4 10-10" stroke-linecap="round" stroke-linejoin="round" />
		</svg>
	</div>
	<h1 class="mt-4 text-2xl font-bold text-emerald-900">{m.submitted_title()}</h1>
	<p class="mt-2 text-sm text-emerald-800">{m.submitted_desc()}</p>

	<div class="mt-6 rounded-lg border border-emerald-300 bg-white p-4">
		<div class="text-xs uppercase tracking-wider text-slate-500">{m.submitted_tracking_label()}</div>
		<div class="mt-1 font-mono text-2xl font-bold text-emerald-700">{data.trackingNumber}</div>
	</div>

	<a
		href={resolve('/track') + `?n=${encodeURIComponent(data.trackingNumber)}`}
		class="mt-6 inline-block rounded-md bg-emerald-600 px-5 py-2 font-medium text-white transition hover:bg-emerald-700"
		>{m.submitted_track_button()}</a
	>
</div>
