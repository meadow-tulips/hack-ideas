import { useContext } from "react";
import styled from "styled-components";
import { ProfileContext } from "../../contexts/profileContext";
import SideNavigation from "../sideNavigation";

const StyledNav = styled.nav`
    text-align: right;
    padding: 1rem 1rem 1.5rem 1rem;
`
const StyledLi = styled.li`
    list-style: none;
    cursor: pointer;
    color: #333;
    font-weight: 200;
    letter-spacing: -0.035em;
    line-height: 1.5rem;
    text-transform: capitalize;
`

const TopNavigation = ({ children }) => {

    const _profileContent = useContext(ProfileContext);

    return <>
        <SideNavigation>
            <StyledNav>
                <StyledLi onClick={_profileContent.onLogout}>Hi {_profileContent.profile.id},&nbsp; Logout</StyledLi>
            </StyledNav>
            {children}
        </SideNavigation>
    </>
}

export default TopNavigation;