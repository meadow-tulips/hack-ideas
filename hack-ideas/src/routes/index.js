import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Login from "../pages/login";
import Dashboard from "../pages/dashboard";
import { useContext, useMemo } from "react";
import { ProfileContext } from "../contexts/profileContext";
import Page404 from "../pages/404";
import TopNavigation from "../layouts/topNavigation";
import AddChallenge from "../pages/addChallenge";
import ChallengeDetails from "../pages/challengeDetails";

const PrivateWrapper = ({ isAuthenticated }) => {
    return isAuthenticated ?
        <TopNavigation>
            <Outlet />
        </TopNavigation> :
        <Navigate to="/login" />;
};

const AppRoutes = () => {
    const _profileContext = useContext(ProfileContext);
    const isAuthenticated = useMemo(() => _profileContext.profile.id, [_profileContext.profile]);
    return <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to={"/"} /> : <Login />} />
        <Route element={<PrivateWrapper isAuthenticated={isAuthenticated} />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/challenge/add" element={<AddChallenge />} />
            <Route path="/challenge/:id" element={<ChallengeDetails />} />
        </Route>
        <Route path="*" element={<Page404 />} />
    </Routes>
}

export default AppRoutes