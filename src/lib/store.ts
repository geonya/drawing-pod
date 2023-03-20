import type { SupabaseClient } from '@supabase/supabase-js'
import { writable } from 'svelte/store'
import type { User } from './types'

const setSideBarOpen = () => {
	const { subscribe, set } = writable<boolean>(false)
	return {
		subscribe,
		set,
	}
}

const setSideBarKey = () => {
	const { subscribe, set } = writable<symbol>(Symbol())
	return {
		subscribe,
		set,
	}
}

const setSaveProgress = () => {
	const { subscribe, set } = writable<number>(0)
	return {
		subscribe,
		set,
	}
}

const setIsLocked = () => {
	const { subscribe, set } = writable<boolean>(false)
	return {
		subscribe,
		set,
	}
}

const setSVG = () => {
	const { subscribe, set } = writable<string>('')
	return {
		subscribe,
		set,
	}
}

const setUser = () => {
	const { subscribe, set, update } = writable<User | null>(null)
	return {
		subscribe,
		set,
		update,
	}
}

export const sb = writable<SupabaseClient | null>(null)
export const sideBarOpen = setSideBarOpen()
export const sideBarKey = setSideBarKey()
export const saveProgress = setSaveProgress()
export const isLocked = setIsLocked()
export const canvasSVG = setSVG()
export const user = setUser()
