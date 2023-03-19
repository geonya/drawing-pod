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
	login: async ({ request, locals, url }) => {
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

			console.log(data, err)

			if (err) {
				console.log(err)
				return fail(400, {
					message: 'Something went wrong.',
				})
			}

			throw redirect(303, data.url)
		}

		const body = Object.fromEntries(await request.formData())

		const { data, error: err } = await locals.supabase.auth.signInWithPassword({
			email: body.email as string,
			password: body.password as string,
		})

		console.log(err)

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

		throw redirect(303, '/')
	},
}
