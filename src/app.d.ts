// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import { SupabaseClient, Session } from '@supabase/supabase-js'

declare global {
	interface Window {
		Kakao: any
		kakao: any
	}
	namespace App {
		// interface Error {}
		interface Locals {
			supabase: SupabaseClient
			getSession(): Promise<Session | null>
		}
		interface PageData {
			session: Session | null
		}
		// interface Platform {}
	}
}

export {}
