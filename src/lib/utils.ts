import { MM_TO_PX } from './constants'
import { fabric } from 'fabric'

export const getDistance = (point1: fabric.Point, point2: fabric.Point) => {
	return Math.sqrt(Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2))
}

export function setGridOnCanvasWithMM(canvas: fabric.Canvas | fabric.StaticCanvas) {
	// grid 간격 50mm
	const gridSpacing = 50 * MM_TO_PX
	const gridLength = 50 * MM_TO_PX
	const gridColor = '#cccccc' // 그리드 색상

	if (typeof document === 'undefined') return // 서버사이드 렌더링에서는 실행하지 않음
	const canvasWidth = window.innerWidth!
	const canvasHeight = window.innerHeight!

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
