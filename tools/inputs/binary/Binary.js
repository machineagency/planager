import { html, css } from "lit";
import { Tool } from "../../../src/components/tool_ui/Tool";

export default class Binary extends Tool {
  static styles = css`
    #binary-container {
      display: flex;
      color: var(--planager-text-light);
      font-weight: bolder;
      user-select: none;
      align-items: center;
      height: 2rem;
    }

    #increment-container {
      height: 100%;
    }

    .increment {
      background-color: var(--planager-workspace-background);
      cursor: pointer;
      height: 50%;
      justify-content: center;
      text-align: center;
      width: 1rem;
      font-size: 0.6rem;
    }

    .increment:hover {
      background-color: var(--planager-toolbar);
    }

    .bit {
      cursor: pointer;
      text-align: center;
      font-size: 0.75rem;
      padding: 0px 0.1rem;
      height: 100%;
      display: flex;
      align-items: center;
    }

    .alive {
      background-color: var(--planager-text-light);
      color: var(--planager-text-dark);
    }

    .dead {
      background-color: var(--planager-workspace-background);
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
          <span>${bit}</span>
        </div>`
      );
    }
    return binList;
  }

  render() {
    return html`<div id="binary-container">
      <div id="increment-container">
        <div class="increment" @click=${(e) => this.addBit()}>+</div>
        <div class="increment" @click=${(e) => this.removeBit()}>-</div>
      </div>
      ${this.renderBinary()}
    </div> `;
  }
}
