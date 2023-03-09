<script lang="ts">
	import { Sidebar, Topbar } from '$lib';
	import { CANVAS_CONTEXT_KEY, CANVAS_DATA } from '$lib/constants';
	import { activeObject, canvas, paletteColor } from '$lib/store';
	import { onMount, setContext } from 'svelte';
	import { Controller } from '../canvas/Controller';
	import { Render } from '../canvas/Render';

	let render: Render;
	let controller: Controller;
	let isTopbarOpen = true;
	let sideBarKey = Symbol();
	$: isSideBarOpen = false;

	const onObjectSelect = () => {
		render.onObjectSelect();
		render.onActiveObjectStoreUpdate(activeObject);
		onSideBarOpen();
	};
	const onObjectSelectUpdate = () => {
		render.onObjectSelectUpdate();
		render.onActiveObjectStoreUpdate(activeObject);
		changeSideBar();
		clearPaletteColor();
	};
	const onObjectSelectClear = () => {
		render.onObjectSelectClear();
		render.onActiveObjectStoreUpdate(activeObject);
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
	const onLoadStorageData = (canvas: fabric.Canvas) => {
		const storageJsonData = localStorage.getItem(CANVAS_DATA);
		if (storageJsonData) {
			const json = JSON.parse(storageJsonData);
			canvas.loadFromJSON(json, () => {
				canvas.renderAll();
			});
		}
	};
	setContext(CANVAS_CONTEXT_KEY, {
		getController: () => controller,
		getRender: () => render,
	});

	onMount(() => {
		if ($canvas) {
			onLoadStorageData($canvas);
			controller = new Controller($canvas);
			render = new Render($canvas);
			$canvas.on('selection:created', onObjectSelect);
			$canvas.on('selection:updated', onObjectSelectUpdate);
			$canvas.on('selection:cleared', onObjectSelectClear);
			$canvas.on('object:added', onObjectSelect);
		}
	});
</script>

{#if $canvas && render && controller}
	{#if isTopbarOpen}
		<Topbar />
	{/if}
	{#if isSideBarOpen}
		{#key sideBarKey}
			<Sidebar />
		{/key}
	{/if}
{/if}
