import React from "react";
import GenericAction from "../GenericAction";
import Inport from "../../base/Inport";
import Outport from "../../base/Outport";
import SonicationProtocol from "./SonicationProtocol";

import "./buildSonicationProtocol.css";
import Jubilee from "../jubileedeck/Jubilee";

export default class BuildSonicationProtocol extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inports: [
        new Inport("Input", Jubilee, new Jubilee(), "The Jubilee Deck"),
      ],
      outports: [
        new Outport(
          "Output",
          SonicationProtocol,
          new SonicationProtocol(),
          "A sonication protocol."
        ),
      ],
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!nextProps.payload) return null;

    // This is where data comes in from a link and is assigned to a port
    // This is where you should do anything that should happen when a link is connected
    prevState.inports[0].data = nextProps.payload.data.data;

    return prevState;
  }

  addSonicationCommand(slot) {
    console.log("making a command");
    console.log(slot);
  }

  renderDeck() {
    if (!this.state.inports[0].data) return;
    let preview = [];
    for (var slot = 0; slot < this.state.inports[0].data.deck.length; slot++) {
      preview.push(
        <div
          className="deckSlot"
          key={slot}
          onClick={this.addSonicationCommand.bind(this, slot)}
        >
          {!this.state.inports[0].data.deck[slot]
            ? ""
            : `${this.state.inports[0].data.deck[slot].name}`}
          <br />
          {!this.state.inports[0].data.deck[slot]
            ? `empty`
            : `${this.state.inports[0].data.deck[slot].xWells}x${this.state.inports[0].data.deck[slot].yWells}`}
        </div>
      );
    }

    preview.splice(2, 0, <br key={`break1`} />);
    preview.splice(5, 0, <br key={`break2`} />);

    return preview;
  }

  addStep() {
    let outports = [...this.state.outports];
    outports[0].data.addStep(1, "A", 2, 3.0, 2, true);
    this.setState({ outports: outports });
  }

  renderProtocol() {
    if (!this.state.outports[0].data) return;
    let protocolView = [];
    const protocol = this.state.outports[0].data.protocol.protocol;
    for (var step = 0; step < protocol.length; step++) {
      protocolView.push(
        <div key={step}>
          <span>{`${step}. Sonicate well ${protocol[step].specs.row_letter}${
            step + 1
          }\n`}</span>
        </div>
      );
    }
    return protocolView;
  }

  render() {
    return (
      <GenericAction
        inports={this.state.inports}
        outports={this.state.outports}
        actionID={this.props.id}
      >
        <div className="actionTitle">Create Sonication Protocol</div>
        <div className="actionContent">
          <div className="deck">{this.renderDeck.bind(this)()}</div>
          <div>
            <button
              className="planagerButton"
              onClick={this.addStep.bind(this)}
            >
              Add Step
            </button>
          </div>
          <div className="protocol">{this.renderProtocol.bind(this)()}</div>
        </div>
      </GenericAction>
    );
  }
}
