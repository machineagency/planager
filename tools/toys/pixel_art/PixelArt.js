import { html, css } from "lit";
import { Tool } from "../../../src/components/tool_ui/Tool";

const COLORS = {
  Black: "#000000",
  White: "#ffffff",
  Base03: "#002b36",
  Base02: "#073642",
  Base01: "#586e75",
  Base00: "#657b83",
  Base0: "#839496",
  Base1: "#93a1a1",
  Base2: "#eee8d5",
  Base3: "#fdf6e3",
  Yellow: "#b58900",
  Orange: "#cb4b16",
  Red: "#dc322f",
  Magenta: "#d33682",
  Violet: "#6c71c4",
  Blue: "#268bd2",
  Cyan: "#2aa198",
  Green: "#859900",
};

const ART = [
  [
    COLORS.Violet,
    COLORS.Violet,
    COLORS.Violet,
    COLORS.Violet,
    COLORS.Violet,
    COLORS.Violet,
    COLORS.Violet,
  ],
  [
    COLORS.Violet,
    COLORS.Base3,
    COLORS.Violet,
    COLORS.Violet,
    COLORS.Violet,
    COLORS.Base3,
    COLORS.Violet,
  ],
  [
    COLORS.Violet,
    COLORS.Base3,
    COLORS.Violet,
    COLORS.Base3,
    COLORS.Violet,
    COLORS.Base3,
    COLORS.Violet,
  ],
  [
    COLORS.Violet,
    COLORS.Violet,
    COLORS.Base3,
    COLORS.Violet,
    COLORS.Base3,
    COLORS.Violet,
    COLORS.Violet,
  ],
  [
    COLORS.Violet,
    COLORS.Violet,
    COLORS.Violet,
    COLORS.Violet,
    COLORS.Violet,
    COLORS.Violet,
    COLORS.Violet,
  ],
];

export default class PixelArt extends Tool {
  static styles = css`
    #pixelArtActionContent {
      background-color: var(--planager-module-background);
    }

    #pixelArtContainer {
      display: grid;
      grid-auto-rows: auto;
    }

    .pixel {
      min-height: 0.5rem;
      min-width: 0.5rem;
      aspect-ratio: 1/1;
    }

    /* Styles for the settings */
    #settings {
      display: flex;
      justify-content: space-around;
    }

    #resetButton {
      background-color: var(--planager-blue);
      padding: 5px 10px;
      color: var(--planager-text-light);
      font-weight: bolder;
      display: inline-flex;
      cursor: pointer;
    }

    #resetButton:hover {
      background-color: var(--planager-gray);
    }

    #currentColor {
      padding: 5px 10px;
      color: var(--planager-text-light);
      display: inline-flex;
      font-weight: bolder;
    }

    .sizeInput {
      color: var(--planager-text-dark);
      font-weight: bolder;
      display: inline;
    }

    .numRowCols {
      padding: 0 5px;
    }

    .plusMinusIcon {
      cursor: pointer;
    }

    #colorBar {
      height: 20px;
      display: flex;
      cursor: pointer;
    }

    .color {
      flex-basis: 100%;
    }
  `;

  static properties = {
    numRows: {},
    numCols: {},
    currentColor: {},
    colorList: {},
    artwork: {},
    bitmap: {},
  };

  constructor() {
    super();
    this.numRows = ART.length;
    this.numCols = ART[0].length;
    this.currentColor = COLORS.Black;
    this.colorList = COLORS;
    this.artwork = ART;
    this.bitmap = [];
  }

  setNumRows(numRows) {
    const rowDiff = numRows - this.numRows;
    if (rowDiff == 0) return;

    let newArt;

    if (rowDiff > 0) {
      let newRows = Array.from(Array(rowDiff), () =>
        Array.from(Array(this.numCols), () => this.currentColor)
      );
      newArt = this.artwork.concat(newRows);
    } else {
      newArt = this.artwork.slice(0, rowDiff);
    }
    this.artwork = newArt;
    this.numRows = numRows;
    this.requestUpdate();
  }

  setNumCols(numCols) {
    const colDiff = numCols - this.numCols;
    if (colDiff == 0) return;

    let newArt = [...this.artwork];
    if (colDiff > 0) {
      for (const row of newArt) {
        row.push(Array.from(Array(colDiff), () => this.currentColor));
      }
    } else {
      for (const row of newArt) {
        row.splice(row.length + colDiff, Math.abs(colDiff));
      }
    }

    this.artwork = newArt;
    this.numCols = numCols;
    this.requestUpdate();
  }

  fillPixelWithCurrentColor(row, column) {
    let art = [...this.artwork];
    art[row][column] = this.currentColor;
    this.artwork = art;
  }

  onColorClick(color) {
    this.currentColor = this.colorList[color];
  }

  paint(e, row, column) {
    if (!e.buttons == 1) return;
    this.fillPixelWithCurrentColor(row, column);
  }

  onReset() {
    // Remake the art array with only white squares
    let arr = Array.from(Array(this.numRows), () =>
      Array.from(Array(this.numCols), () => this.currentColor)
    );
    this.artwork = arr;
  }

  renderPixelArt() {
    let pixelArt = [];
    for (const [rowNum, row] of Object.entries(this.artwork)) {
      for (const [colNum, color] of Object.entries(row)) {
        pixelArt.push(
          html` <div
            class="pixel"
            @click=${(e) => this.fillPixelWithCurrentColor(rowNum, colNum)}
            onMouseEnter=${(e) => this.paint(e, rowNum, colNum)}
            style=${`background-color: ${color}`}
          ></div>`
        );
      }
    }
    return pixelArt;
  }

  renderColorBar() {
    let colors = [];
    for (const [colorName, colorHex] of Object.entries(this.colorList)) {
      colors.push(
        html`<div
          @click=${(e) => this.onColorClick(colorName)}
          class="color"
          style=${`background-color: ${colorHex}`}
        ></div>`
      );
    }
    return colors;
  }

  render() {
    // TODO: Use canvas or another tool instead of making so many DOM nodes.
    return html` <div id="pixelArtActionContent">
      <div id="settings">
        <div class="sizeInput">
          <span
            @click=${(e) => this.setNumRows(this.numRows - 1)}
            class="plusMinusIcon"
            >-</span
          >
          <span class="numRowCols">${this.numRows} Rows</span>
          <span
            @click=${(e) => this.setNumRows(this.numRows + 1)}
            class="plusMinusIcon"
            >+</span
          >
        </div>
        <div class="sizeInput">
          <span
            @click="${(e) => this.setNumCols(this.numCols - 1)}"
            class="plusMinusIcon"
            >-</span
          >
          <span class="numRowCols">${this.numCols} Cols</span>
          <span
            @click="${(e) => this.setNumCols(this.numCols + 1)}"
            class="plusMinusIcon"
            >+</span
          >
        </div>
      </div>
      <div
        id="pixelArtContainer"
        style=${`
        grid-template-columns: repeat(${this.numCols},1fr)
      `}
      >
        ${this.renderPixelArt()}
      </div>
      <div id="settings">
        <span id="resetButton" @click="${(e) => this.onReset()}"
          >Fill Screen</span
        >
        <span
          id="currentColor"
          style=${`background-color: ${this.currentColor}`}
        >
          Current Color
        </span>
      </div>
      <div id="colorBar">${this.renderColorBar()}</div>
    </div>`;
  }
}
