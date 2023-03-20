<script lang="ts">
	import { goto } from '$app/navigation'
	import { sb } from '$lib/store'
	import { onMount } from 'svelte'
	import { control } from './canvas/canvas.store'

	let images: any = []
	let imageModal: { path: string; url: string } | null = null

	export let openStorage: boolean
	async function getCanvasImages() {
		if (!$sb) return
		try {
			const { data, error } = await $sb.storage
				.from('canvas')
				.list('', { limit: 20, sortBy: { column: 'created_at', order: 'desc' } })
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
	async function downloadImage(path: string | null) {
		if (!$sb || !path) return
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
	function onStorageItemClick(item: { path: string; url: string }) {
		imageModal = item
	}

	async function onLoadCanvasJSONData(path: string | null | undefined) {
		if (!$sb || !path) return
		try {
			const {
				data: { user },
			} = await $sb?.auth.getUser()
			if (!user) {
				await goto('/login')
				return
			}
			console.log('path', path)
			const { data, error } = await $sb.from('canvas').select('data').eq('path', path).single()
			if (error) {
				console.log(error)
				return
			}
			console.log('data', data)
			if (!data) return
			const canvasData = data.data
			if (canvasData) {
				const canvas = $control?.getCanvas()
				if (canvas) {
					canvas.loadFromJSON(canvasData, () => {
						canvas.renderAll()
						imageModal = null
					})
				}
			}
		} catch (error) {
			console.error(error)
		}
	}

	onMount(async () => {
		const data = await getCanvasImages()
		if (data) {
			images = await Promise.all(
				data.map(async (item: any) => {
					const url = await downloadImage(item.name)
					return {
						path: item.name,
						url,
					}
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
					style="background-image:url({item.url});"
					on:click={() => onStorageItemClick(item)}
				/>
			{/each}
		</div>
	</div>
</div>
{#if imageModal}
	<div
		class="fixed top-1/2 left-1/2 z-50 h-[50vh] w-2/3 -translate-x-1/2 -translate-y-1/2 rounded-md border bg-white bg-cover bg-center bg-no-repeat shadow-lg"
		style="background-image:url({imageModal.url});"
	>
		<div class="flex h-full w-full items-end justify-center text-lg">
			<div>
				<h1 class="mb-1">이 디자인을 캔버스에 적용해볼까요?</h1>
				<div class="mb-3 flex w-full justify-around">
					<button
						class="inline-flex rounded-md border px-2 py-1"
						on:click={async () => {
							await onLoadCanvasJSONData(imageModal?.path)
						}}>Yes</button
					>
					<button
						class="inline-flex rounded-md border px-2 py-1"
						on:click={() => (imageModal = null)}>No</button
					>
				</div>
			</div>
		</div>
	</div>
{/if}
