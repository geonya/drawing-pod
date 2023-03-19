<script lang="ts">
	import type { MenuTitle } from '$lib/types'
	import { fade } from 'svelte/transition'

	export let menuTitle: MenuTitle | null = null
</script>

<button class="fixed inset-0 z-40 h-full w-full" on:click={() => (menuTitle = null)} />

{#if menuTitle === 'about'}
	<div
		transition:fade={{ duration: 100 }}
		class="fixed top-1/2 left-1/2 z-50 grid h-1/2 w-1/2 -translate-x-1/2 -translate-y-1/2 grid-flow-col rounded-md border shadow-lg backdrop-blur-lg"
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
		class="fixed inset-0 z-50 grid h-full w-full place-content-center"
	>
		<div role="status">
			<svg
				aria-hidden="true"
				class="mb-2 h-10 w-10 animate-spin fill-blue-600 text-gray-200 dark:text-gray-600"
				viewBox="0 0 100 101"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
					fill="currentColor"
				/>
				<path
					d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
					fill="currentFill"
				/>
			</svg>
			<span class="text-center">저장 듕</span>
		</div>
	</div>
{/if}
{#if menuTitle === 'preferences'}
	<div
		transition:fade={{ duration: 100 }}
		class="fixed top-1/2 left-1/2 z-50 grid h-1/2 w-1/2 -translate-x-1/2 -translate-y-1/2 grid-flow-col rounded-md border bg-white shadow-lg backdrop-blur-md"
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
		class="fixed top-1/2 left-1/2 z-50 grid h-1/2 w-1/2 -translate-x-1/2 -translate-y-1/2 grid-flow-col rounded-md border bg-white shadow-lg backdrop-blur-md"
	>
		<div class="flex h-full w-full flex-col items-center justify-center space-y-3">
			<h3>geony@signpod.co.kr</h3>
			<a href="https://github.com/geonya">Github : geonya</a>
		</div>
		<button class="absolute top-3 right-3 p-2" on:click={() => (menuTitle = null)}> X </button>
	</div>
{/if}
