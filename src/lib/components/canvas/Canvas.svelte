<script lang="ts">
	import { fabric } from 'fabric'
	import type { IEvent } from 'fabric/fabric-impl'
	import { onMount } from 'svelte'
	import { CanvasFactory, StaticCanvasFactory } from './canvasFactory'
	import Layer from './Layer.svelte'
	let canvasElement: HTMLCanvasElement
	let staticCanvasElement: HTMLCanvasElement
	let layerCanvasElement: HTMLCanvasElement
	let canvasWrapper: HTMLElement
	let canvas: fabric.Canvas | null | undefined
	let layoutRect: fabric.Object | null | undefined

	async function initCanvas(canvasElement: HTMLCanvasElement) {
		const canvasFactory = await CanvasFactory.getInstance(canvasElement)
		return canvasFactory?.canvas
	}
	function onResize() {
		if (!canvas) return
		canvas.setDimensions({
			width: window.innerWidth,
			height: window.innerHeight,
		})
		canvas.calcOffset()
	}
	function onZoom(e: IEvent<WheelEvent>) {
		if (!canvas || !canvas.width || !canvas.height) return
		const delta = e.e.deltaY
		let zoom = canvas.getZoom()
		zoom *= 0.999 ** delta
		if (zoom > 5) zoom = 5
		if (zoom < 1) zoom = 1
		canvas.zoomToPoint(new fabric.Point(canvas.width / 2, canvas.height / 2), zoom)
		e.e.preventDefault()
		e.e.stopPropagation()
	}
	onMount(async () => {
		canvas = await initCanvas(canvasElement)
		if (canvas) {
			canvas.on('resizing', () => {})
			canvas.on('mouse:wheel', (e) => onZoom(e))
		}
	})
</script>

<svelte:window on:resize={onResize} />
<div class="relative h-screen w-full bg-neutral-100" bind:this={canvasWrapper}>
	<canvas id="canvas" bind:this={canvasElement} class="absolute inset-0 z-30 h-full w-full" />
	<canvas id="layerCanvas" bind:this={layerCanvasElement} class="absolute inset-0 h-full w-full" />
	<canvas
		id="staticCanvas"
		bind:this={staticCanvasElement}
		class="absolute inset-0 h-full w-full"
	/>
</div>
{#if canvas}
	<Layer {canvas} />
{:else}
	initializing...
{/if}
