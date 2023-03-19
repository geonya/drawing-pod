import { PaintType } from '$lib/types'
import { colord, type HsvaColor, type RgbaColor } from 'colord'
import { derived, writable, type Readable, type Writable } from 'svelte/store'
import { shape } from '../canvas/canvas.store'

export type OutputColor = {
	[key in PaintType]: string | null
}

export const paintType = writable(PaintType.FILL)
export const inputColor: Readable<HsvaColor | null> = derived(
	[shape, paintType],
	([$shape, $paintType], set) => {
		if ($paintType === PaintType.FILL) {
			const _sRgba = rgbaChecker($shape?.fill)
			const _hsva = stringRgbaToHsva(_sRgba)
			set(_hsva)
		}
		if ($paintType === PaintType.STROKE) {
			const _sRgba = rgbaChecker($shape?.stroke)
			const _hsva = stringRgbaToHsva(_sRgba)
			set(_hsva)
		}
		return () => {
			set(null)
		}
	},
)

export const paletteColor = writable<HsvaColor | null>(null)
export const outputColor: Readable<OutputColor | null> = derived(
	[paletteColor, paintType],
	([$paltteColor, $paintType], set) => {
		const fill = $paintType === PaintType.FILL ? hsvaToStringRgba($paltteColor) : null
		const stroke = $paintType === PaintType.STROKE ? hsvaToStringRgba($paltteColor) : null
		set({ fill, stroke })
		return () => set(null)
	},
)

function stringifyRgba(rgba: RgbaColor): string {
	const srgba = `rgba(${Object.values(rgba).join()})`
	return srgba
}

function convertStringToRgba(color: string) {
	if (!color) return { r: 0, g: 0, b: 0, a: 0 }
	const rgbaNumbers = color
		.replace('rgba(', '')
		.replace(')', '')
		.split(',')
		.map((c) => parseFloat(c))
	const keyArray = ['r', 'g', 'b', 'a']
	const rgba = rgbaNumbers.reduce((acc, curr: number, i: number) => {
		const key = keyArray[i]
		acc = { ...acc, [key]: curr }
		return acc
	}, {}) as RgbaColor
	return rgba
}

export function hsvaToStringRgba(hsva: HsvaColor | null) {
	if (!hsva) return null
	return stringifyRgba(hsvaToRgba(hsva))
}
function hsvaToRgba(hsva: HsvaColor): RgbaColor {
	const rgb = colord(hsva).toRgb()
	return { ...rgb, a: hsva.a }
}
function rgbaToHsva(rgba: RgbaColor): HsvaColor {
	return { ...colord(rgba).toHsv(), a: rgba.a }
}

function stringRgbaToHsva(color: string): HsvaColor {
	const rgba = convertStringToRgba(color)
	const hsva = rgbaToHsva(rgba)
	return hsva
}
export function stringRgbaToHex(color: string): string {
	const rgba = convertStringToRgba(color)
	const hex = colord(rgba).toHex()
	return hex
}
function rgbaChecker(color: any) {
	if (!color) return null
	if (color.includes('rgb(')) return color.replace(')', ',1)')
	if (typeof color === 'object') return null
	return color
}
