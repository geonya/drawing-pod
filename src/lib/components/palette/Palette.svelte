<script lang="ts">
	import { fly } from 'svelte/transition';
	import Picker from './Picker.svelte';
	import Slider from './Slider.svelte';
	let paletteBgColor: string = '#FFFF00';
	$: bgColor = paletteBgColor;

	const handlePalletBgColor = (e: CustomEvent) => {
		paletteBgColor = e.detail.hex;
	};
	$: console.log(bgColor);
</script>

<div
	transition:fly={{ y: -200, duration: 500 }}
	id="baseModal"
	class="t-0 absolute left-0 z-30 flex h-60 w-60 items-center space-x-3 rounded-md bg-base-300 bg-opacity-90 px-5 shadow-xl"
>
	<div id="pickerWrapper" class="h-full w-full"><Picker {bgColor} /></div>
	<div id="colorSliderWrapper" class="h-full w-full">
		<Slider on:changeSliderColor={handlePalletBgColor} />
	</div>
</div>
