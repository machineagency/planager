import "../components/tool_ui/Pipe";

export class PipeController {
  host; // Declare the host variable so we can use it later

  loosePipe = null; // This is the reference to a pipe that is in progress of being connected
  originPort = null;
  destinationPort = null;

  // In order to properly remove an event listener, you need to give
  // removeEventListener the exact function rather than a copy. Binding `this`
  // creates new copies of functions, so we must store them as variables if we
  // are to remove them later.
  startPipeListener = this.startPipe.bind(this);
  movePipeListener = this.movePipe.bind(this);
  closePipeListener = this.closePipe.bind(this);
  cancelPipeListener = this.cancelPipe.bind(this);

  constructor(host) {
    // The host element is passed into the constructor. We store it in this.host
    // so we can reference it later.
    this.host = host;
    this.host.addController(this);
  }

  calculatePipeEnd(port) {
    const rect = port.getBoundingClientRect();
    const offset = this.host.viewOffset;

    return {
      x: rect.left + offset.x + (port.side == "right" ? rect.width - 5 : 5),
      y: rect.top + offset.y + rect.height / 2,
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
    pipe.slot = "pipes";
    this.host.appendChild(pipe);
    this.host.requestUpdate();
    return pipe;
  }

  addPermanentPipe(response) {
    let pipe = document.createElement("planager-pipe");

    if (this.originPort.side === "right") {
      // pipe.start = this.originPort.pipe;
      pipe.start = this.calculatePipeEnd(this.originPort);
      // pipe.end = this.destinationPort.pipe;
      pipe.end = this.calculatePipeEnd(this.destinationPort);
    } else {
      // pipe.end = this.originPort.pipe;
      // pipe.start = this.destinationPort.pipe;
      pipe.start = this.calculatePipeEnd(this.destinationPort);
      pipe.end = this.calculatePipeEnd(this.originPort);
    }

    let result = response.pipe;

    pipe.startparentid = result.startActionID;
    pipe.startportid = result.startPortID;
    pipe.endparentid = result.endActionID;
    pipe.endportid = result.endPortID;

    pipe.slot = "pipes";

    this.host.appendChild(pipe);
    this.host.requestUpdate();

    return pipe;
  }

  startPipe(e) {
    // Now that a connection is in progress, stop listening for new pipe events.
    removeEventListener("port-click", this.startPipeListener);
    const target = e.composedPath()[0];
    const mouseLocation = { x: e.detail.mouseX, y: e.detail.mouseY };
    // const portLocation = this.portCenter(target);
    // const portLocation = target.pipe;
    const portLocation = this.calculatePipeEnd(target);

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

  updatePipeEnd(pipe, side, coords) {
    if (side === "end") {
      pipe.end = coords;
    } else {
      pipe.start = coords;
    }
  }

  moveAttachedPipes(parentid, delta) {
    const pipes = this.host.shadowRoot
      .querySelector("slot[name=pipes]")
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
    let startingTool = this.host.getToolByID(pipeInfo.startActionID);
    let endTool = this.host.getToolByID(pipeInfo.endActionID);

    let originPort = startingTool.renderRoot.querySelector(
      `planager-port[side=right][portid=${pipeInfo.startPortID}]`
    );

    let destinationPort = endTool.renderRoot.querySelector(
      `planager-port[side=left][portid=${pipeInfo.endPortID}]`
    );

    let pipe = document.createElement("planager-pipe");

    // pipe.start = originPort.pipe;
    // pipe.end = destinationPort.pipe;
    pipe.start = this.calculatePipeEnd(originPort);
    pipe.end = this.calculatePipeEnd(destinationPort);

    pipe.startparentid = pipeInfo.startActionID;
    pipe.startportid = pipeInfo.startPortID;
    pipe.endparentid = pipeInfo.endActionID;
    pipe.endportid = pipeInfo.endPortID;

    pipe.slot = "pipes";

    this.host.appendChild(pipe);
    this.host.requestUpdate();
  }

  removePipe(info) {
    let pipeToRemove = this.host.getPipeByIDs(
      info.start_port_id,
      info.start_tool_id,
      info.end_port_id,
      info.end_tool_id
    );
    if (!pipeToRemove) return;
    pipeToRemove.remove();
  }

  updatePipe() {
    console.log("pipe");
  }
}
