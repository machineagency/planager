import React from "react";
import GenericAction from "../GenericAction";
import Inport from "../../base/Inport";
import Outport from "../../base/Outport";
import { SVGPathData } from "svg-pathdata";

export default class SvgToAxidraw extends React.Component {
  constructor(props) {
    super(props);
    const pathdata = this.props.payload.data.data;

    this.state = {
      inports: [
        new Inport("Path Data", SVGPathData, pathdata, "PathData Object"),
      ],
      outports: [
        new Outport("Axidraw buffer", Object, null, "Axidraw commands"),
      ],
      pathdata: pathdata,
      buffer: [],
    };
  }

  penUp() {
    const Http = new XMLHttpRequest();
    const url = "http://localhost:4242/v1/pen";

    Http.open("PUT", url);
    Http.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    Http.send(JSON.stringify({ state: 0 }));

    Http.onreadystatechange = (e) => {
      this.setState({ buffer: this.state.buffer.slice(1) });
      this.processBuffer();
    };
  }

  penDown() {
    const Http = new XMLHttpRequest();
    const url = "http://localhost:4242/v1/pen";

    Http.open("PUT", url);
    Http.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    Http.send(JSON.stringify({ state: 1 }));

    Http.onreadystatechange = (e) => {
      this.setState({ buffer: this.state.buffer.slice(1) });
      this.processBuffer();
    };
  }

  move(coords) {
    console.log(coords);
    const Http = new XMLHttpRequest();
    const url = "http://localhost:4242/v1/pen";

    Http.open("PUT", url);
    Http.setRequestHeader("Content-Type", "application/json; charset=utf-8");
    Http.send(JSON.stringify({ x: coords.x, y: coords.y }));

    Http.onreadystatechange = (e) => {
      this.setState({ buffer: this.state.buffer.slice(1) });
      this.processBuffer();
    };
  }

  async draw() {
    if (!this.state.pathdata) console.log("NO PATHDATA!");
    let scaled = this.state.pathdata.scale(1).commands;
    let commandList = [];

    for (const command of scaled) {
      let lastCommand;
      if (commandList.length) {
        lastCommand = commandList[commandList.length - 1];
      } else {
        lastCommand = { x: 0, y: 0};
      }

      switch (command.type) {
        case SVGPathData.LINE_TO:
          commandList.push({
            type: "move",
            x: command.x,
            y: command.y,
          });
          break;
        case SVGPathData.MOVE_TO:
          if (lastCommand.x === command.x && lastCommand.y === command.y) break;
          commandList.push({ type: "up" });
          commandList.push({
            type: "move",
            x: command.x,
            y: command.y,
          });
          commandList.push({ type: "down" });
          break;
        case SVGPathData.CLOSE_PATH:
          // commandList.push([]);
          break;
        default:
          console.log("BLAH");
      }
    }

    console.log(commandList)
    this.setState({ buffer: commandList });
    this.processBuffer();
  }

  processBuffer() {
    if (!this.state.buffer[0]) return;
    const command = this.state.buffer[0];
    switch (command.type) {
      case "move":
        console.log("moving")
        this.move(command);
        break;
      case "up":
        console.log("up")
        this.penUp();
        break;
      case "down":
        console.log("down")
        this.penDown();
        break;
      default:
        console.log("other");
    }
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
        <div className="actionTitle">Svg PathData to Axidraw</div>
        <div className="actionContent">
          <input type="button" value="Draw" onClick={this.draw.bind(this)} />
        </div>
      </GenericAction>
    );
  }
}
