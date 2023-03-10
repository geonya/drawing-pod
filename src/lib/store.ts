import { writable } from 'svelte/store'
import type { Shape } from "$lib/types"
import type { IPaletteColor, MotionState } from './types'

const setSideBarOpen = () => {
	const { subscribe, set } = writable<boolean>(false)
	return {
		subscribe,
		set,
	}
}
const setShape = () => {
	const { subscribe, set, update } = writable<Shape | null>(null)
	return {
		subscribe,
		update,
		set,
	}
}

const setSideBarKey = () => {
	const { subscribe, set } = writable<Symbol>(Symbol())
	return {
		subscribe,
		set,
	}
}

const setPaletteColor = () => {
	const { subscribe, set, update } = writable<IPaletteColor | null>(null)
	return {
		subscribe,
		update,
		set,
	}
}

const setMotionState = () => {
	const { subscribe, set, update } = writable<MotionState | null>(null)
	return {
		subscribe,
		update,
		set,
	}
}

const setSaveProgress = () => {
	const { subscribe, set, } = writable<number>(0)
	return {
		subscribe,
		set,
	}
}

export const paletteColor = setPaletteColor()
export const sideBarOpen = setSideBarOpen()
export const sideBarKey = setSideBarKey()
export const saveProgress = setSaveProgress()
export const motionState = setMotionState()


export const shape = setShape()