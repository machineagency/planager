import { html, css } from "lit";
import { Tool } from "../../../src/components/tool_ui/Tool";

export default class BooleanToggle extends Tool {
  static styles = css`
    .switch {
      position: relative;
      display: inline-block;
      width: 5rem;
      height: 1.5rem;
    }
    .switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: var(--planager-toolbar);
      -webkit-transition: 0.2s;
      transition: 0.2s;
    }

    .slider:before {
      position: absolute;
      content: "";
      background-color: var(--planager-text-light);
      transition: all 0.2s ease 0s;
      height: 1.5rem;
      width: 1.5rem;
      border-radius: 50%;
    }

    input:checked + .slider {
      background-color: var(--planager-blue);
    }

    input:focus + .slider {
      box-shadow: 0 0 1px #2196f3;
    }

    input:checked + .slider:before {
      -webkit-transform: translateX(3.5rem);
      -ms-transform: translateX(3.5rem);
      transform: translateX(3.5rem);
    }
  `;

  render() {
    return html`
      <label class="switch">
        <input
          type="checkbox"
          @change=${(e) => {
            this.state.bool = e.target.checked;
          }} />
        <span class="slider"></span>
      </label>
    `;
  }
}
