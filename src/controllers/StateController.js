export class StateController {
  // Host is the module that this controller is attached to
  host;
  // True state is the actual state object that the module will use to render
  trueState;
  // State is the proxy that the host will interact with, it will intercept any "set" operation
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
    this.trueState = { ...this.host.info.state };
    this.state = new Proxy(this.trueState, this.stateHandler);
    // Open sockets that listen for changes to each state
    for (const [state, value] of Object.entries(this.state)) {
      this.host.socket.on(`${this.host.info.id}_${state}_update`, (res) => {
        this.trueState[state] = res;
        this.host.requestUpdate();
      });
    }
  }
}
