<script lang="ts">
	import { Sidebar, Topbar } from '$lib';
	import { CANVAS_DATA } from '$lib/constants';
	import { activeObject, canvas, paletteColor } from '$lib/store';
	import { onMount } from 'svelte';
	import { Controller } from '../canvas/Controller';
	import { Render } from '../canvas/Render';
	import { AUTO_SAVE_DELAY } from '$lib/constants';

	let render: Render;
	let controller: Controller;
	let isTopbarOpen = true;
	let sideBarKey = Symbol();
	let saveProgress = 0;
	$: isSideBarOpen = false;

	const saveTimer = (m: number) => {
		let saveTimerId: ReturnType<typeof requestAnimationFrame>;
		let start: number | null = null;
		const loop = (timestamp: number) => {
			if (!start) start = timestamp;
			const elapsed = timestamp - start;
			const progress = (elapsed / m) * 1.1;
			if (progress <= 1) {
				requestAnimationFrame(loop);
			}
			saveProgress = progress;
		};
		saveTimerId = requestAnimationFrame(loop);
		return saveTimerId;
	};

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
	const onAutoSaveInLocalStorage = (canvas: fabric.Canvas) => {
		let interval: ReturnType<typeof setInterval>;
		interval = setInterval(() => {
			const json = canvas.toJSON();
			localStorage.setItem(CANVAS_DATA, JSON.stringify(json));
			console.log('canvas data auto saved!');
		}, AUTO_SAVE_DELAY);
		return () => {
			clearInterval(interval);
		};
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

	const onIntervalAutoSaveWithTimer = () => {
		let interval: ReturnType<typeof setInterval>;
		let saveTimerId: ReturnType<typeof requestAnimationFrame> | null;
		saveTimerId = saveTimer(AUTO_SAVE_DELAY);
		interval = setInterval(() => {
			saveTimerId = saveTimer(AUTO_SAVE_DELAY);
		}, AUTO_SAVE_DELAY);
		return () => {
			clearInterval(interval);
			saveTimerId && cancelAnimationFrame(saveTimerId);
		};
	};

	onMount(() => {
		if ($canvas) {
			onLoadStorageData($canvas);
			controller = new Controller($canvas);
			render = new Render($canvas);
			$canvas.on('selection:created', onObjectSelect);
			$canvas.on('selection:updated', onObjectSelectUpdate);
			$canvas.on('selection:cleared', onObjectSelectClear);
			$canvas.on('object:added', onObjectSelect);
			onAutoSaveInLocalStorage($canvas);
			onIntervalAutoSaveWithTimer();
		}
	});
</script>

{#if $canvas && render && controller}
	{#if isTopbarOpen}
		<Topbar {render} {controller} {saveProgress} />
	{/if}
	{#if isSideBarOpen}
		{#key sideBarKey}
			<Sidebar {render} />
		{/key}
	{/if}
{/if}
