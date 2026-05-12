<script lang="ts">
	import { enhance } from '$app/forms';
	import { m } from '$lib/paraglide/messages.js';
	import { departmentName, roleLabel } from '$lib/i18n';
	import { ROLES } from '$lib/constants';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<h1 class="text-2xl font-bold text-slate-900">{m.admin_users()}</h1>

<div class="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
	<table class="w-full text-sm">
		<thead class="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
			<tr>
				<th class="px-4 py-3 text-start">{m.form_full_name()}</th>
				<th class="px-4 py-3 text-start">{m.form_email()}</th>
				<th class="px-4 py-3 text-start">{m.users_role()}</th>
				<th class="px-4 py-3 text-start">{m.users_department()}</th>
				<th class="px-4 py-3"></th>
			</tr>
		</thead>
		<tbody class="divide-y divide-slate-100">
			{#each data.users as u (u.id)}
				<tr>
					<td class="px-4 py-3 font-medium text-slate-900">{u.name}</td>
					<td class="px-4 py-3 text-slate-600">{u.email}</td>
					<td colspan="3" class="px-4 py-3">
						<form method="post" use:enhance class="flex flex-wrap items-center gap-2">
							<input type="hidden" name="id" value={u.id} />
							<select
								name="role"
								value={u.role ?? 'citizen'}
								class="rounded-md border border-slate-300 px-2 py-1.5 text-sm"
							>
								{#each Object.values(ROLES) as r (r)}
									<option value={r}>{roleLabel(r)}</option>
								{/each}
							</select>
							<select
								name="departmentId"
								value={u.departmentId ?? ''}
								class="rounded-md border border-slate-300 px-2 py-1.5 text-sm"
							>
								<option value="">{m.users_none_dept()}</option>
								{#each data.departments as d (d.id)}
									<option value={d.id}>{departmentName(d)}</option>
								{/each}
							</select>
							<button
								type="submit"
								class="rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700"
								>{m.users_save()}</button
							>
						</form>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
