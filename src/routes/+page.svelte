<script lang="ts">
	import ColorPicker from '$lib/components/ColorPicket/ColorPicker.svelte';
	import { CANVAS_DATA } from '$lib/constants';
	import { MouseState } from '$lib/types';
	import { convertStringToRgba, stringifyRGB } from '$lib/utils';
	import { colord, type RgbaColor } from 'colord';
	import { fabric } from 'fabric';
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';

	let canvas: fabric.Canvas;
	let navOpen = false;
	let canvasWrapper: HTMLElement;
	let activeObject: fabric.Object | null = null;
	let mouseState: MouseState = MouseState.DEFAULT;
	let fillColorBoxOpen = false,
		strokeColorBoxOpen = false;

	let fillColorHex: string;
	let fillColorRgba: RgbaColor;
	let strokeColorHex: string;
	let strokeColorRgba: RgbaColor;

	const handleBringForward = () => {
		setMouseStateDefault();
		if (!activeObject) {
			activeObject = null;
			return;
		}
		canvas.bringForward(activeObject);
	};
	const handleSendBackward = () => {
		setMouseStateDefault();
		if (!activeObject) {
			activeObject = null;
			return;
		}
		canvas.sendBackwards(activeObject);
	};
	const handleAddText = () => {
		setMouseStateDefault();
		const textBox = new fabric.Textbox('Hello', {
			editable: true,
		});
		canvas.add(textBox);
		canvas.centerObject(textBox);
	};
	const handleAddRect = () => {
		setMouseStateDefault();
		const rect = new fabric.Rect({
			width: 200,
			height: 200,
			stroke: 'black',
			strokeWidth: 2,
			fill: 'transparent',
		});
		canvas.add(rect);
		canvas.centerObject(rect);
	};
	const handleAddCircle = () => {
		setMouseStateDefault();
		const circle = new fabric.Circle({
			fill: 'transparent',
			stroke: 'black',
			strokeWidth: 2,
			radius: 100,
		});
		canvas.add(circle);
		canvas.centerObject(circle);
	};

	const handleDrawing = (mouseState: MouseState) => {
		if (!canvas) return;
		if (mouseState === MouseState.DRAWING) {
			console.log('drawing mode on');
			canvas.isDrawingMode = true;
			canvas.freeDrawingBrush.color = 'black';
			canvas.freeDrawingBrush.width = 5;
		} else {
			console.log('drawing mode off');
			canvas.isDrawingMode = false;
		}
	};

	const handleDelete = () => {
		setMouseStateDefault();
		if (activeObject) {
			canvas.remove(activeObject);
			activeObject = null;
		}
	};
	const getObjectColor = (object: fabric.Object) => {
		const _fillColorRgba = convertStringToRgba(object.fill as string);
		const _strokeColorRgba = convertStringToRgba(object.stroke as string);
		if (typeof _fillColorRgba?.a === 'number') {
			fillColorRgba = _fillColorRgba;
			fillColorHex = colord(_fillColorRgba).toHex();
		}
		if (typeof _strokeColorRgba?.a === 'number') {
			strokeColorRgba = _strokeColorRgba;
			strokeColorHex = colord(_strokeColorRgba).toHex();
		}
	};
	const setObjectColor = (fillColorRgba: RgbaColor, strokeColorRgba: RgbaColor) => {
		if (!activeObject) return;
		if (fillColorRgba) {
			activeObject.set('fill', stringifyRGB(fillColorRgba));
		}
		if (strokeColorRgba) {
			activeObject.set('stroke', stringifyRGB(strokeColorRgba));
		}
		canvas.renderAll();
	};

	const handleObjectSelect = () => {
		activeObject = canvas.getActiveObject();
		if (activeObject) {
			getObjectColor(activeObject);
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

	const handleNavOpen = (activeObject: fabric.Object | null) => {
		if (!activeObject) {
			navOpen = false;
			fillColorBoxOpen = false;
			strokeColorBoxOpen = false;
			return;
		}
		const realActiveObject = canvas.getActiveObject();
		if (!realActiveObject) {
			navOpen = false;
			return;
		}
		navOpen = true;
	};

	const handleColorBoxOpen = (type: 'fill' | 'stroke') => {
		if (type === 'fill') {
			fillColorBoxOpen = !fillColorBoxOpen;
			strokeColorBoxOpen = false;
		} else if (type === 'stroke') {
			strokeColorBoxOpen = !strokeColorBoxOpen;
			fillColorBoxOpen = false;
		}
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

	// event react
	$: canvas && handleNavOpen(activeObject);
	$: toggleDrawingAndDraggingMode(mouseState);
	$: setObjectColor(fillColorRgba, strokeColorRgba);

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
		canvas.on('selection:created', () => handleObjectSelect());
		canvas.on('selection:updated', () => handleObjectSelect());
		canvas.on('selection:cleared', () => handleObjectSelect());
		canvas.on('object:moving', preventExitCanvas);

		let interval = handleAutoSave(10000);
		return () => {
			clearInterval(interval);
		};
	});
</script>

<svelte:window on:resize={windowResize} />
<header class="fixed top-0 left-0 right-0 z-10 h-24 w-full">
	<div class="grid h-full w-full grid-cols-10">
		<!-- // left side -->
		<div class="col-span-2 place-self-center justify-self-start pl-9">
			<button class="self-start">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width={1.5}
					stroke="currentColor"
					class="h-6 w-6"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
					/>
				</svg>
			</button>
		</div>
		<!-- // center side -->
		<div class="col-span-6 self-center">
			<div
				class="flex items-center justify-around space-x-4 rounded-md border-2 px-3 py-2 text-xl shadow-2xl backdrop-blur"
			>
				<button class="자물쇠">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width={1.5}
						stroke="currentColor"
						class="h-6 w-6"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
						/>
					</svg>
				</button>
				<button class="마우스" on:click={setMouseStateDefault}>
					<svg
						fill="none"
						stroke="currentColor"
						stroke-width="1.5"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
						aria-hidden="true"
						class="h-6 w-6"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59"
						/>
					</svg>
				</button>
				<button
					class="손"
					on:click={() => {
						mouseState = MouseState.DRAGGING;
					}}
				>
					<svg
						fill="none"
						stroke="currentColor"
						stroke-width="1.5"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
						aria-hidden="true"
						class="h-6 w-6"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M10.05 4.575a1.575 1.575 0 10-3.15 0v3m3.15-3v-1.5a1.575 1.575 0 013.15 0v1.5m-3.15 0l.075 5.925m3.075.75V4.575m0 0a1.575 1.575 0 013.15 0V15M6.9 7.575a1.575 1.575 0 10-3.15 0v8.175a6.75 6.75 0 006.75 6.75h2.018a5.25 5.25 0 003.712-1.538l1.732-1.732a5.25 5.25 0 001.538-3.712l.003-2.024a.668.668 0 01.198-.471 1.575 1.575 0 10-2.228-2.228 3.818 3.818 0 00-1.12 2.687M6.9 7.575V12m6.27 4.318A4.49 4.49 0 0116.35 15m.002 0h-.002"
						/>
					</svg>
				</button>
				<button class="네모 cursor-pointer" on:click={handleAddRect}
					><svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width={1.5}
						stroke="currentColor"
						class="h-6 w-6"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M16.5 8.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v8.25A2.25 2.25 0 006 16.5h2.25m8.25-8.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-7.5A2.25 2.25 0 018.25 18v-1.5m8.25-8.25h-6a2.25 2.25 0 00-2.25 2.25v6"
						/>
					</svg>
				</button>
				<button class="원" on:click={handleAddCircle}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width={1.5}
						stroke="currentColor"
						class="h-6 w-6"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
				</button>
				<button
					class="연필"
					on:click={() => {
						mouseState = MouseState.DRAWING;
					}}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width={1.5}
						stroke="currentColor"
						class="h-6 w-6"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
						/>
					</svg>
				</button>
				<input
					name="image-upload"
					id="imageUpload"
					type="file"
					accept="image/*"
					class="hidden"
					on:change={handleImageUpload}
				/>
				<label for="imageUpload" class="inline-block cursor-pointer">
					<button class="사진 업로드 pointer-events-none">
						<svg
							class="h-6 w-6"
							fill="none"
							stroke="currentColor"
							stroke-width="1.5"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
							aria-hidden="true"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
							/>
						</svg>
					</button>
				</label>
				<button class="쓰레기통" on:click={handleDelete}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width={1.5}
						stroke="currentColor"
						class="h-6 w-6"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
						/>
					</svg>
				</button>
				<button class="저장" on:click={handleSaveWithButton}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width={1.5}
						stroke="currentColor"
						class="h-6 w-6"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
						/>
					</svg>
				</button>
			</div>
		</div>

		<!-- 우측 버튼 모음 -->
		<div class="col-span-2 hidden h-full w-full md:block">
			<div class="flex h-full items-center justify-center space-x-3">
				<button class="rounded-md bg-blue-400 p-2 text-white">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width={1.5}
						stroke="currentColor"
						class="h-5 w-5"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
						/>
					</svg>
				</button>
				<button
					class="flex flex-shrink items-center space-x-2 rounded-md border px-3 py-1.5 hover:bg-base-100"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="h-6 w-6"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M7.875 14.25l1.214 1.942a2.25 2.25 0 001.908 1.058h2.006c.776 0 1.497-.4 1.908-1.058l1.214-1.942M2.41 9h4.636a2.25 2.25 0 011.872 1.002l.164.246a2.25 2.25 0 001.872 1.002h2.092a2.25 2.25 0 001.872-1.002l.164-.246A2.25 2.25 0 0116.954 9h4.636M2.41 9a2.25 2.25 0 00-.16.832V12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 12V9.832c0-.287-.055-.57-.16-.832M2.41 9a2.25 2.25 0 01.382-.632l3.285-3.832a2.25 2.25 0 011.708-.786h8.43c.657 0 1.281.287 1.709.786l3.284 3.832c.163.19.291.404.382.632M4.5 20.25h15A2.25 2.25 0 0021.75 18v-2.625c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125V18a2.25 2.25 0 002.25 2.25z"
						/>
					</svg>
					<span>창꼬</span>
				</button>
			</div>
		</div>
	</div>
</header>

{#if navOpen && activeObject}
	<nav
		transition:fly={{ x: -200, duration: 500 }}
		class="fixed top-48 left-8 z-10 h-full max-h-[600px] w-64 rounded-md border shadow-md backdrop-blur md:block"
	>
		<div class="scroll-none scroll scrollbar-hide h-full w-full overflow-y-auto">
			<div class="컨트롤 박스 grid-auto-row grid gap-2 p-3">
				{#if fillColorBoxOpen}
					<ColorPicker bind:hex={fillColorHex} bind:rgba={fillColorRgba} bind:activeObject />
				{/if}
				{#if strokeColorBoxOpen}
					<ColorPicker bind:hex={strokeColorHex} bind:rgba={strokeColorRgba} bind:activeObject />
				{/if}
				<div class="선">
					<label for="stroke">
						<span class="">선</span>
					</label>
					<div class="grid grid-flow-col items-center gap-2">
						<button
							class="컬러박스 h-7 w-7 rounded-md"
							style="background-color:{strokeColorHex || 'black'};"
							on:click={() => handleColorBoxOpen('stroke')}
						/>
						<input id="stroke" type="text" class="input max-h-7 w-full rounded-md border px-2" />
					</div>
				</div>
				<div class="채우기">
					<label for="fill">
						<span class="">채우기</span>
					</label>
					<div class="grid grid-flow-col items-center gap-2">
						<button
							class="컬러박스 h-7 w-7 rounded-md "
							on:click={() => handleColorBoxOpen('fill')}
							style="background-color:{fillColorHex || 'black'};"
						/>
						<input id="fill" type="text" class="input max-h-7 w-full rounded-md border px-2" />
					</div>
				</div>
			</div>
			<div class="flex h-full justify-around">
				<button class="앞으로" on:click={handleBringForward}>
					<svg
						class="h-6 w-6"
						aria-hidden="true"
						focusable="false"
						role="img"
						viewBox="0 0 20 20"
						fill="none"
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						><g
							clip-path="url(#a)"
							stroke="currentColor"
							stroke-width="1.25"
							stroke-linecap="round"
							stroke-linejoin="round"
							><path
								fill-rule="evenodd"
								clip-rule="evenodd"
								d="M6.944 12.5H12.5v1.389a1.389 1.389 0 0 1-1.389 1.389H5.556a1.389 1.389 0 0 1-1.39-1.39V8.334a1.389 1.389 0 0 1 1.39-1.389h1.388"
								fill="currentColor"
							/><path
								d="M13.889 4.167H8.333c-.767 0-1.389.621-1.389 1.389v5.555c0 .767.622 1.389 1.39 1.389h5.555c.767 0 1.389-.622 1.389-1.389V5.556c0-.768-.622-1.39-1.39-1.39Z"
							/></g
						><defs><clipPath id="a"><path fill="#fff" d="M0 0h20v20H0z" /></clipPath></defs></svg
					>
				</button>
				<button class="뒤로" on:click={handleBringForward}>
					<svg
						aria-hidden="true"
						focusable="false"
						role="img"
						viewBox="0 0 20 20"
						class="h-6 w-6"
						fill="none"
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						><g
							clip-path="url(#a)"
							stroke="currentColor"
							stroke-width="1.25"
							stroke-linecap="round"
							stroke-linejoin="round"
							><path
								d="M13.889 4.167H8.333c-.767 0-1.389.622-1.389 1.389v5.555c0 .767.622 1.389 1.39 1.389h5.555c.767 0 1.389-.622 1.389-1.389V5.556c0-.767-.622-1.39-1.39-1.39Z"
								fill="currentColor"
							/><path
								d="M12.5 12.5v1.389a1.389 1.389 0 0 1-1.389 1.389H5.556a1.389 1.389 0 0 1-1.39-1.39V8.334a1.389 1.389 0 0 1 1.39-1.389h1.388"
							/></g
						><defs><clipPath id="a"><path fill="#fff" d="M0 0h20v20H0z" /></clipPath></defs></svg
					>
				</button>
			</div>
		</div>
	</nav>
{/if}
<main class="scrollbar-hide min-h-[100vh]" bind:this={canvasWrapper}>
	<canvas id="canvas" class="" />
</main>
<footer class="fixed bottom-0 right-0 left-0 grid h-12 w-full place-content-center backdrop-blur">
	Copyright Geony 2023. All rights reserved.
</footer>
