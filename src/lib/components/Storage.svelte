<script lang="ts">
	import { sb } from '$lib/store'
	import { onMount } from 'svelte'

	let images: any = []

	export let openStorage: boolean
	async function getCanvasImages() {
		if (!$sb) return
		try {
			const { data, error } = await $sb.storage.from('canvas').list()
			if (error) {
				throw error
			}
			return data
		} catch (error) {
			if (error instanceof Error) {
				console.log('Error downloading image: ', error.message)
			}
		}
	}
	async function downloadImage(path: string) {
		if (!$sb) return
		try {
			const { data, error } = await $sb.storage.from('canvas').download(path)
			if (error) {
				throw error
			}
			const url = URL.createObjectURL(data)
			return url
		} catch (error) {
			if (error instanceof Error) {
				console.log('Error downloading image: ', error.message)
			}
		}
	}
	onMount(async () => {
		const data = await getCanvasImages()
		if (data) {
			images = await Promise.all(
				data.map(async (item: any) => {
					const url = await downloadImage(item.name)
					return url
				}),
			)
		}
	})
</script>

<button
	class="fixed inset-0 z-40 h-full w-full"
	on:click={() => {
		openStorage = false
	}}
/>
<div class="fixed top-16 right-5 z-50 w-64 rounded-md shadow-lg backdrop-blur-md">
	<div class="flex flex-col">
		<div class="flex items-center justify-between border-b px-4 py-2">
			<span>Canvas Storage</span>
			<button
				class="flex h-6 w-6 items-center justify-center rounded-full hover:bg-base-200"
				on:click={() => {
					openStorage = false
				}}
			/>
		</div>
		<div class="h-[80vh] items-center space-y-2 overflow-y-scroll p-3">
			{#each images || [] as item}
				<button
					class="h-32 w-full cursor-pointer border bg-cover bg-center bg-no-repeat shadow-md"
					style="background-image:url({item});"
				/>
			{/each}
		</div>
	</div>
</div>
