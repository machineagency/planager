import { html, css } from "lit";
import { Tool } from "../../../src/components/tool_ui/Tool";

export default class PlanagerTextInput extends Tool {
  static styles = css`
    input[type="range"]::-moz-range-thumb {
      height: 1rem;
      width: 1rem;
      background: var(--planager-blue);
      border-radius: 50%;
      border: none;
    }

    input[type="range"]::-moz-range-track {
      background: var(--planager-pipe);
      height: 5px;
      border-radius: 3px;
    }

    input[type="range"] {
      -webkit-appearance: none;
      background-color: var(--planager-module-background);
      display: block;
      width: -moz-available;
      padding: 0.5rem 0.25rem;
      margin: 0;
    }

    input[type="range"]:focus {
      outline: none;
    }

    input[type="number"] {
      display: block;
      background-color: var(--planager-module-background);
      border: none;
      text-align: right;
    }

    input[type="number"]:focus {
      outline: none;
    }

    #control-panel {
      display: grid;
      grid-template-columns: auto 4rem;
    }

    #config-header {
      font-size: 0.75rem;
      font-weight: bolder;
      background-color: var(--planager-toolbar);
      text-align: end;
      color: var(--planager-text-light);
      padding: 0.1rem 0.5rem;
    }

    .label {
      text-align: right;
      font-size: 0.75rem;
      font-weight: bolder;
      background-color: var(--planager-workspace-background);
      color: var(--planager-text-light);
      cursor: default;
      padding: 0 0.5rem;
    }
  `;

  setMin(newMin) {
    this.state.min = newMin;
  }

  setMax(newMax) {
    this.state.max = newMax;
  }

  render() {
    return html`
      <input
        type="range"
        min=${this.state.min}
        max=${this.state.max}
        class="slider"
        value=${this.state.value}
        @input=${(e) => (this.state.value = e.target.value)}
      />
      <div id="config-header">config</div>
      <div id="control-panel">
        <span class="label">current</span>
        <input
          type="number"
          name="current"
          value=${this.state.value}
          @input=${(e) => (this.state.value = e.target.value)}
        />
        <span class="label">min</span>
        <input
          type="number"
          value=${this.state.min}
          @input=${(e) => (this.state.min = e.target.value)}
        />
        <span class="label">max</span>
        <input
          type="number"
          value=${this.state.max}
          @input=${(e) => (this.state.max = e.target.value)}
        />
      </div>
    `;
  }
}
