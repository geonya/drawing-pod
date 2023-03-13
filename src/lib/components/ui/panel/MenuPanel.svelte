<script lang="ts">
	import type { MenuTitle } from '$lib/types'
	import { fade } from 'svelte/transition'
	export let isMenuOpen: boolean
	export let menuTitle: MenuTitle | null = null
</script>

<nav
	transition:fade={{ duration: 100 }}
	class="absolute top-9 -left-10 z-50 grid w-28 grid-flow-row rounded-md border shadow-lg backdrop-blur-md"
>
	<ul class="flex flex-col overflow-hidden">
		<li class="">
			<button
				class="flex w-full justify-start px-2 py-1 hover:cursor-pointer hover:bg-base-100"
				on:click={() => {
					menuTitle = 'about'
					isMenuOpen = false
				}}
			>
				<span class="">About</span>
			</button>
		</li>
		<li class="">
			<button
				class="flex w-full justify-start px-2 py-1 hover:cursor-pointer hover:bg-base-100"
				on:click={() => {
					menuTitle = 'save'
					isMenuOpen = false
					const timeout = setTimeout(() => {
						menuTitle = null
					}, 1000)
					return () => {
						clearTimeout(timeout)
					}
				}}
			>
				<span class="">Save</span>
			</button>
		</li>
		<li class="">
			<button
				class="flex w-full justify-start px-2 py-1 hover:cursor-pointer hover:bg-base-100"
				on:click={() => {
					menuTitle = 'preferences'
					isMenuOpen = false
				}}
			>
				<span class="">Preferences</span>
			</button>
		</li>

		<li class="">
			<button
				class="flex w-full justify-start px-2 py-1 hover:cursor-pointer hover:bg-base-100"
				on:click={() => {
					menuTitle = 'preferences'
					isMenuOpen = false
				}}
			>
				<span class="">help</span>
			</button>
		</li>
	</ul>
</nav>
