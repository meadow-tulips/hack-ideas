import { createContext, useCallback, useState } from 'react';
import API from '../config/apiConfig';
import Cookies from 'universal-cookie';
import { post, get } from '../utils';


const ProfileContext = createContext({
    profile: {},
    onLogin: () => {},
    onLogout: () => {}
});


const GlobalProfileContext = ({ children }) => {

    const [profile, updateProfile] = useState({ id: null  });

    const onLogin = useCallback((val) => {
        post({ url: API.USER, data: { id: val }})
        .then(res => {
            updateProfile({id: res.data.id });
            // const cookies = new Cookies();
            // cookies.set('sessionId', res.data.sessionId)
            return res;
        }).then((res) => get({ url: API.HOME }))

        // if(val === 'admin')
        //     updateProfile({ id: val})
    }, [updateProfile]);

    const onLogout = useCallback(() => {
        updateProfile({ id: null })
    }, [updateProfile])

    return <ProfileContext.Provider
               value={{
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