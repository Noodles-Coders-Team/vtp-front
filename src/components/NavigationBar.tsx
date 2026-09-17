import {Link} from 'react-router-dom';
import logo from '../assets/dvr_128dp.png';

export default function Navigation() {
    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary nav-scroller fixed-top shadow-sm">
            <div className="container-fluid">
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <img src={logo} alt="Logo" width="64" height="64" className="d-inline-block align-text-top"/>
                        <p className="navbar-brand">VT&P</p>
                    </ul>
                    <NavLink address="/" text='Home'/>
                    <NavLink address="/config" text="Configuration"/>
                    <NavLink address="/games" text="Games"/>
                    <NavLink address='/import' text="CSV Import"/>
                    <NavLink address='http://localhost:8080/docs' text="API Docs"/>
                    <NavLink address='/channel-data' text="Channel Data Graph"/>
                </div>
            </div>
        </nav>
    )
}

function NavLink({address = '/', text = 'No Text Provided'}) {
    // We are using link as it's just updates status, and prevents browser from refreshing the page
    return (
        <ul className="navbar-nav">
            <Link className="nav-link active" to={address}>{text}</Link>
        </ul>
    )
}