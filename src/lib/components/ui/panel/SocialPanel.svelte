<script lang="ts">
	import Icon from '../Icon.svelte'
	import { goto } from '$app/navigation'
	import { sb, user } from '$lib/store'
	import { control } from '$lib/components/canvas/canvas.store'
	import Storage from '$lib/components/Storage.svelte'

	let avatarUrl = ''
	let openStorage = false
	async function onKakaoShare() {
		if (!window.Kakao) {
			console.error('Kakao is not loaded.')
			return
		}
		try {
			const publicUrl = await $control?.getCanvasPNGPublicUrl($sb)
			if (!publicUrl) return
			window.Kakao.Share.sendDefault({
				objectType: 'feed',
				content: {
					title: '드로잉팟 그림 공유 😇',
					description: '이쁘게 그려보아요 🎨',
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
</script>

<div class="absolute top-0 right-5">
	<div class="flex h-full items-center justify-center space-x-3">
		<button
			class="rounded-md bg-blue-400 p-2 text-white"
			on:click={async () => await onKakaoShare()}
		>
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
			on:click={() => {
				openStorage = !openStorage
			}}
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

<!-- Storage -->
{#if openStorage}
	<Storage bind:openStorage />
{/if}
