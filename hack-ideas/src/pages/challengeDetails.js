import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { StyledLabel } from "../components/Input";
import RichTextEditor from "../components/RichTextEditor";
import Voter from "../components/Voter";
import { ChallengesContext } from "../contexts/challengesContext";

const StyledChallengeDetails = styled.section`
    text-align: left;
    padding: 0 2rem;
    margin-top: -4rem;
    
    .RichEditor-editor {
        border-top: none;
    }
`
const VotesHeadingWrapper = styled.div`
    display: flex;
`

const StyledChallengeWrapper = styled.section`
    margin: 1rem 0;
`
const StyledHeading = styled.h5`
    margin-left: 1rem;
`
const StyledDateTime = styled.p`
    text-align: right;
    font-size: .75rem;
    font-color: gray;

`
const StyledTags = styled.div`
    margin: 1rem 0;
`

const StyledCustomLabel = styled(StyledLabel)`
    margin: 1rem 0;
`

const ChallengeDetails = () => {

    const [data, updateData] = useState(null);


    const _challengesContext = useContext(ChallengesContext);
    let { id } = useParams();

    const { getChallengeDetails, upvoteChallenge, downvoteChallenge } = _challengesContext

    const onUpvote = useCallback(() => {
        upvoteChallenge(id)
            .then(res => {
                if (res.data.votes) {
                    updateData(prev => ({
                        ...prev,
                        votes: res.data.votes
                    }))
                }
            })
    }, [upvoteChallenge, id, updateData])

    const onDownvote = useCallback(() => {
        downvoteChallenge(id)
            .then(res => {
                if (res.data.votes) {
                    updateData(prev => ({
                        ...prev,
                        votes: res.data.votes
                    }))
                }
            })
    }, [downvoteChallenge, id, updateData])

    useEffect(() => {
        if (id) {
            getChallengeDetails(id)
                .then(res => {
                    updateData({ ...res.data, description: JSON.parse(res.data.description || "") });
                })
        }

    }, [id, getChallengeDetails])

    const createdOn = useMemo(() => data ? new Date(data.createdOn.seconds * 1000) : null, [data])

    if (!data) return null

    return <StyledChallengeDetails>
        <h3>Challenge Details Page</h3>
        <StyledChallengeWrapper>
            <VotesHeadingWrapper>
                <Voter total={data.votes.total} ownVote={data.votes.ownVote} onDownvote={onDownvote} onUpvote={onUpvote} />
                <StyledHeading>&nbsp;{data.title}</StyledHeading>
            </VotesHeadingWrapper>
            <StyledDateTime>{createdOn.toLocaleDateString()} | {createdOn?.toLocaleTimeString()}</StyledDateTime>
            <div>
                <StyledCustomLabel>Description</StyledCustomLabel>
                <RichTextEditor value={data.description} readOnly />
                <StyledTags>
                    Tags: {data.tags.map((tag, index) => (index !== 0 ? ", ": "") + tag.name )}
                </StyledTags>
            </div>


        </StyledChallengeWrapper>
    </StyledChallengeDetails>
}

export default ChallengeDetails;