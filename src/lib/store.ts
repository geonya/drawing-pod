import { writable } from 'svelte/store'
import { Action } from './types'
import type { Renderer } from './components/canvas/Renderer'
import type { Control } from './components/canvas/Control'

const setAction = () => {
	const { subscribe, set } = writable(Action.DEFAULT)
	return {
		subscribe,
		set,
	}
}

const setRenderer = () => {
	const { subscribe, set } = writable<Renderer | null>(null)
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
export const renderer = setRenderer()
export const control = setControl()
export const sideBarOpen = setSideBarOpen()
export const sideBarKey = setSideBarKey()
export const saveProgress = setSaveProgress()
export const action = setAction()
export const isLocked = setIsLocked()
export const canvasSVG = setSVG()
