<script lang="ts">
	import { canvas, paletteColor } from '$lib/store';
	import { onMount } from 'svelte';
	import type { Render } from './Render';

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

	const onSelect = () => {
		render.onCreateObjectSelect();
	};
	const onSelectUpdate = () => {
		render.onChangeObjectSelect();
	};
	const onSelectClear = () => {
		render.onClearObjectSelect();
	};
	onMount(() => {
		if ($canvas) {
			$canvas.on('selection:created', onSelect);
			$canvas.on('selection:updated', onSelectUpdate);
			$canvas.on('selection:cleared', onSelectClear);
		}
	});
</script>

<slot />
