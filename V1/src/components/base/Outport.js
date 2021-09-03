export default class Outport {
  constructor(name, type, data = null, description = null) {
    this._name = name;
    this._type = type;
    this.data = data;
    this._description = description;
  }
  set data(data) {
    this._data = data;
  }
  set name(name) {
    this._name = name;
  }
  set description(description) {
    this._description = description;
  }
  set type(type) {
    if (this._type === type) {
      this._type = type;
    } else {
      console.error("Error: could not set type.");
    }
  }
  get name() {
    return this._name;
  }
  get description() {
    return this._description;
  }
  get type() {
    return this._type;
  }
  get data() {
    return this._data;
  }
}
