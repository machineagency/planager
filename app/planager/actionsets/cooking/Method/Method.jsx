import React from "react";
import { useState } from "react";

import "./Method.css";

export default function Method({ action, sendToOutport }) {
  const [method, setMethod] = useState("");
  function renderToolsTags() {
    return Object.values(action.inports.tools.value).map((val, index) => {
      if (!val) return;
      return (
        <span className='tool tag' key={index}>
          {val}
        </span>
      );
    });
  }
  function renderIngredientTags() {
    return Object.values(action.inports.ingredients.value).map((val, index) => {
      if (!val) return;
      return (
        <span className='ingredient tag' key={index}>
          {val}
        </span>
      );
    });
  }
  return (
    <div className='mixContent'>
      <div className='tagContainer'>
        <span>
          <b>Ingredients:</b>
        </span>
        {renderIngredientTags()}
      </div>
      <div className='tagContainer'>
        <span>
          <b>Tools:</b>
        </span>
        {renderToolsTags()}
      </div>
    </div>
  );
}
