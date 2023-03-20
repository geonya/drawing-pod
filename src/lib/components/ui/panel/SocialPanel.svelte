<script lang="ts">
	import Icon from '../Icon.svelte'
	import type { Session, SupabaseClient } from '@supabase/supabase-js'
	import { goto } from '$app/navigation'
	import { sb, user } from '$lib/store'
	import { control } from '$lib/components/canvas/canvas.store'

	let avatarUrl = ''

	const downloadAvatar = async (path: string) => {
		if (!$sb) return
		try {
			const { data, error } = await $sb.storage.from('avatars').download(path)
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

	async function onKakaoShare() {
		if (!$sb) return
		if (!window.Kakao) {
			console.error('Kakao is not loaded.')
			return
		}
		try {
			const file = $control?.getCanvasPNGFile()
			if (!file) return
			const fileExt = file.name.split('.').pop()
			const url = `${Math.random()}.${fileExt}`
			let { data: pathData, error } = await $sb.storage.from('canvas').upload(url, file)
			if (error) {
				console.error('upload error', error)
			}
			if (!pathData?.path) return
			const { path } = pathData
			const { data } = $sb.storage.from('canvas').getPublicUrl(path)
			if (!data?.publicUrl) return
			const { publicUrl } = data
			window.Kakao.Share.sendDefault({
				objectType: 'feed',
				content: {
					title: '오늘 내가 그린고 어때?',
					description: '드로잉팟에서 그려보아떠 👍',
					imageUrl: publicUrl,
					link: {
						mobileWebUrl: publicUrl,
						webUrl: publicUrl,
					},
				},
				social: {
					likeCount: 10,
					commentCount: 20,
					sharedCount: 30,
				},
				buttons: [
					{
						title: '드로잉팟으로 그려보기',
						link: {
							mobileWebUrl: publicUrl,
							webUrl: publicUrl,
						},
					},
				],
			})
		} catch (err) {
			console.error(err)
		}
	}

	$: if ($user?.avatar_url) downloadAvatar($user?.avatar_url)
	$: if (!$user) avatarUrl = ''
</script>

<div class="absolute top-0 right-5">
	<div class="flex h-full items-center justify-center space-x-3">
		<button class="rounded-md bg-blue-400 p-2 text-white" on:click={onKakaoShare}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width={1.5}
				stroke="currentColor"
				class="h-4 w-4"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
				/>
			</svg>
		</button>
		<button
			class="flex flex-shrink items-center space-x-2 rounded-md border px-2 py-1 hover:bg-base-100"
		>
			<Icon name="storage" />
			<span>창꼬</span>
		</button>

		<!-- Avatar -->
		<button
			class="h-8 w-8 rounded-full bg-cover bg-center bg-no-repeat"
			style="background-image:url({avatarUrl || 'https://api.dicebear.com/5.x/thumbs/svg'});"
			on:click={async () => await goto('/account')}
		/>
	</div>
</div>
