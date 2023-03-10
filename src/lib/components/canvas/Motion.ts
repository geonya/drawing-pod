import { motionState } from "$lib/store"
import { MotionState } from "$lib/types"

export class Motion {
  motionState: MotionState
  constructor(
    private canvas: fabric.Canvas
  ) {
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
    if (this.motionState !== MotionState.DRAGGING) return;
    let lastClientX = 0
    let lastClientY = 0
    let state: string = 'ready'
    this.canvas.discardActiveObject()
    this.canvas.defaultCursor = 'grab'
    this.canvas.forEachObject((o: fabric.Object) => {
      o.evented = false
      o.selectable = false
    })
    this.canvas.selection = false
    this.canvas.on('mouse:up', (e: fabric.IEvent<MouseEvent>) => {
      state = 'ready'
    })
    this.canvas.on('mouse:down', (e: fabric.IEvent<MouseEvent>) => {
      state = 'moving'
      lastClientX = e.e.clientX
      lastClientY = e.e.clientY
    })
    this.canvas.on('mouse:move', (e: fabric.IEvent<MouseEvent>) => {
      if (state === 'moving' && e && e.e) {
        const delta = {
          x: e.e.clientX - lastClientX,
          y: e.e.clientY - lastClientY,
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
    if (this.motionState !== MotionState.DRAWING) return;
    this.canvas.isDrawingMode = true
    this.canvas.freeDrawingBrush.color = 'rgba(0,0,0,1)'
    this.canvas.freeDrawingBrush.width = 5
  }
  onDrawingEnd() {
    this.canvas.isDrawingMode = false
  }
  onPreventCanvasExit(e: fabric.IEvent<MouseEvent>) {
    if (!e.target) return
    if (!this.canvas) return

    const objWidth = e.target.width! * e.target.scaleX!
    const objHeight = e.target.height! * e.target.scaleY!
    if (e.target.top && e.target.top < 0) {
      e.target.top = 0
    }
    if (e.target.left && e.target.left < 0) {
      e.target.left = 0
    }
    if (
      e.target.left &&
      objWidth &&
      this.canvas.width &&
      e.target.left + objWidth > this.canvas.width
    ) {
      e.target.left = this.canvas.width - objWidth
    }
    if (
      e.target.top &&
      objHeight &&
      this.canvas.height &&
      e.target.top + objHeight > this.canvas.height
    ) {
      e.target.top = this.canvas.height - objHeight
    }
  }
  onDelete() {
    const activeObject = this.canvas.getActiveObject()
    if (activeObject) {
      this.canvas.remove(activeObject)
    }
  }
  onKeyDown(e: KeyboardEvent) {
    if (e.key === ' ') {
      this.onChangeMotionState(MotionState.DRAGGING)
    }
    if (e.key === 'Escape') {
      this.onChangeMotionState(MotionState.DEFAULT)
    }
    if (e.key === 'Delete' || e.key === 'Backspace') {
      this.onDelete()
    }
  }
  onKeyUp(e: KeyboardEvent) {
    if (e.key === ' ') {
      this.onDraggingEnd()
    }
  }

}
