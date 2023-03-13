<script lang="ts">
	import { renderer } from '$lib/store'
	import { onMount } from 'svelte'
	import BjsCanvas from '../babylonjs/BJSCanvas.svelte'
	import { CanvasFactory } from './CanvasFactory'
	import Layer from './Layer.svelte'
	let canvasElement: HTMLCanvasElement
	let canvasWrapper: HTMLElement
	let canvas: fabric.Canvas | null | undefined

	async function initCanvas(canvasElement: HTMLCanvasElement) {
		const canvasFactory = await CanvasFactory.getInstance(canvasElement)
		return canvasFactory?.canvas
	}

	onMount(async () => {
		canvas = await initCanvas(canvasElement)
		if (canvas) {
		}
	})
</script>

<svelte:window />
<div
	id="canvasWrapper"
	class="relative grid h-screen w-full grid-flow-col justify-items-center overflow-hidden"
	bind:this={canvasWrapper}
>
	<div class="hidden border lg:block" />
	<canvas id="canvas" bind:this={canvasElement} class="block border" />
	<div class="hidden border lg:block" />
</div>
{#if canvas}
	<Layer {canvas} />
	<!-- <div class="absolute right-32 top-1/2 z-50 -translate-y-1/2 cursor-grab backdrop-blur-lg">
		<BjsCanvas />
	</div> -->
{:else}
	initializing...
{/if}

<style>
</style>
