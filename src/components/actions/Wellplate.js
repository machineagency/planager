import React from "react";
import GenericAction from "./GenericAction";
import "./css/Wellplate.css";

export default class Wellplate extends React.Component {
  static defaultProps = {
    inportData: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      inports: {},
      outports: {
        plateObject: {
          value: {
            x: 12,
            y: 8,
            name: "name",
          },
        },
      },
    };
  }

  xwellsHandler(e) {
    let plate = this.state.outports.plateObject;
    plate.value.x = Number(e.target.value);
    this.setState({ outports: { plateObject: plate } });
  }

  ywellsHandler(e) {
    let plate = this.state.outports.plateObject;
    plate.value.y = Number(e.target.value);
    this.setState({ outports: { plateObject: plate } });
  }

  nameHandler(e) {
    let plate = this.state.outports.plateObject;
    plate.value.name = e.target.value;
    this.setState({ outports: { plateObject: plate } });
  }

  shapeChange() {

  }

  renderPreview() {
    const xWells = this.state.outports.plateObject.value.x;
    const yWells = this.state.outports.plateObject.value.y;

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

  minus() {
    let plate = this.state.outports.plateObject;
    plate.value.x--;
    this.setState({ outports: { plateObject: plate } });
  }

  plus() {
    let plate = this.state.outports.plateObject;
    plate.value.x++;
    this.setState({ outports: { plateObject: plate } });
  }

  minusy() {
    let plate = this.state.outports.plateObject;
    plate.value.y--;
    this.setState({ outports: { plateObject: plate } });
  }

  plusy() {
    let plate = this.state.outports.plateObject;
    plate.value.y++;
    this.setState({ outports: { plateObject: plate } });
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
              value={this.state.outports.plateObject.value.y}
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
            <button className="inputbuttonleft" onClick={this.minus.bind(this)}>
              -
            </button>
            <input
              type="number"
              min="1"
              max="20"
              className="wellinput"
              value={this.state.outports.plateObject.value.x}
              onChange={this.xwellsHandler.bind(this)}
            />
            <button className="inputbuttonright" onClick={this.plus.bind(this)}>
              +
            </button>
          </div>
          <span className="desc">Columns</span>
          <br />
          <input
            type="text"
            className="welltext"
            value={this.state.outports.plateObject.value.name}
            onChange={this.nameHandler.bind(this)}
          />
          <br />
          <form>
            <label>Well shape: </label>
            <input type="radio" id="round" value="round" onChange={this.shapeChange.bind(this)} checked={true}/>
            <label htmlFor="round">Round</label>
            <input type="radio" id="square" value="square" onChange={this.shapeChange.bind(this)} />
            <label htmlFor="square">Square</label>
          </form>
          <b>Preview:</b>
          <br />
          <div className="wellplate">{this.renderPreview.bind(this)()}</div>
        </div>
      </GenericAction>
    );
  }
}
