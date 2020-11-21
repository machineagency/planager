import React from "react";
import ReactDOM from "react-dom";
import Main from "./components/base/Main";
import { GlobalProvider } from "./utils/GlobalContext";

ReactDOM.render(
  <GlobalProvider>
    <Main />
  </GlobalProvider>,
  document.getElementById("root")
);
