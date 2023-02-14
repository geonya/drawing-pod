<script lang="ts">
	let hex: any;
	let colorBg = '#ffffff';
	let picker: HTMLElement;
	let s: number;
	let v: number;
	let isMouseDown = false;

	let pos = { x: 0, y: 0 };
	let pickerSize = {
		width: 200,
		height: 200,
	};

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

	const onClick = (e: Pick<MouseEvent, 'offsetX' | 'offsetY'>) => {
		let mouse = { x: e.offsetX, y: e.offsetY };
		let width = picker.getBoundingClientRect().width;
		let height = picker.getBoundingClientRect().height;
		s = Math.min(Math.max(0, mouse.x / width), 1) * 100;
		v = Math.min(Math.max(0, mouse.y / height), 1) * 100;
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

	$: if (typeof s === 'number' && typeof v === 'number' && picker) {
		pos = {
			x: s,
			y: v,
		};
		// console.log(s, v);
	}
	// pos = %
</script>

<div>
	<input type="hidden" value={hex} />
</div>
<div
	class="h-[{pickerSize.height}px] w-[{pickerSize.width}px] overflow-hidden shadow-md"
	on:mouseup={mouseUp}
	on:mousedown={pickerMouseDown}
	on:mousemove={mouseMove}
>
	<div
		bind:this={picker}
		class="color-picker-gradient relative h-full w-full"
		style="--color-bg:{colorBg};"
	>
		<div
			class="absolute h-[10px] w-[10px] rounded-full bg-gray-600 shadow-md"
			style={`left: calc(${(pos.x / 200) * 186}% + 2px); top: calc(${(pos.y / 200) * 186}% + 2px);`}
		/>
	</div>
</div>

<style>
	.color-picker-gradient {
		background: linear-gradient(#ffffff00, #000000ff),
			linear-gradient(0.25turn, #ffffffff, #00000000), var(--color-bg);
	}
</style>
