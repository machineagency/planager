/* eslint-disable no-throw-literal */

export default class Jubilee {
  constructor() {
    this._deck = [null, null, null, null, null, null];
  }

  toJSON() {
    return `Jubilee Deck object`;
  }

  /**
   * @param {Object} plate
   */
  set slot(plate) {
    this._deck[plate.num] = plate.data;
  }

  /**
   * @returns {Object}
   */
  get deck() {
    return this._deck;
  }
}
