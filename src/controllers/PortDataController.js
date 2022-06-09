export class PortDataController {
  inports = {};
  outports = {};

  constructor(host) {
    this.host = host;
    this.host.addController(this);
  }

  hostConnected() {
    for (const [port, value] of Object.entries(this.host.info.inports)) {
      this.host.socket.on(`${this.host.info.id}_inport_${port}`, (value) => {
        this.inports[port] = value;
        this.host.requestUpdate();
      });
    }
    for (const [port, value] of Object.entries(this.host.info.outports)) {
      this.host.socket.on(`${this.host.info.id}_outport_${port}`, (value) => {
        this.outports[port] = value;
        this.host.requestUpdate();
      });
    }
  }
}
