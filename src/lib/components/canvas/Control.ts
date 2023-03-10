import { CANVAS_DATA, INITIAL_RGBA } from '$lib/constants'
import { sideBarOpen, sideBarKey, shape, paletteColor } from '$lib/store'
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
	onSideBarOpen() {
		sideBarOpen.set(true)
	}
	onSidebarClose() {
		sideBarOpen.set(false)
	}
	changeSideBar() {
		sideBarKey.set(Symbol())
	}
	onObjectSelect() {

		const activeObject = this.canvas.getActiveObject()
		if (activeObject) {
			shape.set({
				fill: activeObject.fill as string,
				stroke: activeObject.stroke as string ?? INITIAL_RGBA,
				type: activeObject.type as ObjectType,
				strokeWidth: activeObject.strokeWidth as number,
			})
			if (activeObject.type === ObjectType.IMAGE) {

			}
			this.onSideBarOpen()
		}
	}
	onObjectSelectUpdate() {
		this.onObjectSelect()
		this.changeSideBar()
		this.setClearPaletteColor()
	}
	onObjectSelectClear() {
		this.canvas.discardActiveObject().renderAll()
		this.onSidebarClose()
		this.setClearPaletteColor()
		this.setClearShape()
	}
	setClearPaletteColor() {
		paletteColor.set(null)
	}
	setClearShape() {
		shape.set(null)
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
		let blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
		let url = URL.createObjectURL(blob)
		let a = document.createElement('a')
		a.download = 'canvas.svg'
		a.href = url
		a.click()
		URL.revokeObjectURL(url)
	}



}
