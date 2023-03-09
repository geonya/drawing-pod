import { writable } from "svelte/store"
import { MotionState, type PaintType } from "./types";

const setCanvas = () => {
  const { subscribe, update, set } = writable<fabric.Canvas | null>(null)
  return {
    subscribe,
    set,
    update,
  }
}
const setMotionState = () => {
  const { subscribe, set } = writable<MotionState>(MotionState.DEFAULT)
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
  const { subscribe, set } = writable<Symbol>(Symbol())
  return {
    subscribe,
    set,
  }
}

// TODO - type : color
export interface IPaletteColor {
  color: string;
  type: PaintType
}

const setPaletteColor = () => {
  const { subscribe, set, update } = writable<IPaletteColor | null>(null)
  return {
    subscribe,
    update,
    set
  }
}

const setActiveObject = () => {
  const { subscribe, set, update } = writable<fabric.Object | null>(null)
  return {
    subscribe,
    set,
    update,
  }
}

export const paletteColor = setPaletteColor()
export const canvas = setCanvas()
export const motionState = setMotionState()
export const activeObject = setActiveObject()
export const sideBarOpen = setSideBarOpen()
export const sideBarKey = setSideBarKey()
