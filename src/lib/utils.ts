import { colord, type HsvaColor, type RgbaColor } from 'colord';
import { INITIAL_RGBA } from './constants';
export const objectChecker = (obj: fabric.Object | undefined | null): boolean => {
	if (!obj) return false;
	const { fill, stroke, height, width } = obj;
	if (!fill || !stroke || !height || !width) return false;
	return true;
};

export const stringifyRgba = (rgba: RgbaColor): string => `rgba(${Object.values(rgba).join()})`;
export const convertStringToRgba = (color: string) => {
	const rgbaNumbers = color
		.replace('rgba(', '')
		.replace(')', '')
		.split(',')
		.map((c) => parseFloat(c));
	const keyArray = ['r', 'g', 'b', 'a'];
	const rgba = rgbaNumbers.reduce((acc, curr: number, i: number) => {
		const key = keyArray[i];
		acc = { ...acc, [key]: curr };
		return acc;
	}, {}) as RgbaColor;
	return rgba;
};

export const hsvaToStringRgba = (hsva: HsvaColor): string => stringifyRgba(hsvaToRgba(hsva));

export const hsvaToHex = (hsva: HsvaColor) => colord(hsva).toHex();
export const hsvaToRgba = (hsva: HsvaColor): RgbaColor => {
	const rgb = colord(hsva).toRgb();
	return { ...rgb, a: hsva.a };
};
export const rgbaToHsva = (rgba: RgbaColor): HsvaColor => {
	return { ...colord(rgba).toHsv(), a: rgba.a };
};

export const shapeColorConvertToRgbaString = (color: any): string => {
	if (typeof color === 'object') return INITIAL_RGBA;
	if (color === 'rgba(NaN)') return INITIAL_RGBA;
	if (typeof color === 'string') return color;
	return INITIAL_RGBA;
};
export const extractHsvaInShape = (color: string) => {
	const sRgba = shapeColorConvertToRgbaString(color);
	const rgba = convertStringToRgba(sRgba);
	const hsva = rgbaToHsva(rgba);
	console.log(hsva);
	return hsva;
};

export const colorChecker = (color: any) => {
	if (typeof color === 'object') return INITIAL_RGBA;
	if (typeof color === 'undefined') return INITIAL_RGBA;
	if (typeof color === 'string') return color;
	return INITIAL_RGBA;
};
