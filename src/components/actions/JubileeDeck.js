import React from "react";
import GenericAction from "./GenericAction";
import "./css/JubileeDeck.css";

export default class JubileeDeck extends React.Component {
  // Specify default inputs here
  static defaultProps = {
    inportData: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      inports: {
        slot1: {},
        slot2: {},
        slot3: {},
        slot4: {},
        slot5: {},
        slot6: {},
      },
      outports: {
        deck: {},
      },
    };
  }

  updateDeckOutport() {
    if (!this.haveSameData(this.state.inports, this.state.outports.deck)) {
      this.setState({ outports: { deck: { ...this.state.inports } } });
    }
  }

  renderPreview() {
    let preview = [];
    for (const slot of Object.keys(this.state.inports)) {
      preview.push(
        <div className="deckSlot" key={slot}>
          {Object.entries(this.state.inports[slot]).length === 0
            ? `${slot}: empty`
            : `${this.state.inports[slot].name},${this.state.inports[slot].xWells}x${this.state.inports[slot].yWells}`}
        </div>
      );
    }

    preview.splice(2, 0, <br key={`break1`} />);
    preview.splice(5, 0, <br key={`break2`} />);

    this.updateDeckOutport();
    return preview;
  }

  haveSameData(obj1, obj2) {
    const obj1Length = Object.keys(obj1).length;
    const obj2Length = Object.keys(obj2).length;

    if (obj1Length === obj2Length) {
      return Object.keys(obj1).every(
        (key) => obj2.hasOwnProperty(key) && obj2[key] === obj1[key]
      );
    }
    return false;
  }

  componentDidUpdate(prevState) {
    const newDat = Object.assign(
      { ...this.state.inports },
      this.props.inportData
    );
    if (!this.haveSameData(newDat, this.state.inports)) {
      this.setState({
        inports: newDat,
      });
    }
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
