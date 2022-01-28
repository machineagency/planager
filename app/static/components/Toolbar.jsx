import Dropdown from "./Dropdown";
import React from "react";

export default function Toolbar({ dropdownInfo, addAction }) {
  return (
    <div className='toolbar'>
      <span id='toolbarTitle' className='unselectable'>
        Planager
      </span>
      {/* <label title='Load plan' className='toolbarButton unselectable'>
            Upload
            <input type='file' onChange={this.uploadPlan.bind(this)} />
          </label> */}
      <span className='relative'>
        <span title='Actions' className='toolbarButton unselectable addAction'>
          Actions
          <div className='actionDropdownContainer'>
            <Dropdown dropdownInfo={dropdownInfo} addAction={addAction} />
          </div>
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
