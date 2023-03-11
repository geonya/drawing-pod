<script lang="ts">
	import { onMount } from 'svelte'
	import { DOT_RADIUS } from './constants'
	import { hsvaToStringRgba, stringRgbaToHsva } from '$lib/utils'
	import type { HsvaColor } from 'colord'

	export let hsva: HsvaColor
	export let bgColor: string

	let slider: HTMLElement
	let isMouseDown = false
	let sliderRect: DOMRect
	const dotRadius = DOT_RADIUS
	let dotRadiusRatio: number
	let sliderPositionRatio: number

	const updateColor = (h: number) => {
		const newHsva = { ...hsva, h }
		hsva = newHsva
		const bgHsva = { h, s: 100, v: 100, a: 1 }
		bgColor = hsvaToStringRgba(bgHsva)
	}

	const handleMouseDown = () => {
		isMouseDown = true
	}
	const handleMouseUp = () => {
		isMouseDown = false
	}
	const handleMouseMove = (e: MouseEvent) => {
		if (isMouseDown === false) return
		if (!sliderRect) return
		const { clientY } = e
		const { top, height } = sliderRect
		sliderPositionRatio = ((clientY - top) / height) * 100
		if (sliderPositionRatio <= dotRadiusRatio) sliderPositionRatio = dotRadiusRatio
		if (sliderPositionRatio >= 100 - dotRadiusRatio) sliderPositionRatio = 100 - dotRadiusRatio
		const h = setHValue(sliderPositionRatio)
		updateColor(h)
	}
	const hsvaToSliderPosition = (h: number) => {
		let vRatio = (h / 360) * 100
		if (h === 0) {
			vRatio = dotRadiusRatio
		}
		if (h === 360) {
			vRatio = 100 - dotRadiusRatio
		}
		return vRatio
	}
	const setHValue = (position: number) => {
		let h = (position / 100) * 360
		if (position === dotRadiusRatio) h = 0
		if (position === 100 - dotRadiusRatio) h = 360
		return h
	}

	onMount(() => {
		sliderRect = slider.getBoundingClientRect()
		if (!sliderRect.height) return
		dotRadiusRatio = (dotRadius / sliderRect.height) * 100
		if (dotRadiusRatio) {
			sliderPositionRatio = hsvaToSliderPosition(hsva.h)
		}
	})
</script>

<!-- color slider -->
<svelte:window on:mouseup={handleMouseUp} />
<div class="sliderWrapper h-full w-full select-none p-[2px]" on:mousemove={handleMouseMove}>
	<div
		bind:this={slider}
		on:mousedown={handleMouseDown}
		class="slider relative h-full w-3 rounded-md"
		style=""
	>
		{#if sliderPositionRatio && dotRadiusRatio}
			<div
				on:mousedown={handleMouseDown}
				class="sliderDot z-1 absolute left-0 right-0 m-auto cursor-grab
							rounded-full bg-base-500"
				style="width:{dotRadius * 2}px; height:{dotRadius *
					2}px; translate(0, 0); top:{sliderPositionRatio - dotRadiusRatio}%;"
			/>
		{/if}
	</div>
</div>

<style>
	.slider {
		--gradient: #ff0000, #ffff00 17.2%, #ffff00 18.2%, #00ff00 33.3%, #00ffff 49.5%, #00ffff 51.5%,
			#0000ff 67.7%, #ff00ff 83.3%, #ff0000;
		background: linear-gradient(var(--gradient));
	}
</style>
