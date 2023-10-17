import React, { useEffect, useState } from "react";
import { UserAuth } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";
import './Register.css'


const SignIn = () => {
  const { user, emailSignUp } = UserAuth();
  const navigate = useNavigate();
  const [inputValues, setInputValues] = useState({
    input1: "",
    input2: "",
    input3: ""
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
    if (inputValues.input3.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }
    emailSignUp(inputValues.input1,inputValues.input2, inputValues.input3)
    console.log(inputValues)
  }

  

  useEffect(() =>{
    if(user != null){
      navigate('/')
    }
  }, [user])

  return (
    <div>
      <h1 className="heading">Register</h1>
          <form className="input-container">

          <label>
            Full Name
            
          </label>
          <input
              type="text"
              name="input1"
              className='input'
              placeholder="Full Name"
              value={inputValues.input1}
              onChange={handleInputChange}
              required
            ></input>
          <label className="email">
            Email
           
          </label>
          <input
              type="text"
              name="input2"
              className='input'
              placeholder="Email"
              value={inputValues.input2}
              onChange={handleInputChange}
              required
            ></input>
          <label className="pass">
            Password
            
          </label>
          <input
              type="text"
              name="input3"
              className='input'
              placeholder="Password"
              value={inputValues.input3}
              onChange={handleInputChange}
              required
              minLength={6}
            ></input>
          <input className='button-green' type="submit" value="Submit" onClick={handleSubmit} inputValues={inputValues}/>
          </form>

    </div>
  );
};

export default SignIn;
