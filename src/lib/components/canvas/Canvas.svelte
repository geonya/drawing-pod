<script lang="ts">
	import { renderer } from '$lib/store'
	import { onMount } from 'svelte'
	import BjsCanvas from '../babylonjs/BJSCanvas.svelte'
	import { fabric } from 'fabric'
	import Layer from './Layer.svelte'
	let canvasElement: HTMLCanvasElement
	let canvasWrapper: HTMLElement
	let canvas: fabric.Canvas | null | undefined

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
			backgroundColor: 'rgba(255, 255, 255, 0)',
			// . preserveObjectStacking 옵션
			// 객체들의 쌓이는 순서를 유지하면서 비율이 일치하도록 자동으로 조정
			preserveObjectStacking: true,
			selection: true,
			hoverCursor: 'pointer',
			moveCursor: 'move',
			defaultCursor: 'default',
			fireRightClick: true,
		})
		// 배경 그리드 추가 TODO : 객체로 만들지 말 것 (STATIC CANVAS.)
		// setGridOnCanvasWithMM(newCanvas)
		canvas.zoomToPoint(new fabric.Point(canvas.width! / 2, canvas.height! / 2), 2.7)
		fabric.ActiveSelection.prototype.cornerStyle = 'circle'
		fabric.Group.prototype.cornerStyle = 'circle'
		fabric.Object.prototype.cornerStyle = 'circle'
	})
</script>

<svelte:window />
<div id="canvasWrapper" class="absolute inset-0 h-screen w-full" bind:this={canvasWrapper}>
	<canvas id="canvas" bind:this={canvasElement} class="block" />
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
