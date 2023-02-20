<script lang="ts">
	import { fly } from 'svelte/transition';
	import Picker from './Picker.svelte';
	import Slider from './Slider.svelte';
</script>

<div
	transition:fly={{ y: -200, duration: 500 }}
	id="baseModal"
	class="t-0 absolute left-0 z-30 flex h-60 w-60 items-center space-x-3 rounded-md bg-base-300 bg-opacity-90 px-5 shadow-xl"
>
	<div id="pickerWrapper" class=""><Picker /></div>
	<div id="colorSliderWrapper"><Slider /></div>
	<div id="alphaSliderWrapper"><Slider /></div>
</div>
