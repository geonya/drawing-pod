<script lang="ts">
	import { PaintType, type IPaletteColor } from '$lib/types'
	import { onMount } from 'svelte'
	import { paletteColor } from '$lib/store'
	import type { Renderer } from './Renderer'
	import type { Control } from './Control'
	export let canvas: fabric.Canvas
	export let control: Control
	export let renderer: Renderer

	$: {
		if ($paletteColor && renderer) {
			if ($paletteColor.type === PaintType.FILL) {
				renderer.fill = $paletteColor.color
			} else {
				renderer.stroke = $paletteColor.color
			}
			renderer.onUpdateObjectColor($paletteColor)
		}
	}

	onMount(() => {
		if (canvas && control) {
			canvas.on('selection:created', () => control.onObjectSelect())
			canvas.on('selection:updated', () => control.onObjectSelectUpdate())
			canvas.on('selection:cleared', () => control.onObjectSelectClear())
		}
	})
</script>

<slot />
