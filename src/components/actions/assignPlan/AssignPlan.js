import React from "react";
import GenericAction from "../GenericAction";
import Inport from "../../base/Inport";
import Outport from "../../base/Outport";
import SonicationPlanObject from "../sonicationPlan/SonicationPlanObject";
import Plate from "../wellplate/Plate";
import SonicationProtocol from "./SonicationProtocol";
import Jubilee from "../jubileedeck/Jubilee";

export default class AssignPlan extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inports: [
        new Inport(
          "Sonication plan",
          SonicationPlanObject,
          null,
          "The input sonication plan."
        ),
        new Inport("Agent", Jubilee, null, "the agent to carry out the plan"),
        new Inport("labware", Plate, null, "The labware to use."),
      ],
      outports: [
        new Outport(
          "Protocol",
          Array,
          null,
          "an array of sonication protocols"
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
      }
    }

    return prevState;
  }

  generateProtocol() {
    const plan = this.state.inports[0].data;
    let actionList = [];
    let currentDepth = plan.startDepth;
    let currentTime = plan.startTime;
    
    for (let depth = 0; depth < plan.varyDepthIterations; depth++) {
      for (let time = 0; time < plan.varyTimeIterations; time++) {
        actionList.push({ time: currentTime, depth: currentDepth });
        currentTime += plan.varyTimeIncrement;
      }
      currentDepth += plan.varyDepthIncrement;
    }

    const machineRuns = Math.ceil(actionList.length / 30);    
    let protocolArray = [];
    console.log(machineRuns)
    console.log("heasdfadsfllo")

    for (var machineRun = 0; machineRun < machineRuns; machineRun++) {
      let protocol = new SonicationProtocol();
      let startIndex = machineRun * 30;
      let actionSet = actionList.slice(startIndex, startIndex + 30);
      console.log("hello")
      console.log(actionSet.length)

      for (var plate = 0; plate < 5; plate ++) {
        console.log("bai")
        const wellList = [
          { letter: "A", column: 1 },
          { letter: "B", column: 2 },
          { letter: "A", column: 3 },
          { letter: "B", column: 1 },
          { letter: "A", column: 2 },
          { letter: "B", column: 3 },
        ];
        for (var well = 0; well < wellList.length; well++) {
          console.log((plate * 6 )+ well)
          if (typeof (actionSet[((plate * 6) + well)]) === 'undefined') break;
          protocol.addInstruction({
            operation: "sonicate_well",
            specs: {
              deck_index: plate,
              row_letter: wellList[well].letter,
              column_index: wellList[well].column,
              plunge_depth: actionSet[(plate * 6 )+ well].depth,
              seconds: actionSet[(plate * 6) + well].time,
              autoclean: true,
            },
          });
        }
      }
      protocolArray.push(protocol);
    }

    let newOutports = this.state.outports;
    newOutports[0].data = [protocolArray];
    this.setState({ outports: newOutports });
  }

  renderLabware() {
    if (!this.state.inports[2].data) return "not defined";
    return this.state.inports[2].data.toJSON();
  }

  renderAgent() {
    if (!this.state.inports[1].data) return "not defined";
    return this.state.inports[1].data.toJSON();
  }

  renderPlan() {
    if (!this.state.inports[0].data) return "not defined";
    return this.state.inports[0].data.toJSON();
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
        <div className="actionTitle">Assign Plan</div>
        <div className="actionContent" style={{ width: "200px", padding: "10px" }}>
          <span>
            <b>Agent: </b>
            {this.renderAgent.bind(this)()}
          </span>
          <br />
          <span>
            <b>Labware: </b>
            {this.renderLabware.bind(this)()}
          </span>
          <br />
          <span>
            <b>Plan: </b>
            {this.renderPlan.bind(this)()}
          </span>
          <br />
          <br />
          <button
            className="planagerButton violet"
            onClick={this.generateProtocol.bind(this)}
          >
            Generate Protocol
          </button>
        </div>
      </GenericAction>
    );
  }
}
