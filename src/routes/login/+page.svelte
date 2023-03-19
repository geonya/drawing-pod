<script lang="ts">
	import type { Provider } from '@supabase/supabase-js'
	import { enhance, type SubmitFunction } from '$app/forms'
	import type { LayoutData } from '../$types'

	export let data: LayoutData

	$: ({ supabase } = data)

	const signInWithProvider = async (provider: Provider) => {
		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: provider,
			options: {
				queryParams: {
					access_type: 'offline',
					prompt: 'consent',
				},
			},
		})
		console.log(data)
		console.log(error)
	}
	const submitSocialLogin: SubmitFunction = async ({ action, cancel }) => {
		switch (action.searchParams.get('provider')) {
			case 'google':
				await signInWithProvider('google')
				break
			default:
				break
		}
		cancel()
	}
</script>

<div>
	<h1>Login</h1>
	<form method="post">
		<label for=""> Email </label>
		<input type="text" name="email" />
		<label for=""> Password </label>
		<input type="password" name="password" />
		<button type="submit" class="">Login</button>
	</form>
	<form class="socials" method="POST" use:enhance={submitSocialLogin}>
		<button formaction="?/login&provider=google" class="border px-3 py-1">Google</button>
	</form>
</div>
