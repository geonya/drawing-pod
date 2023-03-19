// src/routes/+layout.ts
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public'
import type { User } from '$lib/types'
import { createSupabaseLoadClient } from '@supabase/auth-helpers-sveltekit'
import type { LayoutLoad } from './$types'

export const load: LayoutLoad = async ({ fetch, data, depends }) => {
	depends('supabase:auth')

	const supabase = createSupabaseLoadClient({
		supabaseUrl: PUBLIC_SUPABASE_URL,
		supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
		event: { fetch },
		serverSession: data.session,
	})

	const {
		data: { session },
	} = await supabase.auth.getSession()

	if (session) {
		const { data: profile } = await supabase
			.from('profiles')
			.select(`username, full_name, website, avatar_url`)
			.eq('id', session.user.id)
			.single()
		return { supabase, session, profile }
	}

	return { supabase, session }
}
