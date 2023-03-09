import type { HsvaColor, RgbaColor } from 'colord'
import type { Controller } from './components/canvas/Controller'
import type { Render } from './components/canvas/Render'
// TODO - type : color
export interface IPaletteColor {
	color: string
	type: PaintType
}

export enum MotionState {
	DEFAULT = 'default',
	DRAWING = 'drawing',
	DRAGGING = 'dragging',
}

export enum PaintType {
	FILL = 'fill',
	STROKE = 'stroke',
}


export enum ObjectType {
	RECT = 'rect',
	CIRCLE = 'circle',
	PATH = 'path',
	IMAGE = 'image',
}

export interface ColorType {
	hsva: HsvaColor
	rgba: RgbaColor
	hex: string
}
export interface IShape {
	fill: string | null
	stroke: string | null
	type: ObjectType | null
	strokeWidth: number | null
}

export interface IMotionContext {
	onAddImage: (e: Event) => void
	onAddRect: () => void
	onAddCircle: () => void
	onHandDraggingStart: () => void
	onHandDraggingEnd: () => void
	onCursorMove: () => void
	onDrawing: () => void
	onDelete: () => void
	onSave: () => void
	onKeyDown: (e: KeyboardEvent) => void
	onKeyUp: (e: KeyboardEvent) => void
}
export interface ICanvasContext {
	getController: () => Controller
	getRender: () => Render
}
