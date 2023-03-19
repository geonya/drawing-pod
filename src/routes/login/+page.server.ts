// src/routes/+page.server.ts
import { fail, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'
import { AuthApiError, type Provider } from '@supabase/supabase-js'

const OAUTH_PROVIDERS = ['google']

export const load: PageServerLoad = async ({ url, locals: { getSession } }) => {
	const session = await getSession()

	// if the user is already logged in return them to the account page
	if (session) {
		throw redirect(303, '/account')
	}

	return {
		data: {
			url: url.origin,
		},
	}
}

export const actions: Actions = {
	default: async ({ request, locals, url }) => {
		const provider = url.searchParams.get('provider') as Provider
		if (provider) {
			if (!OAUTH_PROVIDERS.includes(provider)) {
				return fail(400, {
					error: 'Provider not supported.',
				})
			}
			const { data, error: err } = await locals.supabase.auth.signInWithOAuth({
				provider: provider,
			})

			if (err) {
				console.log(err)
				return fail(400, {
					message: 'Something went wrong.',
				})
			}

			throw redirect(303, data.url)
		}

		const body = Object.fromEntries(await request.formData())

		const { data, error: err } = await locals.supabase.auth.signInWithOtp({
			email: body.email as string,
			options: {
				emailRedirectTo: '/account',
			},
		})

		if (err) {
			if (err instanceof AuthApiError && err.status === 400) {
				return fail(400, {
					error: 'Invalid credentials',
				})
			}
			return fail(500, {
				message: 'Server error. Try again later.',
			})
		}

		return {
			success: true,
		}
	},
}
