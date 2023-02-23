<script lang="ts">
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
</script>
