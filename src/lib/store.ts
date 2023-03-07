import { writable } from "svelte/store"
import type { PaintType } from "./types";

const setCanvas = () => {
  const { subscribe, update, set } = writable<fabric.Canvas | null>(null)

  return {
    subscribe,
    set,
    update,
  }

}

export interface paletteColor {
  color: string;
  type: PaintType
}

const setPaletteColor = () => {
  const { subscribe } = writable<paletteColor | null>(null)

  return {
    subscribe
  }
}

export const paletteColor = setPaletteColor()
export const canvas = setCanvas()
