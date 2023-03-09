<script lang="ts">
	import { MOTION_CONTEXT_KEY } from '$lib/constants';
	import {
		activeObject,
		canvas,
		motionState,
		paletteColor,
		sideBarKey,
		sideBarOpen,
	} from '$lib/store';
	import { MotionState, type IMotionContext } from '$lib/types';
	import type { Controller } from './Controller';
	import type { Render } from './Render';
	import { CANVAS_CONTEXT_KEY } from '$lib/constants';
	import type { ICanvasContext } from '$lib/types';
	import { getContext, onMount, setContext } from 'svelte';
	import { sidebarKey } from './Layer.svelte';

	let controller: Controller;
	let render: Render;
	const { getController, getRender } = getContext<ICanvasContext>(CANVAS_CONTEXT_KEY);
	$: {
		if (render && controller) {
			if ($motionState === MotionState.DEFAULT) {
				render.onDrawingEnd();
				render.onDraggingEnd();
			}
			if ($motionState === MotionState.DRAWING) {
				render.onDrawingStart();
			}
			if ($motionState === MotionState.DRAGGING) {
				render.onDraggingStart();
			}
		}
	}
	const onAddRect = () => {
		render.onAddRect();
	};
	const onAddCircle = () => {
		render.onAddCircle();
	};
	const onHandDraggingStart = () => {
		$motionState = MotionState.DRAGGING;
	};
	const onHandDraggingEnd = () => {
		$motionState = MotionState.DEFAULT;
	};
	const onCursorMove = () => {
		$motionState = MotionState.DEFAULT;
	};
	const onDrawing = () => {
		$motionState = MotionState.DRAWING;
	};
	const onDelete = () => {
		controller.onDelete();
	};
	const onSave = () => {
		controller.onSave();
	};
	const onAddImage = (e: Event) => {
		controller.onAddImage(e);
	};

	const onKeyDown = (e: KeyboardEvent) => {
		if (e.key === 'Delete' || e.key === 'Backspace') {
			onDelete();
		}
		if (e.key === ' ') {
			onHandDraggingStart();
		}
		if (e.key === 'Escape') {
			$motionState = MotionState.DEFAULT;
			render.onObjectSelectClear();
		}
	};
	const onKeyUp = (e: KeyboardEvent) => {
		if (e.key === ' ') {
			onHandDraggingEnd();
		}
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
		$sideBarOpen = true;
	};
	const onSidebarClose = () => {
		$sideBarOpen = false;
	};
	const changeSideBar = () => {
		$sideBarKey = Symbol();
	};
	setContext<IMotionContext>(MOTION_CONTEXT_KEY, {
		onAddRect,
		onAddCircle,
		onHandDraggingStart,
		onHandDraggingEnd,
		onCursorMove,
		onDrawing,
		onDelete,
		onSave,
		onAddImage,
		onKeyDown,
		onKeyUp,
	});
	onMount(() => {
		controller = getController();
		render = getRender();
		if ($canvas) {
			$canvas.on('selection:created', onObjectSelect);
			$canvas.on('selection:updated', onObjectSelectUpdate);
			$canvas.on('selection:cleared', onObjectSelectClear);
		}
	});
</script>

<slot />
