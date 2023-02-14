<script lang="ts">
	import { fabric } from 'fabric';
	import { onMount } from 'svelte';
	import ColorPicker, { type RgbaColor } from 'svelte-awesome-color-picker';
	import MyColorPicker from '../lib/components/MyColorPicker.svelte';

	const navHeight = 150;
	const minusHeight = -navHeight;
	let rgb: RgbaColor;

	let canvas: fabric.Canvas;
	let activeObject: fabric.Object | null = null;

	const updateSelection = () => {
		console.log('hello');
	};

	const addRect = () => {
		const rect = new fabric.Rect({
			left: window.innerWidth / 2 - 100,
			top: (window.innerHeight + minusHeight) / 2 - 100,
			fill: 'green',
			width: 200,
			height: 200,
		});
		canvas.add(rect);
	};
	const addCircle = () => {
		const circle = new fabric.Circle({
			left: window.innerWidth / 2 - 100,
			top: (window.innerHeight + minusHeight) / 2 - 100,
			// left: 300,
			// top: 300,
			fill: 'red',
			radius: 100,
		});
		canvas.add(circle);
	};

	const addText = () => {
		const textBox = new fabric.Textbox('Hello', {
			editable: true,
			width: 200,
			left: window.innerWidth / 2 - 100,
			top: (window.innerHeight + minusHeight) / 2 - 50,
		});
		canvas.add(textBox);
	};
	const handleSave = () => {
		const data = canvas.toJSON();
		const stringifiedData = JSON.stringify(data);
		localStorage.setItem('canvas-data', stringifiedData);
	};

	const handleSelect = () => {
		activeObject = canvas.getActiveObject();
	};

	const handleDelete = () => {
		if (!activeObject) return;
		canvas.remove(activeObject);
	};
	const handleBringForward = () => {
		if (!activeObject) return;
		canvas.bringForward(activeObject);
	};
	const handleSendBackward = () => {
		if (!activeObject) return;
		canvas.sendBackwards(activeObject);
	};

	const handleColorChange = () => {
		console.log('handleColorChange');
	};

	onMount(() => {
		const storageString = localStorage.getItem('canvas-data');

		canvas = new fabric.Canvas('canvas', {
			snapAngle: 0,
			fireRightClick: true,
			preserveObjectStacking: true,
		});
		canvas.setDimensions({
			height: window.innerHeight + minusHeight,
			width: window.innerWidth,
		});
		if (storageString) {
			canvas.loadFromJSON(JSON.parse(storageString), () => {
				console.log('Saved Data Loaded');
			});
		}
		canvas.on('selection:created', () => handleSelect());
		canvas.on('selection:updated', () => handleSelect());
		window.addEventListener('resize', () => {
			console.log('resize');
			canvas.setDimensions({
				height: window.innerHeight + minusHeight,
				width: window.innerWidth,
			});
			canvas.calcOffset();
		});
	});

	$: {
		console.log(activeObject);
	}
</script>

<div class="relative flex flex-col items-center justify-around overflow-hidden bg-slate-300">
	<nav
		class="flex h-[{navHeight}] w-full items-center justify-around space-x-3 bg-blue-500 px-6 shadow-md"
	>
		<ul>
			<li class="">
				<span class="text-xl font-bold text-base-300">Svelte Canvas</span>
			</li>
		</ul>
		<ul>
			<ColorPicker bind:rgb />
		</ul>
		<ul>
			<li class="">
				<button class="btn-primary btn" on:click={addRect}>Add Rect</button>
			</li>
		</ul>
		<ul>
			<li class="">
				<button class="btn-secondary btn" on:click={addCircle}>Add Circle</button>
			</li>
		</ul>
		<ul>
			<li class="">
				<button class="btn-primary btn" on:click={addText}>Add Text</button>
			</li>
		</ul>
		<ul>
			<li class="">
				<button class="btn-secondary btn" on:click={handleDelete}>Delete</button>
			</li>
		</ul>
		<ul>
			<li class="">
				<button class="btn-secondary btn" on:click={handleSave}>Save</button>
			</li>
		</ul>
		<ul>
			<li class="">
				<button class="btn-secondary btn-sm btn" on:click={handleBringForward}>Bring Forward</button
				>
			</li>
			<li class="">
				<button class="btn-secondary btn-sm btn" on:click={handleSendBackward}>Bring Back</button>
			</li>
		</ul>
	</nav>
	<main class="grid grid-cols-10">
		<div on:click={updateSelection} on:keypress={updateSelection} class="col-span-7 bg-slate-300">
			<canvas id="canvas" />
		</div>
		<div class="col-span-3 bg-amber-300">
			Color Picker
			<MyColorPicker />
		</div>
	</main>

	<nav
		class="flex h-[{navHeight}] w-full items-center justify-around space-x-3 bg-blue-500 px-6 shadow-md"
	>
		<ul>
			<li class="">
				<button class="btn-secondary btn-sm btn" on:click={handleBringForward}>Bring Forward</button
				>
			</li>
			<li class="">
				<button class="btn-secondary btn-sm btn" on:click={handleSendBackward}>Bring Back</button>
			</li>
		</ul>
	</nav>
</div>

<style>
</style>
