import { createContext, useCallback, useContext, useState } from 'react';
import API from '../config/apiConfig';
import { post, get, put } from '../utils';
import { ProfileContext } from './profileContext';


const ChallengesContext = createContext({
    challenges: [],
    fetchChallenges: () => { },
    postChallenge: () => { },
    upvoteChallenge: () => { },
    downvoteChallenge: () => { }
});


const GlobalChallengesContext = ({ children }) => {


    const [challenges, updateChallenges] = useState([]);

    const _profileContent = useContext(ProfileContext);
    const { triggerLoader, stopLoader, onLogout } = _profileContent;

    const fetchChallenges = useCallback(() => {
        triggerLoader()
        get({ url: API.CHALLENGES })
            .then(res => {
                updateChallenges(res.data)
                stopLoader()
            })
            .catch(err => {
                if (err.code === 403 || err.code === 401)
                    onLogout()
                stopLoader()
            })
    }, [triggerLoader, stopLoader, updateChallenges, onLogout])


    const postChallenge = useCallback(() => {
        triggerLoader();
        post({ url: `${API.CHALLENGES}/add`, data: { title: "Drawing a beizian Curve", description: "Description of a beizian curve", tags: ['php', 'html'] } })
            .then(res => {
                if (res.data)
                    updateChallenges(prev => prev.concat(res.data))
                stopLoader();
            }).catch(err => {
                if (err.code === 403 || err.code === 401)
                    onLogout()
                stopLoader()
            })
    }, [triggerLoader, stopLoader, onLogout])


    const upvoteChallenge = useCallback((id, index) => {
        triggerLoader();
        put({ url: `${API.CHALLENGES}/${id}/upvote` })
            .then(_ => {
                updateChallenges(prev => ([
                    ...prev.slice(0, index),
                    { ...prev[index], votes: prev[index].votes + 1 },
                    ...prev.slice(index + 1)
                ]))
                stopLoader();
            }).catch(err => {
                if (err.code === 403 || err.code === 401)
                    onLogout()
                stopLoader()
            })
    }, [triggerLoader, stopLoader, onLogout, updateChallenges])

    const downvoteChallenge = useCallback((id, index) => {
        triggerLoader();
        put({ url: `${API.CHALLENGES}/${id}/downvote` })
            .then(_ => {
                updateChallenges(prev => ([
                    ...prev.slice(0, index),
                    { ...prev[index], votes: prev[index].votes - 1 },
                    ...prev.slice(index + 1)
                ]))
                stopLoader();
            }).catch(err => {
                if (err.code === 403 || err.code === 401)
                    onLogout()
                stopLoader()
            })
    }, [triggerLoader, stopLoader, onLogout, updateChallenges])


    return <ChallengesContext.Provider
        value={{
            challenges,
            fetchChallenges,
            postChallenge,
            upvoteChallenge,
            downvoteChallenge
        }}
    >
        {children}
    </ChallengesContext.Provider>
}


export default GlobalChallengesContext;
export {
    ChallengesContext
}