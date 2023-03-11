<script lang="ts">
	import Picker from './Picker.svelte'
	import Slider from './Slider.svelte'
	import AlphaSlider from './AlphaSlider.svelte'
	import { createEventDispatcher, onMount } from 'svelte'
	import { hsvaToStringRgba, stringRgbaToHsva } from '$lib/utils'
	import { shape } from '../canvas/Renderer'
	import { PaintType } from '$lib/types'

	const dispatcher = createEventDispatcher()

	export let paintType: PaintType
	export let color: string | null | undefined =
		paintType === PaintType.FILL ? $shape?.fill : $shape?.stroke

	let bgColor: string

	$: {
		if (color) {
			dispatcher('colorUpdate', { paintType, color })
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
