import logo from '@assets/dvr_128dp.png';
import {authClient, authClientSignOut} from "@api/AuthApi.ts";
import {NavLink} from "@commonComponents/NavLink.tsx";
import {UserRoles} from "@nct/vtp-common";


export default function Navigation() {
    const {data} = authClient.useSession();

    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary nav-scroller fixed-top shadow-sm">
            <div className="container-fluid">
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <img src={logo} alt="Logo" width="64" height="64" className="d-inline-block align-text-top"/>
                        <p className="navbar-brand">VT&P</p>
                    </ul>
                    <NavLink address="/" text='Home'/>
                    <NavLink address="/games" text="Games"/>
                    <NavLink address="/steam-global-search" text="Steam App Filter"/>
                    {/*Display only do admin*/}
                    {/*<NavLink address='/import' text="CSV Import"/>*/}
                    {data?.user.role == UserRoles.Admin && <>
                        <NavLink address="/config" text="Configuration"/>
                        <NavLink address='http://localhost:8080/docs' text="API Docs"/>
                    </>
                    }
                    <div style={{marginLeft: 'auto', marginRight: '10px'}}>
                        <span className="navbar-text">
                                {data?.user.name ?? 'LOADING'}
                        </span>
                        <button className="btn btn-outline-secondary" style={{marginLeft: '15px'}}
                                onClick={() => {
                                    authClientSignOut().then()
                                }}>Log Out
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    )
}