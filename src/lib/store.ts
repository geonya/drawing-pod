import { writable } from "svelte/store"
import type { PaintType } from "./types";

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