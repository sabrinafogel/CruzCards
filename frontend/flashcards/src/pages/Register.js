import React, { useEffect, useState } from "react";
import { UserAuth } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Register.css";

/**
 * Register.js
 * SignIn() displays the webpage for registering as a new user
 * @returns Register User page
 */
const SignIn = () => {
  // Initialize necessary variables
  const { user, emailSignUp } = UserAuth();
  const navigate = useNavigate();
  const [inputValues, setinputvalues] = useState({
    input1: "",
    input2: "",
    input3: "",
  });

  /**
   * Register.js
   * handleInputChange() is a method that changes the input values to an event target's value
   * @param {event} e
   * @returns None
   */
  const handleInputChange = (e) => {
    const value = e.target.value;
    // console.log(value);
    setinputvalues({
      ...inputValues,
      [e.target.name]: value,
    });
  };

  /**
   * Register.js
   * handleSubmit() is an asynchronous function that saves user information
   * @param {event} e
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    // If the password is too short, alert the user and return
    if (inputValues.input3.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    // Send input values into emailSignUp
    emailSignUp(inputValues.input1, inputValues.input2, inputValues.input3);
    // console.log(inputvalues);
  };

  useEffect(() => {
    if (user != null) {
      // Navigate to the homepage
      navigate("/");
    }
  }, [user, navigate]);

  // Return the Register page
  return (
    <div className="page-wrapper">
      <div className="Register-in-container">
        <h1 className="heading">Register</h1>
        <form className="input-container">
          <label>Full Name</label>
          <input
            type="text"
            name="input1"
            className="input"
            placeholder="Full Name"
            value={inputValues.input1}
            onChange={handleInputChange}
            required
          ></input>
          <label className="email">Email</label>
          <input
            type="text"
            name="input2"
            className="input"
            placeholder="Email"
            value={inputValues.input2}
            onChange={handleInputChange}
            required
          ></input>
          <label className="pass">Password</label>
          <input
            type="text"
            name="input3"
            className="input"
            placeholder="Password"
            value={inputValues.input3}
            onChange={handleInputChange}
            required
            minLength={6}
          ></input>
          <input
            className="button-green"
            type="submit"
            value="Submit"
            onClick={handleSubmit}
            inputvalues={inputValues}
          />
        </form>
      </div>
    </div>
  );
};

export default SignIn;
