import { Link } from 'react-router-dom';
import logo from '../assets/dvr_128dp.png';

export default function Navigation() {
    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <img src={logo} alt="Logo" width="64" height="64" className="d-inline-block align-text-top"></img>
                        <p className="navbar-brand" >VP&T</p>
                    </ul>
                    <NavLink adress="/" text='Home' />
                    <NavLink adress="/user" text="User Managment" />
                    <NavLink adress="/games" text="Games" />
                    <NavLink adress='/import' text="CSV Import" />
                    <NavLink adress='http://localhost:8080/docs' text="API Docs" />
                </div>
            </div>
        </nav>
    )
}

function NavLink({ adress = '/', text = 'No Text Provided' }) {
    // We are using link as it's just updates status, and prevents browser from refreshing the page
    return (
        <ul className="navbar-nav">
            <Link className="nav-link active" to={adress}>{text}</Link>
        </ul>
    )
}