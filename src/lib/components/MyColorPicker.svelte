<script lang="ts">
	import { Colord, colord } from 'colord';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
	let colorBg: string = '#ff0000';
	let picker: HTMLElement;
	let s: number;
	let v: number;
	let isMouseDown = false;
	let pos = { x: 100, y: 0 };
	let pickerSize = {
		width: 200,
		height: 200,
	};
	let alpha: HTMLElement;
	let rgba = { r: 255, g: 0, b: 0, a: 1 };
	let hsv = { h: 0, s: 100, v: 100, a: 1 };
	let hex = '#ffffff';
	let _rgba = { r: 255, g: 0, b: 0, a: 1 };
	let _hsv = { h: 0, s: 100, v: 100, a: 1 };
	let _hex = '#ff0000';

	let color: Colord | undefined;
	let sliderH = 0;
	let sliderPos = 0;
	let slider: HTMLElement;
	let isSliderMouseDown = false;
	let alphaH = 1;
	let alphaPos = 100;
	let isAlphaMouseDown = false;

	const limitMousePosition = (e: MouseEvent) => ({
		offsetX: Math.max(
			0,
			Math.min(
				picker.getBoundingClientRect().width,
				e.clientX - picker.getBoundingClientRect().left,
			),
		),
		offsetY: Math.max(
			0,
			Math.min(
				picker.getBoundingClientRect().height,
				e.clientY - picker.getBoundingClientRect().top,
			),
		),
	});

	const getAlphaPosition = (e: MouseEvent) => {
		return e.clientY - alpha.getBoundingClientRect().top;
	};

	const alphaOnClick = (pos: number) => {
		const size = alpha.getBoundingClientRect().height;
		const indicatorPos = Math.max(0, Math.min(size, pos));
		alphaH = hsv.a = indicatorPos / size;
	};

	const alphaMouseDown = (e: MouseEvent) => {
		if (e.button === 0) {
			isAlphaMouseDown = true;
			alphaOnClick(getAlphaPosition(e));
		}
	};
	const alphaMouseMove = (e: MouseEvent) => {
		if (isAlphaMouseDown) {
			alphaOnClick(getAlphaPosition(e));
		}
	};

	const alphaMouseUp = () => {
		isAlphaMouseDown = false;
	};

	const getSliderPostion = (e: MouseEvent) => {
		return e.clientY - slider.getBoundingClientRect().top;
	};

	const sliderOnClick = (pos: number) => {
		const size = slider.getBoundingClientRect().height;
		const boundedPos = Math.max(0, Math.min(size, pos));
		sliderH = hsv.h = (boundedPos / size) * 360;
	};

	const sliderMouseDown = (e: MouseEvent) => {
		if (e.button === 0) {
			isSliderMouseDown = true;
			sliderOnClick(getSliderPostion(e));
		}
	};
	const sliderMouseUp = () => {
		isSliderMouseDown = false;
	};
	const sliderMouseMove = (e: MouseEvent) => {
		if (isSliderMouseDown) {
			sliderOnClick(getSliderPostion(e));
		}
	};

	const onClick = (e: Pick<MouseEvent, 'offsetX' | 'offsetY'>) => {
		let mouse = { x: e.offsetX, y: e.offsetY };
		let width = picker.getBoundingClientRect().width;
		let height = picker.getBoundingClientRect().height;
		s = hsv.s = Math.min(Math.max(0, mouse.x / width), 1) * 100;
		v = hsv.v = Math.min(Math.max(0, (height - mouse.y) / height), 1) * 100;
	};
	const pickerMouseDown = (e: MouseEvent) => {
		if (e.button === 0) {
			isMouseDown = true;
			onClick(limitMousePosition(e));
		}
	};
	const mouseUp = () => {
		isMouseDown = false;
	};

	const mouseMove = (e: MouseEvent) => {
		if (isMouseDown) {
			onClick(limitMousePosition(e));
		}
	};

	const updateColor = () => {
		if (
			hsv.h === _hsv.h &&
			hsv.s === _hsv.s &&
			hsv.v === _hsv.v &&
			hsv.a === _hsv.a &&
			rgba.r === _rgba.r &&
			rgba.g === _rgba.g &&
			rgba.b === _rgba.b &&
			rgba.a === _rgba.a &&
			hex === _hex
		) {
			return;
		}
		if (hsv.a === undefined) hsv.a = 1;
		if (_hsv.a === undefined) _hsv.a = 1;
		if (rgba.a === undefined) rgba.a = 1;
		if (_rgba.a === undefined) _rgba.a = 1;
		if (hex?.substring(7) === 'ff') hex = hex.substring(0, 7);
		if (hex?.substring(7) === 'ff') hex = hex.substring(0, 7);
		// check which color format changed and updates the others accordingly
		if (hsv.h !== _hsv.h || hsv.s !== _hsv.s || hsv.v !== _hsv.v || hsv.a !== _hsv.a) {
			color = colord(hsv);
			rgba = color.toRgb();
			hex = color.toHex();
		} else if (
			rgba.r !== _rgba.r ||
			rgba.g !== _rgba.g ||
			rgba.b !== _rgba.b ||
			rgba.a !== _rgba.a
		) {
			color = colord(rgba);
			hex = color.toHex();
			hsv = color.toHsv();
		} else if (hex !== _hex) {
			color = colord(hex);
			rgba = color.toRgb();
			hsv = color.toHsv();
		}
		// update old colors
		_hsv = Object.assign({}, hsv);
		_rgba = Object.assign({}, rgba);
		_hex = hex;

		dispatch('colorChange', { color, hsv, rgba, hex });
	};

	$: if (typeof s === 'number' && typeof v === 'number' && picker) {
		pos = {
			x: s,
			y: 100 - v,
		};
		// console.log(s, v);
	}
	// pos = %

	$: if (typeof sliderH === 'number' && slider) {
		sliderPos = (100 * sliderH) / 360;
	}

	$: if (typeof hsv.h === 'number') {
		colorBg = colord({ h: hsv.h, s: 100, v: 100, a: 1 }).toHex();
	}
	$: if (typeof alphaH === 'number' && alpha) {
		alphaPos = 100 * alphaH;
	}

	$: if (hsv || rgba || hex) {
		updateColor();
	}
