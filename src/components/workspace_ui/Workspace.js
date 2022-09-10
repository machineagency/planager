import { html, css, LitElement } from "lit";

import { PipeController } from "../../controllers/PipeController";

import "./ContextMenu";
import "./Background";

// Workspace class handles user interactions with the toolchain
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

    #tool-container {
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
        <div id="pipe-container">
          <slot name="pipes" @slotchange=${this.pipeSlot}></slot>
        </div>
        <div id="tool-container">
          <slot name="tools" @slotchange=${this.onToolSlotChange}></slot>
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
    this.dragType = "none";
    event.target.releasePointerCapture(event.pointerId);
  }

  shiftView(delta) {
    // Calculate the new viewOffset
    let newOffset = {
      x: this.viewOffset.x + delta.x * (2 - this.scaleFactor),
      y: this.viewOffset.y + delta.y * (2 - this.scaleFactor),
    };

    this.viewOffset = newOffset;

    // Update the background position
    this.background.style.setProperty(
      "--offset-x",
      `${this.viewOffset.x * this.scaleFactor}px`
    );
    this.background.style.setProperty(
      "--offset-y",
      `${this.viewOffset.y * this.scaleFactor}px`
    );

    // translate the tool container
    this._toolContainer.style.transform = `translate(${this.viewOffset.x}px, ${this.viewOffset.y}px)`;
    // Redraw pipes
    for (const tool of this._tools) {
      this.pipeController.updateAttachedPipes(tool);
    }
  }

  updatePosition(element, delta) {
    // Updates an element's position property and translate it.
    element.dx = element.dx + delta.x * (2 - this.scaleFactor);
    element.dy = element.dy + delta.y * (2 - this.scaleFactor);
    element.style.transform = `translate(${element.dx}px, ${element.dy}px)`;

    // TODO: Better way of recording tool coordinates than just checking if
    // it has info. Also, it might be good to just update coordinates when
    // the drag ends.
    if (element.info) {
      this.socket.emit("update_tool_coordinates", {
        tool_id: element.info.id,
        coordinates: { x: element.dx, y: element.dy },
      });
    }
  }

  getToolByID(toolID) {
    for (const tool of this._tools) {
      if (tool.info.id == toolID) {
        return tool;
      }
    }
  }

  getPipeByIDs(startPortID, startToolID, endPortID, endToolID) {
    const pipes = this._pipes;
    let obj = pipes.find(
      (pipe) =>
        pipe.startportid === startPortID &&
        pipe.startparentid === startToolID &&
        pipe.endportid === endPortID &&
        pipe.endparentid === endToolID
    );
    return obj;
  }

  get _toolContainer() {
    return this.shadowRoot.querySelector("#tool-container");
  }

  get _pipeContainer() {
    return this.shadowRoot.querySelector("#pipe-container");
  }

  get _toolsAndPipes() {
    // Selects all of the tools and pipes
    const tools = this.shadowRoot
      .querySelector("slot[name=tools]")
      .assignedElements({ flatten: true });
    const pipes = this.shadowRoot
      .querySelector("slot[name=pipes]")
      .assignedElements({ flatten: true });
    tools.push(...pipes);
    return tools;
  }

  get _tools() {
    const tools = this.shadowRoot
      .querySelector("slot[name=tools]")
      .assignedElements({ flatten: true });
    return tools;
  }

  get _pipes() {
    return this.shadowRoot
      .querySelector("slot[name=pipes]")
      .assignedElements({ flatten: true });
  }

  onResize(entries, observer) {
    // This is called if a tool ui changes size, which allows us to update
    // the pipe position accordingly
    for (const entry of entries) {
      this.pipeController.updateAttachedPipes(entry.target);
    }
  }

  // This runs when nodes are added or removed from the tool slot.
  onToolSlotChange(e) {
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
          this.pipeController.updateAttachedPipes(newTool);
        });
      };

      const observer = new ResizeObserver(this.onResize.bind(this));
      observer.observe(newTool);

      // Finally, properly position the element by calling move with negative
      // view offset. This means the new tool will alway be placed relative to
      // the current view.
      this.updatePosition(newTool, {
        x: -this.viewOffset.x,
        y: -this.viewOffset.y,
      });
    }
  }

  pipeSlot(e) {
    // This runs when pipes are added to the pipe slot
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
    this.socket.on("pipe_added", (pipe, cb) => {
      this.pipeController.addPipe(pipe);
    });
    this.socket.on("pipe_removed", (pipe) => {
      this.pipeController.removePipe(pipe);
    });
  }

  async firstUpdated() {
    // Save references to the workspace and background
    this.root = this.renderRoot.querySelector("#workspace");
    this.background = this.renderRoot.querySelector("planager-background");

    // Add a listener to the workspace to handle pointerdown events
    this.root.addEventListener("pointerdown", (e) => {
      this.handleDown(e, "canvas");
    });

    // Add a listener to the workspace background to handle move events
    this.root.addEventListener("pointermove", (e) => {
      // When the move is a canvas move, we will shift the view.
      this.handleMove(e, "canvas", (delta) => this.shiftView(delta));
    });

    // Listener for drag stop/pointer up
    this.root.addEventListener("pointerup", (e) => this.handleUp(e));
  }
}
customElements.define("planager-workspace", Workspace);
