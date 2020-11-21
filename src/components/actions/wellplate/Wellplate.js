import React from "react";
import GenericAction from "../GenericAction";
import "./Wellplate.css";
import Plate from "./Plate";
import Outport from "../../base/Outport";

export default class Wellplate extends React.Component {
  static defaultProps = {
    inportData: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      inports: [],
      outports: [
        new Outport(
          "Plate",
          Plate,
          new Plate(12, 8, "", true),
          "The created wellplate."
        ),
      ],
    };
  }

  xwellsHandler(e) {
    let port = this.state.outports[0];
    port.data.xWells = e.target.value;
    this.setState({ outports: [port] });
  }

  ywellsHandler(e) {
    let port = this.state.outports[0];
    port.data.yWells = e.target.value;
    this.setState({ outports: [port] });
  }

  nameHandler(e) {
    let port = this.state.outports[0];
    port.data.name = e.target.value;
    this.setState({ outports: [port] });
  }

  minusx() {
    let port = this.state.outports[0];
    port.data.xWells = port.data.xWells - 1;
    this.setState({ outports: [port] });
  }

  plusx() {
    let port = this.state.outports[0];
    port.data.xWells = port.data.xWells + 1;
    this.setState({ outports: [port] });
  }

  minusy() {
    let port = this.state.outports[0];
    port.data.yWells = port.data.yWells - 1;
    this.setState({ outports: [port] });
  }

  plusy() {
    let port = this.state.outports[0];
    port.data.yWells = port.data.yWells + 1;
    this.setState({ outports: [port] });
  }

  renderPreview() {
    const xWells = this.state.outports[0].data.xWells;
    const yWells = this.state.outports[0].data.yWells;

    let preview = [];
    for (let y = 0; y < yWells; y++) {
      let row = [];
      for (let x = 0; x < xWells; x++) {
        row.push(<span className="well" key={x + "by" + y} />);
      }
      preview.push(
        <div className="wellrow" key={`break${y}`}>
          {row}
        </div>
      );
    }

    return preview;
  }

  render() {
    return (
      <GenericAction
        inports={this.state.inports}
        inportData={this.props.inportData}
        outports={this.state.outports}
        actionID={this.props.id}
      >
        <div className="actionTitle">Create Wellplate</div>
        <div className="actionContent nodrag">
          <span>Name: </span>
          <input
            type="text"
            className="wellText"
            placeholder="Enter name"
            value={this.state.outports[0].data.name}
            onChange={this.nameHandler.bind(this)}
          />
          <br />
          <div>
            <div className="wellinputcontainer">
              <button
                className="inputbuttonleft"
                onClick={this.minusy.bind(this)}
              >
                -
              </button>
              <input
                type="number"
                min="1"
                max="20"
                className="wellinput"
                value={this.state.outports[0].data.yWells}
                onChange={this.ywellsHandler.bind(this)}
              />
              <button
                className="inputbuttonright"
                onClick={this.plusy.bind(this)}
              >
                +
              </button>
            </div>
            <span className="desc">Rows</span>
            <div className="wellinputcontainer">
              <button
                className="inputbuttonleft"
                onClick={this.minusx.bind(this)}
              >
                -
              </button>
              <input
                type="number"
                min="1"
                max="20"
                className="wellinput"
                value={this.state.outports[0].data.xWells}
                onChange={this.xwellsHandler.bind(this)}
              />
              <button
                className="inputbuttonright"
                onClick={this.plusx.bind(this)}
              >
                +
              </button>
            </div>
          </div>
          <span className="desc">Columns</span>
          <br />
          <b>Preview:</b>
          <br />
          <div className="wellplate">{this.renderPreview.bind(this)()}</div>
        </div>
      </GenericAction>
    );
  }
}
