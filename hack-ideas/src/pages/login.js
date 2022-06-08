import { useCallback, useContext, useState } from 'react';
import styled from 'styled-components';
import Input from '../components/Input';
import { ProfileContext } from '../contexts/profileContext';


const StyledLoginWrapper = styled.div`
    display: flex;
    align-items: center;
    height: 100%;
    justify-content: center;
`

const StyledButton = styled(Input)`
    margin-top: 2rem;
    font-size: .75rem;
`

const StyledInput = styled(Input)`
    font-size: .75rem;
`

const Login = () => {
    const [value, updateValue] = useState('');

    const handleChange = useCallback((event) => {
        const val = event.target.value;
        updateValue(val);
    }, [updateValue])

    const _profileContext = useContext(ProfileContext)

    const handleSubmit = useCallback((event) => {
            event && event.preventDefault();
            _profileContext.onLogin(value)
    }, [value, _profileContext])

    return <StyledLoginWrapper>
        <form onSubmit={handleSubmit}>
            <StyledInput value={value} onChange={handleChange} placeholder='Enter user ID' />
            <StyledButton type="submit" value={'Submit'} />  
        </form>
    </StyledLoginWrapper>
}

export default Login;