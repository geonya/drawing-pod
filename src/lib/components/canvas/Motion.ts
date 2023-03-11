import { motionState } from '$lib/store'
import { MotionState } from '$lib/types'

export class Motion {
	motionState: MotionState
	constructor(private canvas: fabric.Canvas) {
		this.motionState = MotionState.DEFAULT
	}
	onChangeMotionState(motionState: MotionState) {
		this.motionState = motionState
		if (motionState === MotionState.DEFAULT) {
			this.onDrawingEnd()
			this.onDraggingEnd()
		}
		if (motionState === MotionState.DRAWING) {
			this.onDraggingEnd()
			this.onDrawingStart()
		}
		if (motionState === MotionState.DRAGGING) {
			this.onDrawingEnd()
			this.onDraggingStart()
		}
	}
	onCursorMove() {
		motionState.set(MotionState.DEFAULT)
	}
	onDraggingStart() {
		if (this.motionState !== MotionState.DRAGGING) return
		let lastClientX = 0
		let lastClientY = 0
		let state = 'ready'
		this.canvas.discardActiveObject()
		this.canvas.defaultCursor = 'grab'
		this.canvas.forEachObject((o: fabric.Object) => {
			o.evented = false
			o.selectable = false
		})
		this.canvas.selection = false
		this.canvas.on('mouse:up', () => {
			state = 'ready'
		})
		this.canvas.on('mouse:down', (e: fabric.IEvent<MouseEvent>) => {
			state = 'moving'
			lastClientX = e.e.clientX
			lastClientY = e.e.clientY
		})
		this.canvas.on('mouse:move', (e: fabric.IEvent<MouseEvent>) => {
			if (state === 'moving' && e && e.e) {
				const clientX = e.e.clientX
				const clientY = e.e.clientY
				const delta = {
					x: clientX - lastClientX,
					y: clientY - lastClientY,
				}

				this.canvas.relativePan(delta)
				lastClientX = e.e.clientX
				lastClientY = e.e.clientY
			}
		})
	}
	onDraggingEnd() {
		this.canvas.forEachObject((o: fabric.Object) => {
			o.evented = true
			o.selectable = true
		})
		this.canvas.defaultCursor = 'default'
		this.canvas.off('mouse:up')
		this.canvas.off('mouse:down')
		this.canvas.off('mouse:move')
		this.canvas.selection = true
	}

	onDrawingStart() {
		if (this.motionState !== MotionState.DRAWING) return
		this.canvas.isDrawingMode = true
		this.canvas.freeDrawingBrush.color = 'rgba(0,0,0,1)'
		this.canvas.freeDrawingBrush.width = 2
	}
	onDrawingEnd() {
		this.canvas.defaultCursor = 'default'
		this.canvas.isDrawingMode = false
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
	onDelete() {
		const activeObjects = this.canvas.getActiveObjects()
		this.canvas.remove(...activeObjects)
		this.canvas.discardActiveObject()
		this.canvas.renderAll()
	}
	onKeyDown(e: KeyboardEvent) {
		if (e.repeat) return
		if (e.key === 'Escape') {
			this.onChangeMotionState(MotionState.DEFAULT)
			this.canvas.discardActiveObject()
		}
		const activeObject = this.canvas.getActiveObject()
		if (activeObject) {
			if (activeObject.isType('i-text')) {
				const textObject = activeObject as fabric.IText
				if (textObject.isEditing) {
					if (e.key === 'Escape') {
						textObject.exitEditing()
						this.canvas.discardActiveObject()
					}
					return
				}
			}
		}
		if (e.key === ' ') {
			this.onChangeMotionState(MotionState.DRAGGING)
		}

		if (e.key === 'Delete' || e.key === 'Backspace') {
			this.onDelete()
		}
	}
	onKeyUp(e: KeyboardEvent) {
		e.preventDefault()
		if (e.key === ' ') {
			this.onDraggingEnd()
		}
	}
}
