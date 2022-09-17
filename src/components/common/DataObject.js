import { LitElement, html, css } from "lit";

class DataObject extends LitElement {
  static styles = css`
    .key {
      text-align: right;
      padding: 0.1rem 0.3rem;
      color: var(--planager-text-light);
    }

    .value {
      padding: 0.1rem 0.3rem;
    }

    /* .keyval-container {
      display: grid;
      grid-template-columns: auto auto;
    }

    .keyval-container .key {
      background-color: unset;
    } */

    #object-container .key:nth-of-type(4n + 1) {
      background-color: #2b2d39;
    }

    #object-container .value:nth-of-type(4n + 2) {
      background-color: #dfdfdf;
    }

    #object-container .key:nth-of-type(4n + 3) {
      background-color: #373948;
    }

    #object-container .value:nth-of-type(4n + 4) {
      background-color: #e9e9e9;
    }

    #object-container {
      display: grid;
      grid-template-columns: auto auto;
      font-size: 0.7rem;
      cursor: pointer;
      width: min-content;
    }
  `;

  static properties = {
    obj: { type: Object },
  };

  constructor() {
    super();
    this.obj = {};
  }

  renderValue(value) {
    return value;
    // let renderedValue;
    // switch (typeof value) {
    //   case "object":
    //     renderedValue = this.renderObject(value);
    //     break;
    //   case "number":
    //     renderedValue = this.renderNumber(value);
    //     break;
    //   case "string":
    //     renderedValue = this.renderString(value);
    //     break;
    //   case "boolean":
    //     renderedValue = this.renderBoolean(value);
    //     break;
    //   case "undefined":
    //     renderedValue = this.renderUndefined(value);
    //     break;
    // }
    // let node = renderedValue;
    // return node;
  }

  render() {
    // if (Array.isArray(val)) return this.renderArray(val);
    // if (!val) return this.renderNull();
    let arr = [];
    for (const [key, value] of Object.entries(this.obj)) {
      arr.push(
        html`
          <span class="key">${key}:</span>
          <span class="value">${this.renderValue(value)}</span>
        `
      );
    }

    return html`<div id="object-container">${arr}</div>`;
  }
}

customElements.define("data-object", DataObject);
