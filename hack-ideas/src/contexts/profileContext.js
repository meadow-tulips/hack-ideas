import { createContext, useCallback, useState } from 'react';
import Cookies from 'universal-cookie'
import API from '../config/apiConfig';
import { post } from '../utils';


const ProfileContext = createContext({
    profile: {},
    onLogin: () => { },
    onLogout: () => { },
    loading: true,
    triggerLoader: () => { },
    stopLoader: () => { },
});


const GlobalProfileContext = ({ children }) => {

    const [profile, updateProfile] = useState({ id: localStorage.getItem('profile') || null });
    const [loading, updateLoading] = useState(false)

    const onLogin = useCallback((val) => {
        updateLoading(true)
        return post({ url: API.LOGIN, data: { id: val } })
            .then(res => {
                updateProfile({ id: res.data.id });
                localStorage.setItem('profile', res.data.id)
                updateLoading(false);
                return res;
            }).catch(err => {
                updateLoading(false)
                throw err
            })
    }, [updateProfile]);



    const onLogout = useCallback(() => {
        updateProfile({ id: null })
        const cookies = new Cookies();
        cookies.remove('connect.sid');
        localStorage.setItem('profile', null)
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