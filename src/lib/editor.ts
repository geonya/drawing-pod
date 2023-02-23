import { fabric } from 'fabric';

const enum DrawingMode {
	Line,
	Rectangle,
	Oval,
	Text,
	Polyline,
	Path,
}

interface IObjectDrawer {
	drawingMode: DrawingMode;
	//Makes the current object
	readonly make: (
		x: number, //Horizontal starting point
		y: number, //Vertical starting point
		options: fabric.IObjectOptions,
		x2?: number, //Horizontal ending point
		y2?: number, //Vertical ending point
	) => Promise<fabric.Object>;
	//Resizes the object (used during the mouseOver event below)
	readonly resize: (object: fabric.Object, x: number, y: number) => Promise<fabric.Object>;
}

export class DrawingEditor {
	canvas: fabric.Canvas;
	//

	constructor(private readonly selector: string, canvasHeight: number, canvasWidth: number) {
		this.canvas = new fabric.Canvas('drawingpod', { selection: false });
	}
}

export class LineDrawer implements IObjectDrawer {
	drawingMode: DrawingMode = DrawingMode.Line;
	make(
		x: number,
		y: number,
		options: fabric.IObjectOptions,
		x2?: number,
		y2?: number,
	): Promise<fabric.Object> {
		//Return a Promise that will draw a line
		return new Promise<fabric.Object>((resolve) => {
			//Inside the Promise, draw the actual line from (x,y) to (x2,y2)
			if (x2 && y2) resolve(new fabric.Line([x, y, x2, y2], options));
			else resolve(new fabric.Line([x, y], options));
		});
	}

	resize(object: fabric.Object, x: number, y: number): Promise<fabric.Object> {
		//Change the secondary point (x2, y2) of the object
		//This resizes the object between starting point (x,y)
		//and secondary point (x2,y2), where x2 and y2 have new values.
		if (x2 && y2) {
			object
				.set({
					x2: x,
					y2: y,
				})
				.setCoords();
		}

		//Wrap the resized object in a Promise
		return new Promise<fabric.Object>((resolve) => {
			resolve(object);
		});
	}
}
