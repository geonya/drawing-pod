<!-- src/routes/account/Avatar.svelte -->
<script lang="ts">
	import { user } from '$lib/store'
	import type { SupabaseClient } from '@supabase/supabase-js'
	import { createEventDispatcher } from 'svelte'

	export let url: string | null = null
	export let supabase: SupabaseClient
	export let clazz: string

	let avatarUrl: string | null = null
	let uploading = false
	let files: FileList
	const dispatch = createEventDispatcher()

	const downloadImage = async (path: string) => {
		try {
			console.log(path)
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
			user.update((user) => {
				if (user) {
					user.avatar_url = url
				}
				return user
			})
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
	<label class="cursor-pointer" for="single">
		<img
			src={avatarUrl || 'https://api.dicebear.com/5.x/thumbs/svg'}
			alt={avatarUrl ? 'Avatar' : 'No image'}
			class={'rounded-full shadow-md ' + clazz}
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
