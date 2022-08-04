import "../components/tool_ui/Pipe";
export class PipeController {
  host;

  loosePipe = null;
  originPort = null;
  destinationPort = null;

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

  portCenter(port) {
    return {
      x: port.pipeX,
      y: port.pipeY,
    };
  }

  hostConnected() {
    // When the host is connected, we start listening for pipe events.
    addEventListener("port-click", this.startPipeListener);
  }

  addLoosePipe(start, end) {
    let pipe = document.createElement("planager-pipe");
    pipe.start = start;
    pipe.end = end;
    pipe.slot = "undraggable";
    this.host.appendChild(pipe);
    this.host.requestUpdate();
    return pipe;
  }

  addPermanentPipe(response) {
    let pipe = document.createElement("planager-pipe");

    if (this.originPort.side === "right") {
      pipe.start = this.portCenter(this.originPort);
      pipe.end = this.portCenter(this.destinationPort);
    } else {
      pipe.end = this.portCenter(this.originPort);
      pipe.start = this.portCenter(this.destinationPort);
    }

    let result = response.pipe;

    pipe.startparentid = result.startActionID;
    pipe.startportid = result.startPortID;
    pipe.endparentid = result.endActionID;
    pipe.endportid = result.endPortID;

    pipe.slot = "undraggable";

    this.host.appendChild(pipe);
    this.host.requestUpdate();

    return pipe;
  }

  startPipe(e) {
    // Now that a connection is in progress, stop listening for new pipe events.
    removeEventListener("port-click", this.startPipeListener);
    const target = e.composedPath()[0];
    const mouseLocation = { x: e.detail.mouseX, y: e.detail.mouseY };
    const portLocation = this.portCenter(target);

    // Right port means the end is loose, left means start.
    if (target.side == "right") {
      this.loosePipe = this.addLoosePipe(portLocation, mouseLocation);
    } else {
      this.loosePipe = this.addLoosePipe(mouseLocation, portLocation);
    }
    // Add attribute to record which side should track the mouse movements
    this.loosePipe.freeSide = target.side;
    this.originPort = target;

    // Event listeners for mouse movement and pipe ending
    addEventListener("pointermove", this.movePipeListener);
    addEventListener("port-click", this.closePipeListener);
    addEventListener("contextmenu", this.cancelPipeListener);
  }

  movePipe(e) {
    if (!this.loosePipe) return;
    if (this.host.dragType == "canvas") return;
    if (this.loosePipe.freeSide == "right") {
      this.loosePipe.end = { x: e.clientX, y: e.clientY };
    } else {
      this.loosePipe.start = { x: e.clientX, y: e.clientY };
    }

    this.host.requestUpdate();
  }

  movePipeEnd(pipe, side, delta) {
    if (side === "end") {
      pipe.end = { x: pipe.end.x + delta.x, y: pipe.end.y + delta.y };
    } else {
      pipe.start = { x: pipe.start.x + delta.x, y: pipe.start.y + delta.y };
    }
  }

  moveAttachedPipes(parentid, delta) {
    const pipes = this.host.shadowRoot
      .querySelector("slot[name=undraggable]")
      .assignedElements();
    const outgoing = pipes.filter((node) =>
      node.matches(`planager-pipe[startparentid="${parentid}"]`)
    );
    const incoming = pipes.filter((node) =>
      node.matches(`planager-pipe[endparentid="${parentid}"]`)
    );
    for (const pipe of outgoing) {
      this.movePipeEnd(pipe, "start", delta);
    }
    for (const pipe of incoming) {
      this.movePipeEnd(pipe, "end", delta);
    }
  }

  cancelPipe(e) {
    e.preventDefault();
    this.loosePipe.remove();
    this.loosePipe = null;
    this.originPort = null;
    this.destinationPort = null;
    // Remove move and close listeners, add back the start listener
    removeEventListener("pointermove", this.movePipeListener);
    removeEventListener("port-click", this.closePipeListener);
    removeEventListener("contextmenu", this.cancelPipeListener);
    addEventListener("port-click", this.startPipeListener);
  }

  closePipe(e) {
    this.destinationPort = e.composedPath()[0];
    if (this.destinationPort.side === this.originPort.side) {
      // Cancel if ports are the same side
      this.cancelPipe(e);
      return;
    } else if (this.destinationPort.parentid === this.originPort.parentid) {
      // Cancel if ports have the same parent
      this.cancelPipe(e);
      return;
    }

    let end, start;

    if (this.originPort.side === "right") {
      end = this.destinationPort;
      start = this.originPort;
    } else {
      end = this.originPort;
      start = this.destinationPort;
    }

    this.host.socket.emit(
      "addPipe",
      {
        startActionID: start.parentid,
        startPortID: start.portid,
        endActionID: end.parentid,
        endPortID: end.portid,
      },
      (result) => {
        this.addPermanentPipe(result);
        this.cancelPipe(e);
      }
    );
  }

  addPipe(pipeInfo) {
    console.log(pipeInfo);
    let pipe = document.createElement("planager-pipe");
    console.log(this.host._draggable);
  }
}
