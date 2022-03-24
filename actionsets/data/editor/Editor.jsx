import React from "react";
import codemirror from "codemirror";
import { Controlled as CodeMirrorComponent } from "react-codemirror2";
import { SocketContext } from "../../../src/context/socket";

import "codemirror/mode/xml/xml";
import "codemirror/mode/python/python";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/markdown/markdown";
import "codemirror/mode/css/css";
import "codemirror/mode/powershell/powershell";

import "./Editor.css";

const MODES = [
  {
    name: "python",
    placeholder: "print('Hello world!')",
  },
  { name: "xml", placeholder: "<h1>Hello world!</h1>" },
  {
    name: "javascript",
    placeholder: "console.log('Hello world!')",
  },
  {
    name: "markdown",
    placeholder: "# Hello world!",
  },
  {
    name: "css",
    placeholder: "/* Hello world! */",
  },
  {
    name: "powershell",
    placeholder: "echo Hello world!",
  },
];
const THEMES = [
  "solarized dark",
  "solarized light",
  "monokai",
  "darcula",
  "material",
];

export default class Editor extends React.Component {
  static contextType = SocketContext;
  constructor(props) {
    super(props);
    this.state = {
      mode: "python",
      theme: "solarized dark",
      lineNumbers: true,
      value: "print('Hello world!')",
      readOnly: false,
    };
  }
  buildOptions() {
    return {
      mode: this.state.mode,
      theme: this.state.theme,
      lineNumbers: this.state.lineNumbers,
      readOnly: this.state.readOnly,
    };
  }
  componentDidMount() {
    let socket = this.context;
    socket.emit("runBackendMethod", {
      method: "save",
      actionID: this.props.action.id,
      args: { output: this.state.value },
    });
  }
  onCodeChange(editor, data, value) {
    this.setState({ value: value });
  }
  renderModeDropdown() {
    let dropdown = [];
    for (const mode of MODES) {
      dropdown.push(
        <div
          className='editorDropdownItem'
          key={mode.name}
          onClick={this.updateMode.bind(this, mode.name, mode.placeholder)}>
          {mode.name}
        </div>
      );
    }
    return dropdown;
  }
  updateMode(mode, value) {
    this.setState({ mode: mode, value: value });
  }
  toggleLineNumbers(value) {
    this.setState({ lineNumbers: value });
  }
  updateTheme(theme) {
    this.setState({ theme: theme });
  }
  renderThemeDropdown() {
    let dropdown = [];
    for (const theme of THEMES) {
      dropdown.push(
        <div
          className='editorDropdownItem'
          key={theme}
          onClick={this.updateTheme.bind(this, theme)}>
          {theme}
        </div>
      );
    }
    return dropdown;
  }
  send() {
    let socket = this.context;
    socket.emit("runBackendMethod", {
      method: "save",
      actionID: this.props.action.id,
      args: { output: this.state.value },
    });
  }
  render() {
    return (
      <div>
        <div id='settingsContainer'>
          <div className='settingsRow'>
            <span className='settingsTitle'>Mode</span>
            <span className='dropdown'>
              <span>{this.state.mode}</span>
              <div className='dropdownContainer'>
                {this.renderModeDropdown()}
              </div>
            </span>
          </div>
          <div className='settingsRow'>
            <span className='settingsTitle'>Theme</span>
            <span className='dropdown'>
              <span>{this.state.theme}</span>
              <div className='dropdownContainer'>
                {this.renderThemeDropdown()}
              </div>
            </span>
          </div>
        </div>
        <div id='editorContainer'>
          <CodeMirrorComponent
            className='editor'
            value={this.state.value}
            options={this.buildOptions()}
            onBeforeChange={(editor, data, value) => {
              this.setState({ value });
            }}
            onChange={this.onCodeChange.bind(this)}
          />
        </div>
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
