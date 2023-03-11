import { writable } from 'svelte/store'
import type { IPaletteColor, MotionState } from './types'
import type { Renderer } from './components/canvas/Renderer'
import type { Motion } from './components/canvas/Motion'
import type { Control } from './components/canvas/Control'

const setRenderer = () => {
	const { subscribe, set } = writable<Renderer | null>(null)
	return {
		subscribe,
		set,
	}
}
const setMotion = () => {
	const { subscribe, set } = writable<Motion | null>(null)
	return {
		subscribe,
		set,
	}
}
const setControl = () => {
	const { subscribe, set } = writable<Control | null>(null)
	return {
		subscribe,
		set,
	}
}

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
	const { subscribe, set } = writable<number>(0)
	return {
		subscribe,
		set,
	}
}

export const renderer = setRenderer()
export const motion = setMotion()
export const control = setControl()
export const paletteColor = setPaletteColor()
export const sideBarOpen = setSideBarOpen()
export const sideBarKey = setSideBarKey()
export const saveProgress = setSaveProgress()
export const motionState = setMotionState()
