<script lang="ts">
	import { hsvaToRgba } from '$lib/utils';
	import type { HsvaColor } from 'colord';
	import { onMount } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { hsva } from './colorStore';

	interface RatioPositionXY {
		xRatio: number;
		yRatio: number;
	}
	let pickerBg: HTMLElement;
	let pickerBgRect: DOMRect;
	let isMouseDown = false;
	const dotRadius = 6;
	let dotRadiusRatio: RatioPositionXY = { xRatio: 0, yRatio: 0 };
	let pickerPosition: RatioPositionXY = { xRatio: 0, yRatio: 0 };

	$: pickerBgColor = hsvaToRgba($hsva);
	$: {
		const sv = positionToHsva(pickerPosition);
		hsva.update((hsva) => ({ ...hsva, ...sv }));
	}

	const handleMouseDown = () => {
		isMouseDown = true;
	};
	const handleMouseUp = () => {
		isMouseDown = false;
	};
	const handleMouseMove = (e: MouseEvent) => {
		if (isMouseDown === false) return;
		if (!pickerBgRect) return;
		const { clientX, clientY } = e;
		const { left, top, width, height } = pickerBgRect;
		let [offsetX, offsetY] = [clientX - left, clientY - top];
		if (offsetX <= dotRadius) {
			offsetX = dotRadius;
		}
		if (offsetX >= width - dotRadius) {
			offsetX = width - dotRadius;
		}
		if (offsetY <= dotRadius) {
			offsetY = dotRadius;
		}
		if (offsetY >= height - dotRadius) {
			offsetY = height - dotRadius;
		}
		pickerPosition = { xRatio: (offsetX / width) * 100, yRatio: (offsetY / height) * 100 };
	};

	// TODO: 만약 꼭지점 끝가지 간다면 s 랑 v 값을 극단까지 지정할 수 있는가?
	const hsvaToPickerPosition = (hsva: HsvaColor): RatioPositionXY => {
		if (!hsva) return { xRatio: 0, yRatio: 0 };
		const position = { ...pickerPosition };
		const { s, v } = hsva as { s: number; v: number };
		position.xRatio = (s / 360) * 100;
		position.yRatio = (v / 100) * 100;
		if (s === 0) {
			position.xRatio = dotRadiusRatio.xRatio;
		}
		if (v === 0) {
			position.yRatio = dotRadiusRatio.yRatio;
		}
		if (s >= 360) {
			position.xRatio = 100 - dotRadiusRatio.xRatio;
		}
		if (v >= 100) {
			position.yRatio = 100 - dotRadiusRatio.yRatio;
		}

		return position;
	};

	const positionToHsva = (_position: RatioPositionXY) => {
		const position = { ..._position };
		const { xRatio, yRatio } = position;
		let s = (xRatio / 100) * 360;
		let v = (yRatio / 100) * 100;
		if (xRatio <= dotRadiusRatio.xRatio) {
			s = 0;
		}
		if (xRatio >= 100 - dotRadiusRatio.xRatio) {
			s = 360;
		}
		if (yRatio <= dotRadiusRatio.yRatio) {
			v = 0;
		}
		if (yRatio >= 100 - dotRadiusRatio.yRatio) {
			v = 100;
		}
		return { s, v };
	};
	onMount(() => {
		pickerBgRect = pickerBg.getBoundingClientRect();
		if (!pickerBgRect) return;
		dotRadiusRatio = {
			xRatio: (dotRadius / pickerBgRect.width) * 100,
			yRatio: (dotRadius / pickerBgRect.height) * 100,
		};
		pickerPosition = { xRatio: dotRadiusRatio.xRatio, yRatio: dotRadiusRatio.yRatio };
		pickerPosition = hsvaToPickerPosition($hsva);
	});
</script>

<svelte:window on:mouseup={handleMouseUp} />
<div class="p-5" id="pickerBgWrapper" on:mousemove={handleMouseMove}>
	<div
		class="relative h-32 w-32"
		id="pickerBg"
		style="--bg-color:{pickerBgColor};"
		on:mousedown|self={handleMouseDown}
		bind:this={pickerBg}
	>
		<div
			on:mousedown|self={handleMouseDown}
			id="pickerDot"
			class="absolute rounded-full bg-red-400"
			style="width:{dotRadius * 2}px; height:{dotRadius * 2}px; top:{pickerPosition.yRatio -
				dotRadiusRatio.yRatio}%; left:{pickerPosition.xRatio - dotRadiusRatio.xRatio}%;"
		/>
	</div>
</div>

<style>
	#pickerBg {
		background: linear-gradient(#ffffff00, #000000ff),
			linear-gradient(0.25turn, #ffffffff, #00000000), rgba(0, 0, 0, 1);
	}
	/* your styles go here */
</style>
