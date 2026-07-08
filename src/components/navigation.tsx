import { Link } from 'react-router-dom';
import logo from '../assets/weather_hail_64.svg';

export default function Navigation() {
    // We are using link as it's just updates status, and prevents browser from refreshing the page
    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <img src={logo} alt="Logo" width="64" height="64" className="d-inline-block align-text-top"></img>
                        <p className="navbar-brand" >Weather Controll</p>
                    </ul>
                    <ul className="navbar-nav">
                        <Link className="nav-link active" to="/">Home</Link>
                    </ul>
                    <ul className="navbar-nav">
                        <Link className="nav-link active" to="/user">User Management</Link>
                    </ul>
                    <ul className="navbar-nav">
                        <Link className="nav-link active" to="/temperature">Temperature Management</Link>
                    </ul>
                </div>
            </div>
        </nav>
    )
}