import { MouseState } from '$lib/types';
import { fabric } from 'fabric'

export class Renderer {
  mouseState: MouseState = MouseState.DEFAULT;
  constructor(
    private readonly canvas: fabric.Canvas,
  ) { }

  handleAddRect() {
    const rect = new fabric.Rect({
      fill: 'rgba(200,200,200,1)',
      stroke: 'rgba(0,0,0,1)',
      strokeWidth: 2,
      width: 200,
      height: 200,
    });
    this.canvas.add(rect);
    this.canvas.centerObject(rect);
    this.canvas.setActiveObject(rect);
  };
  handleAddCircle() {
    const circle = new fabric.Circle({
      fill: 'rgba(255,255,255,1)',
      stroke: 'rgba(0,0,0,1)',
      strokeWidth: 2,
      radius: 100,
    });
    this.canvas.add(circle);
    this.canvas.centerObject(circle);
    this.canvas.setActiveObject(circle);
  };
  // handleBringForward () {
  // 	setMouseStateDefault();
  // 	if (!$activeObject) {
  // 		$activeObject = null;
  // 		return;
  // 	}
  // 	canvas.bringForward($activeObject);
  // };
  // handleSendBackward () {
  // 	setMouseStateDefault();
  // 	if (!$activeObject) {
  // 		$activeObject = null;
  // 		return;
  // 	}
  // 	canvas.sendBackwards($activeObject);
  // };
  // handleAddText () {
  // 	setMouseStateDefault();
  // 	const textBox = new fabric.Textbox('Hello', {
  // 		editable: true,
  // 	});
  // 	canvas.add(textBox);
  // 	canvas.centerObject(textBox);
  // };

  handleDragging(mouseState: MouseState) {
    if (mouseState === MouseState.DRAGGING) {
      console.log('drag mode on');
      let lastClientX = 0;
      let lastClientY = 0;
      let state: string = 'ready';
      this.canvas.discardActiveObject();
      this.canvas.defaultCursor = 'grab';
      this.canvas.forEachObject((o: fabric.Object) => {
        o.evented = false;
        o.selectable = false;
      });
      this.canvas.selection = false;
      this.canvas.on('mouse:up', (e: fabric.IEvent<MouseEvent>) => {
        state = 'ready';
      });
      this.canvas.on('mouse:down', (e: fabric.IEvent<MouseEvent>) => {
        state = 'moving';
        lastClientX = e.e.clientX;
        lastClientY = e.e.clientY;
      });
      this.canvas.on('mouse:move', (e: fabric.IEvent<MouseEvent>) => {
        if (state === 'moving' && e && e.e) {
          const delta = {
            x: e.e.clientX - lastClientX,
            y: e.e.clientY - lastClientY,
          };
          this.canvas.relativePan(delta);
          lastClientX = e.e.clientX;
          lastClientY = e.e.clientY;
        }
      });
    } else {
      console.log('drag mode off');
      this.canvas.forEachObject((o: fabric.Object) => {
        o.evented = true;
        o.selectable = true;
      });
      this.canvas.defaultCursor = 'default';
      this.canvas.off('mouse:up');
      this.canvas.off('mouse:down');
      this.canvas.off('mouse:move');
      this.canvas.selection = true;
    }
  };
  handleDrawing(mouseState: MouseState) {
    if (mouseState === MouseState.DRAWING) {
      console.log('drawing mode on');
      this.canvas.isDrawingMode = true;
      this.canvas.freeDrawingBrush.color = 'rgba(0,0,0,1)';
      this.canvas.freeDrawingBrush.width = 5;
    } else {
      console.log('drawing mode off');
      this.canvas.isDrawingMode = false;
    }
  };

  handleDelete() {
    const activeObject = this.canvas.getActiveObject();
    if (activeObject) {
      this.canvas.remove(activeObject);
    }
  };

  preventExitCanvas(e: fabric.IEvent<MouseEvent>) {
    if (!e.target) return;
    if (!this.canvas) return;
    if (e.target.top && e.target.top < 0) {
      e.target.top = 0;
    }
    if (e.target.left && e.target.left < 0) {
      e.target.left = 0;
    }
    if (
      e.target.left &&
      e.target.width &&
      this.canvas.width &&
      e.target.left + e.target.width > this.canvas.width
    ) {
      e.target.left = this.canvas.width - e.target.width;
    }
    if (
      e.target.top &&
      e.target.height &&
      this.canvas.height &&
      e.target.top + e.target.height > this.canvas.height
    ) {
      e.target.top = this.canvas.height - e.target.height;
    }
  };
}