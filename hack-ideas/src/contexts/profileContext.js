import { createContext, useCallback, useEffect, useState } from 'react';
import API from '../config/apiConfig';
import { post, get } from '../utils';


const ProfileContext = createContext({
    profile: {},
    onLogin: () => {},
    onLogout: () => {}
});


const GlobalProfileContext = ({ children }) => {

    const [profile, updateProfile] = useState({ id: null  });
    const [loading, updateLoading] = useState(true)

    useEffect(() => {
        // To get if user is logged on hard reload
        get({ url: API.LOGIN })
        .then(res => {
            updateProfile({id: res.data?.id ?? null });
            updateLoading(false)
        }).catch(err => {
            updateLoading(false)
        })
    }, [])



    const onLogin = useCallback((val) => {
        updateLoading(true)
        post({ url: API.LOGIN, data: { id: val }})
        .then(res => {
            updateProfile({id: res.data.id });
            updateLoading(false);
            return res;
        }).catch(err => {
            updateLoading(false)
        })
    }, [updateProfile]);



    const onLogout = useCallback(() => {
        updateProfile({ id: null })
    }, [updateProfile])

    return <ProfileContext.Provider
               value={{
                   loading,
                   profile,
                   onLogin,
                   onLogout
               }}
            >
            {children}
    </ProfileContext.Provider>
}


export default GlobalProfileContext;
export {
    ProfileContext
}