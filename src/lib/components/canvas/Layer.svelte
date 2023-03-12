<script context="module" lang="ts">
	export let sidebarKey = Symbol()
</script>

<script lang="ts">
	import { onMount } from 'svelte'
	import { Renderer } from './Renderer'
	import { Control } from './Control'
	import { control, renderer, sideBarKey, sideBarOpen } from '$lib/store'
	import { Action, Controller, ShapeRender, Sidebar, Topbar } from '$lib'
	export let canvas: fabric.Canvas

	onMount(() => {
		if (canvas) {
			$renderer = new Renderer(canvas)
			$control = new Control(canvas)
		}
	})
</script>

<Action {canvas}>
	<Controller {canvas} />
	<ShapeRender {canvas} />
	<Topbar />
	{#if $sideBarOpen}
		{#key $sideBarKey}
			<Sidebar />
		{/key}
	{/if}
</Action>
