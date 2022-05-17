export class DataController {
  host;

  constructor(host) {
    (this.host = host).addController(this);
    console.log("inside constructor");
  }

  send() {}

  hostConnected() {
    console.log("connected");
    this.host.requestUpdate();
  }
  hostDisconnected() {
    console.log("disconnected");
  }
}
