<script lang="ts">
	import { enhance } from '$app/forms';
	import { m } from '$lib/paraglide/messages.js';
	import { departmentName, roleLabel } from '$lib/i18n';
	import { ROLES } from '$lib/constants';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<div class="flex items-center justify-between">
	<h1 class="text-2xl font-bold text-slate-900">{m.admin_users()}</h1>
</div>

{#if form?.message}
	<p class="mt-4 rounded bg-rose-50 px-3 py-2 text-sm text-rose-700">{form.message}</p>
{/if}

<!-- Create User Form -->
<div class="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
	<h2 class="text-lg font-semibold text-slate-900">{m.register_title()}</h2>
	<form method="post" action="?/create" use:enhance class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
		<label class="block">
			<span class="mb-1 block text-xs font-medium text-slate-700">{m.register_name()}</span>
			<input name="name" required class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
		</label>
		<label class="block">
			<span class="mb-1 block text-xs font-medium text-slate-700">{m.login_email()}</span>
			<input type="email" name="email" required class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
		</label>
		<label class="block">
			<span class="mb-1 block text-xs font-medium text-slate-700">{m.login_password()}</span>
			<input type="password" name="password" required class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm" />
		</label>
		<label class="block">
			<span class="mb-1 block text-xs font-medium text-slate-700">{m.users_role()}</span>
			<select name="role" class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm">
				{#each Object.values(ROLES) as r (r)}
					<option value={r}>{roleLabel(r)}</option>
				{/each}
			</select>
		</label>
		<label class="block">
			<span class="mb-1 block text-xs font-medium text-slate-700">{m.users_department()}</span>
			<select name="departmentId" class="w-full rounded-md border border-slate-300 px-3 py-2 text-sm">
				<option value="">{m.users_none_dept()}</option>
				{#each data.departments as d (d.id)}
					<option value={d.id}>{departmentName(d)}</option>
				{/each}
			</select>
		</label>
		<div class="flex items-end">
			<button type="submit" class="w-full rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition">
				{m.dept_create()}
			</button>
		</div>
	</form>
</div>

<!-- Users List -->
<div class="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
	<div class="overflow-x-auto">
		<table class="w-full text-sm">
			<thead class="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
				<tr>
					<th class="px-4 py-3 text-start">{m.form_full_name()}</th>
					<th class="px-4 py-3 text-start">{m.form_email()}</th>
					<th class="px-4 py-3 text-start">{m.users_role()}</th>
					<th class="px-4 py-3 text-start">{m.users_department()}</th>
					<th class="px-4 py-3 text-end">{m.admin_action()}</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-slate-100">
				{#each data.users as u (u.id)}
					<tr>
						<td class="px-4 py-3">
							<form method="post" action="?/update" use:enhance class="contents">
								<input type="hidden" name="id" value={u.id} />
								<input name="name" value={u.name} class="w-full rounded border-transparent px-1 py-0.5 hover:border-slate-300 focus:border-emerald-500 focus:ring-0" />
							</form>
						</td>
						<td class="px-4 py-3 text-slate-600 font-mono text-xs">{u.email}</td>
						<td class="px-4 py-3">
							<form method="post" action="?/update" use:enhance id="update-{u.id}" class="flex items-center gap-2">
								<input type="hidden" name="id" value={u.id} />
								<input type="hidden" name="name" value={u.name} />
								<select
									name="role"
									value={u.role ?? 'citizen'}
									onchange={(e) => (e.currentTarget.form?.requestSubmit())}
									class="rounded-md border border-slate-300 px-2 py-1 text-xs"
								>
									{#each Object.values(ROLES) as r (r)}
										<option value={r}>{roleLabel(r)}</option>
									{/each}
								</select>
							</form>
						</td>
						<td class="px-4 py-3 text-slate-600">
							<select
								form="update-{u.id}"
								name="departmentId"
								value={u.departmentId ?? ''}
								onchange={(e) => (e.currentTarget.form?.requestSubmit())}
								class="rounded-md border border-slate-300 px-2 py-1 text-xs"
							>
								<option value="">{m.users_none_dept()}</option>
								{#each data.departments as d (d.id)}
									<option value={d.id}>{departmentName(d)}</option>
								{/each}
							</select>
						</td>
						<td class="px-4 py-3 text-end">
							{#if u.id !== data.user?.id}
								<form method="post" action="?/delete" use:enhance class="inline-block" onsubmit={() => confirm(m.dept_delete() + '?')}>
									<input type="hidden" name="id" value={u.id} />
									<button type="submit" class="text-rose-600 hover:text-rose-800 p-1 rounded hover:bg-rose-50 transition" title={m.dept_delete()}>
										<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
										</svg>
									</button>
								</form>
							{/if}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
