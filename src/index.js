import React from "react";
import ReactDOM from "react-dom";
import Main from "./containers/Main";
import { GlobalProvider } from "./utils/GlobalContext";
import 'semantic-ui-css/semantic.min.css'

ReactDOM.render(
  <GlobalProvider>
    <Main />
  </GlobalProvider>,
  document.getElementById("root")
);
