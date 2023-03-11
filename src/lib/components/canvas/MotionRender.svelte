<script lang="ts">
	import { MotionState } from '$lib/types'
	import { onMount } from 'svelte'
	import { motion } from '$lib/store'

	export let canvas: fabric.Canvas

	onMount(() => {
		if (canvas) {
			canvas.on('object:moving', (e) => $motion?.onPreventCanvasExit(e))
			canvas.on('selection:created', () => $motion?.onChangeMotionState(MotionState.DEFAULT))
			canvas.on('selection:updated', () => $motion?.onChangeMotionState(MotionState.DEFAULT))
			canvas.on('before:render', () => {
				const zoom = canvas.getZoom()
				const vp = canvas.viewportTransform
				if (!vp) return
				vp[4] = Math.max(vp[4], canvas.getWidth() - canvas.getWidth() * zoom)
				vp[5] = Math.max(vp[5], canvas.getHeight() - canvas.getHeight() * zoom)
				vp[4] = Math.min(vp[4], 0)
				vp[5] = Math.min(vp[5], 0)
			})
		}
	})
</script>

<svelte:window on:keydown={(e) => $motion?.onKeyDown(e)} on:keyup={(e) => $motion?.onKeyUp(e)} />
