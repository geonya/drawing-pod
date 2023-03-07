import type { paletteColor } from '$lib/store';
import { MotionState, PaintType } from '$lib/types';
import { fabric } from 'fabric'

export class Render {
  motionState: MotionState = MotionState.DEFAULT;
  fill: string | null = null;
  stroke: string | null = null;
  activeObject: fabric.Object | null = null;
  constructor(
    private canvas: fabric.Canvas,
  ) {
    this.activeObject = this.canvas.getActiveObject();
  }

  onAddRect() {
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
  onAddCircle() {
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
  onBringForward() {
    if (!this.activeObject) {
      this.activeObject = null;
      return;
    }
    this.canvas.bringForward(this.activeObject);
  };
  onSendBackward() {
    if (!this.activeObject) {
      this.activeObject = null;
      return;
    }
    this.canvas.sendBackwards(this.activeObject);
  };
  onAddText() {

    const textBox = new fabric.Textbox('Hello', {
      editable: true,
    });
    this.canvas.add(textBox);
    this.canvas.centerObject(textBox);
  };

  onChangeMotionState(state: MotionState) {
    this.motionState = state;
    // TODO : change cursor
    // this.canvas.defaultCursor = state;
  }

  onDragStart() {

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
  }
  onDragEnd() {
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

  };

  onDrawStart() {
    console.log('drawing mode on');
    this.canvas.isDrawingMode = true;
    this.canvas.freeDrawingBrush.color = 'rgba(0,0,0,1)';
    this.canvas.freeDrawingBrush.width = 5;
  }

  onDrawEnd() {
    console.log('drawing mode off');
    this.canvas.isDrawingMode = false;
  }

  onPreventCanvasExit(e: fabric.IEvent<MouseEvent>) {
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

  onCreateObjectSelect() {
    const activeObject = this.canvas.getActiveObject();
    console.log(activeObject)
    if (activeObject) {
      const { fill: _fill, stroke: _stroke } = activeObject;
      this.fill = _fill as string;
      this.stroke = _stroke as string;
    }
  };

  onChangeObjectSelect() {
    const activeObject = this.canvas.getActiveObject();
    if (activeObject) {
      const { fill: _fill, stroke: _stroke } = activeObject;
      this.fill = _fill as string;
      this.stroke = _stroke as string;
    }
  };
  onClearObjectSelect() {
    this.canvas.discardActiveObject();
    this.fill = null;
    this.stroke = null;
  };

  onUpdateColor(colorObj: paletteColor) {
    const activeObject = this.canvas.getActiveObject();
    if (activeObject) {
      const { color, type } = colorObj;
      if (type === PaintType.FILL) {
        activeObject.set(PaintType.FILL, color);
      }
      if (type === PaintType.STROKE) {
        activeObject.set(PaintType.STROKE, color);
      }
      this.canvas.requestRenderAll();
    }
  };
}
