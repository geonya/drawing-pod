import { convertStringToRgba, rgbaToHsva } from '$lib/utils';
import type { HsvaColor } from 'colord';
import { writable } from 'svelte/store';

interface Shape extends fabric.Object {
	fillHsva?: HsvaColor;
	strokeHsva?: HsvaColor;
}
const setShape = () => {
	const { subscribe, update, set } = writable<Shape | null>(null);
	const addShape = (obj: fabric.Object | undefined | null) => {
		if (!obj) return;
		const { fill, stroke } = obj;
		const newShape: Shape = {
			...obj,
			fillHsva: extractHsvaInShape(fill as string),
			strokeHsva: extractHsvaInShape(stroke as string),
		};
		set(newShape);
	};

	const shapeColorConvertToRgbaString = (color: any): string => {
		if (typeof color === 'object') return 'rgba(255, 255, 255, 1)';
		if (color === 'rgba(NaN)') return 'rgba(255, 255, 255, 1)';
		if (typeof color === 'string') return color;
		return 'rgba(255, 255, 255, 1)';
	};
	const extractHsvaInShape = (color: string) => {
		const sRgba = shapeColorConvertToRgbaString(color);
		const rgba = convertStringToRgba(sRgba);
		const hsva = rgbaToHsva(rgba);
		return hsva;
	};

	const updateShape = (obj: fabric.Object | undefined | null) => {
		if (!obj) return;
		update((shape: Shape | null) => {
			return {
				...obj,
				...shape,
			};
		});
	};
	const deleteShape = () => {
		set(null);
	};
	return {
		subscribe,
		addShape,
		updateShape,
		deleteShape,
	};
};

const setColor = () => {
	const { set, update, subscribe } = writable<HsvaColor>({ h: 0, s: 0, v: 100, a: 1 });
	return {
		subscribe,
		update,
		set,
	};
};

export const activeShape = setShape();
export const color = setColor();
