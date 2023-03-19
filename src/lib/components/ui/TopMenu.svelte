<script lang="ts">
	import type { MenuTitle } from '$lib/types'
	import Icon from './Icon.svelte'
	import MenuContentGenerator from './MenuContentGenerator.svelte'
	import MenuPanel from './panel/MenuPanel.svelte'
	let isMenuOpen = false
	let menuTitle: MenuTitle | null = null
	function toggleMenu() {
		isMenuOpen = !isMenuOpen
	}
	function closeMenu() {
		isMenuOpen = false
	}
</script>

<div class="absolute left-20 top-0">
	<button class="p-2 hover:rounded-full hover:bg-base-100 hover:opacity-80" on:click={toggleMenu}>
		<Icon name="menu" class="h-6 w-6" />
	</button>
	{#if isMenuOpen}
		<MenuPanel on:close={closeMenu} bind:isMenuOpen bind:menuTitle />
	{/if}
</div>
{#if isMenuOpen}
	<button
		class="fixed inset-0 z-30 h-full w-full"
		on:click={() => {
			isMenuOpen = false
		}}
	/>
{/if}
{#if menuTitle}
	<MenuContentGenerator bind:menuTitle />
{/if}
