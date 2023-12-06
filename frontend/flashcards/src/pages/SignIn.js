import React, { useEffect, useState } from "react";
import { GoogleButton } from "react-google-button";
import { UserAuth } from "../components/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import "./SignIn.css";

/**
 * SignIn.js
 * SignIn() displays the webpage for signing in as a returning user
 * @returns Sign In User page
 */
const SignIn = () => {
  // Initialize necessary variables
  const { user, googleSignIn, emailSignIn } = UserAuth();
  const navigate = useNavigate();

  const [inputValues, setinputvalues] = useState({
    input1: "",
    input2: "",
  });

  /**
   * SignIn.js
   * handleInputChange() is a method that changes the input values to an event target's value
   * @param {event} e
   * @returns None
   */
  const handleInputChange = (e) => {
    const value = e.target.value;
    //console.log(value);
    setinputvalues({
      ...inputValues,
      [e.target.name]: value,
    });
  };

  /**
   * SignIn.js
   * handleSubmit() is an asynchronous function that enters user information
   * @param {event} e
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    emailSignIn(inputValues.input1, inputValues.input2);
    // console.log(inputvalues);
  };

  /**
   * SignIn.js
   * handleGoogleSignIn() is an asynchronous function that uses Google's authentication to sign the user in
   * @param {event} e
   */
  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (user != null) {
      // Navigate to the homepage
      navigate("/");
    }
  }, [user, navigate]);

  // Return the Sign In page
  return (
    <div className="page-wrapper">
      <div className="Sign-in-container">
        <h1 className="signin-heading">Sign In</h1>
        <div className="input-container">
          <h1>Email</h1>
          <input
            type="text"
            name="input1"
            className="signin-input"
            placeholder="Email"
            value={inputValues.input1}
            onChange={handleInputChange}
            required
          ></input>
          <h1 className="pass">Password</h1>
          <input
            type="text"
            name="input2"
            className="signin-input"
            placeholder="Password"
            value={inputValues.input2}
            onChange={handleInputChange}
            required
          ></input>
          <input
            className="button-green"
            type="submit"
            value="Log In"
            onClick={handleSubmit}
            inputvalues={inputValues}
          />
          <Link className="link" to="/register-account">
            Register an account here!
          </Link>
          <GoogleButton className="Google" onClick={handleGoogleSignIn} />
        </div>
      </div>
    </div>
  );
};

export default SignIn;
