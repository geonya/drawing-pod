<script lang="ts">
	import { onMount } from 'svelte';
	import { DOT_RADIUS } from './constants';
	import { hsvaToStringRgba, stringRgbaToHsva } from '$lib/utils';

	export let color: string;
	export let bgColor: string;

	let sliderWrapper: HTMLElement;
	let slider: HTMLElement;
	let isMouseDown = false;
	let sliderRect: DOMRect;
	const dotRadius = DOT_RADIUS;
	let dotRadiusRatio: number;
	let sliderPositionRatio: number;

	const updateColor = (a: number) => {
		const hsva = stringRgbaToHsva(color);
		const newHsva = { ...hsva, a };
		color = hsvaToStringRgba(newHsva);
	};

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
		const a = setAValue(sliderPositionRatio);
		updateColor(a);
	};
	const hsvaToSliderPosition = (a: number) => {
		let vRatio = a * 100;
		if (a === 0) {
			vRatio = dotRadiusRatio;
		}
		if (a === 1) {
			vRatio = 100 - dotRadiusRatio;
		}
		return vRatio;
	};
	const setAValue = (position: number) => {
		if (position === dotRadiusRatio) return 0;
		if (position === 100 - dotRadiusRatio) return 1;
		return position / 100;
	};

	onMount(() => {
		sliderRect = slider.getBoundingClientRect();
		if (sliderRect.height) {
			dotRadiusRatio = (dotRadius / sliderRect.height) * 100;
			if (dotRadiusRatio) {
				const hsva = stringRgbaToHsva(color);
				sliderPositionRatio = hsvaToSliderPosition(hsva.a);
			}
		}
	});
</script>

<svelte:window on:mouseup={handleMouseUp} />
<div
	class="sliderWrapper h-full w-full select-none p-1"
	bind:this={sliderWrapper}
	on:mousemove={handleMouseMove}
>
	<div
		bind:this={slider}
		on:mousedown={handleMouseDown}
		class="alpha relative h-full w-3 rounded-md before:absolute before:inset-0 before:z-0 before:rounded-md before:content-['']"
		style="--alpha-color: {bgColor || color}; --pathern-size:5px"
	>
		{#if sliderPositionRatio && dotRadiusRatio}
			<div
				on:mousedown={handleMouseDown}
				class="alphaDot z-1 absolute left-0 right-0 m-auto cursor-grab
							rounded-full bg-base-500"
				style="width:{dotRadius * 2}px; height:{dotRadius *
					2}px; translate(0, 0); top:{sliderPositionRatio - dotRadiusRatio}%;"
			/>
		{/if}
	</div>
</div>

<style>
	.alpha:before {
		background: linear-gradient(#00000000, var(--alpha-color));
	}
	.alpha {
		background-image: linear-gradient(45deg, #eee 25%, transparent 25%, transparent 75%, #eee 75%),
			linear-gradient(45deg, #eee 25%, transparent 25%, transparent 75%, #eee 75%);
		background-size: var(--pattern-size-2x, 12px) var(--pattern-size-2x, 12px);
		background-position: 0 0, var(--pattern-size, 6px) var(--pattern-size, 6px);
	}
</style>
