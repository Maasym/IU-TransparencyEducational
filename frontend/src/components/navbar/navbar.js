import React, {useState} from "react";
import {FaBars, FaTimes} from "react-icons/fa";
import './navbar.css'
import {Link} from "react-router-dom";

const Navbar = () => {
    const [nav, setNav] = useState(false)
    const handleNav = () => setNav(!nav)

    const handleLogout = () => {
        window.localStorage.removeItem('loggedUser')
        window.localStorage.removeItem('userID')
        window.localStorage.removeItem('role')
        window.localStorage.removeItem('token')
    }

    return(
        <div className='navbar'>
            <div className="container">
                <Link to='/dashboard' className='navTitle'>Transparency Educational</Link>
                <ul className={nav ? 'nav-menu active' : 'nav-menu'}>
                    <Link to='/createTicket' className='navbarLink'>create ticket</Link>
                    <Link to='/viewTickets' className='navbarLink'>view tickets</Link>
                    <Link to='/login' onClick={handleLogout} className='navbarLink'>Logout</Link>
                </ul>
                <div className="hamburger" onClick={handleNav}>
                    {nav ? (<FaTimes size={20} style={{color: '#ffffff'}}/>) : (<FaBars size={20}/>)}
                </div>
            </div>
        </div>
    )
}

export default Navbar