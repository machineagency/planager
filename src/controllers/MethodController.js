export class MethodController {
  host;
  constructor(host) {
    this.host = host;
    this.host.addController(this);
  }
  runMethod(methodName) {
    this.host.socket.emit(`${this.host.info.id}_method`, methodName);
  }
}
