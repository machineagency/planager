export default class SonicationPlanObject {
  constructor() {
    this._startDepth = 0;
    this._startTime = 0;
    this._varyTime = false;
    this._varyDepth = false;
    this._varyTimeIterations = 1;
    this._varyDepthIterations = 1;
    this._varyTimeIncrement = 0;
    this._varyDepthIncrement = 0;
    this._sampleTotal = 0;
  }
  toJSON() {
    return `Sonication plan for ${this._sampleTotal} samples`;
  }
  get startDepth() {
    return this._startDepth;
  }
  get startTime() {
    return this._startTime;
  }
  get varyTime() {
    return this._varyTime;
  }
  get varyDepth() {
    return this._varyDepth;
  }
  get varyTimeIterations() {
    return this._varyTimeIterations;
  }
  get varyDepthIterations() {
    return this._varyDepthIterations;
  }
  get varyTimeIncrement() {
    return this._varyTimeIncrement;
  }
  get varyDepthIncrement() {
    return this._varyDepthIncrement;
  }
  get sampleTotal() {
    return this._sampleTotal;
  }
  set startDepth(value) {
    this._startDepth = value;
  }
  set startTime(value) {
    this._startTime = value;
  }
  set varyTime(value) {
    this._varyTime = value;
  }
  set varyDepth(value) {
    this._varyDepth = value;
  }
  set varyTimeIterations(value) {
    this._varyTimeIterations = value;
  }
  set varyDepthIterations(value) {
    this._varyDepthIterations = value;
  }
  set varyTimeIncrement(value) {
    this._varyTimeIncrement = value;
  }
  set varyDepthIncrement(value) {
    this._varyDepthIncrement = value;
  }
  set sampleTotal(value) {
    this._sampleTotal = value;
  }
}
