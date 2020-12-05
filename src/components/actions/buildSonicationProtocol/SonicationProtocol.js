/* eslint-disable no-throw-literal */

export default class SonicationProtocol {
  constructor() {
    this._protocol = { protocol: [] };
  }

  toJSON() {
    return `Sonication Protocol object`;
  }

  addStep(
    deck_index,
    row_letter,
    column_index,
    plunge_depth,
    seconds,
    autoclean = true
  ) {
    this._protocol.protocol.push({
      operation: "sonicate_well",
      specs: {
        deck_index: deck_index,
        row_letter: row_letter,
        column_index: column_index,
        plunge_depth: plunge_depth,
        seconds: seconds,
        autoclean: autoclean,
      },
    });
  }

  removeStep(index) {
    this._protocol.splice(index, 1);
  }

  /**
   * @returns {Object}
   */
  get protocol() {
    return this._protocol;
  }

  // /**
  //  * @param {Object} Jubilee Deck
  //  */
  set deck(jubileeDeck) {
    this._deck = jubileeDeck;
  }
}
