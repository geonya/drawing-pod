<script lang="ts">
	import { fabricCanvas, paletteColor } from '$lib/store';
	import { onMount } from 'svelte';
	import { onDestroy } from 'svelte';
	import type { Render } from './Render';
	$: canvas = $fabricCanvas!;

	export let render: Render;
	export let fill: string | null;
	export let stroke: string | null;

	$: fill = render.fill;
	$: stroke = render.stroke;
	$: {
		if ($paletteColor) {
			render.onUpdateColor($paletteColor);
		}
	}
	onMount(() => {
		canvas.on('selection:created', () => render.onCreateObjectSelect());
		canvas.on('selection:updated', () => render.onChangeObjectSelect());
		canvas.on('selection:cleared', () => render.onClearObjectSelect());
	});
	onDestroy(() => {
		canvas.off('selection:created');
		canvas.off('selection:updated');
		canvas.off('selection:cleared');
	});
</script>

<slot />
