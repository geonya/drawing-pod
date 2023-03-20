<script context="module" lang="ts">
	export let sidebarKey = Symbol()
</script>

<script lang="ts">
	import { onMount } from 'svelte'
	import { Renderer } from './Renderer'
	import { Control } from './Control'
	import { sideBarOpen, sideBarKey } from '$lib/store'
	import { Action, Controller, Sidebar, Topbar } from '$lib'
	import { control, renderer } from './canvas.store'
	import type { SupabaseClient } from '@supabase/supabase-js'
	export let canvas: fabric.Canvas
	export let supabase: SupabaseClient

	onMount(() => {
		if (canvas) {
			$renderer = new Renderer(canvas)
			$control = new Control(canvas)
		}
	})
</script>

<Action {canvas}>
	<Controller {canvas} />
	<Topbar {supabase} />
	{#if $sideBarOpen}
		{#key $sideBarKey}
			<Sidebar />
		{/key}
	{/if}
</Action>
