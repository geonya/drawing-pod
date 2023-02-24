import type { HsvaColor, RgbaColor } from 'colord';

export enum MouseState {
	DEFAULT = 'default',
	DRAWING = 'drawing',
	DRAGGING = 'dragging',
}

export enum PaintType {
	FILL = 'fill',
	STROKE = 'stroke',
}

export interface ColorType {
	hsva: HsvaColor;
	rgba: RgbaColor;
	hex: string;
}
export interface Shape {
	id: string;
	object: fabric.Object;
	fill: ColorType;
	stroke: ColorType;
}
