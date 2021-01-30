import React from "react";
import ReactDOM from "react-dom";
import Main from "./components/base/Main";
import { GlobalProvider } from "./utils/GlobalContext";
import { ThemeProvider } from "theme-ui";
import theme from "./components/base/Theme";

ReactDOM.render(
  <GlobalProvider>
    <ThemeProvider theme={theme}>
      <Main />
    </ThemeProvider>
  </GlobalProvider>,
  document.getElementById("root")
);
