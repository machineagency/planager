export default class SonicationProtocol {
  constructor() {
    this._protocol = [];
  }

  addInstruction(instruction) {
    this._protocol.push(instruction);
  }

  get protocol() {
    return this._protocol;
  }
}
