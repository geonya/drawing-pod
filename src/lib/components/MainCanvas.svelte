<script lang="ts">
	import type { RgbaColor } from 'colord';
	import { fabric } from 'fabric';
	import { onMount } from 'svelte';

	export let canvas: fabric.Canvas;
	let activeObject: fabric.Object | null = null;
	let canvasWrapper: HTMLElement;

	const updateSelection = () => {
		console.log('hello');
	};

	const addCircle = () => {
		const circle = new fabric.Circle({
			fill: 'red',
			radius: 100,
		});
		canvas.add(circle);
		canvas.centerObject(circle);
	};

	const addText = () => {
		const textBox = new fabric.Textbox('Hello', {
			editable: true,
		});
		canvas.add(textBox);
		canvas.centerObject(textBox);
	};
	const handleSave = () => {
		const data = canvas.toJSON();
		const stringifiedData = JSON.stringify(data);
		localStorage.setItem('canvas-data', stringifiedData);
	};

	const handleSelect = () => {
		activeObject = canvas.getActiveObject();
	};

	const stringifyRGB = (rgba: RgbaColor) => Object.values(rgba).join();

	const handleColorChange = (e: CustomEvent) => {
		const { rgba } = e.detail;
		if (!activeObject || !rgba) return;
		activeObject.set('fill', `rgba(${stringifyRGB(rgba)})`);
		canvas.renderAll();
	};
</script>
