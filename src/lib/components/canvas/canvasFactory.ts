import { fabric } from 'fabric'

export class CanvasFactory {
	private static instance: CanvasFactory | null = null
	static async getInstance(canvas: HTMLCanvasElement): Promise<CanvasFactory | null> {
		if (!this.instance && typeof document !== 'undefined') {
			const newCanvas = new fabric.Canvas(canvas, {
				width: window.innerWidth,
				height: window.innerHeight,
				centeredScaling: true,
				centeredRotation: true,
				backgroundColor: 'rgba(255,255,255,0)',
				preserveObjectStacking: true,
				selectionLineWidth: 1,
				selection: true,
				hoverCursor: 'pointer',
				moveCursor: 'move',
				defaultCursor: 'default',
				fireRightClick: true,
			})
			if (!newCanvas) {
				return null
			}
			this.instance = new CanvasFactory(newCanvas)
		}
		return this.instance
	}
	constructor(public readonly canvas: fabric.Canvas) { }
}

export class StaticCanvasFactory {
	private static instance: StaticCanvasFactory | null = null
	static async getInstance(canvas: HTMLCanvasElement): Promise<StaticCanvasFactory | null> {
		if (!this.instance && typeof document !== 'undefined') {
			const staticCanvas = new fabric.StaticCanvas(canvas, {
				width: window.innerWidth,
				height: window.innerHeight,
				backgroundColor: 'rgba(255,255,255,0)',
			})
			if (!staticCanvas) {
				return null
			}
			this.instance = new StaticCanvasFactory(staticCanvas)
		}
		return this.instance
	}
	constructor(public readonly canvas: fabric.StaticCanvas) { }
}
