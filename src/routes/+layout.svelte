<script lang="ts">
	import type { Pathname } from '$app/types';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { locales, localizeHref, getLocale } from '$lib/paraglide/runtime';
	import { m } from '$lib/paraglide/messages.js';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children, data } = $props();

	const localeNames: Record<string, string> = { ar: 'العربية', fr: 'Français', en: 'English' };
	const isAdmin = $derived(
		data.user?.role === 'system_admin' ||
			data.user?.role === 'department_admin' ||
			data.user?.role === 'staff'
	);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>{m.app_name()} — {m.app_tagline()}</title>
</svelte:head>

<div class="flex min-h-screen flex-col bg-slate-50 text-slate-900">
	<header class="border-b border-slate-200 bg-white">
		<div class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
			<a href={resolve('/')} class="flex items-center gap-2 text-lg font-bold text-emerald-700">
				<img src="/logo-200x200.png" alt="University Logo" class="h-10 w-10 object-contain" />
				<span>{m.app_name()}</span>
			</a>

			<nav class="hidden items-center gap-5 text-sm font-medium text-slate-700 md:flex">
				<a class="hover:text-emerald-700" href={resolve('/')}>{m.nav_home()}</a>
				<a class="hover:text-emerald-700" href={resolve('/complaints/new')}
					>{m.nav_new_complaint()}</a
				>
				<a class="hover:text-emerald-700" href={resolve('/meetings/new')}>{m.nav_new_meeting()}</a>
				<a class="hover:text-emerald-700" href={resolve('/track')}>{m.nav_track()}</a>
				{#if isAdmin}
					<a class="text-emerald-700 hover:underline" href={resolve('/admin')}>{m.nav_admin()}</a>
				{/if}
			</nav>

			<div class="flex items-center gap-3 text-sm">
				<div class="flex items-center gap-1 text-slate-500">
					{#each locales as locale (locale)}
						<a
							class="rounded px-2 py-1 hover:bg-slate-100"
							class:font-bold={getLocale() === locale}
							class:text-emerald-700={getLocale() === locale}
							href={resolve(localizeHref(page.url.pathname, { locale }) as Pathname)}
							>{localeNames[locale] ?? locale}</a
						>
					{/each}
				</div>

				{#if data.user}
					<form method="post" action="/auth/logout" class="contents">
						<button class="text-slate-600 hover:text-rose-600">{m.nav_logout()}</button>
					</form>
				{:else}
					<a class="text-slate-600 hover:text-emerald-700" href={resolve('/auth/login')}
						>{m.nav_login()}</a
					>
				{/if}
			</div>
		</div>
	</header>

	<main class="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
		{@render children()}
	</main>

	<footer class="border-t border-slate-200 bg-white py-6 text-center text-sm text-slate-500">
		{m.footer_text()}
	</footer>
</div>
