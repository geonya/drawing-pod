<script lang="ts">
	import '../app.postcss'
	import { invalidate } from '$app/navigation'
	import { onMount } from 'svelte'
	import type { LayoutData } from './$types'
	import { Canvas } from '$lib'
	import { user } from '$lib/store'
	import { PUBLIC_KAKAO_KEY } from '$env/static/public'
	export let data: LayoutData

	$: ({ supabase, session, profile } = data)

	$: if (profile) $user = profile

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange(() => {
			console.log('Auth state change detected')
			invalidate('supabase:auth')
		})
		if (!window?.kakao?.isInitialized()) {
			window?.kakao?.init(PUBLIC_KAKAO_KEY)
		}
		return () => data.subscription.unsubscribe()
	})
</script>

<Canvas {supabase} />
<slot />
<footer class="fixed bottom-0 right-0 left-0 grid h-12 w-full place-content-center">
	Copyright Geony 2023. All rights reserved.
</footer>
