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
	let layerCanvas: fabric.Canvas | null | undefined
	let staticCanvas: fabric.StaticCanvas | null | undefined
	let layoutRect: fabric.Object | null | undefined

	async function initCanvas(canvasElement: HTMLCanvasElement) {
		const canvasFactory = await CanvasFactory.getInstance(canvasElement)
		return canvasFactory?.canvas
	}
	async function initStaticCanvas(canvasElement: HTMLCanvasElement) {
		const canvasFactory = await StaticCanvasFactory.getInstance(canvasElement)
		return canvasFactory?.canvas
	}
	function onResize() {
		if (!canvas) return
		canvas.setDimensions({
			width: window.innerWidth,
			height: window.innerHeight,
		})
		if (!staticCanvas) return
		staticCanvas.setDimensions({
			width: window.innerWidth * 0.7,
			height: window.innerHeight * 0.7,
		})
		canvas.calcOffset()
	}
	function onZoom(e: IEvent<WheelEvent>) {
		if (!canvas || !canvas.width || !canvas.height || !staticCanvas || !layoutRect) return
		const delta = e.e.deltaY
		let zoom = canvas.getZoom()
		zoom *= 0.999 ** delta
		if (zoom > 5) zoom = 5
		if (zoom < 1) zoom = 1
		canvas.zoomToPoint(new fabric.Point(canvas.width / 2, canvas.height / 2), zoom)
		layoutRect.scale(zoom)
		staticCanvas.renderAll()
		e.e.preventDefault()
		e.e.stopPropagation()
	}
	onMount(async () => {
		canvas = await initCanvas(canvasElement)
		staticCanvas = await initStaticCanvas(staticCanvasElement)
		layerCanvas = await initCanvas(layerCanvasElement)
		if (canvas) {
			canvas.on('resizing', () => {
				staticCanvas?.setDimensions({
					width: canvas!.getWidth(),
					height: canvas!.getHeight(),
				})
			})
			canvas.on('mouse:wheel', (e) => onZoom(e))
		}
		if (layerCanvas) {
		}
		if (staticCanvas) {
			layoutRect = new fabric.Rect({
				fill: 'rgba(255,255,255,1)',
				width: staticCanvas.getWidth() * 0.7,
				height: staticCanvas.getHeight() * 0.7,
				originX: 'center',
				originY: 'center',
				rx: 10,
				ry: 10,
				shadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);',
			})
			staticCanvas.centerObject(layoutRect)
			staticCanvas.add(layoutRect)
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
