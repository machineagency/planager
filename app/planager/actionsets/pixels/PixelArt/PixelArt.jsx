import React from "react";
import { FaPlus, FaMinus } from "react-icons/fa";

import "./PixelArt.css";

const COLORS = {
  Black: "#000000",
  White: "#ffffff",
  Base03: "#002b36",
  Base02: "#073642",
  Base01: "#586e75",
  Base00: "#657b83",
  Base0: "#839496",
  Base1: "#93a1a1",
  Base2: "#eee8d5",
  Base3: "#fdf6e3",
  Yellow: "#b58900",
  Orange: "#cb4b16",
  Red: "#dc322f",
  Magenta: "#d33682",
  Violet: "#6c71c4",
  Blue: "#268bd2",
  Cyan: "#2aa198",
  Green: "#859900",
};

const ART = [
  [
    COLORS.Violet,
    COLORS.Violet,
    COLORS.Violet,
    COLORS.Violet,
    COLORS.Violet,
    COLORS.Violet,
    COLORS.Violet,
  ],
  [
    COLORS.Violet,
    COLORS.Base3,
    COLORS.Violet,
    COLORS.Violet,
    COLORS.Violet,
    COLORS.Base3,
    COLORS.Violet,
  ],
  [
    COLORS.Violet,
    COLORS.Base3,
    COLORS.Violet,
    COLORS.Base3,
    COLORS.Violet,
    COLORS.Base3,
    COLORS.Violet,
  ],
  [
    COLORS.Violet,
    COLORS.Violet,
    COLORS.Base3,
    COLORS.Violet,
    COLORS.Base3,
    COLORS.Violet,
    COLORS.Violet,
  ],
  [
    COLORS.Violet,
    COLORS.Violet,
    COLORS.Violet,
    COLORS.Violet,
    COLORS.Violet,
    COLORS.Violet,
    COLORS.Violet,
  ],
];

export default class PixelArt extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      numRows: ART.length,
      numCols: ART[0].length,
      currentColor: COLORS.Black,
      colorList: COLORS,
      artwork: ART,
      bitmap: [],
    };
  }
  componentDidMount() {
    this.artUpdated();
  }
  componentDidUpdate() {
    let bitmap = this.props.inports.bitmap.value;
    if (!bitmap) return;
    if (!(JSON.stringify(bitmap) == JSON.stringify(this.state.bitmap))) {
      let art = [];
      for (const row of bitmap) {
        let artRow = [];
        for (const pixel of row) {
          artRow.push(pixel ? COLORS.Base3 : COLORS.Base03);
        }
        art.push(artRow);
      }
      this.setState({
        artwork: art,
        bitmap: bitmap,
        numRows: art.length,
        numCols: art[0].length,
      });
    }
  }
  artUpdated() {
    this.props.sendToOutport(this.props.action.id, {
      pixelArt: this.state.artwork,
    });
  }
  setNumRows(numRows) {
    const rowDiff = numRows - this.state.numRows;
    if (rowDiff == 0) return;
    let newArt;
    if (rowDiff > 0) {
      let newRows = Array.from(Array(rowDiff), () =>
        Array.from(Array(this.state.numCols), () => this.state.currentColor)
      );
      newArt = this.state.artwork.concat(newRows);
    } else {
      newArt = this.state.artwork.slice(0, rowDiff);
    }
    this.setState({ artwork: newArt, numRows: numRows }, this.artUpdated);
  }
  setNumCols(numCols) {
    const colDiff = numCols - this.state.numCols;
    if (colDiff == 0) return;
    let newArt = [...this.state.artwork];
    if (colDiff > 0) {
      for (const row of newArt) {
        row.push(Array.from(Array(colDiff), () => this.state.currentColor));
      }
    } else {
      for (const row of newArt) {
        row.splice(row.length + colDiff, Math.abs(colDiff));
      }
    }
    this.setState({ artwork: newArt, numCols: numCols }, this.artUpdated);
  }
  fillPixelWithCurrentColor(row, column) {
    let art = [...this.state.artwork];
    art[row][column] = this.state.currentColor;
    this.setState({ artwork: art }, this.artUpdated);
  }
  onColorClick(color) {
    this.setState({ currentColor: this.state.colorList[color] });
  }
  paint(row, column, e) {
    if (!e.buttons == 1) return;
    this.fillPixelWithCurrentColor(row, column);
  }
  onReset() {
    // Remake the art array with only white squares
    let arr = Array.from(Array(this.state.numRows), () =>
      Array.from(Array(this.state.numCols), () => this.state.currentColor)
    );
    this.setState({ artwork: arr }, this.artUpdated);
  }
  renderPixelArt() {
    let pixelArt = [];
    for (const [rowNum, row] of Object.entries(this.state.artwork)) {
      for (const [colNum, color] of Object.entries(row)) {
        pixelArt.push(
          <div
            onClick={this.fillPixelWithCurrentColor.bind(this, rowNum, colNum)}
            onMouseEnter={this.paint.bind(this, rowNum, colNum)}
            className='pixel'
            style={{
              backgroundColor: color,
              aspectRatio: "1/1",
            }}
            key={`${rowNum}_${colNum}`}
          />
        );
      }
    }
    return pixelArt;
  }
  renderColorBar() {
    let colors = [];
    for (const [colorName, colorHex] of Object.entries(this.state.colorList)) {
      colors.push(
        <div
          onClick={this.onColorClick.bind(this, colorName)}
          className='color'
          style={{ backgroundColor: colorHex }}
          key={colorName}
        />
      );
    }
    return colors;
  }
  render() {
    return (
      <div id='pixelArtActionContent'>
        <div id='settings'>
          <div id='resetButton' onClick={this.onReset.bind(this)}>
            Reset
          </div>
          <div
            id='currentColor'
            style={{ backgroundColor: this.state.currentColor }}>
            Current Color
          </div>
          <div className='sizeInput'>
            <span
              onClick={this.setNumRows.bind(this, this.state.numRows - 1)}
              className='plusMinusIcon'>
              <FaMinus />
            </span>
            <span className='numRowCols'>{this.state.numRows} Rows</span>
            <span
              onClick={this.setNumRows.bind(this, this.state.numRows + 1)}
              className='plusMinusIcon'>
              <FaPlus />
            </span>
          </div>
          <div className='sizeInput'>
            <span
              onClick={this.setNumCols.bind(this, this.state.numCols - 1)}
              className='plusMinusIcon'>
              <FaMinus />
            </span>
            <span className='numRowCols'>{this.state.numCols} Cols</span>
            <span
              onClick={this.setNumCols.bind(this, this.state.numCols + 1)}
              className='plusMinusIcon'>
              <FaPlus />
            </span>
          </div>
        </div>
        <div
          id='pixelArtContainer'
          style={{
            gridTemplateColumns: `repeat(${this.state.numCols},1fr)`,
          }}>
          {this.renderPixelArt()}
        </div>
        <div id='colorBar'>{this.renderColorBar()}</div>
      </div>
    );
  }
}