</script>

<div class="flex h-full w-full justify-center space-x-2">
	<!-- <input type="hidden" value={hex} class="hidden" /> -->
	<div
		class="overflow-hidden shadow-md"
		style="width:{pickerSize.width}px; height:{pickerSize.height}px"
	>
		<div
			on:mouseup={mouseUp}
			on:mousedown={pickerMouseDown}
			on:mousemove={mouseMove}
			bind:this={picker}
			class="picker color-picker-gradient relative h-full w-full"
			style="--color-bg:{colorBg};"
		>
			<div
				class="absolute h-[10px] w-[10px] rounded-full bg-gray-600 shadow-md"
				style={`left: calc(${(pos.x / 200) * 186}% + 2px); top: calc(${
					(pos.y / 200) * 186
				}% + 2px);`}
			/>
		</div>
	</div>
	<div
		class="slider-wrapper inline-block h-[200px] w-[20px] select-none overflow-hidden rounded-sm"
	>
		<div
			on:mousedown={sliderMouseDown}
			on:mousemove={sliderMouseMove}
			on:mouseup={sliderMouseUp}
			aria-valuemin={0}
			aria-valuemax={360}
			aria-valuenow={Math.round(sliderH)}
			class="slider relative h-full w-full select-none outline-none"
			bind:this={slider}
		>
			<div
				class="slider-indicator z-1 pointer-events-none absolute left-1/2 box-border h-[10px] w-[10px] -translate-x-1/2 transform rounded-full bg-white"
				style={`top:calc(${(sliderPos / 200) * 186}% + 2px)`}
			/>
		</div>
	</div>
	<div class="alpha-wrapper inline-block h-[200px] w-[20px] select-none overflow-hidden rounded-sm">
		<div
			on:mousedown={alphaMouseDown}
			on:mousemove={alphaMouseMove}
			on:mouseup={alphaMouseUp}
			bind:this={alpha}
			style="--alpha-color: {hex?.substring(0, 7)}"
			class="alpha"
		>
			<div
				class="z-1 pointer-events-none absolute left-1/2 box-border h-[9px] w-[9px] -translate-x-1/2 transform rounded-full bg-black"
				style={`top:calc(${(alphaPos / 200) * 186}% + 2px)`}
			/>
		</div>
	</div>
</div>

<style>
	.color-picker-gradient {
		background: linear-gradient(#ffffff00, #000000ff),
			linear-gradient(0.25turn, #ffffffff, #00000000), var(--color-bg);
	}
	.slider {
		--gradient: #ff0000, #ffff00 17.2%, #ffff00 18.2%, #00ff00 33.3%, #00ffff 49.5%, #00ffff 51.5%,
			#0000ff 67.7%, #ff00ff 83.3%, #ff0000;
		background: linear-gradient(var(--gradient));
	}
	.alpha:after {
		position: absolute;
		content: '';
		inset: 0;
		background: linear-gradient(#00000000, var(--alpha-color));
		z-index: 0;
	}
	.alpha {
		position: relative;
		width: 100%;
		height: 100%;
		background-image: linear-gradient(45deg, #eee 25%, transparent 25%, transparent 75%, #eee 75%),
			linear-gradient(45deg, #eee 25%, transparent 25%, transparent 75%, #eee 75%);
		background-size: var(--pattern-size-2x, 12px) var(--pattern-size-2x, 12px);
		background-position: 0 0, var(--pattern-size, 6px) var(--pattern-size, 6px);
		outline: none;
		user-select: none;
	}
</style>
