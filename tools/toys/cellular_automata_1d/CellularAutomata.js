import { html, css } from "lit";
import { Tool } from "../../../src/components/tool_ui/Tool";

const RULE = [1, 0, 1, 0, 0, 1, 0, 1];
const STARTINGROW = Array.from(Array(50), () => 1);

export default class CellularAutomata extends Tool {
  static styles = css`
    #automata-container {
      min-width: 300px;
      max-width: 500px;
    }

    #ruleContainer {
      display: flex;
      color: var(--planager-text-light);
      font-weight: bolder;
    }

    .ruleLabel {
      padding: 0.25rem;
      background-color: var(--planager-text-dark);
      cursor: default;
    }

    .rulebit {
      padding: 0.25rem;
      flex-basis: 100%;
      cursor: pointer;
      text-align: center;
    }

    .alive {
      background-color: var(--planager-text-light);
      color: var(--planager-text-dark);
    }

    .dead {
      background-color: var(--planager-text-dark);
      color: var(--planager-text-light);
    }

    .rowContainer {
      display: flex;
      color: var(--planager-text-light);
      font-weight: bolder;
    }

    .bit {
      flex-basis: 100%;
      aspect-ratio: 1/1;
    }

    .plusMinusIcon {
      cursor: pointer;
    }

    input[type="range"]::-webkit-slider-thumb {
      -webkit-appearance: none;
      height: 15px;
      width: 15px;
      background: var(--planager-blue);
      /* margin-top: -5px; */
      border-radius: 50%;
      border: none;
      cursor: grab;
    }

    input[type="range"]::-moz-range-thumb {
      height: 15px;
      width: 15px;
      background: var(--planager-blue);
      /* margin-top: -5px; */
      border-radius: 50%;
      border: none;
      cursor: grab;
    }

    input[type="range"]::-webkit-slider-runnable-track {
      background: var(--planager-text-light);
      height: 5px;
    }

    input[type="range"]::-moz-range-track {
      background: var(--planager-text-light);
      height: 5px;
    }

    input[type="range"] {
      -webkit-appearance: none;
      background-color: transparent;
    }

    input[type="range"]:focus {
      outline: none;
    }

    #automataSettingsContainer {
      /* display: flex; */
      background-color: var(--planager-text-dark);
      color: var(--planager-text-light);
      font-weight: bolder;
      font-size: 0.75rem;
    }

    .automataButton {
      flex-basis: 100%;
      padding: 5px 10px;
      background-color: var(--planager-blue);
      text-align: center;
    }

    .automataSetting {
      display: flex;
      justify-content: right;
      cursor: default;
    }

    .automataButton:hover {
      background-color: var(--planager-purple);
    }

    .automataSettingLabel {
      padding: 5px 10px;
      text-align: right;
    }

    .borderToggle {
      flex-basis: 100%;
      padding: 5px 10px;
      text-align: center;
    }
  `;

  static properties = {
    rule: {},
    startingRow: {},
    iterations: {},
    automata: {},
    borderState: {},
  };

  constructor() {
    super();

    this.rule = RULE;
    this.startingRow = STARTINGROW;
    this.iterations = 50;
    this.automata = [[]];
    this.borderState = 0;
  }

  firstUpdated() {
    this.runAutomata();
  }

  flipRuleBit(index) {
    let oldRule = [...this.rule];
    oldRule[index] = oldRule[index] ? 0 : 1;
    this.rule = oldRule;
    this.runAutomata();
  }

  flipStartingRowBit(index) {
    let oldRow = [...this.startingRow];
    oldRow[index] = oldRow[index] ? 0 : 1;
    this.startingRow = oldRow;
    this.runAutomata();
  }

  setBorderState() {
    this.borderState = !this.borderState;
    this.runAutomata();
  }

