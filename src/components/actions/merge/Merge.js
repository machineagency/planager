import React from "react";
import GenericAction from "../GenericAction";

export default class Merge extends React.Component {
  // Specify default inputs here
  static defaultProps = {
    inportData: { inputData: {} },
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (Object.entries(nextProps.inportData.inputData).length) {
      let mergedOutput = [];
      for (const data of Object.keys(nextProps.inportData.inputData)) {
        mergedOutput.push(nextProps.inportData.inputData[data].value);
      }
      return {
        outports: {
          mergedOutput: mergedOutput,
        },
      };
    } else return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      inports: this.props.inportData,
      outports: { mergedOutput: [] },
    };
  }

  render() {
    return (
      <GenericAction
        inports={this.state.inports}
        inportData={this.props.inportData}
        outports={this.state.outports}
        actionID={this.props.id}
      >
        <div className="actionTitle">Merge</div>
        <div className="actionContent">
          Merging {Object.keys(this.state.inports.inputData).length} inputs.<br />
          Result: {JSON.stringify(this.state.outports.mergedOutput)}
        </div>
      </GenericAction>
    );
  }
}
