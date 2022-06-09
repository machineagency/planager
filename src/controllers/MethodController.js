export class MethodController {
  host;
  constructor(host) {
    this.host = host;
    this.host.addController(this);
  }
  runMethod(methodName, args = null) {
    this.host.socket.emit(`${this.host.info.id}_method`, methodName, args);
  }
}
