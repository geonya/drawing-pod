import { ActionType, type Shape } from '$lib/types'
import { writable } from 'svelte/store'

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