  setStartingRowLength(e) {
    const diff = e.target.value - this.startingRow.length;
    if (!diff) return;
    let row;
    if (diff > 0) {
      row = this.startingRow.concat(Array.from(Array(diff), () => 1));
    } else {
      row = this.startingRow.slice(0, diff);
    }
    this.startingRow = row;
    this.runAutomata();
  }

  setStartingRow(fill) {
    const row = Array.from(Array(this.startingRow.length), () => fill);
    this.startingRow = row;
    this.runAutomata();
  }

  setIterations(e) {
    this.iterations = e.target.value;
    this.runAutomata();
  }

  runAutomata() {
    let automata = [];
    let lastRow = [this.borderState]
      .concat(this.startingRow)
      .concat([this.borderState]);

    for (let row = 0; row < this.iterations; row++) {
      let automataRow = [];

      for (let pixel = 1; pixel < lastRow.length - 1; pixel++) {
        const neighbors = lastRow.slice(pixel - 1, pixel + 2);
        const ind = neighbors[0] * 4 + neighbors[1] * 2 + neighbors[2] * 1;
        const alive = this.rule[ind];

        automataRow.push(alive);
      }

      automata.push(automataRow);
      lastRow = [this.borderState]
        .concat(automataRow)
        .concat([this.borderState]);
    }

    this.automata = automata;
    this.requestUpdate();
    // this.props.sendToOutport(this.props.action.id, { automata: automata });
  }

  renderRule() {
    let rule = [];
    for (const [index, bit] of this.rule.entries()) {
      rule.push(
        html`<div
          class=${`rulebit ${bit ? "alive" : "dead"}`}
          @click=${(e) => this.flipRuleBit(index)}
        >
          ${bit}
        </div>`
      );
    }
    return html`<div id="ruleContainer">
      <div class="ruleLabel">Rule</div>
      ${rule}
    </div>`;
  }

  renderSettings() {
    // TODO: Use canvas or another tool instead of making so many DOM nodes.
    return html`<div id="automataSettingsContainer">
      <div class="automataSetting">
        <span class="automataSettingLabel">
          Width: ${this.startingRow.length}
        </span>

        <input
          type="range"
          min="8"
          max="200"
          value=${this.startingRow.length}
          class="automataSlider"
          @change=${(e) => this.setStartingRowLength(e)}
        />
      </div>
      <div class="automataSetting">
        <span class="automataSettingLabel">
          Iterations: ${this.iterations}
        </span>

        <input
          type="range"
          min="8"
          max="500"
          value=${this.iterations}
          class="automataSlider"
          @change=${(e) => this.setIterations(e)}
        />
      </div>
      <div style="display: flex">
        <div class="automataButton" @click=${(e) => this.setStartingRow(0)}>
          Fill Black
        </div>
        <div class="automataButton" @click=${(e) => this.setStartingRow(1)}>
          Fill White
        </div>
        <div
          @click=${(e) => this.setBorderState()}
          class=${`borderToggle ${this.borderState ? "alive" : "dead"}`}
        >
          Border
        </div>
      </div>
    </div>`;
  }

  renderStartingRow() {
    let row = [];
    for (const [index, bit] of this.startingRow.entries()) {
      row.push(
        html`<div
          class=${`bit ${bit ? "alive" : "dead"}`}
          @click=${(e) => this.flipStartingRowBit(index)}
        ></div>`
      );
    }
    return html`<div class="rowContainer">${row}</div>`;
  }

  renderAutomata() {
    let automata = [];

    for (const [index, row] of this.automata.entries()) {
      let automataRow = [];
      for (const [pixelIndex, pixel] of row.entries()) {
        automataRow.push(
          html`<div class=${`bit ${pixel ? "alive" : "dead"}`}></div>`
        );
      }

      automata.push(html`<div class="rowContainer">${automataRow}</div>`);
    }

    return automata;
  }

  render() {
    return html`<div id="automata-container">
      ${this.renderRule()} ${this.renderSettings()} ${this.renderStartingRow()}
      ${this.renderAutomata()}
    </div>`;
  }
}
