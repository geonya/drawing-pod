<script context="module" lang="ts">
	export let sidebarKey = Symbol()
</script>

<script lang="ts">
	import { onMount } from 'svelte'
	import { Renderer } from './Renderer'
	import { Control } from './Control'
	import { sideBarOpen } from '$lib/store'
	import { Action, Controller, Sidebar, Topbar } from '$lib'
	import { control, renderer } from './canvas.store'
	export let canvas: fabric.Canvas
	export let staticCanvas: fabric.StaticCanvas

	onMount(() => {
		if (canvas) {
			$renderer = new Renderer(canvas)
			$control = new Control(canvas)
		}
	})
</script>

<Action {canvas} {staticCanvas}>
	<Controller {canvas} />
	<Topbar />
	{#if $sideBarOpen}
		<Sidebar />
	{/if}
</Action>
