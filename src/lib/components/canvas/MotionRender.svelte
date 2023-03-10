<script lang="ts">
	import type { Motion } from './Motion'

	export let motion: Motion
</script>

<svelte:window on:keydown={(e) => motion?.onKeyDown(e)} on:keyup={(e) => motion?.onKeyUp(e)} />
