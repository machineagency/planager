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
  looseEndListener = this.updateLoosePipe.bind(this);
  closePipeListener = this.closePipe.bind(this);
  cancelPipeListener = this.cancelPipe.bind(this);
  shouldConnect = this.canPipeConnect.bind(this);
  buildPipe = this.createLoosePipe.bind(this);

  constructor(host) {
    // The host element is passed into the constructor. We store it in this.host
    // so we can reference it later.
    this.host = host;
    this.host.addController(this);
  }

  hostConnected() {
    // When the host is connected, we start listening for pipe events.
    addEventListener("port-click", this.startPipeListener);
  }

  canPipeConnect() {
    // TODO: Replace this with an API call to check connectivity
    if (this.destinationPort.side === this.originPort.side) return false;
    if (this.destinationPort.parentid === this.originPort.parentid)
      return false;
    return true;
  }

  calculatePipeEnd(port) {
    // Calculates where the pipe should attach to a given port
    let portui = port.shadowRoot.querySelector("#portui");
    let rect = portui.getBoundingClientRect();
    let x;

    if (port.side == "left") {
      x = rect.left + 5;
    } else {
      x = rect.left + rect.width - 5;
    }

    let y = rect.top + rect.height / 2;

    return { x: x, y: y };
  }

  addPermanentPipe(response) {
    let pipe = document.createElement("planager-pipe");

    if (this.originPort.side === "right") {
      pipe.start = this.calculatePipeEnd(this.originPort);
      pipe.end = this.calculatePipeEnd(this.destinationPort);
    } else {
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

  createLoosePipe(side, mouseCoords, portCoords) {
    let pipe = document.createElement("planager-pipe");
    if (side == "right") {
      pipe.start = portCoords;
      pipe.end = mouseCoords;
      pipe.freeSide = "end";
      pipe.hookedSide = "start";
    } else {
      pipe.start = mouseCoords;
      pipe.end = portCoords;
      pipe.freeSide = "start";
      pipe.hookedSide = "end";
    }

    pipe.slot = "pipes";
    this.host.appendChild(pipe);
    return pipe;
  }

  startPipe(e) {
    // Now that a connection is in progress, stop listening for new pipe events.
    removeEventListener("port-click", this.startPipeListener);

    const targetPort = e.composedPath()[0];
    const mouseCoords = { x: e.detail.mouseX, y: e.detail.mouseY };
    const portCoords = this.calculatePipeEnd(targetPort);

    this.loosePipe = this.buildPipe(targetPort.side, mouseCoords, portCoords);
    this.originPort = targetPort;

    // Event listeners for mouse movement and pipe ending
    addEventListener("pointermove", this.looseEndListener);
    addEventListener("port-click", this.closePipeListener);
    addEventListener("contextmenu", this.cancelPipeListener);
  }

  updateLoosePipe(e) {
    if (!this.loosePipe) return;

    // Updates the loose side of the pipe to the pointer location
    this.updatePipeEnd(this.loosePipe, this.loosePipe.freeSide, {
      x: e.clientX,
      y: e.clientY,
    });

    // Updates the connected side of the pipe to the origin port location
    this.updatePipeEnd(
      this.loosePipe,
      this.loosePipe.hookedSide,
      this.calculatePipeEnd(this.originPort)
    );
  }

  updatePipeEnd(pipe, side, coords) {
    if (side === "end") {
      pipe.end = coords;
    } else {
      pipe.start = coords;
    }
  }

  updateAttachedPipes(tool) {
    let pipes = this.host._pipes;
    let parentid = tool.toolid;
    let toolRoot = tool.shadowRoot;

    // Get the pipes attached to this tool
    let outgoing = pipes.filter((node) =>
      node.matches(`planager-pipe[startparentid="${parentid}"]`)
    );
    let incoming = pipes.filter((node) =>
      node.matches(`planager-pipe[endparentid="${parentid}"]`)
    );

    // Update each outgoing pipe
    for (const pipe of outgoing) {
      // Query for the port attached to this pipe
      let port = toolRoot.querySelector(
        `#rightPortsContainer planager-port[portid=${pipe.startportid}]`
      );

      let coords = this.calculatePipeEnd(port);
      this.updatePipeEnd(pipe, "start", coords);
    }

    // Update each incoming pipe
    for (const pipe of incoming) {
      // Query for the port attached to this pipe
      let port = toolRoot.querySelector(
        `#leftPortsContainer planager-port[portid=${pipe.endportid}]`
      );

      let coords = this.calculatePipeEnd(port);
      this.updatePipeEnd(pipe, "end", coords);
    }
  }

  closePipe(e) {
    this.destinationPort = e.composedPath()[0];
    if (!this.shouldConnect()) {
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

    // Set pipe start and end coordinates
    pipe.start = this.calculatePipeEnd(originPort);
    pipe.end = this.calculatePipeEnd(destinationPort);

    // Assign attributes
    pipe.startparentid = pipeInfo.startActionID;
    pipe.startportid = pipeInfo.startPortID;
    pipe.endparentid = pipeInfo.endActionID;
    pipe.endportid = pipeInfo.endPortID;

    // Specify that it should be in the pipe slot
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

  cancelPipe(e) {
    // Cancels drawing the pipe that is in progress
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
}
