import React from "react";
import { Controlled as CodeMirror } from "react-codemirror2";
import KnitSpeak from "./KnitSpeak";

import "./KnitspeakEditor.css";

export default class KnitspeakEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value:
        "1st row k, lc2|2, k, rc2|2, [k] to end.\nall ws rows p.\n3rd row k 2, lc2|1, k, rc1|2, [k] to end.\n5th row k 3, lc1|1, k, rc1|1, [k] to end.",
    };
  }
  componentDidMount() {
    fetch("/runBackendMethod", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        method: "save", // The method to run
        actionID: this.props.action.id,
        args: { knitspeak: this.state.value },
      }),
    });
  }
  onCodeChange(editor, data, value) {
    this.setState({ value: value });
  }
  send() {
    fetch("/runBackendMethod", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        method: "save",
        actionID: this.props.action.id,
        args: { knitspeak: this.state.value },
      }),
    });
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
          onChange={this.onCodeChange.bind(this)}
        />
        <div
          type='button'
          onClick={this.send.bind(this)}
          className='sendButton'>
          Send
        </div>
      </div>
    );
  }
}
