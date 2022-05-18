export class PipeController {
  host;

  loosePipe = null;

  constructor(host) {
    (this.host = host).addController(this);
  }

  startConnection(e) {
    // window.removeEventListener("start-connection", this.startConnection);
    const target = e.composedPath()[0];
    const rect = target.getBoundingClientRect();
    const mouseLocation = { x: e.detail.mouseX, y: e.detail.mouseY };
    const portLocation = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };

    this.loosePipe = document.createElement("planager-pipe");

    if (target.side == "right") {
      // Right port means the end is loose
      this.loosePipe.start = portLocation;
      this.loosePipe.end = mouseLocation;
    } else {
      // Left port means the start is loose
      this.loosePipe.start = mouseLocation;
      this.loosePipe.end = portLocation;
    }

    this.loosePipe.slot = "loosepipe";

    this.host.appendChild(this.loosePipe);

    addEventListener("mousemove", this.handleLoosePipe.bind(this, target.side));
    this.host.requestUpdate();
  }

  handleLoosePipe(e, freeSide) {
    if (freeSide == "right") {
      this.loosePipe.end = { x: e.clientX, y: e.clientY };
      this.loosePipe.requestUpdate();
    } else {
      this.loosePipe.start = { x: e.clientX, y: e.clientY };
      this.loosePipe.requestUpdate();
    }
    this.host.requestUpdate();
  }

  hostConnected() {
    window.addEventListener(
      "start-connection",
      this.startConnection.bind(this)
    );
  }
}
