import React from "react";
import { Link } from "react-router-dom";
import { UserAuth } from "./AuthContext";
import './Navbar.css'

const Navbar = () => {
  const { user, logOut } = UserAuth();

  const handleSignOut = async () =>{
    try{
      await logOut()
    } catch(error) {
      console.log(error)
    }
  }

  return (
    <div className="NavContainer">
      <Link to="/">
        <h1 className="Cruz">
          CruzCards
        </h1>
      </Link>
      {console.log(user?.email)}
      {user?.email ? (
        <button className='sign-out' onClick={handleSignOut}>Sign Out</button>
      ) : (
        <Link to="/signin">
          <h1 className="sign-in">
            Sign In
          </h1>
        </Link>
      )}
    </div>
  );
};

export default Navbar;
