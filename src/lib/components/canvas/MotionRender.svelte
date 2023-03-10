<script lang="ts">
	import { MotionState } from '$lib/types'
	import { onMount } from 'svelte'
	import type { Motion } from './Motion'

	export let motion: Motion
	export let canvas: fabric.Canvas

	onMount(() => {
		if (canvas) {
			canvas.on('object:moving', (e) => motion?.onPreventCanvasExit(e))
			canvas.on('selection:created', () => motion?.onChangeMotionState(MotionState.DEFAULT))
		}
	})
</script>

<svelte:window on:keydown={(e) => motion?.onKeyDown(e)} on:keyup={(e) => motion?.onKeyUp(e)} />
