<script context="module" lang="ts">
	export let sidebarKey = Symbol()
</script>

<script lang="ts">
	import { AUTO_SAVE_DELAY, CANVAS_DATA } from '$lib/constants'
	import { onMount } from 'svelte'
	import ShapeRender from './ShapeRender.svelte'
	import { Render } from './Render'
	import { Control } from './Control'
	import { canvas, saveProgress, shape, sideBarKey, sideBarOpen } from '$lib/store'
	import MotionRender from './MotionRender.svelte'
	import Topbar from '../ui/Topbar.svelte'
	import Sidebar from '../ui/Sidebar.svelte'
	import Controller from './Controller.svelte'
	let render: Render
	let control: Control

	onMount(() => {
		if ($canvas) {
			render = new Render($canvas)
			control = new Control($canvas)
		}
	})
</script>

{#if render && control}
	<Controller bind:control />
	<ShapeRender bind:render />
	<MotionRender bind:render bind:control />
	<Topbar />
	{#if $sideBarOpen}
		{#key sideBarKey}
			<Sidebar />
		{/key}
	{/if}
{/if}
