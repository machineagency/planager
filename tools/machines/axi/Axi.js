import { html, css } from "lit";
import { Tool } from "../../../src/components/tool_ui/Tool";

export default class Axi extends Tool {
  // static styles = css`
  //   .button {
  //     background-color: var(--planager-blue);
  //     color: var(--planager-text-light);
  //     padding: 0.2rem;
  //   }
  //   .button:hover {
  //     background-color: var(--planager-workspace-background);
  //     cursor: pointer;
  //   }
  // `;
  // render() {
  //   return this.renderModule(html`<div>Connected: ${this.state.connected}</div>
  //     <div class="button" @click=${(e) => this.api.runMethod("motor_status")}>
  //       Turn off motors
  //     </div>
  //     <div class="button" @click=${(e) => this.api.runMethod("set_home")}>
  //       Set Home
  //     </div>`);
  // }
  static styles = css`
    .button {
      background-color: var(--planager-blue);
      color: var(--planager-text-light);
      padding: 0.2rem 0.5rem;
      text-align: center;
    }
    .button:hover {
      background-color: var(--planager-workspace-background);
      cursor: pointer;
    }
    .label {
      background-color: var(--planager-workspace-background);
      text-align: right;
      padding: 0.2rem 0.5rem;
      font-weight: bolder;
    }
    .info {
      padding: 0.2rem 0.5rem;
      background-color: var(--planager-module-background);
      color: var(--planager-text-dark);
      font-weight: normal;
      font-style: italic;
    }
    #control-container {
      grid-template-columns: auto auto auto;
      display: grid;
      font-size: 0.75rem;
      color: var(--planager-text-light);
      user-select: none;
    }
    #pen-container {
      grid-template-columns: auto auto;
      display: grid;
      font-size: 0.75rem;
      color: var(--planager-text-light);
      user-select: none;
    }
    #divider {
      height: 0.5rem;
      background-color: var(--planager-toolbar);
    }
  `;
  render() {
    return this.renderModule(html`<div id="control-container">
        <!-- <span class="label">connected?</span><span class="info">yes</span> -->
        <!-- <div class="button" @click=${(e) =>
          this.api.runMethod("disconnect")}>
          connect
        </div> -->
        <span class="label">motors?</span
        ><span class="info">${this.state.motors ? "on" : "off"}</span>
        <div
          class="button"
          @click=${(e) => this.api.runMethod("turn_off_motors")}>
          turn ${this.state.motors ? "off" : "on"}
        </div>
        <span class="label">homed?</span
        ><span class="info">${this.state.homed ? "yes" : "no"}</span>
        <div class="button" @click=${(e) => this.api.runMethod("set_home")}>
          set home
        </div>
      </div>
      <div id="divider"></div>
      <div id="pen-container">
        <span class="label">pen up</span
        ><span class="info">${this.state.options.pen_pos_up}</span>
        <span class="label">pen down</span
        ><span class="info">${this.state.options.pen_pos_down}</span>
      </div>`);
  }
}
