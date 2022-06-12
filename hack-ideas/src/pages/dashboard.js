import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { ChallengesContext } from "../contexts/challengesContext";
import Table, { Cell, CellHeader, TableRow } from "../components/Table";
import Voter from "../components/Voter";
import MultiSelect from "../components/MultiSelect";
import Pagination from "../components/Pagination";

const SortOptions = [
    { label: 'Lowest Votes Count', value: "VOTES_ASC" },
    { label: 'Most Votes Count', value: "VOTES_DESC" },
    { label: 'Most Recently Created', value: "CREATED_ON_DESC" },
    { label: 'Oldest Challenges', value: "CREATED_ON_ASC" },

]

const StyledDashboard = styled.section`
    text-align: left;
    padding: 0 2rem;
    margin-top: -4rem;
    height: 100vh;
    overflow: hidden;
`

const StyledCell = styled(Cell)`
`
const SelectWrapper = styled.div`
    display: flex;
    justify-content: flex-end;
    margin: 1rem 0;
    .sort-select {
        max-width: 10rem;
    }
`

const StyledDateString = styled.div`
    margin-bottom: .5rem;
`

const TableWrapper = styled.div`
    height: 75%;
    overflow: auto;
    ::-webkit-scrollbar {
    display: none;
}
`

const StyledPagination = styled(Pagination)`
    margin-top: 1.5rem;
    text-align: right;

`

const NoData = styled.p`
    text-align: center;
    height: 80%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
`


const Dashboard = () => {

    const [sortFilter, updateSortFilter] = useState({ label: 'Most Recently Created', value: "CREATED_ON_DESC" });
    const [pageFilter, updatePageFilter] = useState(1);

    const _challengesContext = useContext(ChallengesContext);
    const { challenges, fetchChallenges, upvoteChallenge, downvoteChallenge } = _challengesContext || {};

    const tableHeaders = useMemo(() => ['title', 'tags', 'votes', 'created by', 'created on'], [])

    const onSortChange = useCallback((val) => {
        updateSortFilter(val)
    }, [updateSortFilter])

    const onPageChange = useCallback((val) => {
        if (val > 0) {
            updatePageFilter(val);
        }
    }, [updatePageFilter])

    useEffect(() => {
        fetchChallenges({ sort: sortFilter.value, page: pageFilter });
    }, [sortFilter, pageFilter, fetchChallenges])

    return <StyledDashboard>
        <h3>Dashboard - Challenges</h3>
            <SelectWrapper><MultiSelect onChange={onSortChange} value={sortFilter} options={SortOptions} placeholder='Sort by' className='sort-select' isMulti={false} /></SelectWrapper>
            <TableWrapper>
            {challenges.length ? <Table>
                    <thead>
                        <TableRow>
                            {tableHeaders.map(item => <CellHeader key={item}>{item}</CellHeader>)}
                        </TableRow>
                    </thead>
                    <tbody>
                        {challenges.map((challenge, index) => <TableRow key={challenge.id}>
                            <StyledCell><Link to={`/challenge/${challenge.id}`}>{challenge.title}</Link></StyledCell>
                            <StyledCell>{challenge.tags.map((tag, index) => (index !== 0 ? ", " : "") + tag.name)}</StyledCell>
                            <StyledCell>
                                <Voter ownVote={challenge.votes.ownVote} total={challenge.votes.total} onUpvote={() => upvoteChallenge(challenge.id, index)} onDownvote={() => downvoteChallenge(challenge.id, index)}></Voter>
                                <p>{challenge.votes.ownVote === "0" ? 'Click to vote' : challenge.votes.ownVote === "-1" ? 'You downvoted' : ' You upvoted.'}</p>
                            </StyledCell>
                            <StyledCell>{challenge.user}</StyledCell>
                            <StyledCell>{challenge.createdOn ? <>
                                <StyledDateString>{new Date(challenge.createdOn.seconds * 1000).toLocaleDateString()}</StyledDateString>
                                <div>{new Date(challenge.createdOn.seconds * 1000).toLocaleTimeString()}</div>
                            </> : null}
                            </StyledCell>
                        </TableRow>)}
                    </tbody>
                </Table> : <NoData>No data</NoData>}
            </TableWrapper>
            <StyledPagination
                total={5}
                current={pageFilter}
                onSelect={onPageChange}
            />
    </StyledDashboard>
}

export default Dashboard;