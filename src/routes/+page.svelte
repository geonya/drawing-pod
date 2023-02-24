<script lang="ts">
	import { CANVAS_DATA } from '$lib/constants';
	import { ColorRender, Sidebar, Topbar } from '$lib/components';
	import { PaintType, MouseState } from '$lib/types';

	import { fabric } from 'fabric';
	import { onMount, SvelteComponent } from 'svelte';

	let canvas: fabric.Canvas;
	let canvasWrapper: HTMLElement;
	let mouseState: MouseState = MouseState.DEFAULT;
	let fill: string | null = null;
	let stroke: string | null = null;
	let paletteOpen: PaintType | null = null;
	let navOpenKey: object[] = [];

	// const handleBringForward = () => {
	// 	setMouseStateDefault();
	// 	if (!$activeObject) {
	// 		$activeObject = null;
	// 		return;
	// 	}
	// 	canvas.bringForward($activeObject);
	// };
	// const handleSendBackward = () => {
	// 	setMouseStateDefault();
	// 	if (!$activeObject) {
	// 		$activeObject = null;
	// 		return;
	// 	}
	// 	canvas.sendBackwards($activeObject);
	// };
	// const handleAddText = () => {
	// 	setMouseStateDefault();
	// 	const textBox = new fabric.Textbox('Hello', {
	// 		editable: true,
	// 	});
	// 	canvas.add(textBox);
	// 	canvas.centerObject(textBox);
	// };
	const handleAddRect = () => {
		const rect = new fabric.Rect({
			fill: 'rgba(200,200,200,1)',
			stroke: 'rgba(0,0,0,1)',
			strokeWidth: 2,
			width: 200,
			height: 200,
		});
		canvas.add(rect);
		canvas.centerObject(rect);
		canvas.setActiveObject(rect);
	};
	const handleAddCircle = () => {
		const circle = new fabric.Circle({
			fill: 'rgba(255,255,255,1)',
			stroke: 'rgba(0,0,0,1)',
			strokeWidth: 2,
			radius: 100,
		});
		canvas.add(circle);
		canvas.centerObject(circle);
		canvas.setActiveObject(circle);
	};

	const handleDrawing = (mouseState: MouseState) => {
		if (!canvas) return;
		if (mouseState === MouseState.DRAWING) {
			console.log('drawing mode on');
			canvas.isDrawingMode = true;
			canvas.freeDrawingBrush.color = 'rgba(0,0,0,1)';
			canvas.freeDrawingBrush.width = 5;
		} else {
			console.log('drawing mode off');
			canvas.isDrawingMode = false;
		}
	};

	const handleDelete = () => {
		const activeObject = canvas.getActiveObject();
		if (activeObject) {
			canvas.remove(activeObject);
		}
	};

	const handleDragging = (mouseState: MouseState) => {
		if (!canvas) return;
		if (mouseState === MouseState.DRAGGING) {
			console.log('drag mode on');
			let lastClientX = 0;
			let lastClientY = 0;
			let state: string = 'ready';
			canvas.discardActiveObject();
			canvas.defaultCursor = 'grab';
			canvas.forEachObject((o: fabric.Object) => {
				o.evented = false;
				o.selectable = false;
			});
			canvas.selection = false;
			canvas.on('mouse:up', (e: fabric.IEvent<MouseEvent>) => {
				state = 'ready';
			});
			canvas.on('mouse:down', (e: fabric.IEvent<MouseEvent>) => {
				state = 'moving';
				lastClientX = e.e.clientX;
				lastClientY = e.e.clientY;
			});
			canvas.on('mouse:move', (e: fabric.IEvent<MouseEvent>) => {
				if (state === 'moving' && e && e.e) {
					const delta = {
						x: e.e.clientX - lastClientX,
						y: e.e.clientY - lastClientY,
					};
					canvas.relativePan(delta);
					lastClientX = e.e.clientX;
					lastClientY = e.e.clientY;
				}
			});
		} else {
			console.log('drag mode off');
			canvas.forEachObject((o: fabric.Object) => {
				o.evented = true;
				o.selectable = true;
			});
			canvas.defaultCursor = 'default';
			canvas.off('mouse:up');
			canvas.off('mouse:down');
			canvas.off('mouse:move');
			canvas.selection = true;
		}
	};

	const preventExitCanvas = (e: fabric.IEvent<MouseEvent>) => {
		if (!e.target) return;
		if (!canvas) return;
		if (e.target.top && e.target.top < 0) {
			e.target.top = 0;
		}
		if (e.target.left && e.target.left < 0) {
			e.target.left = 0;
		}
		if (
			e.target.left &&
			e.target.width &&
			canvas.width &&
			e.target.left + e.target.width > canvas.width
		) {
			e.target.left = canvas.width - e.target.width;
		}
		if (
			e.target.top &&
			e.target.height &&
			canvas.height &&
			e.target.top + e.target.height > canvas.height
		) {
			e.target.top = canvas.height - e.target.height;
		}
	};

	const handleSave = () => {
		if (!canvas) return;
		const storageString = JSON.stringify(canvas.toJSON());
		localStorage.setItem(CANVAS_DATA, storageString);
		console.log('data saved');
	};
	const handleDownloadSVG = () => {
		const group = new fabric.Group(canvas.getObjects());
		const newCanvas = new fabric.Canvas('newCanvas', {
			width: group.width,
			height: group.height,
			backgroundColor: 'green',
		});
		newCanvas.add(group);
		const svgData = newCanvas.toSVG();
		let blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
		let url = URL.createObjectURL(blob);
		let a = document.createElement('a');
		a.download = 'canvas.svg';
		a.href = url;
		a.click();
		URL.revokeObjectURL(url);
	};

	const handleSaveWithButton = () => {
		setMouseStateDefault();
		handleSave();
		handleDownloadSVG();
	};

	const setMouseStateDefault = () => {
		mouseState = MouseState.DEFAULT;
	};

	const toggleDrawingAndDraggingMode = (mouseState: MouseState) => {
		handleDrawing(mouseState);
		handleDragging(mouseState);
	};

	const handleImageUpload = (e: Event) => {
		setMouseStateDefault();
		let file = (e.target as HTMLInputElement).files?.[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = (e) => {
			if (!e?.target?.result || typeof e.target.result !== 'string') return;
			let image = new Image();
			image.src = e.target.result;
			image.onload = () => {
				let img = new fabric.Image(image);
				img.scaleToWidth(200);
				canvas.add(img);
				canvas.setActiveObject(img);
				canvas.centerObject(img);
				canvas.renderAll();
			};
		};
		reader.readAsDataURL(file);
	};

	const windowResize = () => {
		if (!canvas) return;
		console.log('window resizing...');
		canvas.setDimensions({
			height: canvasWrapper.getBoundingClientRect().height,
			width: canvasWrapper.getBoundingClientRect().width,
		});
		canvas.calcOffset();
	};

	const handleAutoSave = (time: number) => {
		return setInterval(() => {
			handleSave();
		}, time);
	};

	onMount(() => {
		const storageString = localStorage.getItem(CANVAS_DATA);
		canvas = new fabric.Canvas('canvas', {
			snapAngle: 0,
			fireRightClick: true,
			preserveObjectStacking: true,
			backgroundColor: 'white',
			height: canvasWrapper.getBoundingClientRect().height,
			width: canvasWrapper.getBoundingClientRect().width,
		});
		if (storageString) {
			canvas.loadFromJSON(JSON.parse(storageString), () => {
				console.log('Saved Data Loaded');
			});
		}

		canvas.on('object:moving', preventExitCanvas);

		let interval = handleAutoSave(10000);
		return () => {
			clearInterval(interval);
		};
	});
</script>

<svelte:window on:resize={windowResize} />
<Topbar />

<ColorRender {canvas} bind:fill bind:stroke>
	{#each navOpenKey as key (key)}
		<Sidebar bind:fill bind:stroke />
	{/each}
</ColorRender>

<main class="scrollbar-hide min-h-[100vh]" bind:this={canvasWrapper}>
	<canvas id="canvas" class="" />
</main>
<footer class="fixed bottom-0 right-0 left-0 grid h-12 w-full place-content-center backdrop-blur">
	Copyright Geony 2023. All rights reserved.
</footer>
