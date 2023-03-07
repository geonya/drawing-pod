<script lang="ts">
	import { fabricCanvas } from '$lib/store';
	import { MotionState } from '$lib/types';
	import { onMount } from 'svelte';
	import type { Render } from './Render';
	export let render: Render;
	$: motionState = render.motionState;
	$: {
		if (motionState === MotionState.DEFAULT) {
			render.onDragEnd();
			render.onDrawEnd();
		}
		if (motionState === MotionState.DRAGGING) {
			render.onDrawEnd();
			render.onDragStart();
		}
		if (motionState === MotionState.DRAWING) {
			render.onDragEnd();
			render.onDrawStart();
		}
	}
	onMount(() => {
		$fabricCanvas?.on('selection:cleared', () => render.onChangeMotionState(MotionState.DEFAULT));
	});
</script>

<slot />
