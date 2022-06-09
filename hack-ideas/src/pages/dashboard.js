import { useContext, useEffect } from "react";
import { ChallengesContext } from "../contexts/challengesContext";


const Dashboard = () => {

    const _challengesContext = useContext(ChallengesContext);
    const { challenges, fetchChallenges, postChallenge } = _challengesContext || {};

    useEffect(() => {
        fetchChallenges();
    }, [fetchChallenges])

    console.log(challenges)

    return <div>
        <h3>Dashboard</h3>
        {challenges.map(challenge => <div key={challenge.id}>
            <p>{challenge.title}</p>
            <p>{challenge.description}</p>
            <p>{challenge.user}</p>
        </div>)}
        <button onClick={postChallenge}>Add</button>
    </div>
}

export default Dashboard;