import { sideBarKey, sideBarOpen } from '$lib/store'
import type { ColorObj, ObjectType, Shape } from '$lib/types'
import { fabric } from 'fabric'
import { writable } from 'svelte/store'

export const colorStore = writable<ColorObj | null>(null)
export const shape = writable<Shape | null>(null)

export class Renderer {
	constructor(private canvas: fabric.Canvas) {
	}
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
				objectType: activeObject.type as ObjectType,
				strokeWidth: activeObject.strokeWidth as number,
			})
			this.onSideBarOpen()
		}
	}
	onObjectSelectUpdate() {
		this.onObjectSelect()
		this.changeSideBar()
	}
	onObjectSelectClear() {
		this.canvas.discardActiveObject().renderAll()
		this.onSidebarClose()
		this.setClearShape()
	}

	setClearShape() {
		shape.set(null)
	}

	onAddRect() {
		console.log('add rect')
		const rect = new fabric.Rect({
			fill: 'rgba(255,255,255,1)',
			stroke: 'rgba(0,0,0,1)',
			strokeWidth: 1,
			width: 100,
			height: 100,
			rx: 10,
			ry: 10,
			cornerStyle: 'circle',
		})
		this.canvas.add(rect)
		this.canvas.centerObject(rect)
		this.canvas.setActiveObject(rect)
	}
	onAddCircle() {
		const circle = new fabric.Circle({
			fill: 'rgba(255,255,255,1)',
			stroke: 'rgba(0,0,0,1)',
			strokeWidth: 1,
			radius: 100,
			cornerStyle: 'circle',
		})
		this.canvas.add(circle)
		this.canvas.centerObject(circle)
		this.canvas.setActiveObject(circle)
	}
	onUpdateObject(shape: Shape) {
		const activeObject = this.canvas.getActiveObject()
		if (activeObject && shape) {
			shape.fill && activeObject.set('fill', shape.fill as string)
			shape.stroke && activeObject.set('stroke', shape.stroke as string)
			shape.strokeWidth && activeObject.set('strokeWidth', shape.strokeWidth as number)
			this.canvas.requestRenderAll()
		}
	}

	onAddImage(e: Event) {
		const file = (e.target as HTMLInputElement).files?.[0]
		if (!file) return
		const reader = new FileReader()
		reader.onload = (e) => {
			if (!e?.target?.result || typeof e.target.result !== 'string') return
			const image = new Image()
			image.src = e.target.result
			image.onload = () => {
				const img = new fabric.Image(image)
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
		const text = new fabric.IText('Hello World', {
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
