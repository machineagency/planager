import { html, css } from "lit";
import { Tool } from "../../../src/components/tool_ui/Tool";

function makeSrc(sketch) {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Sketch</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.6.0/p5.js"></script>
    <style>
      html, body {
        height: 100%;
        margin: 0;
        overflow: hidden;
      }
    </style>
  </head>
  <body>
    <script>
${sketch}
    </script>
  </body>
</html>`;
}

export default class P5Viewer extends Tool {
  static styles = css`
    #sketch {
      display: block;
      border: none;
      resize: both;
    }
  `;

  render() {
    return html`<iframe
      id="sketch"
      srcdoc=${makeSrc(this.inports.sketch)}></iframe> `;
  }
}
