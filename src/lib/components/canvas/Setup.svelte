<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	export let canvas: fabric.Canvas;

	const onResize = () => {
		if (typeof window === 'undefined') return;
		canvas.setDimensions({
			width: window.innerWidth,
			height: window.innerHeight,
		});
	};

	onMount(() => {
		canvas.on('resizing', onResize);
	});
	onDestroy(() => {
		canvas.off('resizing', onResize);
	});
</script>

<svelte:window on:resize={onResize} />
<div data-id="setup" style="display: none;" />
<slot />
