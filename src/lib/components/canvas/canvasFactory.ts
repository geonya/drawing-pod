import { fabric } from 'fabric'

export class CanvasFactory {
  private static instance: CanvasFactory | null = null;
  static async getInstance(canvas: HTMLCanvasElement): Promise<CanvasFactory | null> {
    if (!this.instance && typeof document !== 'undefined') {
      const newCanvas = new fabric.Canvas(canvas)
      if (!newCanvas) {
        return null
      }
      newCanvas.setWidth(window.innerWidth)
      newCanvas.setHeight(window.innerHeight)
      newCanvas.centeredScaling = true
      newCanvas.backgroundColor = 'transparent'
      newCanvas.preserveObjectStacking = true
      this.instance = new CanvasFactory(newCanvas)
    }
    return this.instance
  }
  constructor(
    public readonly canvas: fabric.Canvas,
  ) { }
}

export class StaticCanvasFactory {
  private static instance: StaticCanvasFactory | null = null;
  static async getInstance(canvas: HTMLCanvasElement): Promise<StaticCanvasFactory | null> {
    if (!this.instance && typeof document !== 'undefined') {
      const staticCanvas = new fabric.StaticCanvas(canvas)
      if (!staticCanvas) {
        return null
      }
      staticCanvas.setWidth(window.innerWidth)
      staticCanvas.setHeight(window.innerHeight)
      staticCanvas.backgroundColor = 'transparent'
      this.instance = new StaticCanvasFactory(staticCanvas)
    }
    return this.instance
  }
  constructor(
    public readonly canvas: fabric.StaticCanvas,
  ) { }
}