<script lang="ts">
	import { MotionState } from '$lib/types'
	import type { Control } from './Control'
	import type { Render } from './Render'
	import { onMount } from 'svelte'
	import { motionContext } from '$lib/store'
	export let control: Control
	export let render: Render

	let motionState: MotionState = MotionState.DEFAULT
	$: onChangeMotionState(motionState)
	const onChangeMotionState = (motionState: MotionState) => {
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
		control.onDelete()
	}
	const onSave = () => {
		motionState = MotionState.DEFAULT
		control.onSave()
	}
	const onAddImage = (e: Event) => {
		motionState = MotionState.DEFAULT
		control.onAddImage(e)
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
	const onDownload = () => {}

	motionContext.set({
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
		onDownload,
	})
	onMount(() => {
		motionState = MotionState.DEFAULT
	})
</script>

<slot />
