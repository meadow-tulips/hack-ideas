import { useMemo } from "react"
import styled from "styled-components"

const UpvoteIcon = ({ className, ...rest }) => {
    return <svg {...rest} aria-hidden="true" className={className} width="36" height="36" viewBox="0 0 36 36"><path d="M2 25h32L18 9 2 25Z"></path></svg>
}
const DownVoteIcon = ({  className, ...rest}) => {
    return <svg {...rest} aria-hidden="true" className={className} width="36" height="36" viewBox="0 0 36 36"><path d="M2 11h32L18 27 2 11Z"></path></svg>
}

const CommonSVGStyled = `
        fill: hsl(210deg 8% 45%);
        width: 1.5rem;
        height: 1.5rem;
`;
const StyledUpvoteIcon = styled(UpvoteIcon)`
    ${CommonSVGStyled};
    ${({ hasUpvoted }) => hasUpvoted && `
            fill: #000;
    `};
`

const StyledDownvoteIcon = styled(DownVoteIcon)`
    ${CommonSVGStyled};
    ${({ hasDownvoted }) => hasDownvoted && `
            fill: #000;
    `};
`

const StyledVoter = styled.div`
    display: inline-flex;
    align-items: center;
    flex-direction: column;

    span.total {
        color: hsl(210deg 8% 45%);
    }
`

const Voter = ({ total, ownVote, onUpvote, onDownvote }) => {

    const hasUpvoted = useMemo(() => ownVote === "1", [ownVote])

    const hasDownvoted = useMemo(() => ownVote === "-1", [ownVote])

    return <StyledVoter>
        <StyledUpvoteIcon hasUpvoted={hasUpvoted} onClick={onUpvote} />
        <span className="total">{total}</span>
        <StyledDownvoteIcon hasDownvoted={hasDownvoted} onClick={onDownvote} />
    </StyledVoter>


}

export default Voter;