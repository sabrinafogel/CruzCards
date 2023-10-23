import React, { useEffect, useState } from "react";
import { GoogleButton } from "react-google-button";
import { UserAuth } from "../components/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import "./SignIn.css";

const SignIn = () => {
  const { user, googleSignIn, emailSignIn } = UserAuth();
  const navigate = useNavigate();

  const [inputvalues, setinputvalues] = useState({
    input1: "",
    input2: "",
  });

  const handleInputChange = (e) => {
    const value = e.target.value;
    console.log(value);
    setinputvalues({
      ...inputvalues,
      [e.target.name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    emailSignIn(inputvalues.input1, inputvalues.input2);
    console.log(inputvalues);
  };

  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (user != null) {
      navigate("/");
    }
  }, [user, navigate]);
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
            value={inputvalues.input1}
            onChange={handleInputChange}
            required
          ></input>
          <h1 className="pass">Password</h1>
          <input
            type="text"
            name="input2"
            className="signin-input"
            placeholder="Password"
            value={inputvalues.input2}
            onChange={handleInputChange}
            required
          ></input>
          <input
            className="button-green"
            type="submit"
            value="Log In"
            onClick={handleSubmit}
            inputvalues={inputvalues}
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
