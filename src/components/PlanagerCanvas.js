import { html, css, LitElement } from "lit";
import "./PlanagerContextMenu";

// Largely comes from https://rodydavis.com/posts/lit-draggable-dom/
export class PlanagerCanvas extends LitElement {
  dragType = "none";
  offset = { x: 0, y: 0 };
  pointerMap = new Map();
  scaleFactor = 1;

  static properties = {
    _contextMenu: { state: true },
  };

  constructor() {
    super();
    this._contextMenu = false;
  }

  static styles = css`
    :host {
      --offset-x: 0;
      --offset-y: 0;
      --grid-background-color: white;
      --grid-color: black;
      --grid-size: 2rem;
      --grid-dot-size: 1px;
    }
    main {
      overflow: hidden;
    }
    canvas {
      background-size: var(--grid-size) var(--grid-size);
      background-image: radial-gradient(
        circle,
        var(--planager-foreground) var(--grid-dot-size),
        var(--planager-background) var(--grid-dot-size)
      );
      background-position: var(--offset-x) var(--offset-y);
      z-index: 0;
    }
    .full-size {
      width: 100%;
      height: 100%;
      position: fixed;
    }
    .child {
      --dx: 0px;
      --dy: 0px;
      position: fixed;
      flex-shrink: 1;
      z-index: var(--layer, 0);
      transform: translate(var(--dx), var(--dy));
    }
    @media (prefers-color-scheme: dark) {
      main {
        --grid-background-color: black;
        --grid-color: grey;
      }
    }
  `;

  render() {
    return html`
      <div id="main-canvas" class="full-size" @contextmenu=${this.handleClick}>
        <canvas class="full-size"></canvas>
        <div id="children" class="full-size"></div>
        ${this._contextMenu ? html`<planager-context-menu />` : ``}
      </div>
    `;
  }

  context() {
    console.log("hello");
    if (this._contextMenu) {
      return html`<planager-context-menu></planager-context-menu>`;
    }
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

  handleClick(event) {
    console.log("right click");
    event.preventDefault();
    this._contextMenu = !this._contextMenu;
  }

  handleZoom(event) {
    if (event.wheelDelta > 0) {
      this.scaleFactor = this.scaleFactor + 0.1;
    } else {
      this.scaleFactor = this.scaleFactor - 0.1;
    }
    this.container.style.transform = `scale(${this.scaleFactor})`;
    this.canvas.style.backgroundSize = `calc(var(--grid-size)*${this.scaleFactor}) calc(var(--grid-size)*${this.scaleFactor})`;
  }

  moveCanvas(delta) {
    this.offset.x += delta.x * (2 - this.scaleFactor);
    this.offset.y += delta.y * (2 - this.scaleFactor);
    this.root.style.setProperty(
      "--offset-x",
      `${this.offset.x * this.scaleFactor}px`
    );
    this.root.style.setProperty(
      "--offset-y",
      `${this.offset.y * this.scaleFactor}px`
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
    child.style.transform = `translate(${dx}px, ${dy}px)`;
    child.style.setProperty("--dx", `${dx}px`);
    child.style.setProperty("--dy", `${dy}px`);
  }

  async firstUpdated() {
    this.container = this.renderRoot.querySelector("#children");
    this.root = this.renderRoot.querySelector("#main-canvas");
    this.canvas = this.renderRoot.querySelector("canvas");
    const items = Array.from(this.childNodes);
    let i = 0;
    for (const node of items) {
      if (node instanceof SVGElement || node instanceof HTMLElement) {
        const child = node;
        child.classList.add("child");
        child.style.setProperty("--layer", `${i}`);
        this.container.append(child);
        child.handleDown = (e) => {
          this.handleDown(e, "element");
        };
        child.handleMove = (e) => {
          this.handleMove(e, "element", (delta) => {
            this.moveElement(child, delta);
          });
        };
        i++;
      }
    }
    this.requestUpdate();
    this.root.addEventListener("pointerdown", (e) => {
      this.handleDown(e, "canvas");
    });
    this.root.addEventListener("pointermove", (e) => {
      this.handleMove(e, "canvas", (delta) => {
        this.moveCanvas(delta);
        for (const node of Array.from(this.container.children)) {
          if (node instanceof SVGElement || node instanceof HTMLElement) {
            this.moveElement(node, delta);
          }
        }
      });
    });
    this.root.addEventListener("pointerup", (e) => {
      this.handleUp(e);
    });
    window.addEventListener("wheel", (e) => {
      this.handleZoom(e);
    });
  }
}
customElements.define("planager-canvas", PlanagerCanvas);
