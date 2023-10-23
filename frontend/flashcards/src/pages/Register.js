import React, { useEffect, useState } from "react";
import { UserAuth } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Register.css";

const SignIn = () => {
  const { user, emailSignUp } = UserAuth();
  const navigate = useNavigate();
  const [inputvalues, setinputvalues] = useState({
    input1: "",
    input2: "",
    input3: "",
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
    if (inputvalues.input3.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }
    emailSignUp(inputvalues.input1, inputvalues.input2, inputvalues.input3);
    console.log(inputvalues);
  };

  useEffect(() => {
    if (user != null) {
      navigate("/");
    }
  }, [user, navigate]);

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
            value={inputvalues.input1}
            onChange={handleInputChange}
            required
          ></input>
          <label className="email">Email</label>
          <input
            type="text"
            name="input2"
            className="input"
            placeholder="Email"
            value={inputvalues.input2}
            onChange={handleInputChange}
            required
          ></input>
          <label className="pass">Password</label>
          <input
            type="text"
            name="input3"
            className="input"
            placeholder="Password"
            value={inputvalues.input3}
            onChange={handleInputChange}
            required
            minLength={6}
          ></input>
          <input
            className="button-green"
            type="submit"
            value="Submit"
            onClick={handleSubmit}
            inputvalues={inputvalues}
          />
        </form>
      </div>
    </div>
  );
};

export default SignIn;
