<script lang="ts">
	import { fade } from 'svelte/transition'
	export let isMenuOpen: boolean
</script>

<nav
	transition:fade={{ duration: 100 }}
	class="absolute top-9 -left-10 z-50 grid w-28 grid-flow-row rounded-md border shadow-lg backdrop-blur-md"
>
	<ul class="flex flex-col overflow-hidden">
		<li class="px-2 py-1 hover:cursor-pointer hover:bg-base-100"><button>About</button></li>
		<li class="px-2 py-1 hover:cursor-pointer hover:bg-base-100"><button>Preference</button></li>
		<li class="px-2 py-1 hover:cursor-pointer hover:bg-base-100"><button>Save</button></li>
		<li class="px-2 py-1 hover:cursor-pointer hover:bg-base-100"><button>Quit</button></li>
	</ul>
</nav>
{#if isMenuOpen}
	<button class="fixed inset-0 z-40 h-full w-full" on:click={() => (isMenuOpen = false)} />
{/if}
