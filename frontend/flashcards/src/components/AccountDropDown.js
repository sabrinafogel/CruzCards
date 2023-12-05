import React from "react";
import "./AccountDropDown.css";
import { UserAuth } from "./AuthContext";
import { Link } from "react-router-dom";

/**
 * AccountDropDown.js
 * AccountDropDown() displays the user's account dropdown field, which can either display:
 * 1. If the user is not logged in, the drop down will display a sign-in link
 * 2. If the user is logged in, the drop down will display a link to the profile section and a sign-out link
 * @returns None
 */
function AccountDropDown() {
  // Uses the UserAuth function from components/AuthContext to create user and logOut
  const { user, logOut } = UserAuth();

  /**
   * AccountDropDown.js
   * handleSignOut() is an asynchronous function that invokes the logOut() function from UserAuth()
   * @returns None
   */
  const handleSignOut = async () => {
    try {
      await logOut();
    } catch (error) {
      console.log(error);
    }
  };

  // Return a list of links/buttons as described in the AccountDropDown() DocString
  return (
    <ul className="List">
      {user === null ? (
        <Link to="/signin">
          <li className="List Item">Sign In</li>{" "}
        </Link>
      ) : (
        <div>
          <Link to="/profile"><li className="List Item">Profile</li></Link>
          <Link to="/"><button className="List Item" onClick={handleSignOut}>Sign Out</button></Link>
        </div>
      )}
    </ul>
  );
}

export default AccountDropDown;
