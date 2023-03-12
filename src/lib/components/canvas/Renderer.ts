import { sideBarKey, sideBarOpen } from '$lib/store'
import type { ColorObj, ObjectType, Shape } from '$lib/types'
import { getDistance } from '$lib/utils'
import { fabric } from 'fabric'
import { writable } from 'svelte/store'

export const colorStore = writable<ColorObj | null>(null)
export const shape = writable<Shape | null>(null)

export class Renderer {
	constructor(private canvas: fabric.Canvas) {}

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

	onMakeObject(type: ObjectType) {
		let object: fabric.Object | null = null
		const strokeWidth = 3
		const rectObj = new fabric.Rect({
			fill: 'rgba(255,255,255,1)',
			stroke: 'rgba(0,0,0,1)',
			strokeWidth,
			width: 250,
			height: 100,
			rx: 10,
			ry: 10,
			cornerStyle: 'circle',
		})
		const textObj = new fabric.IText('Hello World', {
			fill: 'rgba(0,0,0,1)',
			stroke: 'rgba(0,0,0,1)',
			fontSize: 50,
			strokeWidth: 1,
			fontFamily: 'Nanum Pen Script',
			isEditing: true,
		})
		switch (type) {
			case 'rect':
				this.canvas.centerObject(rectObj)
				this.canvas.add(rectObj)
				const centerX = rectObj.left! + rectObj.width! / 2
				const centerY = rectObj.top! + rectObj.height! / 2
				textObj.set({
					left: centerX,
					top: centerY,
					originX: 'center',
					originY: 'center',
				})
				this.canvas.add(textObj)
				this.canvas.setActiveObject(textObj)
				break
			case 'circle':
				object = new fabric.Circle({
					fill: 'rgba(255,255,255,1)',
					stroke: 'rgba(0,0,0,1)',
					strokeWidth,
					radius: 100,
					cornerStyle: 'circle',
				})
				break
			case 'text':
				object = textObj
				break
			default:
				break
		}
		if (object) {
			this.canvas.add(object)
			this.canvas.setActiveObject(object)
			this.canvas.renderAll()
		}
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

	onAddStickyLine() {
		let isDrawing = false
		let stickyLine: fabric.Line | null = null

		this.canvas.on('mouse:down', (e) => {
			isDrawing = true
			const pointer = this.canvas.getPointer(e.e)
			stickyLine = new fabric.Line([pointer.x, pointer.y, pointer.x, pointer.y], {})
			if (stickyLine) {
				this.canvas.add(stickyLine)
			}
		})
		this.canvas.on('mouse:move', (e) => {
			if (!isDrawing) return
			const pointer = this.canvas.getPointer(e.e)
			const point = new fabric.Point(pointer.x, pointer.y)
			stickyLine &&
				stickyLine.set({
					x2: pointer.x,
					y2: pointer.y,
					stroke: 'rgba(0,0,0,1)',
					strokeWidth: 3,
					strokeLineCap: 'round',
					originX: 'center',
					originY: 'center',
					selectable: true,
				})

			let closestObject: fabric.Object | null = null
			let closestDistance = Infinity

			this.canvas.forEachObject((object) => {
				if (object.containsPoint(point)) {
					const distance = getDistance(point, object.getCenterPoint())
					if (distance < closestDistance) {
						closestObject = object
						closestDistance = distance
					}
				}
			})
			if (closestObject) {
				const object = closestObject as fabric.Object
				if (closestDistance <= Math.sqrt(object!.width! ** 2 + object!.height! ** 2) + 30) {
					const bound = object.getBoundingRect()
					const tl = new fabric.Point(bound.left, bound.top)
					const tr = new fabric.Point(bound.left + bound.width, bound.top)
					const bl = new fabric.Point(bound.left, bound.top + bound.height)
					const br = new fabric.Point(bound.left + bound.width, bound.top + bound.height)
					const center = new fabric.Point(
						bound.left + bound.width / 2,
						bound.top + bound.height / 2,
					)
					const tc = new fabric.Point(bound.left + bound.width / 2, bound.top)
					const bc = new fabric.Point(bound.left + bound.width / 2, bound.top + bound.height)
					const lc = new fabric.Point(bound.left, bound.top + bound.height / 2)
					const rc = new fabric.Point(bound.left + bound.width, bound.top + bound.height / 2)

					const closestPoint = [tc, bc, lc, rc, center].reduce((prev, curr) =>
						getDistance(prev, point) > getDistance(curr, point) ? curr : prev,
					)
					const diffX = point.x - closestPoint.x
					const diffY = point.y - closestPoint.y
					if (Math.abs(diffX) > Math.abs(diffY)) {
						stickyLine?.set({ x2: closestPoint.x, y2: point.y })
					} else {
						stickyLine?.set({ x2: point.x, y2: closestPoint.y })
					}
				}
			}
			this.canvas.renderAll()
		})

		this.canvas.on('mouse:up', (e) => {
			stickyLine?.setCoords()
			// cancel line mode
			isDrawing = false
			this.canvas.off('mouse:down')
			this.canvas.off('mouse:move')
			this.canvas.off('mouse:up')
		})
	}
}
