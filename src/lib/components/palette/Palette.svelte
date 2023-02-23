<script lang="ts">
	import AlphaSlider from './AlphaSlider.svelte';
	import Picker from './Picker.svelte';
	import Slider from './Slider.svelte';
	import {
		colorChecker,
		hsvaToRgba,
		objectColorConvertToRgbaString,
		rgbaToHsva,
		stringifyRgba,
	} from '$lib/utils';
	import { ColorType } from '$lib/types';
	import { hsva } from './colorStore';
	import type { HsvaColor } from 'colord';
	import { , createEventDispatcher } from 'svelte';
	export let colorType: ColorType;

	const dispatch = createEventDispatcher();

	$: handleObjectColorUpdate($hsva);

	const objectColorExtractToHsva = (object: fabric.Object) => {
		let color = '';
		if (colorType === ColorType.FILL) {
			const value = object[ColorType.FILL];
			color = objectColorConvertToRgbaString(value);
		}
		if (colorType === ColorType.STROKE) {
			const value = object[ColorType.STROKE];
			color = objectColorConvertToRgbaString(value);
		}
		const rgba = colorChecker(color);
		const hsva = rgbaToHsva(rgba);
		return hsva;
	};

	const handleObjectColorUpdate = (hsva: HsvaColor) => {
		const rgba = hsvaToRgba(hsva);
		let stringRgba = stringifyRgba(rgba);
		if (colorType === ColorType.FILL) {
			dispatch('requestColorRender', {
				type: ColorType.FILL,
				value: stringRgba,
			});
		}
		if (colorType === ColorType.STROKE) {
			dispatch('requestColorRender', {
				type: ColorType.STROKE,
				value: stringRgba,
			});
		}
	};
</script>

<div
	id="baseModal"
	class="absolute top-0 left-0 z-30 grid h-52 w-full grid-cols-7 space-x-3 rounded-md bg-base-200 bg-opacity-95 p-1 shadow-xl"
>
	<div id="pickerWrapper" class="col-span-5 grid h-full w-full place-content-center">
		<Picker />
	</div>
	<div class="col-span-2 grid h-full w-full grid-flow-col">
		<div id="colorSliderWrapper" class="h-full w-full">
			<Slider />
		</div>
		<div class="h-full w-full">
			<AlphaSlider />
		</div>
	</div>
</div>
