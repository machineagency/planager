import React from "react";
import { Controlled as CodeMirror } from "react-codemirror2";
import KnitSpeak from "./KnitSpeak";

import "./KnitspeakEditor.css";

export default class KnitspeakEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value:
        "1st row k 10.\nall ws rows p.\n3rd row k 3, p, [k] to end.\n5th row [[k,p] 2, k] 2.\n7th row k, p, k 6, p, k.",
    };
  }
  onCodeChange() {
    console.log("asdf");
  }
  render() {
    return (
      <div>
        <CodeMirror
          value={this.state.value}
          options={{
            theme: "solarized dark",
            lineNumbers: true,
          }}
          defineMode={{ name: "knitspeak", fn: KnitSpeak }}
          onBeforeChange={(editor, data, value) => {
            this.setState({ value });
          }}
          // onChange={(editor, data, value) => {}}
          onChange={this.onCodeChange.bind(this)}
        />
      </div>
    );
  }
}
