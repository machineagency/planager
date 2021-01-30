import React from "react";
import { useColorMode } from "theme-ui";

export default (props) => {
  const [colorMode, setColorMode] = useColorMode();
  return (
    <span
      onClick={(e) => {
        setColorMode(colorMode === "default" ? "dark" : "default");
      }}
    >{props.children}</span>
  );
};
