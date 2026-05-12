<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import { m } from '$lib/paraglide/messages.js';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<div class="mx-auto max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
	<h1 class="text-2xl font-bold text-slate-900">{m.register_title()}</h1>

	<form method="post" use:enhance class="mt-6 space-y-4">
		<label class="block">
			<span class="mb-1 block text-sm font-medium text-slate-700">{m.register_name()}</span>
			<input
				name="name"
				required
				class="w-full rounded-md border border-slate-300 bg-white px-3 py-2 shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
			/>
		</label>
		<label class="block">
			<span class="mb-1 block text-sm font-medium text-slate-700">{m.login_email()}</span>
			<input
				type="email"
				name="email"
				required
				class="w-full rounded-md border border-slate-300 bg-white px-3 py-2 shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
			/>
		</label>
		<label class="block">
			<span class="mb-1 block text-sm font-medium text-slate-700">{m.login_password()}</span>
			<input
				type="password"
				name="password"
				required
				minlength="8"
				class="w-full rounded-md border border-slate-300 bg-white px-3 py-2 shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
			/>
		</label>

		{#if form?.message}
			<p class="rounded bg-rose-50 px-3 py-2 text-sm text-rose-700">{form.message}</p>
		{/if}

		<button
			type="submit"
			class="w-full rounded-md bg-emerald-600 px-4 py-2 font-medium text-white transition hover:bg-emerald-700"
			>{m.register_submit()}</button
		>
	</form>

	<p class="mt-4 text-center text-sm text-slate-600">
		{m.register_have_account()}
		<a href={resolve('/auth/login')} class="text-emerald-700 hover:underline">{m.nav_login()}</a>
	</p>
</div>
