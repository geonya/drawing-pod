<script lang="ts">
	import { DOT_RADIUS } from './constants';

	let sliderWrapper: HTMLElement;
	let slider: HTMLElement;
	let isMouseDown = false;
	const dotRadius = DOT_RADIUS;
	let sliderPositionRatio = 0;
	const handleMouseDown = () => {
		isMouseDown = true;
	};
	const handleMouseUp = () => {
		isMouseDown = false;
	};
	const handleMouseMove = () => {
		if (isMouseDown === false) return;
		console.log('mouse move');
	};
</script>

<!-- color slider -->
<svelte:window on:mouseup={handleMouseUp} />
<div class="" bind:this={sliderWrapper} on:mousemove />
<div
	bind:this={slider}
	on:mousedown={handleMouseDown}
	class="slider relative h-full w-3 rounded-md"
	style=""
>
	<div
		on:mousedown={handleMouseDown}
		class="z-1 absolute left-0 right-0 m-auto cursor-grab
							rounded-full bg-base-500"
		style="width:{dotRadius * 2}px; height:{dotRadius *
			2}px; translate(0, 0); top:{sliderPositionRatio}%;"
	/>
</div>

<style>
	.slider {
		--gradient: #ff0000, #ffff00 17.2%, #ffff00 18.2%, #00ff00 33.3%, #00ffff 49.5%, #00ffff 51.5%,
			#0000ff 67.7%, #ff00ff 83.3%, #ff0000;
		background: linear-gradient(var(--gradient));
	}
</style>
