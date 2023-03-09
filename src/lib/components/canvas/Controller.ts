import { CANVAS_DATA } from '$lib/constants'
import { fabric } from 'fabric'

export class Controller {
	constructor(private readonly canvas: fabric.Canvas) {}

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
	onDownloadSVG() {
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

	onSaveWithButton() {}
}
