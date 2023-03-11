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
}
