<script lang="ts">
	import { colord, type HsvaColor, type RgbaColor } from 'colord';
	import { fly } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { rgbaToHsva } from '$lib/utils';

	export let rgba: RgbaColor = { r: 255, g: 255, b: 255, a: 1 };
	export let hex: string = '#ffffff';

	let hsva: HsvaColor = { h: 0, s: 0, v: 100, a: 1 };
	let colorIndicatorRadius = 4;
	let pickerPosition = { x: 0, y: 0 };
	let colorSliderPosition = { y: 0 }; // %
	let alphaSliderPosition = { y: 100 }; // %
	let colorBox: HTMLElement;
	let colorSlider: HTMLElement;
	let alphaSlider: HTMLElement;
	let isMouseDown = false;

	const handleActiveObjectColorChange = (hsva: HsvaColor) => {
		rgba = colord(hsva).toRgb();
	};

	const handleMouseDown = () => {
		isMouseDown = true;
	};

	const handleMouseUp = () => {
		isMouseDown = false;
	};
	const handleIndicatorMove = (e: MouseEvent, wrapper: HTMLElement) => {
		if (!isMouseDown) return;
		if (!wrapper || !e) return;
		const { width, height, left, top } = wrapper.getBoundingClientRect();
		let x = e.clientX - left - colorIndicatorRadius;
		let y = e.clientY - top - colorIndicatorRadius;
		if (x <= 0) {
			x = 0;
		}
		if (x >= width - colorIndicatorRadius * 2) {
			x = width - colorIndicatorRadius * 2;
		}
		if (y <= 0) {
			y = 0;
		}
		if (y >= height - colorIndicatorRadius * 2) {
			y = height - colorIndicatorRadius * 2;
		}

		return { x, y };
	};

	const handleColorPickerValue = (value: { x: number; y: number } | undefined) => {
		if (!value) return;
		pickerPosition = value;
	};

	const handleSliderValue = (value: { y: number } | undefined) => {
		if (!value) return;
		colorSliderPosition = value;
	};
	const handleAlphaSliderValue = (value: { y: number } | undefined) => {
		if (!value) return;
		alphaSliderPosition = value;
	};

	const handleIndicatorMoveWithVertical = (e: MouseEvent, wrapper: HTMLElement) => {
		if (!isMouseDown) return;
		if (!wrapper || !e) return;
		const { top, height } = wrapper.getBoundingClientRect();
		let h = e.clientY - top - colorIndicatorRadius;
		if (h <= 0) {
			h = 0;
		}
		if (h >= height - colorIndicatorRadius * 2) {
			h = height - colorIndicatorRadius * 2;
		}
		let y = (h / height) * 100;
		return { y };
	};

	const handleCalcColor = (position: { x: number; y: number }) => {
		let s = Math.min(Math.max(0, position.x / colorBox.getBoundingClientRect().width), 1) * 100;
		let v =
			Math.min(
				Math.max(
					0,
					(colorBox.getBoundingClientRect().height - position.y) /
						colorBox.getBoundingClientRect().height,
				),
				1,
			) * 100;
		hsva.s = s;
		hsva.v = v;
	};
	const handleCalcColorWithSlider = (colorSliderPosition: { y: number }) => {
		if (!colorSlider || !hsva) return;
		let h = colorSliderPosition.y * 3.6;
		hsva.h = h;
	};

	const handleCalcAlphaValue = (alphaSliderPosition: { y: number }) => {
		if (!alphaSlider || !hsva) return;
		let a = alphaSliderPosition.y / 100;
		hsva.a = a;
	};

	const handleColorBoxPickerPosition = (rgba: RgbaColor) => {
		let x = (hsva.s / 100) * colorBox.getBoundingClientRect().width;
		let y =
			colorBox.getBoundingClientRect().height -
			(hsva.v / 100) * colorBox.getBoundingClientRect().height;
		const position = { x, y };
		pickerPosition = position;
	};
	const handleSliderPickerPosition = (rgba: RgbaColor) => {
		if (colorSlider) {
			let y = hsva.h / 3.6;
			const position = { y };
			colorSliderPosition = position;
		}
	};

	const handleAlphaSliderPosition = (rgba: RgbaColor) => {
		if (alphaSlider) {
			let y = hsva.a * 100;
			const position = { y };
			alphaSliderPosition = position;
		}
	};

	$: hsva = rgbaToHsva(rgba);
	$: colorBox && handleColorBoxPickerPosition(rgba);
	$: colorBox && handleSliderPickerPosition(rgba);
	$: colorBox && handleAlphaSliderPosition(rgba);
	$: colorBox && handleCalcColor(pickerPosition);
	$: colorSlider && handleCalcColorWithSlider(colorSliderPosition);
	$: alphaSlider && handleCalcAlphaValue(alphaSliderPosition);
	$: handleActiveObjectColorChange(hsva);
	$: hex = colord(hsva).toHex();
	$: console.log(hsva);

	onMount(() => {});
