import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Login from "../pages/login";
import Dashboard from "../pages/dashboard";
import { useContext, useMemo } from "react";
import { ProfileContext } from "../contexts/profileContext";

const PrivateWrapper = ({ isAuthenticated }) => {
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

const AppRoutes = () => {
    const _profileContext = useContext(ProfileContext);
    const isAuthenticated = useMemo(() => _profileContext.profile.id, [_profileContext.profile]);

    return <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to={"/"} /> : <Login />} />
        <Route element={<PrivateWrapper isAuthenticated={isAuthenticated} />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
        </Route>
    </Routes>
}

export default AppRoutes