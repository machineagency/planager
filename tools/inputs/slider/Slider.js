import { html, css } from "lit";
import { Tool } from "../../../src/components/tool_ui/Tool";

export default class PlanagerTextInput extends Tool {
  static styles = css`
    #slider::-moz-range-thumb {
      height: 1rem;
      width: 1rem;
      background: var(--planager-blue);
      border-radius: 50%;
      border: none;
    }

    #slider::-moz-range-track {
      background: var(--planager-pipe);
      height: 5px;
      border-radius: 3px;
    }

    #slider {
      -webkit-appearance: none;
      background-color: var(--planager-module-background);
      display: inline-block;
      width: 10rem;
      padding: 0.3rem 0.25rem;
      margin: 0;
    }

    #slider:focus {
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
      grid-template-columns: auto 6rem;
    }

    #config-header {
      font-size: 0.75rem;
      font-weight: bolder;
      background-color: var(--planager-toolbar);
      text-align: end;
      color: var(--planager-text-light);
      cursor: pointer;
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

    #live {
      cursor: pointer;
      position: relative;
    }

    #slide-container {
      display: flex;
    }

    #apparent {
      display: flex;
      background-color: var(--planager-workspace-background);
      color: var(--planager-text-light);
      align-items: center;
      justify-content: space-around;
      padding: 0px 0.3rem;
      cursor: normal;
    }
  `;

  static properties = {
    collapsed: {},
    apparent: {},
  };

  constructor() {
    super();
    this.collapsed = true;
  }

  firstUpdated() {
    this.apparent = this.state.value;
  }

  setMin(newMin) {
    let updatedMin = parseFloat(newMin);
    this.state.min = updatedMin;
    if (this.state.value < updatedMin) this.setVal(updatedMin);
  }

  setMax(newMax) {
    let updatedMax = parseFloat(newMax);
    this.state.max = updatedMax;
    if (this.state.value > updatedMax) this.setVal(updatedMax);
  }

  setVal(newVal) {
    let updatedValue = parseFloat(newVal);
    this.state.value = updatedValue;
  }

  render() {
    return html`
      <div id="slide-container">
        <input
          type="range"
          id="slider"
          .min=${this.state.min}
          .max=${this.state.max}
          .value=${this.state.value}
          .step=${this.state.step}
          @input=${(e) => {
            if (this.state.live) this.setVal(e.target.value);
            this.apparent = parseFloat(e.target.value);
          }}
          @change=${(e) => {
            if (!this.state.live) this.setVal(e.target.value);
          }}
        />
        <div id="apparent">
          <span>${this.apparent}</span>
        </div>
      </div>
      <div
        id="config-header"
        @click=${(e) => (this.collapsed = !this.collapsed)}
      >
        config
      </div>
      <div
        id="control-panel"
        style=${`display: ${this.collapsed ? "none" : "grid"}`}
      >
        <span class="label">port value</span>
        <input
          type="number"
          id="current"
          .value=${this.state.value}
          .step=${this.state.step}
          .min=${this.state.min}
          .max=${this.state.max}
          @input=${(e) => this.setVal(e.target.value)}
        />
        <span class="label">min</span>
        <input
          type="number"
          .value=${this.state.min}
          .step=${this.state.step}
          @input=${(e) => this.setMin(e.target.value)}
        />
        <span class="label">max</span>
        <input
          type="number"
          .value=${this.state.max}
          .step=${this.state.step}
          @input=${(e) => this.setMax(e.target.value)}
        />
        <span class="label">step</span>
        <input
          type="number"
          .value=${this.state.step}
          @input=${(e) => (this.state.step = parseFloat(e.target.value))}
        />
        <span class="label">live</span>
        <input
          type="checkbox"
          id="live"
          ?checked=${this.state.live}
          @change=${(e) => (this.state.live = e.target.checked)}
        />
      </div>
    `;
  }
}
