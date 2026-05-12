<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { m } from '$lib/paraglide/messages.js';
	import { roleLabel } from '$lib/i18n';

	let { data, children } = $props();
	const isSysAdmin = $derived(data.adminUser.role === 'system_admin');

	const isActive = (href: string) =>
		page.url.pathname === href || page.url.pathname.startsWith(href + '/');

	const links = $derived([
		{ href: resolve('/admin'), label: m.admin_dashboard() },
		{ href: resolve('/admin/complaints'), label: m.admin_complaints() },
		{ href: resolve('/admin/meetings'), label: m.admin_meetings() }
	]);
</script>

<div class="grid gap-6 md:grid-cols-[220px_1fr]">
	<aside class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
		<div class="mb-4 border-b border-slate-100 pb-3">
			<div class="text-sm font-semibold text-slate-900">{data.adminUser.name}</div>
			<div class="text-xs text-emerald-700">{roleLabel(data.adminUser.role)}</div>
		</div>
		<nav class="flex flex-col gap-1 text-sm">
			{#each links as link (link.href)}
				<a
					href={link.href}
					class="rounded-md px-3 py-2 hover:bg-slate-100"
					class:bg-emerald-50={isActive(link.href)}
					class:text-emerald-700={isActive(link.href)}
					class:font-semibold={isActive(link.href)}
				>
					{link.label}
				</a>
			{/each}
			{#if isSysAdmin}
				<div class="my-2 border-t border-slate-100"></div>
				<a
					href={resolve('/admin/departments')}
					class="rounded-md px-3 py-2 hover:bg-slate-100"
					class:bg-emerald-50={isActive(resolve('/admin/departments'))}
					class:text-emerald-700={isActive(resolve('/admin/departments'))}
					class:font-semibold={isActive(resolve('/admin/departments'))}
					>{m.admin_departments()}</a
				>
				<a
					href={resolve('/admin/users')}
					class="rounded-md px-3 py-2 hover:bg-slate-100"
					class:bg-emerald-50={isActive(resolve('/admin/users'))}
					class:text-emerald-700={isActive(resolve('/admin/users'))}
					class:font-semibold={isActive(resolve('/admin/users'))}>{m.admin_users()}</a
				>
			{/if}
		</nav>
	</aside>

	<section>
		{@render children()}
	</section>
</div>
