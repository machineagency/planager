import { LitElement, html, css } from "lit";

class StatePane extends LitElement {
  static properties = {
    state: { type: Object },
  };

  static styles = css`
    #header {
      background-color: var(--planager-blue);
      color: var(--planager-text-light);
      font-size: 0.7rem;
      font-weight: bolder;
    }
    .state-entry {
      padding: 0.2rem;
    }
  `;

  renderState() {
    let arr = [];
    for (const [key, value] of Object.entries(this.state)) {
      arr.push(html`<div class="state-entry">${key}:${value}</div>`);
    }
    return arr;
  }

  render() {
    return html`<div>
      <div id="header">State</div>
      ${this.renderState()}
    </div>`;
  }
}

customElements.define("state-pane", StatePane);
