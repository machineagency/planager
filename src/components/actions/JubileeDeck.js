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
        slot1: { value: { name: "none", x: 0, y: 0 } },
        slot2: { value: { name: "none", x: 0, y: 0 } },
        slot3: { value: { name: "none", x: 0, y: 0 } },
        slot4: { value: { name: "none", x: 0, y: 0 } },
        slot5: { value: { name: "none", x: 0, y: 0 } },
        slot6: { value: { name: "none", x: 0, y: 0 } },
      },
      outports: {
        deck: {},
      },
    };
  }

  renderPreview() {
    let preview = [];
    for (const slot of Object.keys(this.state.inports)) {
      preview.push(
        <div className="deckSlot" key={slot}>
          {`${this.state.inports[slot].value.name}, ${this.state.inports[slot].value.x}x${this.state.inports[slot].value.y}`}
        </div>
      );
    }

    preview.splice(2, 0, <br key={`break1`} />);
    preview.splice(5, 0, <br key={`break2`} />);

    // this.setState({ outports: { deck: { value: {...this.state.inports} } } });
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

  componentDidUpdate() {
    Object.assign(this.state.inports, this.props.inportData);
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
