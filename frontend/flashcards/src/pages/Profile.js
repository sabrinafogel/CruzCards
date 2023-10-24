import React, { useEffect, useRef, useState } from "react";
import { BsFillPencilFill, BsFillCheckCircleFill } from "react-icons/bs";
import { FaTimes } from "react-icons/fa";
import { UserAuth } from "../components/AuthContext";
import { Link } from "react-router-dom";
import "./Profile.css";

function Profile() {
  const { user, updateUserprofile } = UserAuth();
  const [isDisabled, setIsDisabled] = useState(true);
  const inputRef = useRef();

  const [inputvalue, setinputvalue] = useState("");

  const handleInputChange = (e) => {
    const value = e.target.value;
    console.log(value);
    setinputvalue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputvalue === "") {
      return;
    } else {
      updateUserprofile(inputvalue);
      setIsDisabled(!isDisabled);
    }
  };

  useEffect(() => {
    if (!isDisabled) {
      inputRef.current.focus();
      setinputvalue("");
    }
  }, [isDisabled]);

  return (
    <div className="page-wrapper">
      <div className="profile">
        <Link to="/">
          <button className="back-button"> Back </button>
        </Link>
        <h1 className="profile-heading">Profile </h1>
        <h1 className="username">Username:</h1>
        <div className="input-wrapper">
          {console.log(user)}
          {!isDisabled ? (
            <input
              className="profile-input"
              type="text"
              ref={inputRef}
              onChange={handleInputChange}
              onSubmit={handleSubmit}
            ></input>
          ) : (
            <input
              className="profile-input"
              type="text"
              disabled={isDisabled}
              placeholder={
                user.displayName === undefined ? "....." : `${user.displayName}`
              }
            ></input>
          )}
          <button
            className="edit-button"
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
      <button className="back-button"><Link to="/"> Back </Link></button>
    </div>
  );
}

export default Profile;
