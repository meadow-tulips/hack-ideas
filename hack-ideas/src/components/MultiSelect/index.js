import React from 'react'
import styled from 'styled-components'
import Select from 'react-select'


const StyledMultiSelect = styled(Select)`
    font-size: .75rem;
    font-family: inherit;

`


const MultiSelect = ({ onChange = () => {}, value, className, name, options = [], isMulti = true, placeholder = '' }) =>  {

return (
  <StyledMultiSelect 
    name={name}
    className={className}
    isMulti={isMulti}
    options={options} 
    onChange={onChange}
    value={value}
    placeholder={placeholder}
    />
)
}

export default MultiSelect