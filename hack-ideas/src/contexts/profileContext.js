import { createContext, useCallback, useState } from 'react';

const ProfileContext = createContext({
    profile: {},
    onLogin: () => {},
    onLogout: () => {}
});


const GlobalProfileContext = ({ children }) => {

    const [profile, updateProfile] = useState({ id: null });

    const onLogin = useCallback((val) => {
        updateProfile({ id: val})
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