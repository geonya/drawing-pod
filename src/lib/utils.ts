import { colord, type HsvaColor, type RgbaColor } from 'colord'
import { INITIAL_RGBA, MM_TO_PX } from './constants'
import { fabric } from 'fabric'

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
export const rgbaChecker = (color: any) => {
	if (!color) return null
	if (color.includes('rgb(')) return color.replace(')', ',1)')
	if (typeof color === 'object') return INITIAL_RGBA
	return color
}

export const getDistance = (point1: fabric.Point, point2: fabric.Point) => {
	return Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2))
}

export function setGridOnCanvasWithMM(canvas: fabric.Canvas) {
	// grid 간격 50mm
	const gridSpacing = 50 * MM_TO_PX
	const gridLength = 50 * MM_TO_PX
	const gridColor = '#cccccc' // 그리드 색상

	if (typeof document === 'undefined') return // 서버사이드 렌더링에서는 실행하지 않음
	const canvasWidth = canvas.width!
	const canvasHeight = canvas.height!

	// 그리드 그리기
	for (let i = 0; i < canvasWidth / gridSpacing; i++) {
		const gridLineX = new fabric.Line([i * gridSpacing, 0, i * gridSpacing, canvasHeight], {
			stroke: gridColor,
			selectable: false,
			strokeWidth: 0.5,
			strokeDashArray: [gridLength, gridSpacing - gridLength],
		})
		canvas.add(gridLineX)
	}

	for (let j = 0; j < canvasHeight / gridSpacing; j++) {
		const gridLineY = new fabric.Line([0, j * gridSpacing, canvasWidth, j * gridSpacing], {
			stroke: gridColor,
			selectable: false,
			strokeWidth: 0.5,
			strokeDashArray: [gridLength, gridSpacing - gridLength],
		})
		canvas.add(gridLineY)
	}

	canvas.renderAll()
}
function convertSVGToImage(svg: string) {
	return new Promise((resolve, reject) => {
		const canvas = new fabric.Canvas(null, {
			width: 500,
			height: 500,
			backgroundColor: 'white',
		})
		fabric.loadSVGFromString(svg, (objects, options) => {
			const obj = fabric.util.groupSVGElements(objects, options)
			canvas.add(obj).renderAll()
			const dataURL = canvas.toDataURL({
				format: 'png',
				quality: 1,
			})
			resolve(dataURL)
		})
	})
}
