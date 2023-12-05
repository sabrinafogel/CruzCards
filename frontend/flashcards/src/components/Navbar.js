import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { BiSolidUserCircle } from "react-icons/bi";
import { AiFillCaretDown } from "react-icons/ai";
import { UserAuth } from "./AuthContext";
import AccountDropDown from "./AccountDropDown";
import "./Navbar.css";
import Sidebar from "./Sidebar";

/**
 * Navbar.js
 * Navbar() displays the navbar
 * @returns Navbar
 */
const Navbar = () => {
  
  // Uses the UserAuth function from components/AuthContext to create user
  const { user } = UserAuth();

  // Creates two state variables using the useState hook:
  // 1.1 menuStat, which represents the state of the menu 
  // 1.2 menuStat can be changed with setMenuStat (default: false)
  // 2.1 dropDownVisible, which represents if the dropdown is visible
  // 2.2 dropDownVisible can be changed with setdropDownVisible (default: false)
  const [menuStat, setMenuStat] = useState(false);
  const [dropDownVisible, setdropDownVisible] = useState(false);

  /**
   * toggleMenu and handleDropdown do similar things: they change
   * their respective variables to the opposite boolean (true to false, etc.)
   * for menuStat and dropDownVisible
   */
  const toggleMenu = () => {
    setMenuStat(!menuStat);
    //console.log(!menuStat);
  };

  const handleDropdown = () => {
    setdropDownVisible(!dropDownVisible);
  };

  // Return a Navbar, top CruzCards logo, and user drop down
  return (
    <div>
      <div className="Sidebarcontainer">
        <Sidebar menuStat={menuStat} toggleMenu={toggleMenu} />
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
