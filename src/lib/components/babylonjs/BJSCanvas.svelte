<script lang="ts">
	import { BJSApp } from '$lib/components/babylonjs/BJSApp'
	import { canvasSVG } from '$lib/store'
	import { onMount } from 'svelte'

	let canvas: HTMLCanvasElement

	onMount(async () => {
		new BJSApp(canvas).run()
	})
</script>

<canvas bind:this={canvas} id="canvas" />

<style>
	canvas {
		outline: none;
		width: 500px;
		height: 500px;
	}
</style>
