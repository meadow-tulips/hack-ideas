import { useContext } from "react";
import styled from "styled-components";
import { ProfileContext } from "../../contexts/profileContext";

const StyledNav = styled.nav`
    text-align: right;
    padding: 1rem 1rem 1.5rem 1rem;
`
const StyledLi = styled.li`
    list-style: none;
    cursor: pointer;
`

const TopNavigation = ({ children }) => {

    const _profileContent = useContext(ProfileContext);

    return <>
        <StyledNav>
            <StyledLi onClick={_profileContent.onLogout}>Logout</StyledLi>
        </StyledNav>
        {children}
    </>
}

export default TopNavigation;