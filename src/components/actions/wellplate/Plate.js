/* eslint-disable no-throw-literal */
import PlanagerDataType from "../../../utils/PlanagerData";

/**
 * Class representing a wellplate.
 * @extends PlanagerDataType
 */
export default class Plate extends PlanagerDataType {
  constructor(xWells, yWells, name, round = true) {
    super();
    this._xWells = xWells;
    this._yWells = yWells;
    this._round = round;
    this._name = name;
  }

  /**
   * @param {Number} xWells
   */
  set xWells(xWells) {
    try {
      if (typeof xWells !== 'number') throw "a number.";
      if (!Number.isInteger(xWells)) throw "an integer.";
      if (!Math.sign(xWells) || xWells===0) throw "greater than zero.";
      this._xWells = xWells;
    } catch (err) {
      console.error(`xWells should be ${err}`);
      return;
    }
  }
  /**
   * @param {Number} yWells
   */
  set yWells(yWells) {
    try {
      if (typeof yWells !== 'number') throw "a number.";
      if (!Number.isInteger(yWells)) throw "an integer.";
      if (!Math.sign(yWells) || yWells===0) throw "greater than zero.";
      this._yWells = yWells;
    } catch (err) { 
      console.error(`yWells should be ${err}`);
      return;
    }
  }
  /**
   * @param {Boolean} round
   */
  set round(round) {
    this._round = round;
  }
  /**
   * Get wells in X.
   * @returns {Number}
   */
  get xWells() {
    return this._xWells;
  }
  /**
   * Get wells in Y.
   * @returns {Number}
   */
  get yWells() {
    return this._yWells;
  }
  /**
   * Returns whether the wells are round.
   * @returns {Boolean}
   */
  get round() {
    return this._round;
  }
  /**
   * @todo Decide on a standard wellplate implementation.
   * @returns {Object}
   */
  get json() {
    return {
      xWells: this._xWells,
      yWells: this._yWells,
      round: this._round,
    };
  }
  set name(name) {
    this._name = name;
  }
  get name() {
    return this._name;
  }
  /**
   * @returns {Number} The total number of wells in the plate.
   */
  get numWells() {
    return this._xWells * this._yWells;
  }
}
