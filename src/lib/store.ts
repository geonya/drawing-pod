import { writable } from 'svelte/store'

const setSideBarOpen = () => {
	const { subscribe, set } = writable<boolean>(false)
	return {
		subscribe,
		set,
	}
}

// const setSideBarKey = () => {
// 	const { subscribe, set } = writable<symbol>(Symbol())
// 	return {
// 		subscribe,
// 		set,
// 	}
// }

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

export const sideBarOpen = setSideBarOpen()
// export const sideBarKey = setSideBarKey()
export const saveProgress = setSaveProgress()

export const isLocked = setIsLocked()
export const canvasSVG = setSVG()
