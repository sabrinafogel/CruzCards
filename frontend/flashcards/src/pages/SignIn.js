import React, { useEffect, useState } from "react";
import { GoogleButton } from "react-google-button";
import { UserAuth } from "../components/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import './SignIn.css'


const SignIn = () => {
  const { user, googleSignIn, emailSignIn} = UserAuth();
  const navigate = useNavigate();

  const [inputValues, setInputValues] = useState({
    input1: "",
    input2: "",
  });

  const handleInputChange = (e) => {
    const value = e.target.value
    console.log(value)
    setInputValues({
      ...inputValues,
      [e.target.name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    emailSignIn(inputValues.input1, inputValues.input2)
    console.log(inputValues)
  }

  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() =>{
    if(user != null){
      navigate('/')
    }
  }, [user])
  return (
    <div>
      <h1 className="heading">Sign In</h1>
        <div className="input-container">
          <h1>
            Email
           
          </h1>
          <input
              type="text"
              name="input1"
              className='input'
              placeholder="Email"
              value={inputValues.input1}
              onChange={handleInputChange}
              required
            ></input>
          <h1 className="pass">
            Password
            
          </h1>
          <input
              type="text"
              name="input2"
              className='input'
              placeholder="Password"
              value={inputValues.input2}
              onChange={handleInputChange}
              required
            ></input>
          <input className='button-green' type="submit" value="Log In" onClick={handleSubmit} inputValues={inputValues}/>
          <Link className="link" to="/register-account">
            <a className="register">
              Register an account here!
            </a>

          </Link>
        <GoogleButton className="Google" onClick={handleGoogleSignIn} />
      </div>
    </div>
  );
};

export default SignIn;
