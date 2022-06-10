import { useContext, useEffect } from "react";
import { ChallengesContext } from "../contexts/challengesContext";


const Dashboard = () => {

    const _challengesContext = useContext(ChallengesContext);
    const { challenges, fetchChallenges, postChallenge, upvoteChallenge, downvoteChallenge } = _challengesContext || {};

    useEffect(() => {
        fetchChallenges();
    }, [fetchChallenges])


    return <div>
        <h3>Dashboard</h3>
        {challenges.map((challenge, index) => <div key={challenge.id}>
            <p>{challenge.title}</p>
            <p>{challenge.description}</p>
            <p>{challenge.user}</p>
            <button onClick={() => upvoteChallenge(challenge.id, index)}>Upvote</button>
            <button onClick={() => downvoteChallenge(challenge.id, index)}>Downvote</button>
        </div>)}
        <button onClick={postChallenge}>Add</button>
    </div>
}

export default Dashboard;