<script lang="ts">
	import Picker from './Picker.svelte'
	import Slider from './Slider.svelte'
	import AlphaSlider from './AlphaSlider.svelte'
	import { createEventDispatcher, onMount } from 'svelte'
	import { hsvaToStringRgba, stringRgbaToHsva } from '$lib/utils'
	import { shape } from '../canvas/Renderer'
	import { PaintType } from '$lib/types'
	import type { HsvaColor } from 'colord'

	export let paintType: PaintType
	export let color: string | null | undefined =
		paintType === PaintType.FILL ? $shape?.fill : $shape?.stroke

	let hsva: HsvaColor | null
	let bgColor: string

	$: hsva = color ? stringRgbaToHsva(color) : null

	$: {
		if (hsva) {
			handleBgColorUpdate(hsva)
			dispatcher('colorUpdate', { paintType, color: hsvaToStringRgba(hsva) })
		}
	}

	const dispatcher = createEventDispatcher()
	const handleBgColorUpdate = (hsva: HsvaColor) => {
		const bgHsva = { h: hsva.h, s: 100, v: 100, a: 1 }
		bgColor = hsvaToStringRgba(bgHsva)
	}
</script>

<div id="baseModal" class="z-10 grid h-48 w-full grid-cols-7 space-x-3 rounded-md p-1 ">
	{#if hsva}
		<div id="pickerWrapper" class="col-span-5 grid h-full w-full place-content-center">
			<Picker bind:hsva {bgColor} />
		</div>
		<div class="col-span-2 grid h-full w-full grid-flow-col">
			<div id="colorSliderWrapper" class="h-full w-full">
				<Slider bind:hsva bind:bgColor />
			</div>
			<div id="alphaSliderWrapper" class="h-full w-full">
				<AlphaSlider bind:hsva />
			</div>
		</div>
	{/if}
</div>
