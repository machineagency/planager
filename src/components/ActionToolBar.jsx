import React from "react";
import { FaSlidersH, FaGripVertical } from "react-icons/fa";

export default function ActionToolbar({ displayName, toggleConfig }) {
  return (
    <div className='actionToolbarContainer unselectable'>
      <span className='actionTitle'>{displayName}</span>
      <span className='dragHandle'>
        <FaGripVertical />
      </span>
      <span
        className='configButton'
        title='Open config panel'
        onClick={toggleConfig}>
        <FaSlidersH />
      </span>
    </div>
  );
}
