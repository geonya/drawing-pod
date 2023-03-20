<script lang="ts">
	import { enhance, type SubmitFunction } from '$app/forms'
	import { goto } from '$app/navigation'
	import type { ActionData, PageData } from './$types'
	import Avatar from '$lib/components/ui/Avatar.svelte'
	import { user } from '$lib/store'

	export let data: PageData
	export let form: ActionData
	let { session, profile, supabase } = data
	$: $user = profile

	let profileForm: HTMLFormElement
	let loading = false
	let fullName: string | null = profile?.full_name
	let username: string | null = profile?.username
	let website: string | null = profile?.website
	let avatarUrl: string | null = $user?.avatar_url

	const handleSubmit: SubmitFunction = () => {
		loading = true
		return async ({ result }) => {
			loading = false
			if (result.type === 'success') {
				await goto('/login')
			}
		}
	}
</script>

<button class="fixed inset-0 z-40 h-full w-full" on:click={async () => await goto('/')} />
<div
	class="fixed top-1/2  left-1/2 z-50 grid w-[300px] max-w-lg -translate-x-1/2 -translate-y-1/2 grid-flow-col rounded-md border p-3 shadow-lg backdrop-blur-2xl md:w-1/2"
>
	<form
		class="space-y-2 md:w-full"
		method="post"
		action="?/update"
		use:enhance={handleSubmit}
		bind:this={profileForm}
	>
		<Avatar
			{supabase}
			bind:url={avatarUrl}
			on:upload={() => {
				profileForm.requestSubmit()
			}}
			clazz="w-24 h-24 md:w-32 md:h-32"
		/>
		<div class="">
			<label class="mb-1 block text-sm font-medium" for="email">Email</label>
			<input
				class="block w-full rounded-lg border border-base-300 bg-base-100 p-2.5 text-sm text-base-500 focus:border-blue-500 focus:ring-blue-500"
				id="email"
				type="text"
				value={session.user.email}
				disabled
			/>
		</div>

		<div class="">
			<label class="mb-1 block text-sm font-medium" for="fullName">Full Name</label>
			<input
				class="block w-full rounded-lg border border-base-300 bg-base-100 p-2.5 text-sm text-base-700 focus:border-blue-500 focus:ring-blue-500"
				id="fullName"
				name="fullName"
				type="text"
				value={form?.fullName ?? fullName}
			/>
		</div>

		<div class="">
			<label class="mb-1 block text-sm font-medium" for="username">Username</label>
			<input
				class="block w-full rounded-lg border border-base-300 bg-base-100 p-2.5 text-sm text-base-700 focus:border-blue-500 focus:ring-blue-500"
				id="username"
				name="username"
				type="text"
				value={form?.username ?? username}
			/>
		</div>

		<div class="">
			<label class="mb-1 block text-sm font-medium" for="website">website</label>
			<input
				class="block w-full rounded-lg border border-base-300 bg-base-100 p-2.5 text-sm text-base-700 focus:border-blue-500 focus:ring-blue-500"
				id="website"
				name="website"
				type="website"
				value={form?.website ?? website}
			/>
		</div>
		<div class="flex justify-between">
			<button
				type="submit"
				class="rounded-lg bg-blue-500 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 "
				value={loading ? 'Loading...' : 'Update'}
				disabled={loading}>업데이트</button
			>
			<button
				class="rounded-lg bg-red-500 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-300 "
				disabled={loading}
				formaction="?/signout">로그아웃</button
			>
		</div>

		<div />
	</form>
	<button class="absolute top-2 right-3 p-2 text-xl" on:click={async () => await goto('/')}>
		X
	</button>
</div>
