<script lang="ts">
	import { goto } from '$app/navigation'
	import { user } from '$lib/store'
	import type { MenuTitle } from '$lib/types'
	import { fade } from 'svelte/transition'
	export let isMenuOpen: boolean
	export let menuTitle: MenuTitle | null = null
</script>

<nav
	transition:fade={{ duration: 100 }}
	class="absolute top-11 -left-9 z-50 grid w-28 grid-flow-row rounded-md border shadow-lg backdrop-blur-md"
>
	<ul class="flex flex-col overflow-hidden">
		<li class="">
			<button
				class="flex w-full justify-start px-3 py-2 hover:cursor-pointer hover:bg-base-100"
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
				class="flex w-full justify-start px-3 py-2 hover:cursor-pointer hover:bg-base-100"
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
				class="flex w-full justify-start px-3 py-2 hover:cursor-pointer hover:bg-base-100"
				on:click={async () => {
					isMenuOpen = false
					if ($user) {
						await goto('/login')
					} else {
						await goto('/account')
					}
				}}
			>
				<span class="">{$user ? 'Account' : 'Login'}</span>
			</button>
		</li>
	</ul>
</nav>
