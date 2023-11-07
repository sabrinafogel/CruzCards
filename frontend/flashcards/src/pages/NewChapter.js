import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { BsFillExclamationSquareFill } from "react-icons/bs";
import "./NewChapter.css";

function NewChapter() {
  const { courseid } = useParams();

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
    e.preventDefault();

    if (name.length <= 0) {
      return setNoName(true);
    }

    try {
      const response = await fetch("http://localhost:8080/newchapter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseid: courseid,
          name: name,
          description: description,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      navigate(`/courses/${courseid}`);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="NewChapter">
        <div className="new-chapter-header">Create a New Chapter</div>

        <div className="name-and-tags">
          <input
            className="chapter-name-input"
            placeholder="Enter chapter name..."
            value={name}
            onChange={handleInputChange}
            required
          />
        </div>

        {noName ? (
          <div className="noName-error">
            <BsFillExclamationSquareFill />
            <p className="noName-text">Please enter a name...</p>
          </div>
        ) : null}

        <textarea
          className="chapter-description"
          placeholder="Enter chapter description..."
          value={description}
          onChange={handleDescriptionChange}
        ></textarea>

        <div className="button-wrap">
          <button className="course-save" onClick={handleSubmit}>
            Save
          </button>
          <Link to={`/courses/${courseid}`}>
            <button className="course-cancel">Cancel</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NewChapter;
