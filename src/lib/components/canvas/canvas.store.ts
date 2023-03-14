import { ActionType, type Shape } from '$lib/types'
import { writable } from 'svelte/store'

export const shape = writable<Shape | null>(null)
export const action = writable(ActionType.DEFAULT)
