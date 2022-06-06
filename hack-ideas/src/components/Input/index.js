import styled from 'styled-components'

const StyledInputWrapper = styled.div`
    font-size: .85rem;
    font-weight: lighter;
`

const StyledInput = styled.input`
    padding: .45rem .65rem;
    border: 1px solid #b0d5d1;
    font-size: inherit;
    font-weight: inherit;
`

const Input = ({ type, className, value = '', onChange, placeholder = '', onKeyUp }) => {
    return <StyledInputWrapper className={className}>
            <StyledInput onKeyUp={onKeyUp} type={type} value={value} onChange={onChange} placeholder={placeholder} />
    </StyledInputWrapper>
}

export default Input;