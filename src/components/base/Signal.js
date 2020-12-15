export default class Signal {
  constructor(name, data = null) {
    this._name = name;
    this._data = data;
    let d = new Date()
    this._originTime = d.getTime()
  }

  toJSON() {
    return `A signal object.`;
  }

  set data(data) {
    this._data = data;
  }
  get data() {
    return this._data;
  }
  set name(name) {
    this._name = name;
  }
  get name() {
    return this._name;
  }
  get originTime() {
      return this._originTime;
  }
}
