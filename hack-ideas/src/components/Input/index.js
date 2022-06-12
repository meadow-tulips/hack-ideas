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
export const StyledLabel = styled.label`
    font-size: .75rem;
    display: block;
    > div {
        padding: .5rem 0;
        text-transform: capitalize;
    }

`
const StyledError = styled.div`
    font-size: .75rem;
    font-weight: 500;
    padding: .5rem 0;
    color: #aa7c7c;
`

const Input = ({ name, type, className, inputClassName, value = '', onChange, placeholder = '', onKeyUp, label, error }) => {
    return <StyledInputWrapper className={className}>
        <StyledLabel>
            <div>
                {label}
            </div>
            <StyledInput name={name} className={inputClassName} onKeyUp={onKeyUp} type={type} value={value} onChange={onChange} placeholder={placeholder} />
        </StyledLabel>
        <StyledError>{error} &nbsp;</StyledError>
    </StyledInputWrapper>
}

export default Input;