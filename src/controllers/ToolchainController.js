export class ToolchainController {
  host;
  constructor(host) {
    this.host = host;
    host.addController(this);
  }

  addTool() {}

  addPipe() {}

  removePipe() {}

  removeTool() {}

  moveTool() {}

  handleUpload(e) {
    // Get the selected file from the event target
    let file = e.target.files[0];

    // Create a file reader and read it as text because it should be json
    const fileReader = new FileReader();
    fileReader.readAsText(file);

    // Configure onload behavior, using an arrow function to preserve "this"
    fileReader.onload = () => {
      // On load, get the fileReader result and convert it to JSON
      let jsonToolchain = JSON.parse(fileReader.result);
      // Send it to the backend
      this.host.socket.emit("set_toolchain", jsonToolchain);
    };
  }

  uploadToolchain(e) {
    // Create a file input element, style it, and add it to the DOM
    let fileInputElement = document.createElement("input");
    fileInputElement.setAttribute("type", "file");
    fileInputElement.style.display = "none";
    document.body.appendChild(fileInputElement);

    // Call its click event
    fileInputElement.click();

    // Use arrow functions because they preserve the "this" object
    fileInputElement.onchange = (e) => this.handleUpload(e);

    // Clean up the input element
    document.body.removeChild(fileInputElement);
  }

  downloadToolchain(e) {
    // console.log(e);
    this.host.socket.emit("get_toolchain", (plan) => {
      const content = JSON.stringify(plan);

      let element = document.createElement("a");
      element.setAttribute(
        "href",
        "data:application/json;charset=utf-8," + encodeURIComponent(content)
      );

      element.setAttribute("download", "plan.json");
      element.style.display = "none";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    });
  }
}
