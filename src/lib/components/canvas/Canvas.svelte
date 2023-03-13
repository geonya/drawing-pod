<script lang="ts">
	import { onMount } from 'svelte'
	import { fabric } from 'fabric'
	import Layer from './Layer.svelte'

	import { setGridOnCanvasWithMM } from '$lib/utils'
	import BjsCanvas from '../babylonjs/BJSCanvas.svelte'
	let canvasWrapper: HTMLElement
	let canvas: fabric.Canvas
	let staticCanvas: fabric.StaticCanvas

	// async function initCanvas(canvasElement: HTMLCanvasElement) {
	// 	const canvasFactory = await CanvasFactory.getInstance(canvasElement)
	// 	return canvasFactory?.canvas
	// }

	onMount(() => {
		canvas = new fabric.Canvas('canvas', {
			width: canvasWrapper.getBoundingClientRect().width,
			height: canvasWrapper.getBoundingClientRect().height,
			centeredScaling: true,
			centeredRotation: true,
			backgroundColor: 'rgba(0, 0, 0, 0)',
			preserveObjectStacking: true,
			selection: true,
			hoverCursor: 'pointer',
			moveCursor: 'move',
			defaultCursor: 'default',
			fireRightClick: true,
		})
		canvas.zoomToPoint(new fabric.Point(canvas.width! / 2, canvas.height! / 2), 2)
		fabric.ActiveSelection.prototype.cornerStyle = 'circle'
		fabric.Group.prototype.cornerStyle = 'circle'
		fabric.Object.prototype.cornerStyle = 'circle'

		staticCanvas = new fabric.StaticCanvas('staticCanvas', {
			width: canvasWrapper.getBoundingClientRect().width,
			height: canvasWrapper.getBoundingClientRect().height,
		})
		setGridOnCanvasWithMM(staticCanvas)
		staticCanvas.zoomToPoint(new fabric.Point(canvas.width! / 2, canvas.height! / 2), 2)
	})
</script>

<svelte:window />
<div id="canvasWrapper" class="relative h-screen w-full" bind:this={canvasWrapper}>
	<canvas id="canvas" class="absolute inset-0 z-30 h-full w-full" />
	<canvas id="staticCanvas" class="absolute inset-0 z-20 h-full w-full" />
</div>
{#if canvas}
	<Layer {canvas} {staticCanvas} />
	<div class="absolute right-24 top-24 z-50 cursor-grab">
		<BjsCanvas />
	</div>
{:else}
	initializing...
{/if}

<style>
</style>
