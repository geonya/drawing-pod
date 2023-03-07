<script lang="ts">
	import { fabric } from 'fabric';
	import { fabricCanvas } from '$lib/store';
	import { onDestroy, onMount } from 'svelte';
	let canvasWrapper: HTMLElement;
	function onResize() {
		$fabricCanvas?.setDimensions({
			width: window.innerWidth,
			height: window.innerHeight,
		});
		$fabricCanvas?.calcOffset();
	}
	$: console.log($fabricCanvas);
	onMount(() => {
		$fabricCanvas = new fabric.Canvas('canvas', {
			width: canvasWrapper.getBoundingClientRect().width,
			height: canvasWrapper.getBoundingClientRect().height,
			snapAngle: 0,
			fireRightClick: true,
			preserveObjectStacking: true,
			backgroundColor: 'rgba(255,255,255,1)',
		});
	});
	onDestroy(() => {
		$fabricCanvas?.off('resizing', onResize);
	});
</script>

<svelte:window on:resize={onResize} />
<div class="fixed inset-0 h-full w-full" bind:this={canvasWrapper}>
	<canvas id="canvas" />
</div>
{#if $fabricCanvas}
	<slot />
{:else}
	initializing...
{/if}

<style>
</style>
