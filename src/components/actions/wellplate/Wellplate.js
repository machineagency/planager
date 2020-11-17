import React from "react";
import GenericAction from "../GenericAction";
import "./Wellplate.css";
import "./Plate";
import Plate from "./Plate";

export default class Wellplate extends React.Component {
  static defaultProps = {
    inportData: {},
  };

  constructor(props) {
    super(props);
    let plate = new Plate(12, 8, "name", true)
    this.state = {
      inports: {},
      outports: {plate: plate},
      plate: plate,
    };
  }

  xwellsHandler(e) {
    let plate = this.state.plate;
    plate.xWells = Number(e.target.value);
    this.setState({ outports: { plate: plate } });
  }

  ywellsHandler(e) {
    let plate = this.state.plate;
    plate.yWells = Number(e.target.value);
    this.setState({ outports: { plate: plate } });
  }

  nameHandler(e) {
    let plate = this.state.plate;
    plate.name = e.target.value;
    this.setState({ outports: { plate: plate } });
  }
  
  // shapeChange() {}

  renderPreview() {
    const xWells = this.state.plate.xWells;
    const yWells = this.state.plate.yWells;

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

  minusx() {
    let plate = this.state.plate;
    plate.xWells = plate.xWells - 1;
    this.setState({ outports: { plate: plate } });
  }

  plusx() {
    let plate = this.state.plate;
    plate.xWells = plate.xWells + 1;
    this.setState({ outports: { plate: plate } });
  }

  minusy() {
    let plate = this.state.plate;
    plate.yWells = plate.yWells - 1;
    this.setState({ outports: { plate: plate } });
  }

  plusy() {
    let plate = this.state.plate;
    plate.yWells = plate.yWells + 1;
    this.setState({ outports: { plate: plate } });
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
            className="welltext"
            value={this.state.plate.name}
            onChange={this.nameHandler.bind(this)}
          />
          <br />
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
              value={this.state.plate.yWells}
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
            <button className="inputbuttonleft" onClick={this.minusx.bind(this)}>
              -
            </button>
            <input
              type="number"
              min="1"
              max="20"
              className="wellinput"
              value={this.state.plate.xWells}
              onChange={this.xwellsHandler.bind(this)}
            />
            <button className="inputbuttonright" onClick={this.plusx.bind(this)}>
              +
            </button>
          </div>
          <span className="desc">Columns</span>
          <br />
          {/* <form>
            <label>Well shape: </label>
            <input
              type="radio"
              id="round"
              value="round"
              onChange={this.shapeChange.bind(this)}
              checked={true}
            />
            <label htmlFor="round">Round</label>
            <input
              type="radio"
              id="square"
              value="square"
              onChange={this.shapeChange.bind(this)}
            />
            <label htmlFor="square">Square</label>
          </form> */}
          <b>Preview:</b>
          <br />
          <div className="wellplate">{this.renderPreview.bind(this)()}</div>
        </div>
      </GenericAction>
    );
  }
}
