import React from "react";
import ReactDOM from "react-dom";
import Main from "./containers/Main";
import { WorkflowProvider } from "./utils/WorkflowContext";
import 'semantic-ui-css/semantic.min.css'

ReactDOM.render(
  <WorkflowProvider>
    <Main />
  </WorkflowProvider>,
  document.getElementById("root")
);
