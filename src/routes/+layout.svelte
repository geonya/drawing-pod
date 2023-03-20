<script lang="ts">
	import '../app.postcss'
	import { invalidate } from '$app/navigation'
	import { onMount } from 'svelte'
	import type { LayoutData } from './$types'
	import { Canvas } from '$lib'
	import { user, sb } from '$lib/store'
	export let data: LayoutData

	$: ({ supabase, session, profile } = data)

	$: if (profile) $user = profile
	$: if (supabase) $sb = supabase

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange(() => {
			console.log('Auth state change detected')
			invalidate('supabase:auth')
		})
		return () => data.subscription.unsubscribe()
	})
</script>

<Canvas />
<slot />
<footer class="fixed bottom-0 right-0 left-0 grid h-12 w-full place-content-center">
	Copyright Geony 2023. All rights reserved.
</footer>
