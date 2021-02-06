import React from "react";
import GenericAction from "../GenericAction";
import Inport from "../../base/Inport";
import Outport from "../../base/Outport";

export default class Axidraw extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inports: [new Inport("name", "type", "data", "description")],
      outports: [new Outport("name", "type", "data", "description")],
      penInfo: {},
    };
  }

  penUp() {
    const Http = new XMLHttpRequest();
    const url = "http://localhost:4242/v1/pen";

    Http.open("PUT", url);
    Http.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    Http.send(JSON.stringify({ state: 0 }));

    Http.onreadystatechange = (e) => {
      this.setState({ penInfo: Http.responseText });
    };
  }

  penDown() {
    const Http = new XMLHttpRequest();
    const url = "http://localhost:4242/v1/pen";

    Http.open("PUT", url);
    Http.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    Http.send(JSON.stringify({ state: 1 }));

    Http.onreadystatechange = (e) => {
      this.setState({ penInfo: Http.responseText });
    };
  }

  zero() {
    const Http = new XMLHttpRequest();
    const url = "http://localhost:4242/v1/pen";

    Http.open("PUT", url);
    Http.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    Http.send(JSON.stringify({ x: 0, y: 0 }));

    Http.onreadystatechange = (e) => {
      this.setState({ penInfo: Http.responseText });
    };
  }

  move(coords) {
    const Http = new XMLHttpRequest();
    const url = "http://localhost:4242/v1/pen";

    Http.open("PUT", url);
    Http.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    Http.send(JSON.stringify({ x: coords.x, y: coords.y }));

    Http.onreadystatechange = (e) => {
      this.setState({ penInfo: Http.responseText });
    };
  }

  settingsGlobal() {
    const Http = new XMLHttpRequest();
    const url = "http://localhost:4242/v1/settings/global";

    Http.open("GET", url);
    Http.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    Http.send();

    Http.onreadystatechange = (e) => {
      this.setState({ penInfo: Http.responseText });
    };
  }

  settingsBot() {
    const Http = new XMLHttpRequest();
    const url = "http://localhost:4242/v1/settings/bot";

    Http.open("GET", url);
    Http.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    Http.send();

    Http.onreadystatechange = (e) => {
      this.setState({ penInfo: Http.responseText });
    };
  }

  render() {
    return (
      <GenericAction
        inports={this.state.inports}
        inportData={this.props.inportData}
        outports={this.state.outports}
        actionID={this.props.id}
        positionDeltas={this.props.positionDeltas}
      >
        <div className="actionTitle">Axidraw Controller</div>
        <div className="actionContent" style={{ maxWidth: "300px" }}>
          <input type="button" value="Pen Up" onClick={this.penUp.bind(this)} />
          <input
            type="button"
            value="Pen Down"
            onClick={this.penDown.bind(this)}
          />
          <br></br>
          <input type="button" value="Zero" onClick={this.zero.bind(this)} />
          <br></br>
          <input
            type="button"
            value="max"
            onClick={this.move.bind(this, { x: 100, y: 100 })}
          />
          <input
            type="button"
            value="mid"
            onClick={this.move.bind(this, { x: 50, y: 50 })}
          />
          <input
            type="button"
            value="xmax"
            onClick={this.move.bind(this, { x: 100, y: 0 })}
          />
          <input
            type="button"
            value="ymax"
            onClick={this.move.bind(this, { x: 0, y: 100 })}
          />
          <br />
          <input
            type="button"
            value="Settings: Global"
            onClick={this.settingsGlobal.bind(this)}
          />
          <input
            type="button"
            value="Settings: Bot"
            onClick={this.settingsBot.bind(this)}
          />
          <br />
          {JSON.stringify(this.state.penInfo)}
        </div>
      </GenericAction>
    );
  }
}
