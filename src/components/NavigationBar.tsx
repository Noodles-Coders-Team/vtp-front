import logo from '@assets/dvr_128dp.png';
import {authClient, authClientSignOut} from "@api/AuthApi.ts";
import {NavLink} from "@commonComponents/NavLink.tsx";
import {ShowAdminOnly} from "@commonComponents/ShowAdminOnly.tsx";
import Button from "@commonComponents/Button.tsx";
import {ButtonType} from "@/enum/ButtonType.ts";
import {BACKEND_URL} from "@api/BackendUrl.ts";


export default function Navigation() {
    const {data} = authClient.useSession();

    return (
        <nav className="navbar sm:navbar-expand bg-1 fg-2">
            <div className="container-fluid">
                <div className="navbar-brand">
                    <img src={logo} alt="Logo" width="30" height="30"
                         className="d-inline-block align-text-top"/>
                    VT&P
                </div>
                <dialog className="drawer drawer-end" tabIndex={-1} id="navbarNav" aria-labelledby="navbarNavLabel">
                    <div className="drawer-body">
                        <ul className="navbar-nav">
                            <NavLink address="/" text='Home'/>
                            <NavLink address="/games" text="Games"/>
                            <NavLink address="/steam-global-search" text="Steam App Filter"/>
                            <NavLink address="/steam-user-search" text="Steam App User Filter"/>
                            {/*<NavLink address='/import' text="CSV Import"/>*/}
                            <ShowAdminOnly>
                                <NavLink address="/config" text="Configuration"/>
                                <NavLink address={`${BACKEND_URL}/docs`} text="API Docs"/>
                            </ShowAdminOnly>
                            {/*TODO: add right alignment*/}
                            <div className="d-flex" style={{marginLeft: 'auto', marginRight: '10px'}}>
                                <span className="navbar-text">
                                        {data?.user.name ?? 'LOADING'}
                                </span>
                                <Button style={{marginLeft: '15px'}}
                                        type={ButtonType.SECONDARY}
                                        onClick={() => {
                                            authClientSignOut().then()
                                        }}
                                        label="Log Out"
                                />
                            </div>
                        </ul>
                    </div>
                </dialog>
            </div>
        </nav>
    )
}


