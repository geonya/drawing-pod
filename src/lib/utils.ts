import { colord, type HsvaColor, type RgbaColor } from 'colord';

export const stringifyRGB = (rgba: RgbaColor): string => `rgba(${Object.values(rgba).join()})`;
export const convertStringToRgba = (color: string | null) => {
	if (!color) return;
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
export const hsvaToRgba = (hsva: HsvaColor): RgbaColor => {
	const rgb = colord(hsva).toRgb();
	return { ...rgb, a: hsva.a };
};
export const rgbaToHsva = (rgba: RgbaColor): HsvaColor => {
	return { ...colord(rgba).toHsv(), a: rgba.a };
};
