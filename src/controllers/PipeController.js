export class PipeController {
  host;

  loosePipe = null;

  // Binding creates new copies of functions, so we must store
  // them if we are to remove them. You need to give removeEventListener
  // the exact function, not a copy.
  startPipeListener = this.startPipe.bind(this);
  movePipeListener = this.movePipe.bind(this);
  closePipeListener = this.closePipe.bind(this);
  cancelPipeListener = this.cancelPipe.bind(this);

  constructor(host) {
    (this.host = host).addController(this);
  }

  hostConnected() {
    // When the host is connected, we start listening for pipe events.
    addEventListener("port-click", this.startPipeListener);
  }

  addPipe(start, end) {
    let pipe = document.createElement("planager-pipe");
    pipe.start = start;
    pipe.end = end;
    pipe.slot = "undraggable";
    this.host.appendChild(pipe);
    this.host.requestUpdate();
    return pipe;
  }

  startPipe(e) {
    // Now that a connection is in progress, stop listening for new pipe events.
    removeEventListener("port-click", this.startPipeListener);
    const target = e.composedPath()[0];
    const rect = target.getBoundingClientRect();
    const mouseLocation = { x: e.detail.mouseX, y: e.detail.mouseY };
    const portLocation = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };

    // Right port means the end is loose, left means start.
    if (target.side == "right") {
      this.loosePipe = this.addPipe(portLocation, mouseLocation);
    } else {
      this.loosePipe = this.addPipe(mouseLocation, portLocation);
    }
    // Add attribute to record which side should track the mouse movements
    this.loosePipe.freeSide = target.side;

    // Event listeners for mouse movement and pipe ending
    addEventListener("pointermove", this.movePipeListener);
    addEventListener("port-click", this.closePipeListener);
    addEventListener("contextmenu", this.cancelPipeListener);
  }

  movePipe(e) {
    if (!this.loosePipe) return;
    if (this.loosePipe.freeSide == "right") {
      this.loosePipe.end = { x: e.clientX, y: e.clientY };
    } else {
      this.loosePipe.start = { x: e.clientX, y: e.clientY };
    }
    this.host.requestUpdate();
  }

  cancelPipe(e) {
    e.preventDefault();
    this.loosePipe.remove();
    this.loosePipe = null;
    // Remove move and close listeners, add back the start listener
    removeEventListener("pointermove", this.movePipeListener);
    removeEventListener("port-click", this.closePipeListener);
    removeEventListener("contextmenu", this.cancelPipeListener);
    addEventListener("port-click", this.startPipeListener);
  }

  closePipe(e) {
    let target = e.composedPath()[0];
    // Cancel if target port is same as origin port
    if (target.side === this.loosePipe.freeSide) {
      this.cancelPipe();
      return;
    }
    this.addPipe(this.loosePipe.start, this.loosePipe.end);
    this.cancelPipe(e);
  }
}
