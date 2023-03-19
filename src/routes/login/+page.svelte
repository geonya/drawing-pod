<script lang="ts">
	import type { Provider } from '@supabase/supabase-js'
	import { enhance, type SubmitFunction } from '$app/forms'
	import type { LayoutData } from '../$types'
	import { goto } from '$app/navigation'

	export let data: LayoutData

	let email = ''
	let checkMail = false
	let loading = false
	let err: string | undefined = undefined

	$: ({ supabase } = data)

	const signInWithProvider = async (provider: Provider) => {
		const { data, error } = await supabase.auth.signInWithOAuth({
			provider,
		})
	}
	const submitSocialLogin: SubmitFunction = async ({ action, cancel }) => {
		switch (action.searchParams.get('provider')) {
			case 'google':
				await signInWithProvider('google')
				break
			case 'github':
				await signInWithProvider('github')
				break
			default:
				break
		}
		cancel()
	}

	const submitEmailLogin: SubmitFunction = async () => {
		if (!email) return
		loading = true
		const { data, error } = await supabase.auth.signInWithOtp({
			email,
			options: {
				emailRedirectTo: '/account',
			},
		})
		loading = false
		console.log(error?.message)
		err = error?.message
		if (!error) {
			checkMail = true
		}
	}
</script>

<button class="fixed inset-0 z-40 h-full w-full" on:click={async () => await goto('/')} />

<div
	class="fixed top-1/2  left-1/2 z-50 flex w-[300px] -translate-x-1/2 -translate-y-1/2 flex-col items-center rounded-md border p-3 shadow-lg backdrop-blur-2xl"
>
	{#if checkMail}
		<div
			class="absolute -top-12 left-0 flex w-full items-center rounded-full bg-base-100 px-3 py-2"
		>
			<div
				class="inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-green-500 text-base-100"
			>
				<svg
					aria-hidden="true"
					class="h-5 w-5"
					fill="currentColor"
					viewBox="0 0 20 20"
					xmlns="http://www.w3.org/2000/svg"
					><path
						fill-rule="evenodd"
						d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
						clip-rule="evenodd"
					/></svg
				>
				<span class="sr-only">Check icon</span>
			</div>
			<div class="ml-3 text-sm font-normal">메일을 확인하시고 로그인을 완료해주세요.</div>
			<button
				type="button"
				class="ml-auto inline-flex h-5 w-5 rounded-lg text-base-400"
				data-dismiss-target="#toast-success"
				aria-label="Close"
				on:click={() => (checkMail = false)}
			>
				<span class="sr-only">Close</span>
				<svg
					aria-hidden="true"
					class="h-5 w-5"
					fill="currentColor"
					viewBox="0 0 20 20"
					xmlns="http://www.w3.org/2000/svg"
					><path
						fill-rule="evenodd"
						d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
						clip-rule="evenodd"
					/></svg
				>
			</button>
		</div>
	{/if}
	<form method="POST" use:enhance={submitSocialLogin} class="mb-3 flex w-full justify-around">
		<button
			formaction="?/login&provider=google"
			class="rounded-md border border-base-200 px-4 py-2 hover:border-base-100 hover:bg-base-100 hover:bg-opacity-30"
		>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48px" height="48px"
				><path
					fill="#FFC107"
					d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
				/><path
					fill="#FF3D00"
					d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
				/><path
					fill="#4CAF50"
					d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
				/><path
					fill="#1976D2"
					d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
				/></svg
			>
			<span>Google</span>
		</button>
		<button
			formaction="?/login&provider=github"
			class="rounded-md border border-base-200 px-4 py-2 hover:border-base-100 hover:bg-base-100 hover:bg-opacity-30"
			><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="50px" height="50px">
				<path
					d="M17.791,46.836C18.502,46.53,19,45.823,19,45v-5.4c0-0.197,0.016-0.402,0.041-0.61C19.027,38.994,19.014,38.997,19,39 c0,0-3,0-3.6,0c-1.5,0-2.8-0.6-3.4-1.8c-0.7-1.3-1-3.5-2.8-4.7C8.9,32.3,9.1,32,9.7,32c0.6,0.1,1.9,0.9,2.7,2c0.9,1.1,1.8,2,3.4,2 c2.487,0,3.82-0.125,4.622-0.555C21.356,34.056,22.649,33,24,33v-0.025c-5.668-0.182-9.289-2.066-10.975-4.975 c-3.665,0.042-6.856,0.405-8.677,0.707c-0.058-0.327-0.108-0.656-0.151-0.987c1.797-0.296,4.843-0.647,8.345-0.714 c-0.112-0.276-0.209-0.559-0.291-0.849c-3.511-0.178-6.541-0.039-8.187,0.097c-0.02-0.332-0.047-0.663-0.051-0.999 c1.649-0.135,4.597-0.27,8.018-0.111c-0.079-0.5-0.13-1.011-0.13-1.543c0-1.7,0.6-3.5,1.7-5c-0.5-1.7-1.2-5.3,0.2-6.6 c2.7,0,4.6,1.3,5.5,2.1C21,13.4,22.9,13,25,13s4,0.4,5.6,1.1c0.9-0.8,2.8-2.1,5.5-2.1c1.5,1.4,0.7,5,0.2,6.6c1.1,1.5,1.7,3.2,1.6,5 c0,0.484-0.045,0.951-0.11,1.409c3.499-0.172,6.527-0.034,8.204,0.102c-0.002,0.337-0.033,0.666-0.051,0.999 c-1.671-0.138-4.775-0.28-8.359-0.089c-0.089,0.336-0.197,0.663-0.325,0.98c3.546,0.046,6.665,0.389,8.548,0.689 c-0.043,0.332-0.093,0.661-0.151,0.987c-1.912-0.306-5.171-0.664-8.879-0.682C35.112,30.873,31.557,32.75,26,32.969V33 c2.6,0,5,3.9,5,6.6V45c0,0.823,0.498,1.53,1.209,1.836C41.37,43.804,48,35.164,48,25C48,12.318,37.683,2,25,2S2,12.318,2,25 C2,35.164,8.63,43.804,17.791,46.836z"
				/></svg
			>
			<span>Github</span>
		</button>
	</form>
	<form class="w-full space-y-4" method="post" use:enhance={submitEmailLogin}>
		<div class="">
			<label class="mb-1 block text-sm font-medium" for="email">Email</label>
			<input
				class="block w-full rounded-lg border border-base-300 p-2.5 text-sm text-base-700 focus:border-blue-500 focus:ring-blue-500"
				id="email"
				name="email"
				type="text"
				bind:value={email}
				disabled={checkMail}
			/>
		</div>

		<button
			type="submit"
			class={'w-full rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-300 ' +
				(loading ? ' cursor-not-allowed opacity-50 ' : '') +
				(checkMail ? ' bg-green-500' : '')}
			disabled={loading || checkMail}
		>
			{#if loading}
				<span>로딩 듕...</span>
			{:else if checkMail}
				<span>메일 전송 완료</span>
			{:else}
				<span>로그인</span>
			{/if}
		</button>
		{#if err}
			<span class="inline-block w-full text-center text-red-500">{err}</span>
		{/if}
	</form>
</div>
