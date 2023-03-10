import { CANVAS_DATA, INITIAL_RGBA } from '$lib/constants'
import { sideBarOpen, sideBarKey, paletteColor } from '$lib/store'
import { ObjectType } from '$lib/types'
import { fabric } from 'fabric'

export class Control {
	constructor(private readonly canvas: fabric.Canvas) { }
	// onBringForward() {
	// 	if (!this.activeObject) {
	// 		this.activeObject = null
	// 		return
	// 	}
	// 	this.canvas.bringForward(this.activeObject)
	// }
	// onSendBackward() {
	// 	if (!this.activeObject) {
	// 		this.activeObject = null
	// 		return
	// 	}
	// 	this.canvas.sendBackwards(this.activeObject)
	// }


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
		let blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
		let url = URL.createObjectURL(blob)
		let a = document.createElement('a')
		a.download = 'canvas.svg'
		a.href = url
		a.click()
		URL.revokeObjectURL(url)
	}
}
