<script lang="ts">
	import { MOTION_CONTEXT_KEY } from '$lib/constants'
	import { MotionState, type IMotionContext } from '$lib/types'
	import type { Controller } from './Controller'
	import type { Render } from './Render'
	import { onMount, setContext } from 'svelte'
	export let controller: Controller
	export let render: Render
	let motionState: MotionState = MotionState.DEFAULT
	$: onChangeMotionState(motionState)
	const onChangeMotionState = (motionState: MotionState) => {
		if (!render) return
		if (motionState === MotionState.DEFAULT) {
			render.onDrawingEnd()
			render.onDraggingEnd()
		}
		if (motionState === MotionState.DRAWING) {
			render.onDraggingEnd()
			render.onDrawingStart()
		}
		if (motionState === MotionState.DRAGGING) {
			render.onDraggingEnd()
			render.onDraggingStart()
		}
	}
	const onAddRect = () => {
		motionState = MotionState.DEFAULT
		render.onAddRect()
	}
	const onAddCircle = () => {
		motionState = MotionState.DEFAULT
		render.onAddCircle()
	}
	const onHandDraggingStart = () => {
		motionState = MotionState.DRAGGING
	}
	const onHandDraggingEnd = () => {
		motionState = MotionState.DEFAULT
	}
	const onCursorMove = () => {
		motionState = MotionState.DEFAULT
	}
	const onDrawing = () => {
		motionState = MotionState.DRAWING
	}
	const onDelete = () => {
		motionState = MotionState.DEFAULT
		controller.onDelete()
	}
	const onSave = () => {
		motionState = MotionState.DEFAULT
		controller.onSave()
	}
	const onAddImage = (e: Event) => {
		motionState = MotionState.DEFAULT
		controller.onAddImage(e)
	}
	const onKeyDown = (e: KeyboardEvent) => {
		if (e.key === 'Delete' || e.key === 'Backspace') {
			onDelete()
		}
		if (e.key === ' ') {
			onHandDraggingStart()
		}
		if (e.key === 'Escape') {
			motionState = MotionState.DEFAULT
			render.onObjectSelectClear()
		}
	}
	const onKeyUp = (e: KeyboardEvent) => {
		if (e.key === ' ') {
			onHandDraggingEnd()
		}
	}
	setContext<IMotionContext>(MOTION_CONTEXT_KEY, {
		onAddRect,
		onAddCircle,
		onHandDraggingStart,
		onHandDraggingEnd,
		onCursorMove,
		onDrawing,
		onDelete,
		onSave,
		onAddImage,
		onKeyDown,
		onKeyUp,
	})
	onMount(() => {
		motionState = MotionState.DEFAULT
	})
</script>

<slot />
