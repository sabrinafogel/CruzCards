import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { db } from "../components/firebase_config";
import { collection, addDoc } from "firebase/firestore";
import { BsFillExclamationSquareFill } from "react-icons/bs";
import Navbar from "../components/Navbar";
import "./NewCourse.css";

function NewCourse() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [textAreaDisabled, setTextAreaDisabled] = useState(false);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [noName, setNoName] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const newName = event.target.value;
    if (newName.length <= 50) {
      setName(newName);
    } else {
      setInputDisabled(!inputDisabled);
    }
  };

  const handleDescriptionChange = (event) => {
    const newDescription = event.target.value;
    if (newDescription.length <= 250) {
      setDescription(newDescription);
    } else {
      setTextAreaDisabled(!textAreaDisabled);
    }
  };

  const handleSubmit = async (e) => {
    if (name.length <= 0) {
      return setNoName(true);
    }
    e.preventDefault();
    try {
      await addDoc(collection(db, "courses"), {
        name: name,
        description: description,
      });
    } catch (e) {
      console.error("Error adding document: ", e);
    }
    navigate("/");
  };

  return (
    <div className="course-page-wrapper">
      <Navbar />
      <div className="NewCourse">
        <h1 className="new-course-header">Create a New Course</h1>
        <input
          className="course-name-input"
          placeholder="Enter name..."
          value={name}
          onChange={handleInputChange}
          required
        />
        <p className="char-count">{name.length}/50</p>
        {noName ? (
          <div className="noName-error">
            <BsFillExclamationSquareFill />
            <p className="noName-text">Please enter a name...</p>
          </div>
        ) : null}
        <textarea
          value={description}
          onChange={handleDescriptionChange}
          className="course-description"
          placeholder="Enter description..."
        ></textarea>
        <p className="char-count">{description.length}/250</p>
        <div className="button-wrap">
          <button className="course-save" onClick={handleSubmit}>
            Save
          </button>
          <Link to="/">
            <button className="course-cancel">Cancel</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NewCourse;
