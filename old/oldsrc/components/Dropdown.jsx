import React from "react";

function SubDropdown({ actionSetName, actionSet, addAction }) {
  let actionList = [];
  for (const action of actionSet) {
    actionList.push(
      <div key={action}>
        <div
          type='button'
          className='dropdownAction'
          onClick={() => addAction(actionSetName, action)}>
          {action}
        </div>
      </div>
    );
  }
  return actionList;
}

export default function Dropdown({ dropdownInfo, addAction }) {
  let dropdown = [];
  for (const actionSet of Object.keys(dropdownInfo)) {
    dropdown.push(
      <div key={actionSet} className='dropdownActionSet'>
        <div className='textContainer'>
          <div className='dropdownActionSetText'>{actionSet}</div>
        </div>
        <div className='actionListContainer'>
          <SubDropdown
            actionSetName={actionSet}
            actionSet={dropdownInfo[actionSet]}
            addAction={addAction}
          />
        </div>
      </div>
    );
  }
  return dropdown;
}
