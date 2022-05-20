export class StateController {
  host;

  constructor(host) {
    (this.host = host).addController(this);
  }

  updateState(state, val) {
    this.host.socket.emit(`${this.host.info.id}_${state}`, {
      state: state,
      val: val,
    });
  }
}
