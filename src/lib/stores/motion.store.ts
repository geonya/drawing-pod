import type { IShape } from "$lib/types"
import { writable } from "svelte/store"

const setShape = () => {
  const { subscribe, set, update } = writable<IShape | null>(null)

  return {
    subscribe,
    update,
    set,
  }
}