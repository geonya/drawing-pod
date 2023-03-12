<script lang="ts">
	import { Canvas } from '$lib'
	import BjsCanvas from '$lib/components/babylonjs/BJSCanvas.svelte'
</script>

<main class="h-screen w-full">
	<Canvas />
	<div class="absolute right-32 top-1/2 z-50 -translate-y-1/2">
		<BjsCanvas />
	</div>
</main>

<footer class="fixed bottom-0 right-0 left-0 grid h-12 w-full place-content-center">
	Copyright Geony 2023. All rights reserved.
</footer>
