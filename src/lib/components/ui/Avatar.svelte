<!-- src/routes/account/Avatar.svelte -->
<script lang="ts">
	import type { SupabaseClient } from '@supabase/supabase-js'
	import { createEventDispatcher } from 'svelte'

	export let size = 20
	export let url: string | null
	export let supabase: SupabaseClient

	let avatarUrl: string | null = null
	let uploading = false
	let files: FileList
	const dispatch = createEventDispatcher()

	const downloadImage = async (path: string) => {
		try {
			const { data, error } = await supabase.storage.from('avatars').download(path)
			if (error) {
				throw error
			}
			const url = URL.createObjectURL(data)
			avatarUrl = url
		} catch (error) {
			if (error instanceof Error) {
				console.log('Error downloading image: ', error.message)
			}
		}
	}

	const uploadAvatar = async () => {
		try {
			uploading = true

			if (!files || files.length === 0) {
				throw new Error('You must select an image to upload.')
			}
			const file = files[0]
			const fileExt = file.name.split('.').pop()
			url = `${Math.random()}.${fileExt}`
			let { error } = await supabase.storage.from('avatars').upload(url, file)
			if (error) {
				throw error
			}
			dispatch('upload')
		} catch (error) {
			if (error instanceof Error) {
				alert(error.message)
			}
		} finally {
			uploading = false
		}
	}

	$: if (url) downloadImage(url)
</script>

<div class="grid place-content-center">
	<input type="hidden" name="avatarUrl" value={url} />
	<label class="" for="single">
		<img
			src={avatarUrl || 'https://api.dicebear.com/5.x/thumbs/svg'}
			alt={avatarUrl ? 'Avatar' : 'No image'}
			class="h-24 w-24 rounded-full shadow-md md:h-32 md:w-32"
			style=""
		/>
	</label>
	<input
		style="visibility: hidden; position:absolute;"
		type="file"
		id="single"
		accept="image/*"
		bind:files
		on:change={uploadAvatar}
		disabled={uploading}
	/>
</div>
