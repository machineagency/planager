import React from "react";
import ReactJson from "react-json-view";
import "./DataViewer.css";

export default class DataViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataTypes: true,
      collapsed: 1,
    };
  }

  render() {
    return (
      <div id='dataViewerUI'>
        <ReactJson
          theme='solarized'
          name={false}
          src={
            this.props.inports.data.value
              ? this.props.inports.data.value
              : { message: "No data to view!" }
          }
          collapsed={this.state.collapsed}
          dataTypes={this.state.dataTypes}
          enableClipboard={false}
        />
      </div>
    );
  }
}
