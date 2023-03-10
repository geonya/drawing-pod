<script lang="ts">
	import { PaintType } from '$lib/types'
	import { onMount } from 'svelte'
	import { paletteColor } from '$lib/store'
	import type { Renderer } from './Renderer'

	export let canvas: fabric.Canvas
	export let renderer: Renderer

	$: {
		if ($paletteColor && renderer) {
			if ($paletteColor.type === PaintType.FILL) {
				renderer.updateShape({ fill: $paletteColor.color })
			} else {
				renderer.updateShape({ stroke: $paletteColor.color })
			}
		}
	}
	$: renderer.onUpdateObject($renderer)

	onMount(() => {
		if (canvas) {
			canvas.on('selection:created', () => renderer.onObjectSelect())
			canvas.on('selection:updated', () => renderer.onObjectSelectUpdate())
			canvas.on('selection:cleared', () => renderer.onObjectSelectClear())
		}
	})
</script>

<slot />
