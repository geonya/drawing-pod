<script lang="ts">
	import { Sidebar, Topbar } from '$lib';
	import { canvas } from '$lib/store';
	import { onMount } from 'svelte';
	import { Controller } from '../canvas/Controller';
	import { Render } from '../canvas/Render';

	let render: Render;
	let controller: Controller;
	let isTopbarOpen = true;
	let isSideBarOpen = false;
	let sideBarKey = Symbol();

	const toggleSideBarOpen = () => {
		isSideBarOpen = !isSideBarOpen;
	};
	const changeSideBar = () => {
		isSideBarOpen = true;
		sideBarKey = Symbol();
	};

	onMount(() => {
		if ($canvas) {
			controller = new Controller($canvas);
			render = new Render($canvas);
			$canvas.on('selection:created', toggleSideBarOpen);
			$canvas.on('selection:updated', changeSideBar);
			$canvas.on('selection:cleared', toggleSideBarOpen);
		}
	});
</script>

{#if $canvas && render && controller}
	{#if isTopbarOpen}
		<Topbar {render} {controller} />
	{/if}
	{#if isSideBarOpen}
		{#key sideBarKey}
			<Sidebar {render} />
		{/key}
	{/if}
{/if}
