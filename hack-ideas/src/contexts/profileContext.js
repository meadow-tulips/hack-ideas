import { createContext, useCallback, useEffect, useState } from 'react';
import Cookies from 'universal-cookie'
import API from '../config/apiConfig';
import { post, get } from '../utils';


const ProfileContext = createContext({
    profile: {},
    onLogin: () => { },
    onLogout: () => { },
    loading: true,
    triggerLoader: () => { },
    stopLoader: () => { },
});


const GlobalProfileContext = ({ children }) => {

    const [profile, updateProfile] = useState({ id: null });
    const [loading, updateLoading] = useState(true)

    useEffect(() => {
        // To get if user is logged on hard reload
        get({ url: API.LOGIN })
            .then(res => {
                updateProfile({ id: res.data?.id ?? null });
                updateLoading(false)
            })
            .catch(_ => updateLoading(false))
    }, [])



    const onLogin = useCallback((val) => {
        updateLoading(true)
        post({ url: API.LOGIN, data: { id: val } })
            .then(res => {
                updateProfile({ id: res.data.id });
                updateLoading(false);
                return res;
            }).catch(err => {
                updateLoading(false)
            })
    }, [updateProfile]);



    const onLogout = useCallback(() => {
        console.log('called');
        updateProfile({ id: null })
        const cookies = new Cookies();
        cookies.remove('connect.sid');
    }, [updateProfile])



    const triggerLoader = useCallback(() => updateLoading(true), [updateLoading])

    const stopLoader = useCallback(() => updateLoading(false), [updateLoading]);

    return <ProfileContext.Provider
        value={{
            loading,
            profile,
            onLogin,
            onLogout,
            triggerLoader,
            stopLoader
        }}
    >
        {children}
    </ProfileContext.Provider>
}


export default GlobalProfileContext;
export {
    ProfileContext
}