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
	onUpdateStrokeWidth(value: number, paletteColor: IPaletteColor) {
		const activeObject = this.canvas.getActiveObject()
		if (activeObject) {
			activeObject.set('strokeWidth', value)
			if (paletteColor.type === PaintType.STROKE) {
				activeObject.set('stroke', paletteColor.color)
			}
			this.strokeWidth = value
			this.canvas.requestRenderAll()
		}
	}


}
