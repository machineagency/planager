import "./root.css";
import "root.js";

function component() {
  const element = document.createElement("div");
  console.log("Hello webpack");
  console.log(":SDFSDFSDF");
  return element;
}

document.body.appendChild(component());
