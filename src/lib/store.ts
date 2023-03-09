import { writable } from 'svelte/store'
import type { IShape } from "$lib/types"
import type { IMotionContext, IPaletteColor, MotionState, PaintType } from './types'

const setControlContext = () => {
	const { subscribe, set } = writable<IControlContext | null>(null)
	return {
		subscribe,
		set,
	}
}

const setCanvas = () => {
	const { subscribe, set, update } = writable<fabric.Canvas | null>(null)
	return {
		subscribe,
		update,
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
const setShape = () => {
	const { subscribe, set, update } = writable<IShape | null>(null)
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
const setMotionContext = () => {
	const { subscribe, set, update } = writable<IMotionContext | null>(null)
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

export const canvas = setCanvas()
export const paletteColor = setPaletteColor()
export const sideBarOpen = setSideBarOpen()
export const sideBarKey = setSideBarKey()
export const motionContext = setMotionContext()
export const saveProgress = setSaveProgress()
export const controlContext = setControlContext()


export const shape = setShape()