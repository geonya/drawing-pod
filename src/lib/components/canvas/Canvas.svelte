<script lang="ts">
	import { onMount } from 'svelte'
	import { fabric } from 'fabric'
	import Layer from './Layer.svelte'
	import BjsCanvas from '../babylonjs/BJSCanvas.svelte'
	import Spinner from '../Spinner.svelte'
	import { sb } from '$lib/store'

	let canvasWrapper: HTMLElement
	let canvas: fabric.Canvas
	async function onLoadCloudCanvas() {
		if (!$sb) return
		const {
			data: { user },
		} = await $sb?.auth.getUser()
		if (!user) return
		const { data, error } = await $sb.from('canvas').select('*').eq('user', user.id).single()
		if (error) {
			console.log(error)
			return
		}
		if (!data) return
		const canvasData = data.data
		if (canvasData) {
			canvas.loadFromJSON(canvasData, () => {
				canvas.renderAll()
			})
		}
	}

	onMount(async () => {
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

		// load cloud canvas json file
		// await onLoadCloudCanvas()
	})
</script>

<svelte:window />
<div id="canvasWrapper" class="relative h-screen w-full" bind:this={canvasWrapper}>
	<canvas id="canvas" class="absolute inset-0 z-30 h-full w-full" />
</div>
{#if canvas}
	<Layer {canvas} />
	<div class="absolute right-12 top-24 z-40 cursor-grab rounded-full bg-black bg-opacity-5 p-2">
		<BjsCanvas />
	</div>
{:else}
	<div class="fixed inset-0 grid h-full w-full place-content-center">
		<Spinner />
		<span class="text-center">Initializing...</span>
	</div>
{/if}

<style>
</style>
