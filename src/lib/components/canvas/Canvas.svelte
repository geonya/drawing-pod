<script lang="ts">
	import { fabric } from 'fabric'
	import { onMount } from 'svelte'
	import Layer from './Layer.svelte'
	let canvasWrapper: HTMLElement
	let canvas: fabric.Canvas
	function onResize() {
		if (!canvas) return
		canvas.setDimensions({
			width: window.innerWidth,
			height: window.innerHeight,
		})
		canvas.calcOffset()
	}
	onMount(() => {
		canvas = new fabric.Canvas('canvas', {
			width: canvasWrapper.getBoundingClientRect().width,
			height: canvasWrapper.getBoundingClientRect().height,
			snapAngle: 0,
			fireRightClick: true,
			preserveObjectStacking: true,
			backgroundColor: 'rgba(255,255,255,1)',
		})
	})
</script>

<svelte:window on:resize={onResize} />
<div class="fixed inset-0 h-full w-full" bind:this={canvasWrapper}>
	<canvas id="canvas" />
</div>
{#if canvas}
	<Layer bind:canvas />
{:else}
	initializing...
{/if}
