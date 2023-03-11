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
			canvas.on('selection:created', () => $renderer?.onObjectSelect())
			canvas.on('selection:updated', () => $renderer?.onObjectSelectUpdate())
			canvas.on('selection:cleared', () => $renderer?.onObjectSelectClear())
		}
	})
</script>

<slot />
