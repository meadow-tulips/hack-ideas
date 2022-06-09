import styled from "styled-components"

const StyledImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: contain ;

`

const Page404 = () => {
    return <StyledImage src={'/error/404.png'} alt={"No page found"} />
}

export default Page404 