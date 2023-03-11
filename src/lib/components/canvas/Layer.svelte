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
	import { control, motion, renderer, sideBarKey, sideBarOpen } from '$lib/store'
	import MotionRender from './MotionRender.svelte'
	export let canvas: fabric.Canvas

	onMount(() => {
		if (canvas) {
			$renderer = new Renderer(canvas)
			$control = new Control(canvas)
			$motion = new Motion(canvas)
		}
	})
</script>

<Controller {canvas} />
<ShapeRender {canvas} />
<Topbar />
{#if $sideBarOpen}
	{#key $sideBarKey}
		<Sidebar />
	{/key}
{/if}
<MotionRender {canvas} />