</script>

<svelte:window on:mouseup={handleMouseUp} />
<div
	transition:fly={{ y: -200, duration: 500 }}
	class="모달 absolute -top-28 left-0 z-30 flex h-32 w-full items-center rounded-md bg-base-300 bg-opacity-90 p-3 shadow-xl"
>
	<div class="flex h-full w-full space-x-3">
		<div
			on:mousedown={handleMouseDown}
			on:mousemove={(e) => {
				handleColorPickerValue(handleIndicatorMove(e, colorBox));
			}}
			on:mouseup={handleMouseUp}
			bind:this={colorBox}
			class="colorBox relative h-full w-24 rounded-md  focus:cursor-grab"
			style="--bg-color:{hex};"
		>
			<div
				on:mousedown={(e) => {
					if (e.button !== 0) return;
					isMouseDown = true;
				}}
				class="absolute rounded-full bg-base-500"
				style="width:{colorIndicatorRadius * 2}px; height:{colorIndicatorRadius *
					2}px; translate(0, 0); left:{pickerPosition.x}px; top:{pickerPosition.y}px;"
			/>
		</div>
		<!-- color slider -->
		<div
			bind:this={colorSlider}
			on:mouseup={handleMouseUp}
			on:mousedown={handleMouseDown}
			on:mousemove={(e) => {
				handleSliderValue(handleIndicatorMoveWithVertical(e, colorSlider));
			}}
			class="slider relative h-full w-3 rounded-md"
			style=""
		>
			<div
				on:mousedown={handleMouseDown}
				class="z-1 absolute left-0 right-0 m-auto cursor-grab
							rounded-full bg-base-500"
				style="width:{colorIndicatorRadius * 2}px; height:{colorIndicatorRadius *
					2}px; translate(0, 0); top:{colorSliderPosition.y}%;"
			/>
		</div>
		<!-- alpha slider -->
		<div
			bind:this={alphaSlider}
			on:mouseup={handleMouseUp}
			on:mousedown={handleMouseDown}
			on:mousemove={(e) => {
				handleAlphaSliderValue(handleIndicatorMoveWithVertical(e, alphaSlider));
			}}
			class="alpha relative h-full w-3 rounded-md before:absolute before:inset-0 before:z-0 before:rounded-md before:content-['']"
			style="--alpha-color: {hex}"
		>
			<div
				on:mousedown={handleMouseDown}
				class="쩜 z-1 absolute left-0 right-0 mx-auto cursor-grab 
						rounded-full bg-base-500"
				style="width:{colorIndicatorRadius * 2}px; height:{colorIndicatorRadius *
					2}px; translate(0, 0); top:{alphaSliderPosition.y}%;"
			/>
		</div>
	</div>
</div>

<style>
	.colorBox {
		background: linear-gradient(#ffffff00, #000000ff),
			linear-gradient(0.25turn, #ffffffff, #00000000), var(--bg-color);
	}
	.slider {
		--gradient: #ff0000, #ffff00 17.2%, #ffff00 18.2%, #00ff00 33.3%, #00ffff 49.5%, #00ffff 51.5%,
			#0000ff 67.7%, #ff00ff 83.3%, #ff0000;
		background: linear-gradient(var(--gradient));
	}
	.alpha:before {
		background: linear-gradient(#00000000, var(--alpha-color));
	}
	.alpha {
		background-image: linear-gradient(45deg, #eee 25%, transparent 25%, transparent 75%, #eee 75%),
			linear-gradient(45deg, #eee 25%, transparent 25%, transparent 75%, #eee 75%);
		background-size: var(--pattern-size-2x, 12px) var(--pattern-size-2x, 12px);
		background-position: 0 0, var(--pattern-size, 6px) var(--pattern-size, 6px);
	}
</style>
