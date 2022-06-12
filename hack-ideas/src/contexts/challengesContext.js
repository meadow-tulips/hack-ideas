import { createContext, useCallback, useContext, useState } from 'react';
import API from '../config/apiConfig';
import { post, get, put } from '../utils';
import { ProfileContext } from './profileContext';


const ChallengesContext = createContext({
    challenges: [],
    availableTags: [],
    getAllTags: () => { },
    fetchChallenges: () => { },
    postChallenge: () => { },
    upvoteChallenge: () => { },
    downvoteChallenge: () => { },
    getChallengeDetails: () => { }
});


const GlobalChallengesContext = ({ children }) => {


    const [challenges, updateChallenges] = useState([]);

    const [availableTags, updateAvailableTags] = useState([]);

    const _profileContent = useContext(ProfileContext);
    const { triggerLoader, stopLoader, onLogout } = _profileContent;

    const fetchChallenges = useCallback((filters) => {
        triggerLoader()
        
        get({ url: `${API.CHALLENGES}`, queryParams: filters })
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


    const postChallenge = useCallback((formData) => {
        triggerLoader();
        return post({ url: `${API.CHALLENGES}/add`, data: formData })
            .then(res => {
                if (res.data)
                    updateChallenges(prev => prev.concat(res.data))
                stopLoader();
            }).catch(err => {
                stopLoader()
                if (err.code === 403 || err.code === 401) {
                    onLogout()
                } else {
                    throw err;
                }
            })
    }, [triggerLoader, stopLoader, onLogout])


    const upvoteChallenge = useCallback((id, index) => {
        triggerLoader();
        return put({ url: `${API.CHALLENGES}/${id}/upvote` })
            .then(res => {
                if (index === 0 || index) {
                    updateChallenges(prev => ([
                        ...prev.slice(0, index),
                        { ...prev[index], votes: res.data.votes },
                        ...prev.slice(index + 1)
                    ]))
                }
                stopLoader();
                return res;
            }).catch(err => {
                if (err.code === 403 || err.code === 401)
                    onLogout()
                stopLoader()
            })
    }, [triggerLoader, stopLoader, onLogout, updateChallenges])

    const downvoteChallenge = useCallback((id, index) => {
        triggerLoader();
       return put({ url: `${API.CHALLENGES}/${id}/downvote` })
            .then(res => {
                if (index === 0 || index) {
                    updateChallenges(prev => ([
                        ...prev.slice(0, index),
                        { ...prev[index], votes: res.data.votes },
                        ...prev.slice(index + 1)
                    ]))
                }
                stopLoader();
                return res;
            }).catch(err => {
                if (err.code === 403 || err.code === 401)
                    onLogout()
                stopLoader()
            })
    }, [triggerLoader, stopLoader, onLogout, updateChallenges])


    const getChallengeDetails = useCallback((id) => {
        triggerLoader();
        return get({ url: `${API.CHALLENGES}/${id}` })
            .then(res => {
                stopLoader();
                return res;
            }).catch(err => {
                if (err.code === 403 || err.code === 401)
                    onLogout()
                stopLoader()
            })
    }, [triggerLoader, stopLoader, onLogout]);


    const getAllTags = useCallback(() => {
        get({ url: `${API.TAGS}` })
            .then(res => {
                updateAvailableTags(res.data);
            }).catch(err => {
                if (err.code === 403 || err.code === 401)
                    onLogout()
                stopLoader()
            })
    }, [updateAvailableTags, stopLoader, onLogout])



    return <ChallengesContext.Provider
        value={{
            challenges,
            availableTags,
            fetchChallenges,
            getAllTags,
            postChallenge,
            upvoteChallenge,
            downvoteChallenge,
            getChallengeDetails
        }}
    >
        {children}
    </ChallengesContext.Provider>
}


export default GlobalChallengesContext;
export {
    ChallengesContext
}