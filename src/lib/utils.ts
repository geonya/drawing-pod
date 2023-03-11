import { colord, type HsvaColor, type RgbaColor } from 'colord'
import { INITIAL_RGBA } from './constants'

export const stringifyRgba = (rgba: RgbaColor): string => {
	const srgba = `rgba(${Object.values(rgba).join()})`
	return srgba
}
export const stringifyRgbaWithAlpha1 = (sRgba: string): string => {
	const rgba = convertStringToRgba(sRgba)
	const { r, g, b } = rgba
	return `rgba(${r}, ${g}, ${b}, 1)`
}
export const convertStringToRgba = (color: string) => {
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

export const hsvaToStringRgba = (hsva: HsvaColor): string => stringifyRgba(hsvaToRgba(hsva))

export const hsvaToHex = (hsva: HsvaColor) => colord(hsva).toHex()
export const hsvaToRgba = (hsva: HsvaColor): RgbaColor => {
	const rgb = colord(hsva).toRgb()
	return { ...rgb, a: hsva.a }
}
export const rgbaToHsva = (rgba: RgbaColor): HsvaColor => {
	return { ...colord(rgba).toHsv(), a: rgba.a }
}

export const stringRgbaToHsva = (color: string): HsvaColor => {
	const rgba = convertStringToRgba(color)
	const hsva = rgbaToHsva(rgba)
	return hsva
}
export const stringRgbaToHex = (color: string): string => {
	const rgba = convertStringToRgba(color)
	const hex = colord(rgba).toHex()
	return hex
}
export const rgbaChecker = (color: string) => {
	if (!color.includes('rgba')) return INITIAL_RGBA
	if (typeof color === 'object') return INITIAL_RGBA
	if (color.includes('NaN')) return INITIAL_RGBA
	return color
}

export const getDistance = (point1: fabric.Point, point2: fabric.Point) => {
	return Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2))
}
