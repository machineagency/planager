import { html, css } from "lit";
import { Tool } from "../../../src/components/tool_ui/Tool";

export default class CellularAutomata extends Tool {
  static styles = css`
    #automata-container {
      width: 20rem;
      max-height: 40rem;
      overflow: auto;
    }

    .alive {
      background-color: var(--planager-text-light);
    }

    .dead {
      background-color: var(--planager-text-dark);
    }

    .row {
      display: flex;
    }

    .bit {
      flex-basis: 100%;
      aspect-ratio: 1/1;
    }
  `;

  computeAutomata() {
    let automata = [];
    let borderState = this.state.border ? 1 : 0;
    let startRow = this.state.startState;
    let lastRow = [borderState].concat(startRow).concat([borderState]);

    automata.push(startRow);

    for (let row = 0; row < this.state.iterations; row++) {
      let automataRow = [];

      for (let pixel = 1; pixel < lastRow.length - 1; pixel++) {
        const neighbors = lastRow.slice(pixel - 1, pixel + 2);
        const ind = neighbors[0] * 4 + neighbors[1] * 2 + neighbors[2] * 1;
        const alive = this.state.rule[ind];

        automataRow.push(alive);
      }

      automata.push(automataRow);
      lastRow = [borderState].concat(automataRow).concat([borderState]);
    }
    this.state.automata = automata;
    return automata;
  }

  renderAutomata() {
    let automata = this.computeAutomata();
    let automataBits = [];

    for (const [index, row] of automata.entries()) {
      let automataRow = [];
      for (const [pixelIndex, pixel] of row.entries()) {
        automataRow.push(
          html`<div class=${`bit ${pixel ? "alive" : "dead"}`}></div>`
        );
      }

      automataBits.push(html`<div class="row">${automataRow}</div>`);
    }

    return automataBits;
  }

  render() {
    return this.renderModule(html`<div id="automata-container">
      ${this.renderAutomata()}
    </div>`);
  }
}
