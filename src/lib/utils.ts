import { colord, type HsvaColor, type RgbaColor } from 'colord';

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

export const hsvaToHex = (hsva: HsvaColor) => colord(hsva).toHex();
export const hsvaToRgba = (hsva: HsvaColor): RgbaColor => {
	const rgb = colord(hsva).toRgb();
	return { ...rgb, a: hsva.a };
};
export const rgbaToHsva = (rgba: RgbaColor): HsvaColor => {
	return { ...colord(rgba).toHsv(), a: rgba.a };
};

class DrawingEditor {
	canvas: fabric.Canvas; //The FabricJS Canvas object
	//which will hold all the drawn elements

	constructor(private readonly selector: string, canvasHeight: number, canvasWidth: number) {
		//Replace the given element with a canvas
		$(`#${selector}`).replaceWith(
			`<canvas id="${selector}" height=${canvasHeight} width=${canvasWidth}> </canvas>`,
		);

		//Instantiate a new FabricJS Canvas on the created Canvas element.
		this.canvas = new fabric.Canvas(`${selector}`, { selection: false });
	}
}
