import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { BsFillExclamationSquareFill } from "react-icons/bs";
import "./NewChapter.css";

function NewChapter() {
  const { courseid } = useParams();
  const [noName, setNoName] = useState(false);
  const nameCharlimit = 50;
  const descCharlimit = 250;
  const navigate = useNavigate();

  const [inputvalues, setInputValues] = useState({
    name: "",
    description: "",
    course_tags: "",
    chapter_tags: "",
  });

  const handleInputChange = (e) => {
    const value = e.target.value;
    const overNameLimit =
      e.target.name === "name" && value.length <= nameCharlimit;
    const overDescLimit =
      e.target.name === "description" && value.length <= descCharlimit;
    const isTag =
      e.target.name === "course_tags" || e.target.name === "chapter_tags";
    if (overNameLimit || overDescLimit || isTag) {
      setInputValues({
        ...inputvalues,
        [e.target.name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (inputvalues.name.length <= 0) {
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
          name: inputvalues.name,
          description: inputvalues.description,
          course_tags: inputvalues.course_tags,
          chapter_tags: inputvalues.chapter_tags,
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
            name="name"
            placeholder="Enter chapter name..."
            value={inputvalues.name}
            onChange={handleInputChange}
            required
          />

          <input
            className="course-tag-name-input"
            name="course_tags"
            placeholder="Enter course tag..."
            value={inputvalues.course_tags}
            onChange={handleInputChange}
            required
          />
          <input
            className="chapter-tag-name-input"
            name="chapter_tags"
            placeholder="Enter chapter tag..."
            value={inputvalues.chapter_tags}
            onChange={handleInputChange}
            required
          />
        </div>
        <p>{inputvalues.name.length}/50</p>

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
          value={inputvalues.description}
          onChange={handleInputChange}
        ></textarea>

        <p>{inputvalues.description.length}/250</p>

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
