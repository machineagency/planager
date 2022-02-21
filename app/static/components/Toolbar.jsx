import Dropdown from "./Dropdown";
import React from "react";

export default function Toolbar({
  dropdownInfo,
  addAction,
  uploadPlan,
  savePlan,
}) {
  return (
    <div className='toolbar'>
      <span id='toolbarTitle' className='unselectable'>
        Planager
      </span>
      <span className='relative'>
        <span title='Actions' className='toolbarButton unselectable addAction'>
          Actions
          <div className='actionDropdownContainer'>
            <Dropdown dropdownInfo={dropdownInfo} addAction={addAction} />
          </div>
        </span>
      </span>
      <label title='Load plan' className='toolbarButton unselectable'>
        Upload
        <input type='file' onChange={uploadPlan} />
      </label>
      <span>
        <span
          title='Save'
          className='toolbarButton unselectable'
          onClick={savePlan}>
          Save
        </span>
      </span>
      {/* <span className='relative'>
            <span
              title='Examples'
              className='toolbarButton unselectable addAction'>
              Examples
              <div className='actionDropdownContainer'>
                {this.renderExampleDropdown()}
              </div>
            </span>
          </span> */}
    </div>
  );
}
