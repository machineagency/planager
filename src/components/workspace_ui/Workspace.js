import { html, css, LitElement, nothing } from "lit";

import { PipeController } from "../../controllers/PipeController";

import "./ContextMenu";
import "./Background";

export class Workspace extends LitElement {
  pipeController = new PipeController(this);
  pointerMap = new Map();

  static properties = {
    scaleFactor: { type: Number, reflect: true },
    viewOffset: { type: Object, reflect: true },
    dragType: { type: String, reflect: true },
    socket: {},
    numTools: { type: Number, state: true },
  };

  constructor() {
    super();
    this.scaleFactor = 1;
    this.viewOffset = { x: 0, y: 0 };
    this.dragType = "none";
    this.numTools = 0;
  }

  static styles = css`
    .full-size {
      width: 100%;
      height: 100%;
      position: fixed;
    }
  `;

  render() {
    return html`
      <div id="workspace" class="full-size">
        <planager-background
          style="--offset-x: 0; --offset-y: 0; --scaleFactor: 1;"
        ></planager-background>
        <div id="undraggable-elements-container">
          <slot name="undraggable" @slotchange=${this.undraggableSlot}></slot>
        </div>
        <div id="draggable-elements-container">
          <slot
            name="draggable"
            @slotchange=${this.onDraggableSlotChange}
          ></slot>
        </div>
        <div id="floating-element-container">
          <slot name="floating" @slotchange=${this.floatingSlot}></slot>
        </div>
      </div>
    `;
  }

  handleDown(event, type) {
    // If there is not currently a drag happening
    if (this.dragType === "none") {
      event.preventDefault();
      // Start a drag
      this.dragType = type;

      // Designates the event target as the capture target of future pointer events
      event.target.setPointerCapture(event.pointerId);

      // Initializes a map to track the pointer id and positions
      // so that we can calculate the delta position
      this.pointerMap.set(event.pointerId, {
        id: event.pointerId,
        currentPos: { x: event.clientX, y: event.clientY },
      });
    }
  }

  handleMove(event, type, onMove) {
    // Type is element, canvas, or none.
    if (this.dragType === type) {
      event.preventDefault();
      // Get info of the pointer id, start, and current position
      const saved = this.pointerMap.get(event.pointerId);

      // Copy the current position
      const lastPos = { ...saved.currentPos };

      // Update the current position in the pointer map to be client locations
      saved.currentPos = { x: event.clientX, y: event.clientY };

      // Calculate the delta, difference between current and last positions
      const delta = {
        x: saved.currentPos.x - lastPos.x,
        y: saved.currentPos.y - lastPos.y,
      };

      // Do the onMove callback
      onMove(delta);
    }
  }

  handleUp(event) {
    // if (this.dragType == "element" && event.target.info) {
    //   const element = event.target;
    //   this.socket.emit("moveTool", {
    //     id: element.info.id,
    //     coords: { x: element.dx, y: element.dy },
    //   });
    //   console.log("end element drag");
    //   console.log(event.target);
    //   console.log(event.target.info.id);
    // }
    this.dragType = "none";
    event.target.releasePointerCapture(event.pointerId);
  }

  // handleZoom(event) {
  //   if (event.wheelDelta > 0) {
  //     this.scaleFactor = this.scaleFactor + 0.1;
  //   } else {
  //     this.scaleFactor = this.scaleFactor - 0.1;
  //   }
  //   let draggables = this.renderRoot.querySelector(
  //     "#draggable-elements-container"
  //   );

  //   draggables.style.transform = `scale(${this.scaleFactor})`;

  //   for (const node of Array.from(this._undraggables)) {
  //     if (node instanceof SVGElement || node instanceof HTMLElement) {
  //       node.scaleFactor = this.scaleFactor;
  //     }
  //   }
  //   this.background.style.setProperty("--scaleFactor", this.scaleFactor);
  // }

  moveBackground(delta) {
    let newOffset = {};
    newOffset.x = this.viewOffset.x + delta.x * (2 - this.scaleFactor);
    newOffset.y = this.viewOffset.y + delta.y * (2 - this.scaleFactor);
    this.viewOffset = newOffset;
    // this.background.requestUpdate();
    this.background.style.setProperty(
      "--offset-x",
      `${this.viewOffset.x * this.scaleFactor}px`
    );
    this.background.style.setProperty(
      "--offset-y",
      `${this.viewOffset.y * this.scaleFactor}px`
    );
  }

  updatePosition(element, delta) {
    // Update the element's position property and translate it.
    element.dx = element.dx + delta.x * (2 - this.scaleFactor);
    element.dy = element.dy + delta.y * (2 - this.scaleFactor);
    element.style.transform = `translate(${element.dx}px, ${element.dy}px)`;

    if (element.info) {
      this.socket.emit("moveTool", {
        id: element.info.id,
        coords: { x: element.dx, y: element.dy },
      });
    }
  }

