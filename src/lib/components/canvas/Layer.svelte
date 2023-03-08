<script lang="ts">
	import { Sidebar, Topbar } from '$lib';
	import { canvas, paletteColor } from '$lib/store';
	import { onMount } from 'svelte';
	import { Controller } from '../canvas/Controller';
	import { Render } from '../canvas/Render';

	let render: Render;
	let controller: Controller;
	let isTopbarOpen = true;
	let isSideBarOpen = false;
	let sideBarKey = Symbol();

	const onObjectSelect = () => {
		render.onObjectSelect();
		onSideBarOpen();
	};
	const onObjectSelectUpdate = () => {
		render.onObjectSelectUpdate();
		changeSideBar();
		clearPaletteColor();
	};
	const onObjectSelectClear = () => {
		render.onObjectSelectClear();
		onSidebarClose();
		clearPaletteColor();
	};

	const clearPaletteColor = () => {
		$paletteColor = null;
	};
	const onSideBarOpen = () => {
		isSideBarOpen = true;
	};
	const onSidebarClose = () => {
		isSideBarOpen = false;
	};
	const changeSideBar = () => {
		isSideBarOpen = true;
		sideBarKey = Symbol();
	};
	const onAutoSaveInLocalStorage = () => {
		return setInterval(() => {
			const json = $canvas!.toJSON();
			localStorage.setItem('drawingPod', JSON.stringify(json));
		}, 5000);
	};

	onMount(() => {
		if ($canvas) {
			controller = new Controller($canvas);
			render = new Render($canvas);
			$canvas.on('selection:created', onObjectSelect);
			$canvas.on('selection:updated', onObjectSelectUpdate);
			$canvas.on('selection:cleared', onObjectSelectClear);
			$canvas.on('object:added', onObjectSelect);

			const interval = onAutoSaveInLocalStorage();
			return () => {
				clearInterval(interval);
			};
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
