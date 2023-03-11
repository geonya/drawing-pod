<script lang="ts">
	import Picker from './Picker.svelte'
	import Slider from './Slider.svelte'
	import AlphaSlider from './AlphaSlider.svelte'
	import { onMount } from 'svelte'
	import { rgbaChecker, hsvaToStringRgba, stringRgbaToHsva } from '$lib/utils'
	import { paletteColor } from '$lib/store'
	import type { PaintType } from '$lib/types'

	export let color: string
	export let type: PaintType

	let bgColor: string

	$: _color = rgbaChecker(color)

	$: {
		if (_color) {
			$paletteColor = {
				color: _color,
				type,
			}
		}
	}
	onMount(() => {
		if (color) {
			const { h } = stringRgbaToHsva(color)
			const bgHsva = { h, s: 100, v: 100, a: 1 }
			bgColor = hsvaToStringRgba(bgHsva)
		}
	})
</script>

<div id="baseModal" class="z-10 grid h-48 w-full grid-cols-7 space-x-3 rounded-md p-1 ">
	{#if color}
		<div id="pickerWrapper" class="col-span-5 grid h-full w-full place-content-center">
			<Picker bind:color {bgColor} />
		</div>
		<div class="col-span-2 grid h-full w-full grid-flow-col">
			<div id="colorSliderWrapper" class="h-full w-full">
				<Slider bind:color bind:bgColor />
			</div>
			<div id="alphaSliderWrapper" class="h-full w-full">
				<AlphaSlider bind:color />
			</div>
		</div>
	{/if}
</div>
