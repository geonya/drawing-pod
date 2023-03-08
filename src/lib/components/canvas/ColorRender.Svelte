<script lang="ts">
	import { paletteColor, type IPaletteColor } from '$lib/store';
	import { PaintType } from '$lib/types';
	import { onMount } from 'svelte';
	import type { Render } from './Render';

	export let render: Render;
	export let fill: string | null = render.fill;
	export let stroke: string | null = render.stroke;

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
</script>

<slot />
