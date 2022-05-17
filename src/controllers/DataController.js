export class DataController {
  host;

  constructor(host) {
    (this.host = host).addController(this);
    console.log("inside constructor");
  }

  updateBackend(state, val) {
    console.log(state, val);
    this.host.socket.emit("updateBackendState", {
      id: this.host.info.id,
      state: state,
      val: val,
    });
  }

  hostConnected() {
    console.log("connected");
    console.log(this.host.socket);
    console.log(this.host.info);
  }

  hostDisconnected() {
    console.log("disconnected");
  }
}
