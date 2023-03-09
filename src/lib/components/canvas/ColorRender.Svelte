<script lang="ts">
	import { CANVAS_CONTEXT_KEY } from '$lib/constants'
	import { paletteColor, type IPaletteColor } from '$lib/store'
	import { ObjectType, PaintType, type ICanvasContext } from '$lib/types'
	import { getContext, onMount } from 'svelte'
	import type { Render } from './Render'
	let render: Render
	export let fill: string | null
	export let stroke: string | null
	export let type: ObjectType | null
	export let strokeWidth: number | null
	const uiColorChange = (color: IPaletteColor) => {
		if (color) {
			if (color.type === PaintType.FILL) {
				fill = color.color
			} else {
				stroke = color.color
			}
		}
	}
	const onUpdateStrokeWidth = (value: number, color: IPaletteColor) => {
		render.onUpdateStrokeWidth(value, color)
	}

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
	const { getRender } = getContext<ICanvasContext>(CANVAS_CONTEXT_KEY)
	onMount(() => {
		render = getRender()
		fill = render.fill
		stroke = render.stroke
		type = render.type
		strokeWidth = render.strokeWidth
	})
</script>

<slot />
