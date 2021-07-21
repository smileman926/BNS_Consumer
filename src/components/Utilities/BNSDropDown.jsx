import React, { useState }  from 'react'
import {Dropdown} from 'react-bootstrap'
import '@style/components/BNSDropDown.style.scss'

function BNSDropDown(props) {
  const { selectedOption, options, onSelect } = props;
  const [value, setValue] = useState(selectedOption);
  const selectOption = (option) => {
    if (value.name !== option.name)
      setValue(option)
    if (onSelect)
      onSelect(option);
  }
  return (
    <Dropdown className="bns-dropdown mx-auto mx-sm-0">
      <Dropdown.Toggle variant="success" id="dropdown-basic">
        {value.name}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {options.map(option =>
         <Dropdown.Item onClick={()=>selectOption(option)} key={Math.random()}>{ option.name }</Dropdown.Item>
        )}
      </Dropdown.Menu>
    </Dropdown>
  )
}

export default BNSDropDown

