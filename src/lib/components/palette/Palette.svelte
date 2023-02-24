<script lang="ts">
	import type { ColorType, PaintType } from '$lib/types';
	import Picker from './Picker.svelte';
	import { shape, color } from '$lib/store';
	import { createEventDispatcher } from 'svelte';
	import Slider from './Slider.svelte';
	import type { HsvaColor } from 'colord';

	const dispatcher = createEventDispatcher();

	$: {
		if (_hsva) {
			const newColor = shape.updateShapeColor(_hsva, type);
			dispatcher('colorUpdate', { color: newColor, type });
		}
	}
	let _hsva: HsvaColor;
	export let type: PaintType;
	export let init: ColorType;

	let bgColor = init?.hex || 'rgba(0,0,0,0)';
</script>

<div
	id="baseModal"
	class="absolute top-0 left-0 z-30 grid h-52 w-full grid-cols-7 space-x-3 rounded-md bg-base-200 bg-opacity-95 p-1 shadow-xl"
>
	{#if init}
		<div id="pickerWrapper" class="col-span-5 grid h-full w-full place-content-center">
			<Picker {init} {bgColor} bind:_hsva />
		</div>
		<div class="col-span-2 grid h-full w-full grid-flow-col">
			<div id="colorSliderWrapper" class="h-full w-full">
				<Slider {init} bind:bgColor bind:_hsva />
			</div>
			<div class="h-full w-full">
				<!-- <AlphaSlider /> -->
			</div>
		</div>
	{/if}
</div>
