import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { UserAuth } from "./AuthContext";
import {FaBars, FaTimes} from "react-icons/fa";
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

  const Sidebar = ({open, toggleMenu}) => {
    return (
        <div className={open ? "SidebarOpened" : "SidebarHidden"}>
            <ul>
              <li>
                <button onClick={toggleMenu} style={{ color: 'red'}}>
                  <FaTimes/>
                </button>
              </li>
                <li><Link to="/">Home</Link></li>
                <li>Other</li>
            </ul>
        </div>
    );
  } 

  const [menuStat, setMenuStat] = useState(false);

  const toggleMenu = () => {
      setMenuStat(!menuStat);
      console.log(!menuStat);
  }

  return (
    <div className="NavContainer">
      <div className="MenuAndLogo">

        {!menuStat ? (
          <button className="Menu" onClick={toggleMenu}><FaBars/></button>
          ) : (
          <Sidebar open={menuStat} toggleMenu={toggleMenu} />
          )}

        <Link to="/">
          <h1 className="Cruz">
            CruzCards
          </h1>
        </Link>
      </div>
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
