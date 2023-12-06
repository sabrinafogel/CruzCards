import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import { db } from "../components/firebase_config";
// import { collection, addDoc } from "firebase/firestore";
import { BsFillExclamationSquareFill } from "react-icons/bs";
import Navbar from "../components/Navbar";
import "./NewCourse.css";
import { UserAuth } from "../components/AuthContext";
import { FaTimes } from "react-icons/fa";

/**
 * NewCourse.js
 * NewCourse() displays the webpage for creating a new course
 * @returns NewCourse page
 */
function NewCourse() {
  // Initialize necessary variables
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [editors, setEditors] = useState([]);
  const [textAreaDisabled, setTextAreaDisabled] = useState(false);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [noName, setNoName] = useState(false);
  const { user } = UserAuth();
  const navigate = useNavigate();

  /**
   * NewCourse.js
   * handleInputChange() is a method that changes the course name to an event target's value
   * @param {event} e
   * @returns None
   */
  const handleInputChange = (event) => {
    // Get the value and store it in newName
    const newName = event.target.value;

    // Check to make sure newName's length is within the character limit for names
    // If it is, change the name accordingly. If not, do nothing
    if (newName.length <= 50) {
      setName(newName);
    } else {
      setInputDisabled(!inputDisabled);
    }
  };

  /**
   * NewCourse.js
   * handleDescriptionChange() is a method that changes the course description to an event target's value
   * @param {event} e
   * @returns None
   */
  const handleDescriptionChange = (event) => {
    // Get the value and store it in newDescription
    const newDescription = event.target.value;

    // Check to make sure newDescription's length is within the character limit for descriptions
    // If it is, change the description accordingly. If not, do nothing
    if (newDescription.length <= 250) {
      setDescription(newDescription);
    } else {
      setTextAreaDisabled(!textAreaDisabled);
    }
  };

  /**
   * NewCourse.js
   * handleTagsChange() is a method that changes the course tags to an event target's value
   * @param {event} e
   * @returns None
   */
  const handleTagsChange = (e) => {
    if (e.key !== "Enter") {
      return;
    }

    // Get the tag from e's target
    const newTag = e.target.value;

    // Check to make sure there is actual content within new_tag
    if (!newTag.trim()) {
      return;
    }

    // Append new_tag to setTags and reset e's target value
    setTags([...tags, newTag]);
    e.target.value = "";
  };

  /**
   * NewCourse.js
   * handleEditorsChange() is a method that changes the course editors to an event target's value
   * @param {event} e
   * @returns None
   */
  const handleEditorsChange = (e) => {
    if (e.key !== "Enter") {
      return;
    }

    // Get the value from e's target
    const newEditor = e.target.value;

    // Check to make sure there is content within new_editor
    if (!newEditor.trim()) {
      return;
    }

    // Append new_editor to setEditors and reset e's target value
    setEditors([...editors, newEditor]);
    e.target.value = "";
  };

  // Remove a tag using a given index by filtering for all tags except the tag at index
  const removeTag = (index) => {
    setTags(tags.filter((el, i) => i !== index));
  };

  // Remove an  editor using a given index by filtering for all editors except the editor at index
  const removeEditor = (index) => {
    setEditors(editors.filter((el, i) => i !== index));
  };

  /**
   * NewCourse.js
   * handleSubmit() is an asynchronous function that saves course information
   * @param {event} e
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // If there is no name, then return true for NoName
    if (name.length <= 0) {
      return setNoName(true);
    }

    try {
      //console.log(user.email);
      const response = await fetch("http://localhost:8080/newcourse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          description: description,
          tags: tags,
          editors: editors,
          email: user.email,
          privacy: false,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // Return to the homepage
      navigate("/");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Returns a NewCourse page
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
      <div className="course-tag-name-input">
        {tags.map((tag, index) => (
          <div className="tag" key={index}>
            <span className="name">{tag}</span>
            <span className="delete-tag" onClick={() => removeTag(index)}>
              <FaTimes className="delete-icon" />
            </span>
          </div>
        ))}
        <input
          className="tag-input"
          onKeyDown={handleTagsChange}
          placeholder="Enter tag"
        ></input>
      </div>

      <div className="course-tag-name-input">
        {editors.map((editors, index) => (
          <div className="tag" key={index}>
            <span className="name">{editors}</span>
            <span className="delete-tag" onClick={() => removeEditor(index)}>
              <FaTimes className="delete-icon" />
            </span>
          </div>
        ))}
        <input
          className="tag-input"
          onKeyDown={handleEditorsChange}
          placeholder="Add an Editor's Email"
        ></input>
      </div>
    </div>
  );
}

export default NewCourse;