  getToolByID(toolID) {
    for (const tool of this._draggable) {
      if (tool.info.id == toolID) {
        return tool;
      }
    }
  }

  getPipeByIDs(startPortID, startToolID, endPortID, endToolID) {
    const pipes = this.shadowRoot
      .querySelector(`slot[name=undraggable]`)
      .assignedElements({ flatten: true });
    let obj = pipes.find(
      (pipe) =>
        pipe.startportid === startPortID &&
        pipe.startparentid === startToolID &&
        pipe.endportid === endPortID &&
        pipe.endparentid === endToolID
    );
    return obj;
  }

  get _pinnedElements() {
    const pinned = this.shadowRoot
      .querySelector("slot[name=draggable]")
      .assignedElements({ flatten: true });
    const undraggable = this.shadowRoot
      .querySelector("slot[name=undraggable]")
      .assignedElements({ flatten: true });
    pinned.push(...undraggable);
    return pinned;
  }

  get _draggable() {
    const pinned = this.shadowRoot
      .querySelector("slot[name=draggable]")
      .assignedElements({ flatten: true });
    return pinned;
  }

  get _undraggables() {
    return this.shadowRoot
      .querySelector("slot[name=undraggable]")
      .assignedElements({ flatten: true });
  }

  get _pipes() {
    return this.shadowRoot
      .querySelector("slot[name=undraggable]")
      .assignedElements({ flatten: true });
  }

  // This runs when nodes are added or removed from the draggable slot.
  onDraggableSlotChange(e) {
    // Get all of the nodes in the slot.
    const nodes = e.target.assignedNodes({ flatten: true });
    if (this.numTools > nodes.length) {
      // A tool has been removed
      this.numTools = nodes.length;
    } else {
      // A tool has been added
      this.numTools = nodes.length;

      // The last node is the last one added
      const newTool = nodes[this.numTools - 1];

      // Set the layer (used as the z-index)
      newTool.layer = this.numTools;

      newTool.handleDown = (e) => {
        this.handleDown(e, "element");
      };

      newTool.handleMove = (e) => {
        this.handleMove(e, "element", (delta) => {
          // This runs while this element is moving
          this.updatePosition(newTool, delta);
          this.pipeController.moveAttachedPipes(newTool.info.id, delta);
        });
      };

      // Finally, properly position the element by calling move with no delta
      this.updatePosition(newTool, { x: 0, y: 0 });
    }
  }

  undraggableSlot(e) {
    const nodes = e.target.assignedNodes({ flatten: true });
    let i = 0;
    for (const node of nodes) {
      if (node instanceof SVGElement || node instanceof HTMLElement) {
        const child = node;
        child.style.setProperty("position", "fixed");
        i++;
      }
    }
  }

  floatingSlot(e) {
    const nodes = e.target.assignedNodes({ flatten: true });
    let i = 0;
    for (const node of nodes) {
      if (node instanceof SVGElement || node instanceof HTMLElement) {
        const child = node;
        child.style.setProperty("position", "fixed");

        child.handleDown = (e) => {
          this.handleDown(e, "element");
        };

        child.handleMove = (e) => {
          this.handleMove(e, "element", (delta) => {
            // This runs while this element is moving
            this.updatePosition(child, delta);
          });
        };

        child.requestUpdate();
        i++;
        this.updatePosition(child, { x: 0, y: 0 });
      }
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this.socket.on("pipeConnected", (pipes, cb) => {
      this.pipeController.addPipe(pipes);
      // console.log(cb);
    });
    this.socket.on("remove_pipe", (info) => {
      this.pipeController.removePipe(info);
    });
  }

  async firstUpdated() {
    this.root = this.renderRoot.querySelector("#workspace");
    this.background = this.renderRoot.querySelector("planager-background");

    // Add a listener to the worskspace to handle pointerdown events
    this.root.addEventListener("pointerdown", (e) => {
      this.handleDown(e, "canvas");
    });

    // Add a listener to the workspace to handle move events
    this.root.addEventListener("pointermove", (e) => {
      this.handleMove(e, "canvas", (delta) => {
        this.moveBackground(delta);
        for (const node of Array.from(this._pinnedElements)) {
          if (node instanceof SVGElement || node instanceof HTMLElement) {
            this.updatePosition(node, delta);
          }
        }
      });
    });

    // Listener for drag stop/pointer up
    this.root.addEventListener("pointerup", (e) => {
      this.handleUp(e);
    });

    // Listener for the mouse wheel for zooming
    // this.root.addEventListener("wheel", (e) => {
    //   this.handleZoom(e);
    // });
  }
}
customElements.define("planager-workspace", Workspace);
