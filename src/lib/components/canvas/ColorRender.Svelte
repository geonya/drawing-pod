<script lang="ts">
	import { paletteColor } from '$lib/store';
	import { PaintType } from '$lib/types';
	import { onMount } from 'svelte';
	import { onDestroy } from 'svelte/types/runtime/internal/lifecycle';

	export let canvas: fabric.Canvas;
	export let fill: string | null = null;
	export let stroke: string | null = null;

	$: {
		if ($paletteColor) {
			handleUpdateColorRender($paletteColor);
		}
	}

	const handleSelect = () => {
		const activeObject = canvas.getActiveObject();
		if (activeObject) {
			const { fill: _fill, stroke: _stroke } = activeObject;
			fill = _fill as string;
			stroke = _stroke as string;
		}
	};

	const handleSelectinUpdate = () => {
		const activeObject = canvas.getActiveObject();
		if (activeObject) {
			const { fill: _fill, stroke: _stroke } = activeObject;
			fill = _fill as string;
			stroke = _stroke as string;
		}
	};
	const handleUnSelect = () => {
		canvas.discardActiveObject();
		fill = null;
		stroke = null;
	};

	const handleUpdateColorRender = (colorObj: paletteColor) => {
		const activeObject = canvas.getActiveObject();
		if (activeObject) {
			const { color, type } = colorObj;
			if (type === PaintType.FILL) {
				activeObject.set(PaintType.FILL, color);
			}
			if (type === PaintType.STROKE) {
				activeObject.set(PaintType.STROKE, color);
			}
			canvas.requestRenderAll();
		}
	};
	onMount(() => {
		canvas.on('selection:created', () => handleSelect());
		canvas.on('selection:updated', () => handleSelectinUpdate());
		canvas.on('selection:cleared', () => handleUnSelect());
	});
	onDestroy(() => {
		canvas.off('selection:created');
		canvas.off('selection:updated');
		canvas.off('selection:cleared');
	});
</script>

<slot />
