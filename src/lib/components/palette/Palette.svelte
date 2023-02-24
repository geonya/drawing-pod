<script lang="ts">
	import { PaintType } from '$lib/types';
	import { beforeUpdate, createEventDispatcher, onMount } from 'svelte';
	import type { HsvaColor } from 'colord';
	import { initialFillColor, initialStrokeColor, mutableColor, paletteBgColor } from '$lib/store';
	import Picker from './Picker.svelte';
	import Slider from './Slider.svelte';
	import AlphaSlider from './AlphaSlider.svelte';
	import { hsvaToHex } from '$lib/utils';
	import { onDestroy } from 'svelte';

	const dispatch = createEventDispatcher();

	export let type: PaintType;
	let initColor: HsvaColor;
	let bgColor: string;

	$: {
		if ($mutableColor) {
			const color = { ...$mutableColor };
			dispatch('requestColorRender', { color, type });
		}
	}

	$: bgColor = $paletteBgColor;

	beforeUpdate(() => {
		if (type === PaintType.FILL) {
			initColor = $initialFillColor;
		}
		if (type === PaintType.STROKE) {
			initColor = $initialStrokeColor;
		}
	});
	onMount(() => {
		bgColor = hsvaToHex(initColor);
	});

	onDestroy(() => {
		console.log('im destory');
	});
</script>

<div
	id="baseModal"
	class="absolute top-0 left-0 z-30 grid h-52 w-full grid-cols-7 space-x-3 rounded-md bg-base-200 bg-opacity-95 p-1 shadow-xl"
>
	{#if initColor && bgColor}
		<div id="pickerWrapper" class="col-span-5 grid h-full w-full place-content-center">
			<Picker {initColor} {bgColor} />
		</div>
		<div class="col-span-2 grid h-full w-full grid-flow-col">
			<div id="colorSliderWrapper" class="h-full w-full">
				<Slider {initColor} />
			</div>
			<div class="h-full w-full">
				<AlphaSlider {initColor} {bgColor} />
			</div>
		</div>
	{/if}
</div>
