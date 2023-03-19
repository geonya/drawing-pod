<script lang="ts">
	import { Auth } from '@supabase/auth-ui-svelte'
	import { ThemeSupa } from '@supabase/auth-ui-shared'
	import type { PageData } from './$types'

	export let data: PageData
</script>

<div class="row flex-center flex">
	<div class="col-6 form-widget">
		<Auth supabaseClient={data.supabase} providers={['google']} appearance={{ theme: ThemeSupa }} />
	</div>
</div>
