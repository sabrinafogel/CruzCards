import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { BiSolidUserCircle } from "react-icons/bi";
import { AiFillCaretDown } from "react-icons/ai";
import { UserAuth } from "./AuthContext";
import AccountDropDown from "./AccountDropDown";
import "./Navbar.css";

const Navbar = () => {
  const userIconRef = useRef(null);
  const { user } = UserAuth();
  const Sidebar = ({ open, toggleMenu }) => {
    return (
      <div className={open ? "SidebarOpened" : "SidebarHidden"}>
        <ul>
          <li>
            <button
              className="Close-button"
              onClick={toggleMenu}
              style={{ color: "red" }}
            >
              <FaTimes />
            </button>
          </li>
          <li>
            <Link to="/" onClick={() => toggleMenu(toggleMenu)}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/profile" onClick={() => toggleMenu(toggleMenu)}>
              Profile
            </Link>
          </li>
        </ul>
      </div>
    );
  };

  const [menuStat, setMenuStat] = useState(false);
  const [dropDownVisible, setdropDownVisible] = useState(false);

  const toggleMenu = () => {
    setMenuStat(!menuStat);
    //console.log(!menuStat);
  };

  const handleDropdown = () => {
    setdropDownVisible(!dropDownVisible);
  };

  return (
    <div>
      <div className="Sidebarcontainer">
        <Sidebar open={menuStat} toggleMenu={toggleMenu} />
      </div>

      <div className="NavContainer">
        <div className="MenuAndLogo">
          <button className="Menu" onClick={toggleMenu}>
            <FaBars />
          </button>

          <Link to="/">
            <h1 className="Cruz">CruzCards</h1>
          </Link>
        </div>
        {/* {console.log(user?.email)} */}

        <div className="userAndname-wrap" onClick={handleDropdown}>
          {user === undefined || user === null ? null : (
            <p className="navbar-username">{user.displayName}</p>
          )}

          <BiSolidUserCircle className="UserIcon" />
          <AiFillCaretDown className="expand-icon" />
          {dropDownVisible && (
            <div className="dropDownWrapper">
              <AccountDropDown />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
