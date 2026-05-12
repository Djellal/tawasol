<script lang="ts">
	import { onMount } from 'svelte';
	import type Quill from 'quill';
	import 'quill/dist/quill.snow.css';

	let { name, value = $bindable(''), label, required = false, placeholder = '' } = $props();

	let container: HTMLElement;
	let quill: Quill;

	onMount(async () => {
		const { default: Quill } = await import('quill');

		quill = new Quill(container, {
			theme: 'snow',
			placeholder: placeholder || label,
			modules: {
				toolbar: [
					['bold', 'italic', 'underline', 'strike'],
					[{ list: 'ordered' }, { list: 'bullet' }],
					['clean']
				]
			}
		});

		if (value) {
			quill.root.innerHTML = value;
		}

		quill.on('text-change', () => {
			value = quill.root.innerHTML === '<p><br></p>' ? '' : quill.root.innerHTML;
		});
	});
</script>

<div class="block">
	{#if label}
		<span class="mb-1 block text-sm font-medium text-slate-700">
			{label}
			{#if required}
				<span class="text-rose-500">*</span>
			{/if}
		</span>
	{/if}

	<div class="relative min-h-[150px]">
		<div bind:this={container} class="min-h-[150px] rounded-b-md border-slate-300 bg-white"></div>
	</div>

	<!-- Hidden input to make it work with standard form submission -->
	<input type="hidden" {name} {value} {required} />
</div>

<style>
	@reference "../../routes/layout.css";

	:global(.ql-toolbar) {
		@apply rounded-t-md border-slate-300 bg-slate-50;
	}
	:global(.ql-container) {
		@apply rounded-b-md border-slate-300 text-base;
		font-family: inherit;
	}
	:global(.ql-editor) {
		min-height: 150px;
	}
	:global(.ql-editor.ql-blank::before) {
		@apply text-slate-400 italic not-italic;
	}
</style>
