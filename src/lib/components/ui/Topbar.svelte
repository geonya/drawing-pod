<script lang="ts">
	import type { SupabaseClient } from '@supabase/supabase-js'
	import SocialPanel from './panel/SocialPanel.svelte'
	import TopPanel from './panel/TopPanel.svelte'
	import TopMenu from './TopMenu.svelte'
	export let supabase: SupabaseClient
</script>

<div class="fixed top-5 left-0 right-0 z-50 mx-auto w-full ">
	<TopMenu {supabase} />
	<TopPanel {supabase} />
	<SocialPanel {supabase} />
</div>
