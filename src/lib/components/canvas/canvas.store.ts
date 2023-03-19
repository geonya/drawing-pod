import { ActionType, type Shape } from '$lib/types'
import { readable, writable } from 'svelte/store'
import type { Renderer } from './Renderer'
import type { Control } from './Control'

export const shape = writable<Shape | null>(null)
export const action = writable(ActionType.DEFAULT)

const setUndoStack = () => {
	const UNDO_LIMIT = 10
	const { subscribe, update } = writable<object[]>([])
	const push = (item: object) => update((items) => [item, ...items.slice(0, UNDO_LIMIT - 1)])
	const pop = () => {
		subscribe(() => {})
		update((items) => items.slice(1))
	}
	return {
		subscribe,
		push,
		pop,
	}
}
export const undoStack = setUndoStack()
const setRedoStack = () => {
	const REDO_LIMIT = 10
	const { subscribe, update } = writable<object[]>([])
	const push = (item: object) => update((items) => [item, ...items.slice(0, REDO_LIMIT - 1)])
	const pop = () => {
		subscribe(() => {})
		update((items) => items.slice(1))
	}
	return {
		subscribe,
		push,
		pop,
	}
}
export const redoStack = setRedoStack()

const setRenderer = () => {
	const { subscribe, set } = writable<Renderer | null>(null)
	return {
		subscribe,
		set,
	}
}
export const renderer = setRenderer()

const setControl = () => {
	const { subscribe, set } = writable<Control | null>(null)
	return {
		subscribe,
		set,
	}
}
export const control = setControl()
