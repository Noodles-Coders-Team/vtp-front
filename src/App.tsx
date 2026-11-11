import {Navigate, Route, Routes} from 'react-router-dom';
import {useEffect} from 'react';
import GamesPage from './pages/GamesPage';
import HomePage from './pages/HomePage';
import Navigation from './components/NavigationBar';
import AdminPage from './pages/AdminPage.tsx';
import UserLoginPage from "@/pages/UserLoginPage.tsx";
import {LoadingComponent} from "@commonComponents/ItemLoadingErrorState.tsx";
import {authClient} from "@api/AuthApi.ts";
import {appDisplayStyle} from "@/style/appDisplayStyle.ts";
import SteamAppGlobalSearchPage from "@/pages/SteamAppGlobalSearchPage.tsx";
import {UserRoles} from "@nct/vtp-common";


function App() {
    //const {data, isPending, error, refetch} = authClient.useSession();
    const {data, isPending, error} = authClient.useSession();

    useEffect(() => {
        document.title = "Video Tracker & Planner";
    });


    if (error) {
        console.error(error);
    }


    if (isPending) {
        return (
            <LoadingComponent/>
        );
    }


    if (data == null || data.user == null) {
        // Redirect to auth
        return (
            <>
                <Navigate to="/auth" replace/>
                <Routes>
                    <Route path="/auth" element={<UserLoginPage/>}/>
                </Routes>
            </>
        )
    }

    return (
        <>
            <div>
                <Navigation/>
            </div>
            <div style={appDisplayStyle}>
                <Routes>
                    <Route path="/" element={<HomePage/>}/>
                    {/*<Route path="/import" element={<ImportPage/>}/>*/}
                    <Route path="/games" element={<GamesPage/>}/>
                    <Route path="/steam-global-search" element={<SteamAppGlobalSearchPage/>}/>
                    {data.user.role == UserRoles.Admin &&
                        <Route path="/config" element={<AdminPage/>}/>
                    }
                    <Route path="*" element={<Navigate to="/" replace/>}/>
                </Routes>
            </div>
        </>
    )
}


export default App;