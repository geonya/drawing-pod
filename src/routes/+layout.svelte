<script lang="ts">
	import '../app.postcss'
	import { invalidate } from '$app/navigation'
	import { onMount } from 'svelte'
	import type { LayoutData } from './$types'

	export let data: LayoutData

	$: ({ supabase } = data)

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange(() => {
			console.log('Auth state change detected')
			invalidate('supabase:auth')
		})
		return () => data.subscription.unsubscribe()
	})
</script>

<slot />
