<script lang="ts">
	import { resolve } from '$app/paths';
	import { m } from '$lib/paraglide/messages.js';
</script>

<section class="rounded-2xl bg-gradient-to-br from-emerald-700 to-emerald-500 p-10 text-white shadow">
	<h1 class="text-3xl font-bold sm:text-4xl">{m.home_title()}</h1>
	<p class="mt-3 max-w-2xl text-emerald-50">{m.home_subtitle()}</p>
	<div class="mt-6 flex flex-wrap gap-3">
		<a
			href={resolve('/complaints/new')}
			class="rounded-lg bg-white px-5 py-2.5 font-medium text-emerald-700 shadow transition hover:bg-emerald-50"
			>{m.home_cta_complaint()}</a
		>
		<a
			href={resolve('/meetings/new')}
			class="rounded-lg border border-white/30 bg-emerald-600/30 px-5 py-2.5 font-medium text-white backdrop-blur transition hover:bg-emerald-600/50"
			>{m.home_cta_meeting()}</a
		>
		<a
			href={resolve('/track')}
			class="rounded-lg border border-white/30 px-5 py-2.5 font-medium text-white transition hover:bg-emerald-600/30"
			>{m.home_cta_track()}</a
		>
	</div>
</section>

<section class="mt-10 grid gap-6 sm:grid-cols-3">
	<div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
		<div
			class="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700"
		>
			<svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M12 4v16m8-8H4" stroke-linecap="round" />
			</svg>
		</div>
		<h3 class="text-lg font-semibold">{m.home_feature_digital_title()}</h3>
		<p class="mt-2 text-sm text-slate-600">{m.home_feature_digital_desc()}</p>
	</div>

	<div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
		<div
			class="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700"
		>
			<svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<path d="M3 12h18M3 6h18M3 18h12" stroke-linecap="round" />
			</svg>
		</div>
		<h3 class="text-lg font-semibold">{m.home_feature_routing_title()}</h3>
		<p class="mt-2 text-sm text-slate-600">{m.home_feature_routing_desc()}</p>
	</div>

	<div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
		<div
			class="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700"
		>
			<svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<circle cx="12" cy="12" r="9" />
				<path d="M12 7v5l3 2" stroke-linecap="round" />
			</svg>
		</div>
		<h3 class="text-lg font-semibold">{m.home_feature_tracking_title()}</h3>
		<p class="mt-2 text-sm text-slate-600">{m.home_feature_tracking_desc()}</p>
	</div>
</section>
