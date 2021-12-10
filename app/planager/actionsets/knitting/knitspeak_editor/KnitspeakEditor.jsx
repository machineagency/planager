import React from "react";
import { Controlled as CodeMirror } from "react-codemirror2";
import KnitSpeak from "./KnitSpeak";

import "./KnitspeakEditor.css";

export default class KnitspeakEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "all rs rows k.\nall ws rows p.",
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
