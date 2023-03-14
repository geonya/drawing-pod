import type { HsvaColor, RgbaColor } from 'colord'
export type ColorObj = {
	type: PaintType
	color: string
}

export enum ActionType {
	DEFAULT = 'default',
	DRAG = 'drag',
	PENCIL = 'pencil',
	ERASE = 'erase',
	TEXT = 'text',
	BRUSH = 'brush',
	LOADING = 'loading',
	LINE = 'line',
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
	TEXT = 'text',
}

export interface ColorType {
	hsva: HsvaColor
	rgba: RgbaColor
	hex: string
}
export type Shape = IShape | null | undefined
export interface IShape {
	fill?: string | null
	stroke?: string | null
	objectType?: ObjectType | null
	strokeWidth?: number | null
}

export type MenuTitle = 'about' | 'save' | 'quit' | 'preferences' | 'help'
