import { html, css, LitElement, nothing } from "lit";

import { PipeController } from "../controllers/PipeController";

import "./PlanagerContextMenu";
import "./PlanagerBackground";

// Largely comes from https://rodydavis.com/posts/lit-draggable-dom/
export class PlanagerCanvas extends LitElement {
  pipe = new PipeController(this);

  pointerMap = new Map();

  static properties = {
    scaleFactor: { type: Number, reflect: true },
    viewOffset: { type: Object, reflect: true },
    dragType: { type: String, reflect: true },
  };

  constructor() {
    super();
    this.scaleFactor = 1;
    this.viewOffset = { x: 0, y: 0 };
    this.dragType = "none";
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
      <div id="main-canvas" class="full-size">
        <planager-background
          style="--offset-x: -0; --offset-y: 0; --scaleFactor: 1;"
        ></planager-background>
        <div id="pinned-element-container">
          <slot name="undraggable" @slotchange=${this.undraggableSlot}></slot>
          <slot name="draggable" @slotchange=${this.draggableSlot}></slot>
        </div>
        <div id="floating-element-container"></div>
      </div>
    `;
  }

  handleDown(event, type) {
    if (this.dragType === "none") {
      event.preventDefault();
      this.dragType = type;
      event.target.setPointerCapture(event.pointerId);
      this.pointerMap.set(event.pointerId, {
        id: event.pointerId,
        startPos: { x: event.clientX, y: event.clientY },
        currentPos: { x: event.clientX, y: event.clientY },
      });
    }
  }

  handleMove(event, type, onMove) {
    if (this.dragType === type) {
      event.preventDefault();
      const saved = this.pointerMap.get(event.pointerId);
      const current = { ...saved.currentPos };
      saved.currentPos = { x: event.clientX, y: event.clientY };
      const delta = {
        x: saved.currentPos.x - current.x,
        y: saved.currentPos.y - current.y,
      };
      onMove(delta);
    }
  }

  handleUp(event) {
    this.dragType = "none";
    event.target.releasePointerCapture(event.pointerId);
  }

  handleZoom(event) {
    if (event.wheelDelta > 0) {
      this.scaleFactor = this.scaleFactor + 0.1;
    } else {
      this.scaleFactor = this.scaleFactor - 0.1;
    }
    this.pinned.style.transform = `scale(${this.scaleFactor})`;
    this.background.style.setProperty("--scaleFactor", this.scaleFactor);
  }

  moveBackground(delta) {
    let newOffset = {};
    newOffset.x = this.viewOffset.x + delta.x * (2 - this.scaleFactor);
    newOffset.y = this.viewOffset.y + delta.y * (2 - this.scaleFactor);
    this.viewOffset = newOffset;
    this.background.style.setProperty(
      "--offset-x",
      `${this.viewOffset.x * this.scaleFactor}px`
    );
    this.background.style.setProperty(
      "--offset-y",
      `${this.viewOffset.y * this.scaleFactor}px`
    );
  }

  moveElement(child, delta) {
    const getNumber = (key, fallback) => {
      const saved = child.style.getPropertyValue(key);
      if (saved.length > 0) {
        return parseFloat(saved.replace("px", ""));
      }
      return fallback;
    };

    const dx = getNumber("--dx", 0) + delta.x * (2 - this.scaleFactor);
    const dy = getNumber("--dy", 0) + delta.y * (2 - this.scaleFactor);
    // child.dx = dx;
    // child.dy = dy;
    child.style.transform = `translate(${dx}px, ${dy}px)`;
    child.style.setProperty("--dx", `${dx}px`);
    child.style.setProperty("--dy", `${dy}px`);
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

  // This runs when nodes are added to the draggable slot.
  draggableSlot(e) {
    // This is all of the nodes in the slot.
    const nodes = e.target.assignedNodes({ flatten: true });
    let i = 0;
    // console.log(nodes);
    for (const node of nodes) {
      if (node instanceof SVGElement || node instanceof HTMLElement) {
        const child = node;
        child.style.setProperty("--layer", `${i}`);
        child.style.setProperty("position", "fixed");

        // Pass the child the event handlers from this canvas component.
        // Allows us to specify what parts of the child will be draggable
        // (e.g. just the header)
        child.handleDown = (e) => {
          this.handleDown(e, "element");
        };
        child.handleMove = (e) => {
          this.handleMove(e, "element", (delta) => {
            // This runs while this element is moving
            this.moveElement(child, delta);
          });
        };
        i++;
      }
    }
  }

  undraggableSlot(e) {
    const nodes = e.target.assignedNodes({ flatten: true });
    let i = 0;
    for (const node of nodes) {
      if (node instanceof SVGElement || node instanceof HTMLElement) {
        const child = node;
        child.style.setProperty("--layer", `${i}`);
        child.style.setProperty("position", "fixed");
        i++;
      }
    }
  }

  async firstUpdated() {
    this.root = this.renderRoot.querySelector("#main-canvas");
    this.pinned = this.renderRoot.querySelector("#pinned-element-container");
    this.background = this.renderRoot.querySelector("planager-background");

    // Add a listener to the whole thing to handle pointerdown events
    this.root.addEventListener("pointerdown", (e) => {
      this.handleDown(e, "canvas");
    });

    // Add a listener to the whole thing to handle move events
    this.root.addEventListener("pointermove", (e) => {
      this.handleMove(e, "canvas", (delta) => {
        this.moveBackground(delta);
        for (const node of Array.from(this._pinnedElements)) {
          if (node instanceof SVGElement || node instanceof HTMLElement) {
            this.moveElement(node, delta);
          }
        }
      });
    });

    // Listener for drag stop/pointer up
    this.root.addEventListener("pointerup", (e) => {
      this.handleUp(e);
    });

    // Listener for the mouse wheel for zooming
    window.addEventListener("wheel", (e) => {
      this.handleZoom(e);
    });
  }
}
customElements.define("planager-canvas", PlanagerCanvas);
