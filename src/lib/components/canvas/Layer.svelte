<script context="module" lang="ts">
	export let sidebarKey = Symbol()
</script>

<script lang="ts">
	import { Sidebar, Topbar } from '$lib'
	import { CANVAS_DATA } from '$lib/constants'
	import { canvas, sideBarOpen, sideBarKey } from '$lib/store'
	import { onMount } from 'svelte'
	const onLoadStorageData = (canvas: fabric.Canvas) => {
		const storageJsonData = localStorage.getItem(CANVAS_DATA)
		if (storageJsonData) {
			const json = JSON.parse(storageJsonData)
			canvas.loadFromJSON(json, () => {
				canvas.renderAll()
			})
		}
	}
	onMount(() => {
		if ($canvas) {
			onLoadStorageData($canvas)
		}
	})
</script>

{#if $canvas}
	<Topbar />
	{#if $sideBarOpen}
		{#key $sideBarKey}
			<Sidebar />
		{/key}
	{/if}
{/if}
