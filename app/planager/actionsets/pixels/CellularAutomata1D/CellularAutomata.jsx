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
  setStartingRow(row) {
    this.setState({ startingRow: row }, this.runAutomata);
  }
  setIterations(iter) {
    this.setState({ iterations: iter }, this.runAutomata);
  }
  runAutomata() {
    let automata = [];
    let lastRow = [0].concat(this.state.startingRow).concat([0]);

    for (let row = 0; row < this.state.iterations; row++) {
      let automataRow = [];

      for (let pixel = 1; pixel < lastRow.length - 1; pixel++) {
        const neighbors = lastRow.slice(pixel - 1, pixel + 2);
        const ind = neighbors[0] * 4 + neighbors[1] * 2 + neighbors[2] * 1;
        const alive = this.state.rule[ind];

        automataRow.push(alive);
      }

      automata.push(automataRow);
      lastRow = [0].concat(automataRow).concat([0]);
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
        <div className='sizeInput'>
          <span
            onClick={this.setStartingRow.bind(
              this,
              this.state.startingRow.slice(0, -1)
            )}
            className='plusMinusIcon'>
            <FaMinus />
          </span>
          <span className='numRowCols'>
            {this.state.startingRow.length} Width
          </span>
          <span
            onClick={this.setStartingRow.bind(
              this,
              this.state.startingRow.concat([1])
            )}
            className='plusMinusIcon'>
            <FaPlus />
          </span>
        </div>
        <div className='sizeInput'>
          <span
            onClick={this.setIterations.bind(this, this.state.iterations - 1)}
            className='plusMinusIcon'>
            <FaMinus />
          </span>
          <span className='numRowCols'>{this.state.iterations} Iterations</span>
          <span
            onClick={this.setIterations.bind(this, this.state.iterations + 1)}
            className='plusMinusIcon'>
            <FaPlus />
          </span>
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
