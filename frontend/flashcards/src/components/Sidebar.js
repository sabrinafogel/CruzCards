import React from "react";
import "./Sidebar.css";
import { Link } from "react-router-dom";
import { FaTimes } from "react-icons/fa";

/**
 * Sidebar.js
 * Sidebar() displays the sidebar with input from the parameters menuStat and toggleMenu
 * @param {*} menuStat, parameter from Navbar.js which represents the state of the menu
 * @param {*} toggleMenu, parameter from Navbar.js which represents the toggle state
 * @returns Sidebar
 */
function Sidebar({ menuStat, toggleMenu }) {
  // Returns the sidebar, opened or closed based on menuStat with two options: Home and Profile
  return (
    <div className={`Sidebar ${menuStat ? "SidebarOpened" : ""}`}>
      <ul>
        <li className="close-button">
          <button onClick={() => toggleMenu()} style={{ color: "red" }}>
            <FaTimes />
          </button>
        </li>
        <li>
          <Link to="/" onClick={() => toggleMenu()}>
            Home
          </Link>
        </li>
        <li>
          <Link to="/profile" onClick={() => toggleMenu()}>
            Profile
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
