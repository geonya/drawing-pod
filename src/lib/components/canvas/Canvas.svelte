<script lang="ts">
	import { fabric } from 'fabric';
	import { canvas } from '$lib/store';
	import { onMount } from 'svelte';
	let canvasWrapper: HTMLElement;
	function onResize() {
		if (!$canvas) return;
		$canvas.setDimensions({
			width: window.innerWidth,
			height: window.innerHeight,
		});
		$canvas.calcOffset();
	}
	onMount(() => {
		$canvas = new fabric.Canvas('canvas', {
			width: canvasWrapper.getBoundingClientRect().width,
			height: canvasWrapper.getBoundingClientRect().height,
			snapAngle: 0,
			fireRightClick: true,
			preserveObjectStacking: true,
			backgroundColor: 'rgba(255,255,255,1)',
		});
	});
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
