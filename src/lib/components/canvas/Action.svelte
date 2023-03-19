<script lang="ts">
	import { sideBarOpen } from '$lib/store'
	import { ActionType, ObjectType } from '$lib/types'
	import type { IEvent } from 'fabric/fabric-impl'
	import { onMount } from 'svelte'
	import { fabric } from 'fabric'
	import { action, control, renderer, shape } from './canvas.store'
	import { outputColor, type OutputColor } from '../palette/palette.store'
	export let canvas: fabric.Canvas
	export let staticCanvas: fabric.StaticCanvas
	let prevAction = ActionType.DEFAULT
	let clipboard: fabric.Object | null = null
	let undoStack: any[] = []
	let redoStack: any[] = []

	$: {
		onColorUpdate($outputColor)
		onActionHandler($action)
	}

	function onColorUpdate(color: OutputColor | null) {
		const activeObject = canvas.getActiveObject()
		if (activeObject && color) {
			if (activeObject.type === 'group') {
				const group = activeObject as fabric.Group
				group.forEachObject((obj) => {
					if (obj.type === 'rect' || obj.type === 'circle') {
						color.fill && obj.set('fill', color.fill as string)
						color.stroke && obj.set('stroke', color.stroke as string)
					}
					if (obj.type === 'textbox') {
						color.stroke && obj.set('fill', color.fill as string)
						color.stroke && obj.set('stroke', color.stroke as string)
					}
				})
			} else {
				color.fill && activeObject.set('fill', color.fill as string)
				color.stroke && activeObject.set('stroke', color.stroke as string)
			}
			canvas.requestRenderAll()
		}
	}

	function onActionHandler(action: ActionType) {
		if (prevAction !== ActionType.DEFAULT && $action !== prevAction) {
			onActionCancel()
		}
		switch (action) {
			case ActionType.DEFAULT:
				onActionCancel()
				break
			case ActionType.DRAG:
				onDraggingStart()
				break
			case ActionType.PENCIL:
				onPencilDrawingStart()
				break
			case ActionType.BRUSH:
				onBrushDrawingStart()
				break
			case ActionType.LINE:
				$renderer?.onAddStickyLine()
				break
			case ActionType.ERASE:
				onErasingStart()
				break
			default:
				break
		}
		prevAction = action
	}
	function onActionCancel() {
		switch (prevAction) {
			case ActionType.DRAG:
				onDraggingEnd()
				break
			case ActionType.PENCIL:
				onPencilDrawingEnd()
				break
			case ActionType.BRUSH:
				onBrushDrawingEnd()
				break
			case ActionType.ERASE:
				onErasingEnd()
				break
			case ActionType.LINE:
				break
			default:
				break
		}
		prevAction = ActionType.DEFAULT
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
	function setUndo(json: any) {
		const LIMIT = 10
		undoStack = [json, ...undoStack.splice(0, LIMIT)]
	}

	function onUnDo() {
		if (undoStack.length > 0) {
			redoStack = [undoStack[0], ...redoStack.splice(0, 10)]
			// current state
			undoStack = undoStack.slice(1)
			// previous state
			const json = undoStack[0]
			undoStack = undoStack.slice(1)
			console.log(json)
			canvas.loadFromJSON(json, () => {
				canvas.renderAll()
			})
		}
	}

	function onReDo() {
		if (redoStack.length > 0) {
			undoStack = [redoStack[0], ...undoStack.splice(0, 10)]
			// current state
			const json = redoStack[0]
			redoStack = redoStack.slice(1)
			console.log(redoStack)
			canvas.loadFromJSON(json, () => {
				canvas.renderAll()
			})
		}
	}
	function onKeyDown(e: KeyboardEvent) {
		if (e.repeat) return
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
					left: cloned.left! + 15,
					top: cloned.top! + 15,
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
				canvas.setActiveObject(cloned)
				canvas.requestRenderAll()
			})
		}
		// undo
		if (
			(e.key === 'z' && e.ctrlKey && !e.shiftKey) ||
			(e.key === 'z' && e.metaKey && !e.shiftKey)
		) {
			onUnDo()
		}
		// redo
		if ((e.key === 'z' && e.ctrlKey && e.shiftKey) || (e.key === 'z' && e.metaKey && e.shiftKey)) {
			onReDo()
		}

		if (e.key === 'Escape') {
			$action = ActionType.DEFAULT
			canvas.discardActiveObject()
			canvas.defaultCursor = 'default'
			canvas.renderAll()
		}
		if (e.key === ' ') {
			const activeObjects = canvas.getActiveObjects()
			if (!activeObjects || activeObjects.length === 0) return
			for (const activeObject of activeObjects) {
				if (activeObject instanceof fabric.IText || activeObject instanceof fabric.Textbox) {
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
			$action = ActionType.DRAG
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
		if (e.key === ' ') {
			$action = ActionType.DEFAULT
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

	// object selected
	function onObjectSelect(e?: fabric.IEvent) {
		const activeObject = canvas.getActiveObject()
		if (activeObject) {
			shape.set({
				fill: activeObject.fill as string,
				stroke: activeObject.stroke as string,
				objectType: activeObject.type as ObjectType,
				strokeWidth: activeObject.strokeWidth as number,
			})
			onSideBarOpen()
		}
	}
	function onObjectSelectUpdate(e: fabric.IEvent) {
		onObjectSelect()
		onSidebarClose()
		onSideBarOpen()
	}
	function onObjectSelectClear() {
		canvas.discardActiveObject()
		onSidebarClose()
		setClearShape()
	}

	function onSideBarOpen() {
		sideBarOpen.set(true)
	}
	function onSidebarClose() {
		sideBarOpen.set(false)
	}

	function setClearShape() {
		shape.set(null)
	}

	onMount(() => {
		canvas.on('before:render', () => $control?.setCanvasBoundary())
		canvas.on('resizing', onResize)
		canvas.on('mouse:wheel', (e) => onZoom(e))

		// selection
		canvas.on('selection:created', (e) => onObjectSelect(e))
		canvas.on('selection:updated', (e) => onObjectSelectUpdate(e))
		canvas.on('selection:cleared', () => onObjectSelectClear())
		canvas.on('selection:created', () => {
			$action = ActionType.DEFAULT
		})
		canvas.on('selection:updated', () => {
			$action = ActionType.DEFAULT
		})
		canvas.on('selection:cleared', () => {})

		// object
		canvas.on('object:added', () => {
			// undoStack.push(canvas.toJSON())
			setUndo(canvas.toJSON())
		})
		canvas.on('object:selected', (e) => {
			onObjectSelect(e)
		})
		canvas.on('object:scaling', () => {})
		canvas.on('object:removed', () => {
			setUndo(canvas.toJSON())
		})
		canvas.on('object:modified', (e) => {
			onObjectSelectUpdate(e)
		})
		canvas.on('object:moving', (e) => {
			$control?.onPreventCanvasExit(e)
		})
		canvas.on('object:removed', () => {
			setUndo(canvas.toJSON())
		})
		canvas.on('obeject:moved', () => {
			setUndo(canvas.toJSON())
		})
		canvas.on('object:rotating', () => {})
		canvas.on('object:skewing', () => {})
		canvas.on('object:resizing', () => {})

		const undoTimeoutId = setTimeout(() => {
			setUndo(canvas.toJSON())
		}, 0)

		return () => {
			canvas.off('resizing')
			canvas.off('mouse:wheel')
			canvas.off('selection:created')
			canvas.off('selection:updated')
			canvas.off('selection:cleared')
			canvas.off('selection:created')
			canvas.off('selection:updated')
			canvas.off('selection:cleared')
			canvas.off('object:added')
			canvas.off('object:modified')
			canvas.off('object:scaling')
			canvas.off('object:moving')
			canvas.off('object:selected')
			canvas.off('object:modified')
			canvas.off('object:rotating')
			canvas.off('object:skewing')
			canvas.off('object:resizing')

			clearTimeout(undoTimeoutId)
		}
	})
</script>

<svelte:window on:keydown={(e) => onKeyDown(e)} on:keyup={(e) => onKeyUp(e)} on:resize={onResize} />
<slot />
