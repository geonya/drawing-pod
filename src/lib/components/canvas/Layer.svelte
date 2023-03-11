<script context="module" lang="ts">
	export let sidebarKey = Symbol()
</script>

<script lang="ts">
	import { onMount } from 'svelte'
	import ShapeRender from './ShapeRender.svelte'
	import { Renderer } from './Renderer'
	import { Control } from './Control'
	import Topbar from '../ui/Topbar.svelte'
	import Sidebar from '../ui/Sidebar.svelte'
	import Controller from './Controller.svelte'
	import { Motion } from './Motion'
	import { sideBarKey, sideBarOpen } from '$lib/store'
	import MotionRender from './MotionRender.svelte'
	export let canvas: fabric.Canvas
	let renderer: Renderer
	let control: Control
	let motion: Motion

	onMount(() => {
		if (canvas) {
			renderer = new Renderer(canvas)
			control = new Control(canvas)
			motion = new Motion(canvas)
		}
	})
</script>

{#if renderer && control && motion}
	<Controller {canvas} />
	<ShapeRender {canvas} {renderer} />
	<Topbar {control} {motion} {renderer} />
	{#if $sideBarOpen}
		{#key $sideBarKey}
			<Sidebar {renderer} {control} />
		{/key}
	{/if}
	<MotionRender {motion} {canvas} />
{/if}
