<script lang="ts">
	import { fabricCanvas } from '$lib/store';
	import { onDestroy, onMount } from 'svelte';
	$: canvas = $fabricCanvas!;

	const onResize = () => {};

	onMount(() => {});
</script>

<div data-id="setup" style="display: none;" />
