<script lang="ts">
	import { canvas, motionState } from '$lib/store';
	import { MotionState } from '$lib/types';
	import { onMount } from 'svelte';
	import type { Render } from './Render';
	export let render: Render;
	$: {
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
	const onClickESC = (e: KeyboardEvent) => {
		console.log(e.key);
		if (e.key === 'Escape') {
			$motionState = MotionState.DEFAULT;
			render.onObjectSelectClear();
		}
	};

	onMount(() => {
		$canvas!.on('selection:cleared', () => ($motionState = MotionState.DEFAULT));
	});
</script>

<svelte:window on:keydown={onClickESC} />
<slot />
