<script lang="ts">
	import { enhance } from '$app/forms';
	import { m } from '$lib/paraglide/messages.js';
	import { departmentName } from '$lib/i18n';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<div class="mx-auto max-w-2xl rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
	<h1 class="text-2xl font-bold text-slate-900">{m.complaint_new_title()}</h1>
	<p class="mt-2 text-sm text-slate-600">{m.complaint_new_desc()}</p>

	<form
		method="post"
		enctype="multipart/form-data"
		use:enhance
		class="mt-6 space-y-4"
	>
		<div class="grid gap-4 sm:grid-cols-2">
			<label class="block">
				<span class="mb-1 block text-sm font-medium text-slate-700"
					>{m.form_full_name()} <span class="text-rose-500">*</span></span
				>
				<input
					name="fullName"
					required
					class="w-full rounded-md border border-slate-300 bg-white px-3 py-2 shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
				/>
			</label>
			<label class="block">
				<span class="mb-1 block text-sm font-medium text-slate-700"
					>{m.form_department()} <span class="text-rose-500">*</span></span
				>
				<select
					name="departmentId"
					required
					class="w-full rounded-md border border-slate-300 bg-white px-3 py-2 shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
				>
					<option value="">{m.form_select_department()}</option>
					{#each data.departments as d (d.id)}
						<option value={d.id}>{departmentName(d)}</option>
					{/each}
				</select>
			</label>
			<label class="block">
				<span class="mb-1 block text-sm font-medium text-slate-700"
					>{m.form_email()} <span class="text-xs text-slate-400">({m.form_optional()})</span></span
				>
				<input
					type="email"
					name="email"
					class="w-full rounded-md border border-slate-300 bg-white px-3 py-2 shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
				/>
			</label>
			<label class="block">
				<span class="mb-1 block text-sm font-medium text-slate-700"
					>{m.form_phone()} <span class="text-xs text-slate-400">({m.form_optional()})</span></span
				>
				<input
					name="phone"
					class="w-full rounded-md border border-slate-300 bg-white px-3 py-2 shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
				/>
			</label>
		</div>

		<label class="block">
			<span class="mb-1 block text-sm font-medium text-slate-700"
				>{m.form_subject()} <span class="text-rose-500">*</span></span
			>
			<input
				name="subject"
				required
				class="w-full rounded-md border border-slate-300 bg-white px-3 py-2 shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
			/>
		</label>

		<label class="block">
			<span class="mb-1 block text-sm font-medium text-slate-700"
				>{m.form_description()} <span class="text-rose-500">*</span></span
			>
			<textarea
				name="description"
				required
				rows="6"
				class="w-full rounded-md border border-slate-300 bg-white px-3 py-2 shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
			></textarea>
		</label>

		<label class="block">
			<span class="mb-1 block text-sm font-medium text-slate-700">{m.form_attachment()}</span>
			<input
				type="file"
				name="attachments"
				multiple
				class="block w-full text-sm text-slate-700 file:mr-3 file:rounded-md file:border-0 file:bg-emerald-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-emerald-700 hover:file:bg-emerald-100"
			/>
		</label>

		{#if form?.message}
			<p class="rounded bg-rose-50 px-3 py-2 text-sm text-rose-700">{form.message}</p>
		{/if}

		<button
			type="submit"
			class="rounded-md bg-emerald-600 px-6 py-2.5 font-medium text-white transition hover:bg-emerald-700"
			>{m.form_submit()}</button
		>
	</form>
</div>
