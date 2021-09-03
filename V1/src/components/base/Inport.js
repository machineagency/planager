import { v4 as uuidv4 } from "uuid";
export default class Inport {
  constructor(name, type, data = null, description = null) {
    this._name = name;
    this._type = type;
    this._data = data;
    this._description = description;
    this._id = uuidv4();
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
      console.error("Error: Invalid type.");
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
