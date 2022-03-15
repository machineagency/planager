import React, { useState, useEffect } from "react";

import "./TemplateAction.css";

export default function Template({ action, sendToOutport, runBackendMethod }) {
  return <div>{action.id}</div>;
}
