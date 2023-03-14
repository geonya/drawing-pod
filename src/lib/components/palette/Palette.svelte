<script lang="ts">
	import Picker from './Picker.svelte'
	import Slider from './Slider.svelte'
	import AlphaSlider from './AlphaSlider.svelte'
	import { inputColor, paletteColor } from './palette.store'
	import { get } from 'svelte/store'
	import { onMount } from 'svelte'

	onMount(() => {
		paletteColor.set(get(inputColor))
	})
</script>

<div id="baseModal" class="z-10 grid h-40 w-full grid-cols-7 space-x-2 rounded-md p-1 ">
	<div id="pickerWrapper" class="col-span-5 grid h-full w-full place-content-center">
		<Picker />
	</div>
	<div class="col-span-2 grid h-full w-full grid-flow-col">
		<div id="colorSliderWrapper" class="h-full w-full">
			<Slider />
		</div>
		<div id="alphaSliderWrapper" class="h-full w-full">
			<AlphaSlider />
		</div>
	</div>
</div>
