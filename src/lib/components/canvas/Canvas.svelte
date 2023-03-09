<script lang="ts">
	import { fabric } from 'fabric'
	import { canvas } from '$lib/store'
	import { onMount, setContext } from 'svelte'
	import { CANVAS_CONTEXT_KEY } from '$lib/constants'
	import { Controller } from './Controller'
	import { Render } from './Render'
	let canvasWrapper: HTMLElement
	let controller: Controller
	let render: Render
	function onResize() {
		if (!$canvas) return
		$canvas.setDimensions({
			width: window.innerWidth,
			height: window.innerHeight,
		})
		$canvas.calcOffset()
	}
	setContext(CANVAS_CONTEXT_KEY, {
		getController: () => controller,
		getRender: () => render,
	})
	onMount(() => {
		$canvas = new fabric.Canvas('canvas', {
			width: canvasWrapper.getBoundingClientRect().width,
			height: canvasWrapper.getBoundingClientRect().height,
			snapAngle: 0,
			fireRightClick: true,
			preserveObjectStacking: true,
			backgroundColor: 'rgba(255,255,255,1)',
		})
		controller = new Controller($canvas)
		render = new Render($canvas)
	})
</script>

<svelte:window on:resize={onResize} />
<div class="fixed inset-0 h-full w-full" bind:this={canvasWrapper}>
	<canvas id="canvas" />
</div>
{#if $canvas}
	<slot />
{:else}
	initializing...
{/if}
