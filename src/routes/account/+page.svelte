<!-- src/routes/account/+page.svelte -->
<script lang="ts">
	import { enhance } from '$app/forms'
	import { goto } from '$app/navigation'
	import type { ActionData, PageData } from './$types'
	import Avatar from '$lib/components/ui/Avatar.svelte'

	export let data: PageData
	export let form: ActionData
	let { session, profile, supabase } = data
	let profileForm: any
	let loading = false
	let fullName: string | null = profile?.full_name
	let username: string | null = profile?.username
	let website: string | null = profile?.website
	let avatarUrl: string | null = profile?.avatar_url

	function handleSubmit() {
		loading = true
		return async () => {
			loading = false
		}
	}
</script>

<button class="fixed inset-0 z-40 h-full w-full" on:click={async () => await goto('/')} />
<div
	class="fixed top-1/2 left-1/2 z-50 grid max-w-lg -translate-x-1/2 -translate-y-1/2 grid-flow-col rounded-md border p-3 shadow-lg backdrop-blur-2xl md:w-1/2"
>
	<form
		class="w-[300px] md:w-full"
		method="post"
		action="?/update"
		use:enhance={handleSubmit}
		bind:this={profileForm}
	>
		<Avatar
			{supabase}
			bind:url={avatarUrl}
			size={10}
			on:upload={() => {
				profileForm.requestSubmit()
			}}
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
		<div>
			<button
				type="submit"
				class="w-full rounded-lg bg-blue-500 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 sm:w-auto"
				value={loading ? 'Loading...' : 'Update'}
				disabled={loading}>업데이트</button
			>
			<button
				class="w-full rounded-lg bg-red-500 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-300 sm:w-auto"
				disabled={loading}
				formaction="?/signout">로그아웃</button
			>
		</div>

		<div />
	</form>
</div>
