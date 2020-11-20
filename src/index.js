import React from "react";
import ReactDOM from "react-dom";
import Main from "./components/base/Main";
import { GlobalProvider } from "./utils/GlobalContext";
import 'semantic-ui-css/semantic.min.css'

ReactDOM.render(
  <GlobalProvider>
    <Main />
  </GlobalProvider>,
  document.getElementById("root")
);
