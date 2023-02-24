import { extractHsvaInShape, hsvaToHex, hsvaToRgba, stringifyRgba } from '$lib/utils';
import type { HsvaColor, RgbaColor } from 'colord';
import { derived, get, writable } from 'svelte/store';
import type { ColorType, PaintType, Shape } from './types';

const setShape = () => {
	const { subscribe, update, set } = writable<Shape | null>(null);
	const activeShape = (obj: fabric.Object | null): Shape | null => {
		if (!obj) return null;
		const { fill, stroke } = obj;
		const fillHsva = extractHsvaInShape(fill as string);
		const strokeHsva = extractHsvaInShape(stroke as string);
		const newShape: Shape = {
			id: crypto.randomUUID(),
			object: obj,
			fill: {
				hsva: fillHsva,
				rgba: hsvaToRgba(fillHsva),
				hex: hsvaToHex(fillHsva),
			},
			stroke: {
				hsva: strokeHsva,
				rgba: hsvaToRgba(strokeHsva),
				hex: hsvaToHex(strokeHsva),
			},
		};
		set(newShape);
		return newShape;
	};
	const updateShape = (data: Partial<Shape>) => {
		update((shape: Shape | null) => shape && { ...shape, ...data });
	};
	const updateShapeColor = (hsva: HsvaColor, type: PaintType): ColorType | null => {
		const fabricObj = get(shape)?.object;
		if (!fabricObj) return null;
		const rgba = hsvaToRgba(hsva);
		const hex = hsvaToHex(hsva);
		const newColor = {
			hsva,
			rgba,
			hex,
		};
		updateShape({ [type]: newColor });
		const stringRgba = stringifyRgba(rgba);
		fabricObj.set(type, stringRgba);
		return newColor;
	};
	const unActiveShape = () => {
		set(null);
	};
	return {
		subscribe,
		activeShape,
		unActiveShape,
		updateShape,
		updateShapeColor,
	};
};

const setShapes = () => {
	const { subscribe, update } = writable<Shape[]>([]);
	const addShape = (shape: Shape) => {
		update((shapes) => [...shapes, shape]);
	};
	const deleteShape = (id: string) => {
		update((shapes) => shapes.filter((shape) => shape.id !== id));
	};
	return {
		subscribe,
		addShape,
		deleteShape,
	};
};

const setActiveShapes = () => {
	const { subscribe, update } = writable<string[]>([]);
	const addShapes = (...args: string[]) => {
		update((activeShapes) => [...activeShapes, ...args]);
	};
	const deleteShapes = (id: string) => {
		update((activeShapes) => activeShapes.filter((activeShape) => activeShape !== id));
	};
	return {
		subscribe,
		addShapes,
		deleteShapes,
	};
};

const setColor = () => {
	const { set, update, subscribe } = writable<HsvaColor>({ h: 0, s: 0, v: 100, a: 1 });
	const setColor = (color: HsvaColor) => {
		set(color);
	};
	const change = (data: Partial<HsvaColor>) => {
		update((color) => ({ ...color, ...data }));
	};
	const getRgba = (): RgbaColor | null => {
		let rgba: RgbaColor | null = null;
		subscribe((color) => {
			rgba = hsvaToRgba(color);
		});
		return rgba;
	};
	const getHex = (): string | null => {
		let hex: string | null = null;
		subscribe((color) => {
			subscribe((color) => (hex = hsvaToHex(color)));
		});
		return hex;
	};
	return {
		subscribe,
		setColor,
		change,
		getHex,
		getRgba,
	};
};

export const shapes = setShapes();
export const shape = setShape();
export const activeShapes = setActiveShapes();
export const color = setColor();

// export const palette = derived([shape, color], ([$shape, $color]) => {
// 	if (!$shape) return null;
// 	const { fill, stroke } = $shape;
// 	const { h, s, v, a } = $color;
// 	const newFill = { ...fill, hsva: { h, s, v, a } };
// 	const newStroke = { ...stroke, hsva: { h, s, v, a } };
// 	shape.updateShape({ fill: newFill, stroke: newStroke });
// });
