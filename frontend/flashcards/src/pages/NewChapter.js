import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { BsFillExclamationSquareFill } from "react-icons/bs";
import { FaTimes } from "react-icons/fa";
import "./NewChapter.css";

/**
 * NewChapter.js
 * NewChapter() displays the webpage for creating a new chapter
 * @returns NewChapter page
 */
function NewChapter() {
  // Gets these params from the url
  const { courseid: courseId } = useParams();

  // Initialize necessary variables, including character limits for Chapter names and descriptions
  const [noName, setNoName] = useState(false);
  const [tags, setTags] = useState([]);
  const nameCharlimit = 50;
  const descCharlimit = 250;
  const navigate = useNavigate();

  // Initialize input values using React's useState hook
  const [inputValues, setInputValues] = useState({
    name: "",
    description: "",
    tags: [],
  });

  /**
   * NewChapter.js
   * handleInputChange() is a method that changes the chapter name and/or description to an event target's value
   * @param {event} e
   * @returns None
   */
  const handleInputChange = (e) => {
    // Get the value from e's target
    const value = e.target.value;

    // Checks the type and length of the value's name
    const overNameLimit =
      e.target.name === "name" && value.length <= nameCharlimit;

    // Checks the type and length of the value's description
    const overDescLimit =
      e.target.name === "description" && value.length <= descCharlimit;

    // Set values according to the changed values if the values pass the above tests
    if (overNameLimit || overDescLimit) {
      setInputValues({
        ...inputValues,
        [e.target.name]: value,
      });
    }
  };

  /**
   * NewChapter.js
   * handleTagsChange() is a method that changes the chapter tags to an event target's value
   * @param {event} e
   * @returns None
   */
  const handleTagsChange = (e) => {
    if (e.key !== "Enter") {
      return;
    }

    // Get the value from e's target
    const newTag = e.target.value;
    if (!newTag.trim()) {
      return;
    }

    // Add new_tag to setTags
    setTags([...tags, newTag]);

    // Reset e's target value
    e.target.value = "";
  };

  // Remove a tag using a given index by filtering for all tags except the tag at index
  const removeTag = (index) => {
    setTags(tags.filter((el, i) => i !== index));
  };

  /**
   * NewChapter.js
   * handleSubmit() is an asynchronous function that saves chapter information
   * @param {event} e
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // If there is no name, then return true for NoName
    if (inputValues.name.length <= 0) {
      return setNoName(true);
    }

    try {
      const response = await fetch("http://localhost:8080/newchapter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseid: courseId,
          name: inputValues.name,
          description: inputValues.description,
          tags: tags,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // Return to the course page for courseid
      navigate(`/courses/${courseId}`);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Returns a NewChapter page
  return (
    <div>
      <Navbar />
      <div className="NewChapter">
        <div className="new-chapter-header">Create a New Chapter</div>

        <div className="name-and-tags">
          <input
            className="chapter-name-input"
            name="name"
            placeholder="Enter chapter name..."
            value={inputValues.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <p>{inputValues.name.length}/50</p>

        {noName ? (
          <div className="noName-error">
            <BsFillExclamationSquareFill />
            <p className="noName-text">Please enter a name...</p>
          </div>
        ) : null}

        <textarea
          className="chapter-description"
          name="description"
          placeholder="Enter chapter description..."
          value={inputValues.description}
          onChange={handleInputChange}
        ></textarea>

        <p>{inputValues.description.length}/250</p>

        <div className="chapter-tag-name-input">
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

        <div className="button-wrap">
          <button className="course-save" onClick={handleSubmit}>
            Save
          </button>
          <Link to={`/courses/${courseId}`}>
            <button className="course-cancel">Cancel</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NewChapter;
