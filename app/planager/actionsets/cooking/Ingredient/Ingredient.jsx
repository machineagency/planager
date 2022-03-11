import React from "react";
import { useState } from "react";

import "./Ingredient.css";

export default function Ingredient({ action, sendToOutport }) {
  const [ingredient, setIngredient] = useState("");
  return (
    <div className='background'>
      <input
        type='text'
        value={ingredient}
        onChange={(e) => {
          setIngredient(
            e.target.value,
            sendToOutport(action.id, { ingredient: ingredient })
          );
        }}
      />
    </div>
  );
}
