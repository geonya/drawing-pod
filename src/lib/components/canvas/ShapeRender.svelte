<script lang="ts">
	import { ObjectType, PaintType, type ICanvasContext, type IShape } from '$lib/types'
	import type { IPaletteColor } from '$lib/store'
	import { onMount } from 'svelte'
	import { sideBarOpen, sideBarKey, paletteColor } from '$lib/store'
	import { fabric } from 'fabric'
	import type { Render } from './Render'
	export let render: Render
	export let canvas: fabric.Canvas
	let strokeWidth: number | null
	$: {
		if (strokeWidth && $paletteColor) {
			onUpdateStrokeWidth(strokeWidth, $paletteColor)
		}
	}

	$: {
		if ($paletteColor) {
			uiColorChange($paletteColor)
			render.onUpdateObjectColor($paletteColor)
		}
	}
	const uiColorChange = (paletteColor: IPaletteColor) => {
		if (paletteColor) {
			if (paletteColor.type === PaintType.FILL) {
				render.fill = paletteColor.color
			} else {
				render.stroke = paletteColor.color
			}
		}
	}
	const onUpdateStrokeWidth = (value: number, color: IPaletteColor) => {
		if (!render) return
		render.onUpdateStrokeWidth(value, color)
	}
	const clearPaletteColor = () => {
		$paletteColor = null
	}
	const onSideBarOpen = () => {
		$sideBarOpen = true
	}
	const onSidebarClose = () => {
		$sideBarOpen = false
	}
	const changeSideBar = () => {
		$sideBarKey = Symbol()
	}
	const onObjectSelect = () => {
		render.onObjectSelect()
		onSideBarOpen()
	}
	const onObjectSelectUpdate = () => {
		render.onObjectSelectUpdate()
		changeSideBar()
		clearPaletteColor()
	}
	const onObjectSelectClear = () => {
		render.onObjectSelectClear()
		onSidebarClose()
		clearPaletteColor()
	}
	onMount(() => {
		const rect = new fabric.Rect({
			left: 100,
			top: 100,
			fill: 'red',
			width: 20,
			height: 20,
		})
		canvas.add(rect)
		canvas.on('selection:created', onObjectSelect)
		canvas.on('selection:updated', onObjectSelectUpdate)
		canvas.on('selection:cleared', onObjectSelectClear)
	})
</script>

<slot />
