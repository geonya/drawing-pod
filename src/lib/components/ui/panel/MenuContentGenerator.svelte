<script lang="ts">
	import type { MenuTitle } from '$lib/types'
	import { fade } from 'svelte/transition'

	export let menuTitle: MenuTitle | null = null
</script>

{#if menuTitle === 'about'}
	<div
		transition:fade={{ duration: 100 }}
		class="fixed top-1/2 left-1/2 z-30 grid h-1/2 w-1/2 -translate-x-1/2 -translate-y-1/2 grid-flow-col rounded-md border shadow-lg backdrop-blur-lg"
	>
		<div class="flex items-center justify-center">
			<img src="https://avatars.githubusercontent.com/u" alt="drawing pod logo" width="300" />
		</div>
		<div class="flex flex-col items-end justify-between p-10">
			<div />
			<div>
				<h1 class="text-center text-2xl">Drawing Pod</h1>
				<h3>Drawing pod is a simple 2D - 3D drawing app.</h3>
				<p>you can draw like a wizard!</p>
			</div>
			<div>
				<p>
					<strong>Author:</strong> geony
				</p>
				<p>
					<strong>Version:</strong> 0.0.1
				</p>

				<p>
					<strong>License:</strong> MIT
				</p>
				<p>
					<strong>Source:</strong> <a href="https://github.com/geonya/drawingpod">Github</a>
				</p>
			</div>
		</div>
		<button class="absolute top-3 right-3 p-2" on:click={() => (menuTitle = null)}> X </button>
	</div>
{/if}
{#if menuTitle === 'save'}
	<div
		transition:fade={{ duration: 100 }}
		class="fixed top-1/2 left-1/2 z-30 -translate-x-1/2 -translate-y-1/2"
	>
		<div class="flex h-full w-full items-center justify-center">
			<h1 class="text-lg">Saving...</h1>
		</div>
	</div>
{/if}
{#if menuTitle === 'preferences'}
	<div
		transition:fade={{ duration: 100 }}
		class="fixed top-1/2 left-1/2 z-30 grid h-1/2 w-1/2 -translate-x-1/2 -translate-y-1/2 grid-flow-col rounded-md border bg-white shadow-lg backdrop-blur-md"
	>
		<div class="flex h-full w-full items-center justify-center">
			<h1>Prefrences Tab Working....</h1>
		</div>
		<button class="absolute top-3 right-3 p-2" on:click={() => (menuTitle = null)}> X </button>
	</div>
{/if}
{#if menuTitle === 'help'}
	<div
		transition:fade={{ duration: 100 }}
		class="fixed top-1/2 left-1/2 z-30 grid h-1/2 w-1/2 -translate-x-1/2 -translate-y-1/2 grid-flow-col rounded-md border bg-white shadow-lg backdrop-blur-md"
	>
		<div class="flex h-full w-full items-center justify-center">
			<h1>You can ask help me anytime...!</h1>
			<h3>geony@signpod.co.kr</h3>
		</div>
		<button class="absolute top-3 right-3 p-2" on:click={() => (menuTitle = null)}> X </button>
	</div>
{/if}
