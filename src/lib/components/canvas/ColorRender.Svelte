<script lang="ts">
	import { CANVAS_CONTEXT_KEY } from '$lib/constants';
	import { paletteColor, type IPaletteColor } from '$lib/store';
	import { PaintType, type ICanvasContext } from '$lib/types';
	import { getContext, onMount } from 'svelte';
	import type { Render } from './Render';
	let render: Render;
	export let fill: string | null;
	export let stroke: string | null;
	const uiColorChange = (color: IPaletteColor) => {
		if (color) {
			if (color.type === PaintType.FILL) {
				fill = color.color;
			} else {
				stroke = color.color;
			}
		}
	};

	$: {
		if ($paletteColor) {
			uiColorChange($paletteColor);
			render.onUpdateObjectColor($paletteColor);
		}
	}
	const { getRender } = getContext<ICanvasContext>(CANVAS_CONTEXT_KEY);
	onMount(() => {
		render = getRender();
		fill = render.fill;
		stroke = render.stroke;
	});
</script>

<slot />
