import { CANVAS_DATA } from '$lib/constants'
import { fabric } from 'fabric'

export class Control {
	constructor(private readonly canvas: fabric.Canvas) {}
	onBringForward() {
		const activeObject = this.canvas.getActiveObject()
		if (activeObject) {
			this.canvas.bringForward(activeObject)
		}
	}
	onSendBackward() {
		const activeObject = this.canvas.getActiveObject()
		if (activeObject) {
			this.canvas.sendBackwards(activeObject)
		}
	}
	onSave() {
		const storageString = localStorage.getItem(CANVAS_DATA)
		if (storageString) {
			this.canvas.loadFromJSON(JSON.parse(storageString), () => {
				console.log('Saved Data Loaded')
			})
		}
	}
	onDelete() {
		const activeObject = this.canvas.getActiveObject()
		if (activeObject) {
			this.canvas.remove(activeObject)
		}
	}
	onAutoSave(time: number) {
		return setInterval(() => {
			this.onSave()
		}, time)
	}
	onDownloadAsSVG() {
		const group = new fabric.Group(this.canvas.getObjects())
		const newCanvas = new fabric.Canvas('newCanvas', {
			width: group.width,
			height: group.height,
		})
		newCanvas.add(group)
		const svgData = newCanvas.toSVG()
		const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
		const url = URL.createObjectURL(blob)
		const a = document.createElement('a')
		a.download = 'canvas.svg'
		a.href = url
		a.click()
		URL.revokeObjectURL(url)
	}
}
