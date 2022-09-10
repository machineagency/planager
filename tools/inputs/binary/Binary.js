import { html, css } from "lit";
import { Tool } from "../../../src/components/tool_ui/Tool";

export default class Binary extends Tool {
  static styles = css`
    #binary-container {
      display: flex;
      color: var(--planager-text-light);
      font-weight: bolder;
    }

    .increment {
      width: 1rem;
      background-color: var(--planager-blue);
    }

    .increment:hover {
      background-color: var(--planager-workspace-background);
    }

    .bit {
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
  `;

  flipBit(index) {
    let oldVal = [...this.state.val];
    oldVal[index] = oldVal[index] ? 0 : 1;
    this.state.val = oldVal;
  }

  addBit() {
    this.state.val = this.state.val.concat([1]);
  }

  removeBit() {
    this.state.val = this.state.val.slice(0, -1);
  }

  renderBinary() {
    let binList = [];
    for (const [index, bit] of this.state.val.entries()) {
      binList.push(
        html`<div
          class=${`bit ${bit ? "alive" : "dead"}`}
          @click=${(e) => this.flipBit(index)}
        >
          ${bit}
        </div>`
      );
    }
    return binList;
  }

  render() {
    return html`<div id="binary-container">
      <div class="bit increment" @click=${(e) => this.addBit()}>+</div>
      ${this.renderBinary()}
      <div class="bit increment" @click=${(e) => this.removeBit()}>-</div>
    </div> `;
  }
}
