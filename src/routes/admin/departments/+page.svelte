<script lang="ts">
	import { enhance } from '$app/forms';
	import { m } from '$lib/paraglide/messages.js';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let editingId = $state<string | null>(null);
</script>

<h1 class="text-2xl font-bold text-slate-900">{m.admin_departments()}</h1>

<form
	method="post"
	action="?/create"
	use:enhance
	class="mt-4 grid gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-3"
>
	<input
		name="nameAr"
		required
		placeholder={m.dept_name_ar()}
		class="rounded-md border border-slate-300 px-3 py-2 text-sm"
	/>
	<input
		name="nameFr"
		required
		placeholder={m.dept_name_fr()}
		class="rounded-md border border-slate-300 px-3 py-2 text-sm"
	/>
	<input
		name="nameEn"
		required
		placeholder={m.dept_name_en()}
		class="rounded-md border border-slate-300 px-3 py-2 text-sm"
	/>
	<input
		name="description"
		placeholder={m.dept_description()}
		class="rounded-md border border-slate-300 px-3 py-2 text-sm sm:col-span-2"
	/>
	<button
		type="submit"
		class="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
		>{m.dept_create()}</button
	>
</form>

<div class="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
	{#if data.departments.length === 0}
		<p class="p-8 text-center text-slate-500">{m.admin_no_records()}</p>
	{:else}
		<table class="w-full text-sm">
			<thead class="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
				<tr>
					<th class="px-4 py-3 text-start">{m.dept_name_ar()}</th>
					<th class="px-4 py-3 text-start">{m.dept_name_fr()}</th>
					<th class="px-4 py-3 text-start">{m.dept_name_en()}</th>
					<th class="px-4 py-3 text-start">{m.dept_description()}</th>
					<th class="px-4 py-3"></th>
				</tr>
			</thead>
			<tbody class="divide-y divide-slate-100">
				{#each data.departments as d (d.id)}
					<tr class="hover:bg-slate-50">
						{#if editingId === d.id}
							<td colspan="5" class="px-4 py-3">
								<form
									method="post"
									action="?/update"
									use:enhance={() => () => {
										editingId = null;
									}}
									class="grid gap-2 sm:grid-cols-3"
								>
									<input type="hidden" name="id" value={d.id} />
									<input
										name="nameAr"
										value={d.nameAr}
										required
										class="rounded-md border border-slate-300 px-2 py-1.5 text-sm"
									/>
									<input
										name="nameFr"
										value={d.nameFr}
										required
										class="rounded-md border border-slate-300 px-2 py-1.5 text-sm"
									/>
									<input
										name="nameEn"
										value={d.nameEn}
										required
										class="rounded-md border border-slate-300 px-2 py-1.5 text-sm"
									/>
									<input
										name="description"
										value={d.description ?? ''}
										class="rounded-md border border-slate-300 px-2 py-1.5 text-sm sm:col-span-2"
									/>
									<div class="flex gap-2">
										<button
											type="submit"
											class="rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white"
											>{m.dept_save()}</button
										>
										<button
											type="button"
											class="rounded-md bg-slate-100 px-3 py-1.5 text-sm"
											onclick={() => (editingId = null)}>×</button
										>
									</div>
								</form>
							</td>
						{:else}
							<td class="px-4 py-3 font-medium text-slate-900">{d.nameAr}</td>
							<td class="px-4 py-3 text-slate-700">{d.nameFr}</td>
							<td class="px-4 py-3 text-slate-700">{d.nameEn}</td>
							<td class="px-4 py-3 text-slate-500">{d.description ?? ''}</td>
							<td class="px-4 py-3 text-end">
								<button
									type="button"
									class="text-sm text-emerald-700 hover:underline"
									onclick={() => (editingId = d.id)}>{m.dept_edit()}</button
								>
								<form method="post" action="?/delete" use:enhance class="inline">
									<input type="hidden" name="id" value={d.id} />
									<button class="ms-3 text-sm text-rose-600 hover:underline">{m.dept_delete()}</button>
								</form>
							</td>
						{/if}
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
</div>
