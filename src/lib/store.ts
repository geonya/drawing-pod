import { writable } from 'svelte/store'
import type { IMotionContext, IPaletteColor, MotionState, PaintType } from './types'

const setCanvas = () => {
	const { subscribe, set, update } = writable<fabric.Canvas | null>(null)
	return {
		subscribe,
		update,
		set,
	}
}
export const canvas = setCanvas()

const setSideBarOpen = () => {
	const { subscribe, set } = writable<boolean>(false)
	return {
		subscribe,
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

export const paletteColor = setPaletteColor()
export const sideBarOpen = setSideBarOpen()
export const sideBarKey = setSideBarKey()
export const motionContext = setMotionContext()

import type { IShape } from "$lib/types"

const setShape = () => {
	const { subscribe, set, update } = writable<IShape | null>(null)
	return {
		subscribe,
		update,
		set,
	}
}

export const shape = setShape()