<script context="module" lang="ts">
	export let sidebarKey = Symbol()
</script>

<script lang="ts">
	import { AUTO_SAVE_DELAY, CANVAS_DATA } from '$lib/constants'
	import type { IShape, ObjectType, PaintType } from '$lib/types'
	import { onMount } from 'svelte'
	import ShapeRender from './ShapeRender.svelte'
	import { Render } from './Render'
	import { Controller } from './Controller'
	import { canvas, shape, sideBarKey, sideBarOpen } from '$lib/store'
	import MotionRender from './MotionRender.svelte'
	import Topbar from '../ui/Topbar.svelte'
	import Sidebar from '../ui/Sidebar.svelte'
	let render: Render
	let controller: Controller
	let saveProgress: number = 0

	const onLoadStorageData = (canvas: fabric.Canvas) => {
		const storageJsonData = localStorage.getItem(CANVAS_DATA)
		if (storageJsonData) {
			const json = JSON.parse(storageJsonData)
			canvas.loadFromJSON(json, () => {
				canvas.renderAll()
			})
		}
	}
	const saveTimer = (m: number) => {
		let saveTimerId: ReturnType<typeof requestAnimationFrame>
		let start: number | null = null
		const loop = (timestamp: number) => {
			if (!start) start = timestamp
			const elapsed = timestamp - start
			const progress = (elapsed / m) * 1.1
			if (progress <= 1) {
				requestAnimationFrame(loop)
			}
			saveProgress = progress
		}
		saveTimerId = requestAnimationFrame(loop)
		return saveTimerId
	}
	const onIntervalAutoSaveWithTimer = () => {
		let interval: ReturnType<typeof setInterval>
		let saveTimerId: ReturnType<typeof requestAnimationFrame> | null
		saveTimerId = saveTimer(AUTO_SAVE_DELAY)
		interval = setInterval(() => {
			saveTimerId = saveTimer(AUTO_SAVE_DELAY)
		}, AUTO_SAVE_DELAY)
		return () => {
			clearInterval(interval)
			saveTimerId && cancelAnimationFrame(saveTimerId)
		}
	}
	const onAutoSaveInLocalStorage = (canvas: fabric.Canvas) => {
		let interval: ReturnType<typeof setInterval>
		interval = setInterval(() => {
			const json = canvas.toJSON()
			localStorage.setItem(CANVAS_DATA, JSON.stringify(json))
			console.log('canvas data auto saved!')
		}, AUTO_SAVE_DELAY)
		return () => {
			clearInterval(interval)
		}
	}
	onMount(() => {
		if ($canvas) {
			render = new Render($canvas)
			controller = new Controller($canvas)
			// onLoadStorageData(canvas)

			// onIntervalAutoSaveWithTimer()
			// onAutoSaveInLocalStorage(canvas)
		}
	})
</script>

{#if render && controller}
	<ShapeRender bind:render />
	<MotionRender bind:render bind:controller />
	<Topbar />
	{#if $sideBarOpen}
		{#key sideBarKey}
			<!-- <Sidebar /> -->
		{/key}
	{/if}
{/if}
