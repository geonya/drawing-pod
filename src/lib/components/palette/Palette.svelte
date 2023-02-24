<script lang="ts">
	import type { ColorType, PaintType } from '$lib/types';
	import Picker from './Picker.svelte';
	import { shape, color } from '$lib/store';
	import { createEventDispatcher } from 'svelte';
	import Slider from './Slider.svelte';
	import type { HsvaColor } from 'colord';
	import AlphaSlider from './AlphaSlider.svelte';

	export let type: PaintType;
	export let prevColor: ColorType | null;
	$: initHsva = prevColor ? prevColor.hsva : null;

	const dispatcher = createEventDispatcher();

	$: {
		if (_hsva) {
			const newColor = shape.updateShapeColor(_hsva, type);
			dispatcher('colorUpdate', { color: newColor, type });
		}
	}

	let _hsva: HsvaColor = { h: 0, s: 0, v: 100, a: 1 };
</script>

<div
	id="baseModal"
	class="absolute top-0 left-0 z-30 grid h-52 w-full grid-cols-7 space-x-3 rounded-md bg-base-200 bg-opacity-95 p-1 shadow-xl"
>
	{#if initHsva}
		<div id="pickerWrapper" class="col-span-5 grid h-full w-full place-content-center">
			<Picker {initHsva} bind:_hsva />
		</div>
		<div class="col-span-2 grid h-full w-full grid-flow-col">
			<div id="colorSliderWrapper" class="h-full w-full">
				<Slider {initHsva} bind:_hsva />
			</div>
			<div class="h-full w-full">
				<AlphaSlider {initHsva} bind:_hsva />
			</div>
		</div>
	{/if}
</div>
