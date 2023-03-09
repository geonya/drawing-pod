import { writable } from 'svelte/store'
import type { MotionState, PaintType } from './types'

// TODO - type : color
export interface IPaletteColor {
	color: string
	type: PaintType
}
export interface IObject {
	id: string;
	type: string;
	stroke: string;
	strokeWidth: number;
	fill: string;
}
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
const setActiveObject = () => {
	const { subscribe, set, update } = writable<IObject | null>(null)
	return {
		subscribe,
		update,
		set,
	}
}

export const paletteColor = setPaletteColor()
export const sideBarOpen = setSideBarOpen()
export const sideBarKey = setSideBarKey()
export const activeObject = setActiveObject()