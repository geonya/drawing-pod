import { CANVAS_DATA } from '$lib/constants'

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
