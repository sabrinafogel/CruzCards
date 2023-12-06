import React, { useEffect, useRef, useState } from "react";
import { BsFillPencilFill, BsFillCheckCircleFill } from "react-icons/bs";
import { FaTimes } from "react-icons/fa";
import { UserAuth } from "../components/AuthContext";
import { Link } from "react-router-dom";
import "./Profile.css";

/**
 * Profile.js
 * Profile() displays the user's profile page, with modifiable username
 * @returns Profile page
 */
function Profile() {
  // Initialize necessary variables
  const { user, updateUserProfile } = UserAuth();
  const [isDisabled, setIsDisabled] = useState(true);
  const inputRef = useRef();

  const [inputvalue, setinputvalue] = useState(user.displayName);

  /**
   * Profile.js
   * handleInputChange() is a method that changes the input value to an event target's value
   * @param {event} e
   * @returns None
   */
  const handleInputChange = (e) => {
    const value = e.target.value;
    // console.log(value);
    setinputvalue(value);
  };

  /**
   * Profile.js
   * handleSubmit() is a method that handles updates to the user's profile based on an input value
   * @param {event} e
   * @returns None
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    // If there is no input value, return.
    // Otherwise, update user profile accordingly
    if (inputvalue === "") {
      return;
    } else {
      updateUserProfile(inputvalue);
      setIsDisabled(!isDisabled);
    }
  };

  useEffect(() => {
    if (!isDisabled) {
      inputRef.current.focus();
    }
  }, [isDisabled]);

  useEffect(() => {
    setinputvalue(user.displayName);
  }, [user]);

  // Returns Profile page
  return (
    <div className="page-wrapper">
      <div className="profile">
        <Link to="/">
          <button className="back-button"> Back </button>
        </Link>
        <h1 className="profile-heading">Profile </h1>
        <h1 className="username">Username:</h1>
        <div className="profile-input-wrapper">
          {console.log(user)}
          <input
            className="profile-input"
            type="text"
            ref={inputRef}
            value={inputvalue}
            disabled={isDisabled}
            onChange={handleInputChange}
            onSubmit={handleSubmit}
          ></input>
          <button
            className="profile-edit-button"
            onClick={() => setIsDisabled(!isDisabled)}
          >
            {isDisabled ? <BsFillPencilFill /> : <FaTimes />}
          </button>
          {isDisabled ? null : (
            <button className="submit-button" onClick={handleSubmit}>
              <BsFillCheckCircleFill />
            </button>
          )}
        </div>
        <h1 className="username">Email:</h1>
        <h1 className="email">
          {user.email === undefined ? "....." : `${user.email}`}
        </h1>
      </div>
    </div>
  );
}

export default Profile;
