import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import API from '../config/apiConfig';
import { post, get } from '../utils';
import { ProfileContext } from './profileContext';


const ChallengesContext = createContext({
    challenges: [],
    fetchChallenges: () => {},
    postChallenge: () => {}
});


const GlobalChallengesContext = ({ children }) => {
    

    const [challenges, updateChallenges] = useState([]);

    const _profileContent = useContext(ProfileContext);
    const { triggerLoader, stopLoader } = _profileContent;

    const fetchChallenges = useCallback(() => {
        triggerLoader()
        get({ url: API.CHALLENGES })
            .then(res => {
                updateChallenges(res.data)
                stopLoader()
            })
            .catch(err => {
                console.log(err);
                stopLoader()
                throw err
            })
    }, [triggerLoader, stopLoader, updateChallenges])


    const postChallenge = useCallback(() => {
        triggerLoader();
        post({ url: `${API.CHALLENGES}/add`, data: { title: "Drawing a beizian Curve", description: "Description of a beizian curve", tags: ['php', 'html'] } })
        .then(res => {
            if(res.data)
                updateChallenges(prev => prev.concat(res.data))
            stopLoader();
        }).catch(err => stopLoader())
    }, [triggerLoader, stopLoader])
    

    return <ChallengesContext.Provider
        value={{
            challenges,
            fetchChallenges,
            postChallenge
        }}
    >
        {children}
    </ChallengesContext.Provider>
}


export default GlobalChallengesContext;
export {
    ChallengesContext
}