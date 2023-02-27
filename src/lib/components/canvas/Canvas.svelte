<script context="module" lang="ts">
	import { fabric } from 'fabric';
	import { Controller } from './Controller';
	import { Renderer } from './Renderer';
	let canvas: fabric.Canvas;
	let controller: Controller;
	let renderer: Renderer;
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import Sidebar from '../layout/Sidebar.svelte';
	import Topbar from '../layout/Topbar.svelte';
	import Setup from './Setup.svelte';

	onMount(() => {
		canvas = new fabric.Canvas('canvas', {
			// snapAngle: 0,
			fireRightClick: true,
			preserveObjectStacking: true,
			backgroundColor: 'rgba(255,255,255,1)',
		});
		controller = new Controller(canvas);
		renderer = new Renderer(canvas);
	});
</script>

<canvas id="canvas" class="scrollbar-hide block min-h-[100vh] w-full">
	<Setup {canvas}>
		<Sidebar {renderer} />
		<Topbar {renderer} />
	</Setup>
</canvas>

<style>
	#canvas {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 100%;
		height: 100vh;
		overflow: hidden;
	}
</style>
