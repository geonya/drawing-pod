import { CANVAS_DATA } from '$lib/constants'
import { sideBarOpen, sideBarKey, shape, paletteColor } from '$lib/store'
import type { ObjectType } from '$lib/types'
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
				stroke: activeObject.stroke as string,
				type: activeObject.type as ObjectType,
				strokeWidth: activeObject.strokeWidth as number,
			})
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
	getTypeofActiveObject() {
		const activeObject = this.canvas.getActiveObject()
		if (activeObject) {
			return activeObject.type
		}
		return null
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
			backgroundColor: 'green',
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
	onAddImage(e: Event) {
		let file = (e.target as HTMLInputElement).files?.[0]
		if (!file) return
		const reader = new FileReader()
		reader.onload = (e) => {
			if (!e?.target?.result || typeof e.target.result !== 'string') return
			let image = new Image()
			image.src = e.target.result
			image.onload = () => {
				let img = new fabric.Image(image)
				img.scaleToWidth(200)
				this.canvas.add(img)
				this.canvas.setActiveObject(img)
				this.canvas.centerObject(img)
				this.canvas.renderAll()
			}
		}
		reader.readAsDataURL(file)
	}
	// TODO Add Function
	onDownload() { }

	onPreventCanvasExit(e: fabric.IEvent<MouseEvent>) {
		if (!e.target) return
		if (!this.canvas) return
		if (e.target.top && e.target.top < 0) {
			e.target.top = 0
		}
		if (e.target.left && e.target.left < 0) {
			e.target.left = 0
		}
		if (
			e.target.left &&
			e.target.width &&
			this.canvas.width &&
			e.target.left + e.target.width > this.canvas.width
		) {
			e.target.left = this.canvas.width - e.target.width
		}
		if (
			e.target.top &&
			e.target.height &&
			this.canvas.height &&
			e.target.top + e.target.height > this.canvas.height
		) {
			e.target.top = this.canvas.height - e.target.height
		}
	}

	onKeyDown(e: KeyboardEvent) {
		if (e.key === 'Delete' || e.key === 'Backspace') {
			this.onDelete()
		}
	}
}
