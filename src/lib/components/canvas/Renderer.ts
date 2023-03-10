import { ObjectType, PaintType, type IPaletteColor } from '$lib/types'
import { fabric } from 'fabric'

export class Renderer {
	fill: string | null = null
	stroke: string | null = null
	activeObject: fabric.Object | null = null
	type: ObjectType | null = null
	strokeWidth: number | null = null
	constructor(private canvas: fabric.Canvas) { }

	onAddRect() {
		const rect = new fabric.Rect({
			fill: 'rgba(200,200,200,1)',
			stroke: 'rgba(0,0,0,1)',
			strokeWidth: 2,
			width: 200,
			height: 200,
		})
		this.canvas.add(rect)
		this.canvas.centerObject(rect)
		this.canvas.setActiveObject(rect)
	}
	onAddCircle() {
		const circle = new fabric.Circle({
			fill: 'rgba(255,255,255,1)',
			stroke: 'rgba(0,0,0,1)',
			strokeWidth: 2,
			radius: 100,
		})
		this.canvas.add(circle)
		this.canvas.centerObject(circle)
		this.canvas.setActiveObject(circle)
	}
	onAddText() {
		const textBox = new fabric.Textbox('Hello', {
			editable: true,
		})
		this.canvas.add(textBox)
		this.canvas.centerObject(textBox)
	}
	onUpdateColor(paletteColor: IPaletteColor) {
		const { color, type } = paletteColor
		if (type === PaintType.FILL && this.fill) {
			this.fill = color
		}
		if (type === PaintType.STROKE && this.stroke) {
			this.stroke = color
		}
	}
	onUpdateObjectColor(paletteColor: IPaletteColor) {
		const { type, color } = paletteColor
		const activeObject = this.canvas.getActiveObject()
		if (activeObject) {
			if (type === PaintType.FILL) {
				activeObject.set('fill', color)
				this.fill = color
			}
			if (type === PaintType.STROKE) {
				activeObject.set('stroke', color)
				this.stroke = color
			}
			this.canvas.requestRenderAll()
		}
	}
	onUpdateStrokeWidth(value: number | null) {
		if (!value) return;
		const activeObject = this.canvas.getActiveObject()
		if (activeObject) {
			activeObject.set('strokeWidth', value)
			this.strokeWidth = value;
			this.canvas.requestRenderAll()
		}
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
				img.scaleToWidth(300)
				this.canvas.add(img)
				this.canvas.setActiveObject(img)
				this.canvas.centerObject(img)
				this.canvas.renderAll()
			}
		}
		reader.readAsDataURL(file)
	}

	onTextAdd() {
		const text = new fabric.IText('안녕?', {
			fill: 'rgba(0,0,0,1)',
			stroke: 'rgba(0,0,0,1)',
			fontSize: 60,
			strokeWidth: 1,
			fontFamily: 'Nanum Pen Script',
		})
		this.canvas.add(text)
		this.canvas.centerObject(text)
		this.canvas.setActiveObject(text)
	}

}
