import styled from 'styled-components'
import { Link } from "react-router-dom";


const Menu = [
    {
        id: 'dashboard',
        label: "Dashboard",
        link: '/dashboard'
    },
    {
        id: 'add-challenge',
        label: "Add Challenge",
        link: '/challenge/add'
    }
]

const StyledSideNavigation = styled.section`
    display: flex;
    height: 100%;
    
`
const StyledSidebar = styled.div`
    min-width: 15rem;
    background: #120F13;
    color: #fff;
    padding: 2rem 1rem;
    text-align: left;
`

const StyledChildren = styled.div`
    width: 100%;
    max-width: calc(100% - 15rem);
    overflow: auto;
`

const StyledMenuItem = styled.li`
    font-weight: 200;
    font-size: 1.25rem;
    line-height: 1.5rem;
    letter-spacing: -0.035em;
    display: block;
    padding: 0 1rem;
    padding-bottom: 1rem;

    > a {
        cursor: pointer;
        text-decoration: none;
        color: #BDBDBD;
        width: 100%;
        display: block;
    }
   

    :not(:first-of-type) {
        padding: 1.4rem 1rem;
    }

`

const SideNavigation = ({ children }) => {

    return <StyledSideNavigation>
        <StyledSidebar>
            {Menu.map(item => <StyledMenuItem key={item.id}><Link to={item.link}>{item.label}</Link></StyledMenuItem>)}
        </StyledSidebar>
        <StyledChildren>
            {children}
        </StyledChildren>
    </StyledSideNavigation>
}

export default SideNavigation;