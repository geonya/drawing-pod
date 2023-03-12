<script lang="ts">
	import { onMount } from 'svelte'
	import { renderer } from '$lib/store'
	import { shape } from './Renderer'
	export let canvas: fabric.Canvas

	$: {
		if ($shape) {
			$renderer?.onUpdateObject($shape)
		}
	}

	onMount(() => {
		if (canvas) {
			canvas.on('selection:created', (e) => $renderer?.onObjectSelect(e))
			canvas.on('selection:updated', (e) => $renderer?.onObjectSelectUpdate(e))
			canvas.on('object:selected', (e) => $renderer?.onObjectSelect(e))
			canvas.on('object:modified', (e) => $renderer?.onObjectSelectUpdate(e))
			canvas.on('selection:cleared', () => $renderer?.onObjectSelectClear())
		}
	})
</script>

<slot />
