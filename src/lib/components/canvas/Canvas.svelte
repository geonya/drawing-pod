<script lang="ts">
	import { onMount } from 'svelte'
	import { fabric } from 'fabric'
	import Layer from './Layer.svelte'

	import { setGridOnCanvasWithMM } from '$lib/utils'
	import BjsCanvas from '../babylonjs/BJSCanvas.svelte'
	import type { SupabaseClient } from '@supabase/supabase-js'
	import Spinner from '../Spinner.svelte'
	export let supabase: SupabaseClient
	let canvasWrapper: HTMLElement
	let canvas: fabric.Canvas
	let staticCanvas: fabric.StaticCanvas

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
	})
</script>

<svelte:window />
<div id="canvasWrapper" class="relative h-screen w-full" bind:this={canvasWrapper}>
	<canvas id="canvas" class="absolute inset-0 z-30 h-full w-full" />
</div>
{#if canvas}
	<Layer {canvas} {supabase} />
	<div class="absolute right-12 top-24 z-50 cursor-grab rounded-full bg-black bg-opacity-5 p-2">
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
