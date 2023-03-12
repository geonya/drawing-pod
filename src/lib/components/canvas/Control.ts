import { CANVAS_DATA } from '$lib/constants'
import { isLocked } from '$lib/store'
export class Control {
	isLocked = false
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
	onBindGroup = () => {
		const activeObject = this.canvas.getActiveObject()
		if (activeObject) {
			if (activeObject.type === 'activeSelection') {
				const objectGroup = activeObject as fabric.ActiveSelection
				objectGroup.toGroup()
				this.canvas.renderAll()
			}
		}
	}
	onUnBindGroup = () => {
		const activeObject = this.canvas.getActiveObject()
		if (activeObject) {
			if (activeObject.type === 'group') {
				const objectGroup = activeObject as fabric.Group
				objectGroup.toActiveSelection()
				this.canvas.renderAll()
			}
		}
	}

	onAlignLeft() {
		const activeObjects = this.canvas.getActiveObjects()
		if (activeObjects.length <= 1) return
		let minLeft = 0
		activeObjects.forEach((obj) => {
			if (obj.left! < minLeft) {
				minLeft = obj.left as number
			}
		})
		activeObjects.forEach((obj) => {
			obj.set('left', minLeft)
		})
		this.canvas.renderAll()
	}

	onAlignRight() {
		const activeObjects = this.canvas.getActiveObjects()
		if (activeObjects.length <= 1) return
		let maxRight = -Infinity
		activeObjects.forEach((obj) => {
			const right = obj.left! + obj.width! * obj.scaleX!
			if (right > maxRight) {
				maxRight = right as number
			}
		})
		activeObjects.forEach((obj) => {
			const width = obj.width! * obj.scaleX!
			obj.set('left', maxRight - width)
		})
		this.canvas.renderAll()
	}

	onAlignCenter() {
		const activeObjects = this.canvas.getActiveObjects()
		if (activeObjects.length <= 1) return
		let minLeft = 0
		let maxright = -Infinity
		activeObjects.forEach((obj) => {
			const right = obj.left! + obj.width! * obj.scaleX!
			if (right > maxright) {
				maxright = right as number
			}
			if (obj.left! < minLeft) {
				minLeft = obj.left as number
			}
		})
		const center = (maxright + minLeft) / 2
		activeObjects.forEach((obj) => {
			const width = obj.width! * obj.scaleX!
			obj.set('left', center - width / 2)
		})
		this.canvas.renderAll()
	}

	onAlignTop() {
		const activeObjects = this.canvas.getActiveObjects()
		if (activeObjects.length <= 1) return
		let minTop = 0
		activeObjects.forEach((obj) => {
			if (obj.top! < minTop) {
				minTop = obj.top as number
			}
		})
		activeObjects.forEach((obj) => {
			obj.set('top', minTop)
		})
		this.canvas.renderAll()
	}
	onAlignBottom() {
		const activeObjects = this.canvas.getActiveObjects()
		if (activeObjects.length <= 1) return
		let maxBottom = -Infinity
		activeObjects.forEach((obj) => {
			const bottom = obj.top! + obj.height! * obj.scaleY!
			if (bottom > maxBottom) {
				maxBottom = bottom as number
			}
		})
		activeObjects.forEach((obj) => {
			const height = obj.height! * obj.scaleY!
			obj.set('top', maxBottom - height)
		})
		this.canvas.renderAll()
	}
	onAlignMiddle() {
		const activeObjects = this.canvas.getActiveObjects()
		if (activeObjects.length <= 1) return
		let minTop = 0
		let maxBottom = -Infinity
		activeObjects.forEach((obj) => {
			const bottom = obj.top! + obj.height! * obj.scaleY!
			if (bottom > maxBottom) {
				maxBottom = bottom as number
			}
		})
		activeObjects.forEach((obj) => {
			if (obj.top! < minTop) {
				minTop = obj.top as number
			}
		})

		const center = (maxBottom + minTop) / 2
		activeObjects.forEach((obj) => {
			const height = obj.height! * obj.scaleY!
			obj.set('top', center - height / 2)
		})
		this.canvas.renderAll()
	}

	onLockCanvas() {
		this.isLocked = !this.isLocked
		if (this.isLocked) {
			this.canvas.discardActiveObject()
			this.canvas.isDrawingMode = false
			this.canvas.selection = false
			this.canvas.forEachObject((obj) => {
				obj.selectable = false
			})
			this.canvas.renderAll()
		} else {
			this.canvas.isDrawingMode = false
			this.canvas.selection = true
			this.canvas.forEachObject((obj) => {
				obj.selectable = true
			})
			this.canvas.renderAll()
		}
	}

	onPreventCanvasExit(e: fabric.IEvent<MouseEvent>) {
		if (!e.target) return
		if (!this.canvas) return
		const objWidth = e.target.width && e.target.scaleX && e.target.width * e.target.scaleX
		const objHeight = e.target.height && e.target.scaleY && e.target.height * e.target.scaleY
		if (
			!e.target.top ||
			!e.target.height ||
			!e.target.left ||
			!e.target.width ||
			!this.canvas.width ||
			!this.canvas.height ||
			!objHeight ||
			!objWidth
		)
			return
		e.target.top = e.target.top <= 0 ? 0 : e.target.top
		e.target.top =
			e.target.top >= this.canvas.height - objHeight ? this.canvas.height - objHeight : e.target.top
		e.target.left = e.target.left <= 0 ? 0 : e.target.left
		e.target.left =
			e.target.left >= this.canvas.width - objWidth ? this.canvas.width - objWidth : e.target.left
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
		const activeObjects = this.canvas.getActiveObjects()
		this.canvas.remove(...activeObjects)
		this.canvas.discardActiveObject()
		this.canvas.renderAll()
	}
	onAutoSave(time: number) {
		return setInterval(() => {
			this.onSave()
		}, time)
	}
	onDownloadAsSVG() {
		this.canvas.backgroundColor = 'rgba(255,255,255,1)'
		const svg = this.canvas.toSVG()

		this.canvas.backgroundColor = 'rgba(255,255,255,0)'
		const downloadLink = document.createElement('a')
		downloadLink.setAttribute('download', 'canvas.svg')
		downloadLink.setAttribute('href', 'data:image/svg+xml;utf8,' + encodeURIComponent(svg))
		downloadLink.click()
	}
	onZoom() {
		const zoom = this.canvas.getZoom()
		const vp = this.canvas.viewportTransform
		if (!vp) return
		vp[4] = Math.max(vp[4], this.canvas.getWidth() - this.canvas.getWidth() * zoom)
		vp[5] = Math.max(vp[5], this.canvas.getHeight() - this.canvas.getHeight() * zoom)
		vp[4] = Math.min(vp[4], 0)
		vp[5] = Math.min(vp[5], 0)
	}
}
