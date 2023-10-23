import React from "react";
import "./AccountDropDown.css";
import { UserAuth } from "./AuthContext";
import { Link } from "react-router-dom";

function AccountDropDown() {
  const { user, logOut } = UserAuth();

  const handleSignOut = async () => {
    try {
      await logOut();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ul className="List">
      {user === null ? (
        <Link to="/signin">
          <li className="List Item">Sign In</li>{" "}
        </Link>
      ) : (
        <div>
          
          <Link to="/profile"><li className="List Item">Profile</li></Link>
          <button className="List Item"onClick={handleSignOut}>Sign Out</button>
        </div>
      )}
    </ul>
  );
}

export default AccountDropDown;
