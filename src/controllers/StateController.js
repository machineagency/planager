export class StateController {
  host;
  state;

  constructor(host) {
    (this.host = host).addController(this);
  }

  stateHandler = {
    get: function (target, prop, receiver) {
      return Reflect.get(...arguments);
    },
    set: (target, property, value) => {
      // TODO: this should confirm with backend that the state variable was updated
      this.host.socket.emit(`${this.host.info.id}_set_${property}`, {
        state: property,
        val: value,
      });
      Reflect.set(target, property, value);
      return true;
    },
  };

  hostConnected() {
    this.state = new Proxy(this.host.info.state, this.stateHandler);
    // Open sockets for each state
    for (const [state, value] of Object.entries(this.state)) {
      console.log(state, value);
      this.host.socket.on(`${this.host.info.id}_${state}_update`, (res) => {
        console.log(res);
        this.host.requestUpdate();
      });
    }
  }
}
