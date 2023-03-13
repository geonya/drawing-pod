<script lang="ts">
	import { action, canvasSVG, control, renderer } from '$lib/store'
	import { Action, ObjectType } from '$lib/types'
	import type { IEvent } from 'fabric/fabric-impl'
	import { onMount } from 'svelte'
	import { fabric } from 'fabric'
	export let canvas: fabric.Canvas
	export let staticCanvas: fabric.StaticCanvas
	let prevAction = Action.DEFAULT
	let clipboard: fabric.Object | null = null

	$: {
		onActionHandler($action)
	}
	function onActionHandler(action: Action) {
		if (prevAction !== Action.DEFAULT && $action !== prevAction) {
			onActionCancel()
		}
		switch (action) {
			case Action.DEFAULT:
				onActionCancel()
				break
			case Action.DRAG:
				onDraggingStart()
				break
			case Action.PENCIL:
				onPencilDrawingStart()
				break
			case Action.BRUSH:
				onBrushDrawingStart()
				break
			case Action.LINE:
				$renderer?.onAddStickyLine()
				break
			case Action.ERASE:
				onErasingStart()
				break
			default:
				break
		}
		prevAction = action
	}
	function onActionCancel() {
		switch (prevAction) {
			case Action.DRAG:
				onDraggingEnd()
				break
			case Action.PENCIL:
				onPencilDrawingEnd()
				break
			case Action.BRUSH:
				onBrushDrawingEnd()
				break
			case Action.ERASE:
				onErasingEnd()
				break
			case Action.LINE:
				break
			default:
				break
		}
		prevAction = Action.DEFAULT
	}

	function onDraggingStart() {
		let lastClientX = 0
		let lastClientY = 0
		let state = 'ready'
		canvas.discardActiveObject()
		canvas.defaultCursor = 'grab'
		canvas.forEachObject((o: fabric.Object) => {
			o.evented = false
			o.selectable = false
		})
		canvas.selection = false
		canvas.on('mouse:up', () => {
			state = 'ready'
		})
		canvas.on('mouse:down', (e: fabric.IEvent<MouseEvent>) => {
			state = 'moving'
			lastClientX = e.e.clientX
			lastClientY = e.e.clientY
		})
		canvas.on('mouse:move', (e: fabric.IEvent<MouseEvent>) => {
			if (state === 'moving' && e && e.e) {
				const clientX = e.e.clientX
				const clientY = e.e.clientY
				const delta = {
					x: clientX - lastClientX,
					y: clientY - lastClientY,
				}

				canvas.relativePan(delta)
				lastClientX = e.e.clientX
				lastClientY = e.e.clientY
			}
		})
	}
	function onDraggingEnd() {
		canvas.forEachObject((o: fabric.Object) => {
			o.evented = true
			o.selectable = true
		})
		canvas.defaultCursor = 'default'
		canvas.off('mouse:up')
		canvas.off('mouse:down')
		canvas.off('mouse:move')
		canvas.selection = true
	}
	function onPencilDrawingStart() {
		canvas.isDrawingMode = true
		canvas.freeDrawingBrush.color = 'rgba(0,0,0,1)'
		canvas.freeDrawingBrush.width = 2
	}
	function onPencilDrawingEnd() {
		canvas.defaultCursor = 'default'
		canvas.isDrawingMode = false
	}
	function onBrushDrawingStart() {
		function getRandomColor(): string {
			const getRandomNumberTo256 = () => Math.floor(Math.random() * 256)
			const rgba = {
				a: getRandomNumberTo256(),
				b: getRandomNumberTo256(),
				g: getRandomNumberTo256(),
				r: getRandomOpacity(),
			}
			return `rgba(${rgba.r},${rgba.g},${rgba.b},${rgba.a})`
		}
		function getRandomOpacity() {
			return Math.random() * 0.5 + 0.2
		}
		canvas.isDrawingMode = true
		canvas.freeDrawingBrush.color = getRandomColor()
		canvas.freeDrawingBrush.width = Math.random() * 10 + 6
		canvas.freeDrawingBrush.decimate = 3
	}
	function onBrushDrawingEnd() {
		canvas.isDrawingMode = false
	}
	function onErasingStart() {}
	function onErasingEnd() {}

	function onDelete() {
		const activeObjects = canvas.getActiveObjects()
		canvas.remove(...activeObjects)
		canvas.discardActiveObject()
		canvas.renderAll()
	}
	function onKeyDown(e: KeyboardEvent) {
		if (e.repeat) return
		console.log(e)
		if ((e.key === 'c' && e.ctrlKey) || (e.key === 'c' && e.metaKey)) {
			canvas.getActiveObject()?.clone((cloned: fabric.Object) => {
				clipboard = cloned
			})
		}
		if ((e.key === 'v' && e.ctrlKey) || (e.key === 'v' && e.metaKey)) {
			if (!clipboard) return
			clipboard.clone((cloned: fabric.Object) => {
				canvas.discardActiveObject()
				cloned.set({
					left: cloned.left! + 10,
					top: cloned.top! + 10,
					evented: true,
				})
				if (cloned.type === 'activeSelection') {
					// active selection needs a reference to the canvas.
					cloned.canvas = canvas
					;(cloned as fabric.ActiveSelection).forEachObject((obj: fabric.Object) => {
						canvas.add(obj)
					})
					// this should solve the unselectability
					cloned.setCoords()
				} else {
					canvas.add(cloned)
				}
				// ??
				// clipboard!.top = clipboard!.top! + 10
				// clipboard!.left = clipboard!.left! + 10
				canvas.setActiveObject(cloned)
				canvas.requestRenderAll()
			})
		}
		if (e.key === 'Escape') {
			$action = Action.DEFAULT
			canvas.discardActiveObject()
		}
		if (e.key === ' ') {
			if ($action === Action.DRAG) {
				onDraggingStart()
			}
		}

		if (e.key === 'Backspace' || e.key === 'Delete') {
			const activeObjects = canvas.getActiveObjects()
			if (!activeObjects || activeObjects.length === 0) return
			for (const activeObject of activeObjects) {
				if (activeObject instanceof fabric.IText) {
					const textObject = activeObject as fabric.IText
					if (textObject.isEditing === true) {
						console.log('editing')
						return
					}
					if (textObject.text && textObject.text.length === 0) {
						return
					}
				}
			}
			onDelete()
		}
	}
	function onKeyUp(e: KeyboardEvent) {
		e.preventDefault()
		if (e.key) {
			onDraggingEnd()
		}
	}

	function onZoom(e: IEvent<WheelEvent>) {
		if (!canvas || !canvas.width || !canvas.height) return
		const delta = e.e.deltaY
		let zoom = canvas.getZoom()
		zoom *= 0.999 ** delta
		if (zoom > 5) zoom = 5
		if (zoom < 1) zoom = 1
		canvas.zoomToPoint(new fabric.Point(canvas.width / 2, canvas.height / 2), zoom)
		staticCanvas.zoomToPoint(new fabric.Point(canvas.width / 2, canvas.height / 2), zoom)
		e.e.preventDefault()
		e.e.stopPropagation()
	}
	function onResize() {
		canvas.setWidth(window.innerHeight)
		canvas.setHeight(window.innerHeight)
		// setGridOnCanvasWithMM(canvas)
	}

	onMount(() => {
		canvas.on('before:render', () => $control?.setCanvasBoundary())
		canvas.on('resizing', onResize)
		canvas.on('mouse:wheel', (e) => onZoom(e))
		canvas.on('selection:created', () => {
			$action = Action.DEFAULT
		})
		canvas.on('selection:updated', () => {
			$action = Action.DEFAULT
		})
		canvas.on('selection:cleared', () => {})
		canvas.on('object:added', () => {})
		canvas.on('object:modified', () => {})
		canvas.on('object:scaling', () => {})
		canvas.on('object:moving', (e) => {
			console.log('moving')
			$control?.onPreventCanvasExit(e)
		})
		return () => {
			canvas.off('resizing')
			canvas.off('mouse:wheel')
			canvas.off('selection:created')
			canvas.off('selection:updated')
			canvas.off('selection:cleared')
			canvas.off('object:added')
			canvas.off('object:modified')
			canvas.off('object:scaling')
			canvas.off('object:moving')
		}
	})
</script>

<svelte:window on:keydown={(e) => onKeyDown(e)} on:keyup={(e) => onKeyUp(e)} on:resize={onResize} />
<slot />
