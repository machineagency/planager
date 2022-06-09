export class ToolMouseController {
  down = false;
  tracking = false;
  pos = { x: 0, y: 0, xRatio: 0, yRatio: 0 };

  constructor(host) {
    this.host = host;
    host.addController(this);
    this.trackedElement = host;
  }

  mouseDown() {}

  setTrackedElement(el) {
    this.trackedElement = el;
  }

  onMousemove = (e) => {
    let bounds = this.trackedElement.getBoundingClientRect();
    this.pos = {
      x: e.layerX,
      y: e.layerY,
      xRatio: e.layerX / bounds.width,
      yRatio: e.layerY / bounds.height,
    };
    this.host.requestUpdate();
  };

  onMousedown = (e) => {
    this.down = true;
    this.mouseDown();
    this.host.requestUpdate();
  };

  onMouseup = (e) => {
    this.down = false;
    this.host.requestUpdate();
  };

  onMouseEnter = (e) => {
    this.tracking = true;
    this.trackedElement.addEventListener("mousemove", this.onMousemove);
    this.trackedElement.addEventListener("mousedown", this.onMousedown);
    this.trackedElement.addEventListener("mouseup", this.onMouseup);
  };

  onMouseExit = (e) => {
    this.tracking = false;
    this.trackedElement.removeEventListener("mousemove", this.onMousemove);
    this.trackedElement.removeEventListener("mousedown", this.onMousedown);
    this.trackedElement.removeEventListener("mouseup", this.onMouseup);
  };

  hostConnected() {
    this.host.addEventListener("mouseenter", this.onMouseEnter);
    this.host.addEventListener("mouseexit", this.onMouseExit);
  }

  hostDisconnected() {
    this.host.removeEventListener("mouseenter", this.onMouseEnter);
    this.host.addEventListener("mouseexit", this.onMouseExit);
  }
}
