import {Link} from "react-router-dom";

export function NavLink({address = '/', text = 'No Text Provided'}) {
    // We are using link as it's just updates status, and prevents browser from refreshing the page
    return (
        <ul className="navbar-nav">
            <Link className="nav-link active" to={address}>{text}</Link>
        </ul>
    )
}