import type { HsvaColor, RgbaColor } from 'colord'
// TODO - type : color
export type IPaletteColor = {
	type: PaintType,
	color: string
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
export type Shape = IShape | null | undefined
export interface IShape {
	fill: string | null
	stroke: string | null
	type: ObjectType | null
	strokeWidth: number | null
}
