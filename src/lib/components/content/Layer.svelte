<script lang="ts">
	import { fabricCanvas } from '$lib/store';
	import { onDestroy, onMount } from 'svelte';
	import { Controller } from '../canvas/Controller';
	import { Render } from '../canvas/Render';
	import Sidebar from './Sidebar.svelte';
	import Topbar from './Topbar.svelte';
	$: canvas = $fabricCanvas!;

	let render: Render;
	let controller: Controller;
	let isTopbarOpen = true;
	let isSideBarOpen = false;

	onMount(() => {
		controller = new Controller(canvas);
		render = new Render(canvas);
		canvas.on('selection:created', () => (isSideBarOpen = true));
		canvas.on('selection:cleared', () => (isSideBarOpen = false));
	});
	onDestroy(() => {
		canvas.off('selection:created');
		canvas.off('selection:cleared');
	});
</script>

{#if $fabricCanvas && render && controller}
	{#if isTopbarOpen}
		<Topbar {render} {controller} />
	{/if}
	{#if isSideBarOpen}
		<Sidebar {render} />
	{/if}
{/if}
