import React from "react";
import GenericAction from "../GenericAction";
import Outport from "../../base/Outport";
import "./sonicationPlan.css";
import SonicationPlanObject from "./SonicationPlanObject";

export default class SonicationPlan extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inports: [],
      outports: [
        new Outport(
          "SonicationPlan",
          SonicationPlanObject,
          null,
          "A sonication plan."
        ),
      ],
      editing: false,
      plan: new SonicationPlanObject(),
    };
  }

  handleChange(param, event) {
    if (isNaN(event.target.value)) return;
    let plan = this.state.plan;
    plan[param] = event.target.value;
    this.setState({ plan: plan });
  }

  handleCheck(param, event) {
    let plan = this.state.plan;
    plan[param] = event.target.checked;
    this.setState({ plan: plan });
  }

  savePlan() {
    let newOutports = [...this.state.outports];
    newOutports[0].data = this.state.plan;
    this.setState({ outports: newOutports, editing: false });
  }

  startEdit() {
    this.setState({ editing: true });
  }

  varyDepth() {
    return (
      <div>
        <label htmlFor="varyDepthIncrement">Depth Increment</label>
        <br />
        <input
          type="number"
          id="varyDepthIncrement"
          onChange={this.handleChange.bind(this, "varyDepthIncrement")}
          value={this.state.plan.varyDepthIncrement}
        ></input>
        <br />
        <label htmlFor="varyDepthIterations">Iterations</label>
        <br />
        <input
          type="number"
          id="varyDepthIterations"
          onChange={this.handleChange.bind(this, "varyDepthIterations")}
          value={this.state.plan.varyDepthIterations}
        ></input>
      </div>
    );
  }

  varyTime() {
    return (
      <div>
        <label htmlFor="varyTimeIncrement">Time Increment</label>
        <br />
        <input
          type="number"
          id="varyTimeIncrement"
          onChange={this.handleChange.bind(this, "varyTimeIncrement")}
          value={this.state.plan.varyTimeIncrement}
        ></input>
        <br />
        <label htmlFor="varyTimeIterations">Iterations</label>
        <br />
        <input
          type="number"
          id="varyTimeIterations"
          onChange={this.handleChange.bind(this, "varyTimeIterations")}
          value={this.state.plan.varyTimeIterations}
        ></input>
      </div>
    );
  }

  varyFrequency() {
    return (
      <div>
        <label htmlFor="varyTimeIncrement">Time Increment</label>
        <br />
        <input
          type="number"
          id="varyTimeIncrement"
          onChange={this.handleChange.bind(this, "varyTimeIncrement")}
          value={this.state.plan.varyTimeIncrement}
        ></input>
        <br />
        <label htmlFor="varyTimeIterations">Iterations</label>
        <br />
        <input
          type="number"
          id="varyTimeIterations"
          onChange={this.handleChange.bind(this, "varyTimeIterations")}
          value={this.state.plan.varyTimeIterations}
        ></input>
      </div>
    );
  }

  renderEntryForm() {
    return (
      <form>
        <div className="entry">
          <label htmlFor="startDepth">Depth (mm)</label>
          <br />
          <input
            type="number"
            id="startDepth"
            onChange={this.handleChange.bind(this, "startDepth")}
            value={this.state.plan.startDepth}
          ></input>
          <br />
          <label htmlFor="varyDepth">Vary Depth?</label>
          <input
            type="checkbox"
            id="varyDepth"
            onChange={this.handleCheck.bind(this, "varyDepth")}
            checked={this.state.plan.varyDepth}
          ></input>
          {this.state.plan.varyDepth ? this.varyDepth.bind(this)() : null}
        </div>
        <div className="entry">
          <label htmlFor="time">Time (ms)</label>
          <br />
          <input
            type="number"
            id="time"
            onChange={this.handleChange.bind(this, "startTime")}
            value={this.state.plan.startTime}
          ></input>
          <br />
          <label htmlFor="varyTime">Vary Time?</label>
          <input
            type="checkbox"
            id="varyTime"
            onChange={this.handleCheck.bind(this, "varyTime")}
            checked={this.state.plan.varyTime}
          ></input>
          {this.state.plan.varyTime ? this.varyTime.bind(this)() : null}
        </div>
        <button
          className="planagerButton violet"
          onClick={this.savePlan.bind(this)}
        >
          Save Plan
        </button>
      </form>
    );
  }

  renderTextProtocol() {
    const sonicationPlan = this.state.outports[0].data;
    const plan = this.state.plan;
    let sampleTotal = 0;

    if (plan.varyTime && plan.varyDepth) {
      sampleTotal = plan.varyTimeIterations * plan.varyDepthIterations;
    } else if (plan.varyTime) {
      sampleTotal = plan.varyTimeIterations;
    } else if (plan.varyDepth) {
      sampleTotal = plan.varyDepthIterations;
    }

    let textPlan = `${sampleTotal} sonication instances.\n`;
    if (plan.varyTime)
      textPlan += `${plan.varyTimeIterations} durations, ${plan.varyTimeIncrement}ms increment.\n`;
    if (plan.varyDepth)
      textPlan += `${plan.varyDepthIterations} depths, ${plan.varyDepthIncrement}mm increment.\n`;
    if (!sonicationPlan) textPlan = "No plan defined";
    return (
      <div>
        <p style={{maxWidth: "200px"}}>
        {textPlan}
        </p>
        <button
          className="planagerButton violet"
          onClick={this.startEdit.bind(this)}
        >
          Edit Plan
        </button>
      </div>
    );
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
        <div className="actionTitle">Sonication Plan</div>
        <div className="actionContent">
          {this.state.editing
            ? this.renderEntryForm.bind(this)()
            : this.renderTextProtocol.bind(this)()}
        </div>
      </GenericAction>
    );
  }
}
