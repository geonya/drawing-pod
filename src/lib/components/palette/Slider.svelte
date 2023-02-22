<script lang="ts">
	import type { HsvaColor } from 'colord';
	import { createEventDispatcher, onMount } from 'svelte';
	import { DOT_RADIUS } from './constants';
	import { hsva } from './colorStore';
	import { hsvaToHex } from '$lib/utils';
	let sliderWrapper: HTMLElement;
	let slider: HTMLElement;
	let isMouseDown = false;
	let sliderRect: DOMRect;
	const dotRadius = DOT_RADIUS;
	let dotRadiusRatio = 0;
	let sliderPositionRatio = 0;

	const dispatch = createEventDispatcher();

	$: $hsva = positionToHsva(sliderPositionRatio);
	$: {
		handleHexColorForChangingPaletteColor(sliderPositionRatio);
	}
	const handleMouseDown = () => {
		isMouseDown = true;
	};
	const handleMouseUp = () => {
		isMouseDown = false;
	};
	const handleMouseMove = (e: MouseEvent) => {
		if (isMouseDown === false) return;
		if (!sliderRect) return;
		const { clientY } = e;
		const { top, height } = sliderRect;
		sliderPositionRatio = ((clientY - top) / height) * 100;
		if (sliderPositionRatio <= dotRadiusRatio) sliderPositionRatio = dotRadiusRatio;
		if (sliderPositionRatio >= 100 - dotRadiusRatio) sliderPositionRatio = 100 - dotRadiusRatio;
	};
	const hsvaToSliderPosition = (hsva: HsvaColor) => {
		const { h } = hsva as { h: number };
		let verticalRatio = (h / 360) * 100;
		if (h === 0) {
			verticalRatio = dotRadiusRatio;
		}
		if (h === 360) {
			verticalRatio = 100 - dotRadiusRatio;
		}
		return verticalRatio;
	};
	const positionToHsva = (postion: number) => {
		const _hsva = { ...$hsva };
		_hsva.h = (postion / 100) * 360;
		if (postion === dotRadiusRatio) _hsva.h = 0;
		if (postion === 100) _hsva.h = 360;
		return _hsva;
	};
	const handleHexColorForChangingPaletteColor = (position: number) => {
		const hsva = positionToHsva(position);
		const hex = hsvaToHex(hsva);
		console.log(hex);
		dispatch('changeSliderColor', { hex });
	};
	onMount(() => {
		sliderRect = slider.getBoundingClientRect();
		if (!sliderRect.height) return;
		dotRadiusRatio = (dotRadius / sliderRect.height) * 100;
		sliderPositionRatio = hsvaToSliderPosition($hsva);
	});
</script>

<!-- color slider -->
<svelte:window on:mouseup={handleMouseUp} />
<div
	class="sliderWrapper h-full w-full select-none p-1"
	bind:this={sliderWrapper}
	on:mousemove={handleMouseMove}
>
	<div
		bind:this={slider}
		on:mousedown={handleMouseDown}
		class="slider relative h-full w-3 rounded-md"
		style=""
	>
		<div
			on:mousedown={handleMouseDown}
			class="sliderDot z-1 absolute left-0 right-0 m-auto cursor-grab
							rounded-full bg-base-500"
			style="width:{dotRadius * 2}px; height:{dotRadius *
				2}px; translate(0, 0); top:{sliderPositionRatio - dotRadiusRatio}%;"
		/>
	</div>
</div>

<style>
	.slider {
		--gradient: #ff0000, #ffff00 17.2%, #ffff00 18.2%, #00ff00 33.3%, #00ffff 49.5%, #00ffff 51.5%,
			#0000ff 67.7%, #ff00ff 83.3%, #ff0000;
		background: linear-gradient(var(--gradient));
	}
</style>
