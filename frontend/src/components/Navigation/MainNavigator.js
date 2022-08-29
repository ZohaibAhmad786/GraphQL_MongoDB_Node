import React from 'react'
import { NavLink } from 'react-router-dom'
import "./MainNavigator.css"
export default function MainNavigator() {
    return (
        <header className="main-navigator-header">
            <div className="main-navigator-logo">
                <h1>EasyEvents</h1>
            </div>
            <nav className="main-navigator__items">
                <ul>
                    <li>
                        <NavLink to="/auth">Authenticate</NavLink>
                    </li>
                    <li>
                        <NavLink to="/events">Events</NavLink>
                    </li>
                    <li>
                        <NavLink to="/bookings">Bookings</NavLink>
                    </li>
                </ul>
            </nav>
        </header>
    )
}
