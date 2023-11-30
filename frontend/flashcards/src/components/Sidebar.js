import React from "react";
import "./Sidebar.css";
import { Link } from "react-router-dom";
import { FaTimes } from "react-icons/fa";

function Sidebar({ menuStat, toggleMenu }) {
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
