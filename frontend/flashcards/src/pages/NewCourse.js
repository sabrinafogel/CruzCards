import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import { db } from "../components/firebase_config";
// import { collection, addDoc } from "firebase/firestore";
import { BsFillExclamationSquareFill } from "react-icons/bs";
import Navbar from "../components/Navbar";
import "./NewCourse.css";
import { UserAuth } from "../components/AuthContext";

function NewCourse() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [textAreaDisabled, setTextAreaDisabled] = useState(false);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [noName, setNoName] = useState(false);
  const { user } = UserAuth();
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

  const handleTagsChange = (e) => {
    if (e.key !== "Enter"){
      return;
    }
    const new_tag = e.target.value;
    if (!new_tag.trim()){
      return;
    }
    setTags([...tags, new_tag]);
    
    e.target.value="";
    
  };

  const removeTag = (index) => {
    setTags(tags.filter((el, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (name.length <= 0) {
      return setNoName(true);
    }

    try {
      console.log(user.email);
      const response = await fetch("http://localhost:8080/newcourse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          description: description,
          tags: tags,
          email: user.email,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      navigate("/");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="course-page-wrapper">
      <Navbar />
      <div className="NewCourse">
        <h1 className="new-course-header">Create a New Course</h1>
        <div className="name-and-tags">
          <input
            className="course-name-input"
            placeholder="Enter name..."
            value={name}
            onChange={handleInputChange}
            required
          />


          <div className="course-tag-name-input">
            {tags.map((tag, index) => (
              <div className="tag" key={index}>
                <span className="name">{tag}</span>
                <span className="delete-tag" onClick={() =>removeTag(index)}>&times;</span>
              </div>
            ))}
            <input
              className="tag-input"
              onKeyDown={handleTagsChange}
              placeholder="Enter tag">
            </input>
          </div>
        </div>
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
