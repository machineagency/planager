import React from "react";
import Plate from "../wellplate/Plate";
import Jubilee from "./Jubilee";
import GenericAction from "../GenericAction";
import "./JubileeDeck.css";
import Inport from "../../base/Inport";
import Outport from "../../base/Outport";

export default class JubileeDeck extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inports: [
        new Inport("Slot 4", Plate, null, "Jubilee deck slot four."),
        new Inport("Slot 5", Plate, null, "Jubilee deck slot five."),
        new Inport("Slot 2", Plate, null, "Jubilee deck slot two."),
        new Inport("Slot 3", Plate, null, "Jubilee deck slot three."),
        new Inport("Slot 0", Plate, null, "Jubilee deck slot zero."),
        new Inport("Slot 1", Plate, null, "Jubilee deck slot one."),
      ],
      outports: [
        new Outport(
          "Deck",
          Jubilee,
          new Jubilee(),
          "Object representing a Jubilee deck."
        ),
      ],
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!nextProps.payload) return null;

    // This is where data comes in from a link and is assigned to a port
    // This is where you should do anything that should happen when a link is connected

    for (var port = 0; port < prevState.inports.length; port++) {
      if (prevState.inports[port].name === nextProps.payload.targetInportID) {
        // update the data
        prevState.inports[port].data = nextProps.payload.data.data;
        prevState.outports[0].data.slot = {
          num: port,
          data: nextProps.payload.data.data,
        };
      }
    }

    return prevState;
  }

  renderPreview() {
    let preview = [];
    for (var slot = 0; slot < this.state.inports.length; slot++) {
      preview.push(
        <div className="deckSlot" key={slot}>
          {this.state.inports[slot].name}
          <br />
          {!this.state.inports[slot].data
            ? ""
            : `${this.state.inports[slot].data.name}`}
          <br />
          {!this.state.inports[slot].data
            ? `empty`
            : `${this.state.inports[slot].data.xWells}x${this.state.inports[slot].data.yWells}`}
        </div>
      );
    }

    preview.splice(2, 0, <br key={`break1`} />);
    preview.splice(5, 0, <br key={`break2`} />);

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
        <div className="actionTitle">Jubilee Deck Setup</div>
        <div className="actionContent jubileecontent">
          <b>Preview:</b>
          <br />
          <div className="deck">{this.renderPreview.bind(this)()}</div>
        </div>
      </GenericAction>
    );
  }
}
