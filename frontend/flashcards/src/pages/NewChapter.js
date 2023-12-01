import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { BsFillExclamationSquareFill } from "react-icons/bs";
import { FaTimes } from "react-icons/fa";
import "./NewChapter.css";

function NewChapter() {
  const { courseid } = useParams();
  const [noName, setNoName] = useState(false);
  const [tags, setTags] = useState([]);
  const nameCharlimit = 50;
  const descCharlimit = 250;
  const navigate = useNavigate();

  const [inputvalues, setInputValues] = useState({
    name: "",
    description: "",
    tags: [],
  });

  const handleInputChange = (e) => {
    const value = e.target.value;
    const overNameLimit =
      e.target.name === "name" && value.length <= nameCharlimit;
    const overDescLimit =
      e.target.name === "description" && value.length <= descCharlimit;
    if (overNameLimit || overDescLimit) {
      setInputValues({
        ...inputvalues,
        [e.target.name]: value,
      });
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
          tags: tags,
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
          <Link to={`/courses/${courseid}`}>
            <button className="course-cancel">Cancel</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NewChapter;
