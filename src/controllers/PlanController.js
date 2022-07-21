export class PlanController {
  host;
  constructor(host) {
    (this.host = host).addController(this);
  }

  uploadPlan(e) {
    console.log(e);
  }

  downloadPlan(e) {
    this.host.socket.emit("getPlan", (plan) => {
      var element = document.createElement("a");
      element.setAttribute(
        "href",
        "data:application/json;charset=utf-8, " + JSON.stringify(plan)
      );
      element.setAttribute("download", "plan.json");
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    });
  }
}
