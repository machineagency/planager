import React from "react";
import { FaPlus, FaMinus } from "react-icons/fa";

import "./CellularAutomata.css";

const RULE = [1, 0, 1, 0, 0, 1, 0, 1];
const STARTINGROW = Array.from(Array(50), () => 1);

export default class CellularAutomata extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rule: RULE,
      startingRow: STARTINGROW,
      iterations: 150,
      automata: [[]],
      borderState: 0,
    };
  }
  componentDidMount() {
    this.runAutomata();
  }
  flipRuleBit(index) {
    let oldRule = [...this.state.rule];
    oldRule[index] = oldRule[index] ? 0 : 1;
    this.setState({ rule: oldRule }, this.runAutomata);
  }
  flipStartingRowBit(index) {
    let oldRow = [...this.state.startingRow];
    oldRow[index] = oldRow[index] ? 0 : 1;
    this.setState({ startingRow: oldRow }, this.runAutomata);
  }
  setBorderState() {
    this.setState({ borderState: !this.state.borderState }, this.runAutomata);
  }
  setStartingRowLength(e) {
    const diff = e.target.value - this.state.startingRow.length;
    if (!diff) return;
    let row;
    if (diff > 0) {
      row = this.state.startingRow.concat(Array.from(Array(diff), () => 1));
    } else {
      row = this.state.startingRow.slice(0, diff);
    }
    this.setState({ startingRow: row }, this.runAutomata);
  }
  setStartingRow(fill) {
    const row = Array.from(Array(this.state.startingRow.length), () => fill);
    this.setState({ startingRow: row }, this.runAutomata);
  }
  setIterations(e) {
    this.setState({ iterations: e.target.value }, this.runAutomata);
  }
  runAutomata() {
    let automata = [];
    let lastRow = [this.state.borderState]
      .concat(this.state.startingRow)
      .concat([this.state.borderState]);

    for (let row = 0; row < this.state.iterations; row++) {
      let automataRow = [];

      for (let pixel = 1; pixel < lastRow.length - 1; pixel++) {
        const neighbors = lastRow.slice(pixel - 1, pixel + 2);
        const ind = neighbors[0] * 4 + neighbors[1] * 2 + neighbors[2] * 1;
        const alive = this.state.rule[ind];

        automataRow.push(alive);
      }

      automata.push(automataRow);
      lastRow = [this.state.borderState]
        .concat(automataRow)
        .concat([this.state.borderState]);
    }

    this.setState({ automata: automata });
    this.props.sendToOutport(this.props.action.id, { automata: automata });
  }
  renderRule() {
    let rule = [];
    for (const [index, bit] of this.state.rule.entries()) {
      rule.push(
        <div
          className='rulebit'
          style={{ backgroundColor: bit ? "var(--base01)" : "var(--base00)" }}
          key={index}
          onClick={this.flipRuleBit.bind(this, index)}>
          {bit}
        </div>
      );
    }
    return (
      <div id='ruleContainer'>
        <div className='ruleLabel'>Rule</div>
        {rule}
      </div>
    );
  }
  renderSettings() {
    return (
      <div id='automataSettingsContainer'>
        <div className='automataSetting'>
          <span className='automataSettingLabel'>
            Width: {this.state.startingRow.length}
          </span>

          <input
            type='range'
            min='8'
            max='200'
            value={this.state.startingRow.length}
            className='automataSlider'
            onChange={this.setStartingRowLength.bind(this)}
          />
        </div>
        <div className='automataSetting'>
          <span className='automataSettingLabel'>
            Iterations: {this.state.iterations}
          </span>

          <input
            type='range'
            min='8'
            max='500'
            value={this.state.iterations}
            className='automataSlider'
            onChange={this.setIterations.bind(this)}
          />
        </div>
        <div style={{ display: "flex" }}>
          <div
            className='automataButton'
            onClick={this.setStartingRow.bind(this, 0)}>
            Fill Black
          </div>
          <div
            className='automataButton'
            onClick={this.setStartingRow.bind(this, 1)}>
            Fill White
          </div>
          <div
            onClick={this.setBorderState.bind(this)}
            style={{
              flexBasis: "100%",
              padding: "5px 10px",
              backgroundColor: this.state.borderState
                ? "var(--base3)"
                : "var(--base03)",
              color: this.state.borderState ? "var(--base03)" : "var(--base3)",
              textAlign: "center",
            }}>
            Border
          </div>
        </div>
      </div>
    );
  }
  renderStartingRow() {
    let row = [];
    for (const [index, bit] of this.state.startingRow.entries()) {
      row.push(
        <div
          className='bit'
          style={{ backgroundColor: bit ? "var(--base3)" : "var(--base03)" }}
          key={index}
          onClick={this.flipStartingRowBit.bind(this, index)}
        />
      );
    }
    return <div className='rowContainer'>{row}</div>;
  }
  renderAutomata() {
    let automata = [];

    for (const [index, row] of this.state.automata.entries()) {
      let automataRow = [];
      for (const [pixelIndex, pixel] of row.entries()) {
        automataRow.push(
          <div
            className='bit'
            key={pixelIndex}
            style={{ backgroundColor: pixel ? "var(--base3)" : "var(--base03" }}
          />
        );
      }

      automata.push(
        <div className='rowContainer' key={index}>
          {automataRow}
        </div>
      );
    }

    return automata;
  }
  render() {
    return (
      <div id='cellularAutomataActionContent'>
        {this.renderRule()}
        {this.renderSettings()}
        {this.renderStartingRow()}
        {this.renderAutomata()}
      </div>
    );
  }
}
