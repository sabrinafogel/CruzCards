import React, { useEffect, useState } from "react";
import "./EditChapterPage.css";
import Navbar from "../components/Navbar";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BsFillExclamationSquareFill } from "react-icons/bs";

function EditChapterPage() {
  const { courseid, chapterindex } = useParams();
  const [noName, setNoName] = useState(false);
  const navigate = useNavigate();
  const nameCharlimit = 50;
  const descCharlimit = 250;

  const [inputvalues, setInputValues] = useState({
    name: "",
    description: "",
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

  useEffect(() => {
    const fetchCourseInfo = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/courseinfo?courseid=${encodeURIComponent(
            courseid
          )}`
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const course_info = await response.json();
        setInputValues({
          name: course_info.chapters[chapterindex].name,
          description: course_info.chapters[chapterindex].description || "",
        });
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchCourseInfo();
  }, [courseid, chapterindex]);

  const saveChapter = async (e) => {
    e.preventDefault();

    if (inputvalues.name.length <= 0) {
      return setNoName(true);
    }

    try {
      const response = await fetch("http://localhost:8080/editChapter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: courseid,
          index: chapterindex,
          name: inputvalues.name,
          description: inputvalues.description,
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
      <div>
        <div className="NewChapter">
          <div className="new-chapter-header">Edit a Chapter</div>

          <div className="name-and-tags">
            <input
              name="name"
              className="chapter-name-input"
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
            name="description"
            className="chapter-description"
            placeholder="Enter chapter description..."
            value={inputvalues.description}
            onChange={handleInputChange}
          ></textarea>
          <p>{inputvalues.description.length}/250</p>

          <div className="button-wrap">
            <button className="course-save" onClick={saveChapter}>
              Save
            </button>
            <Link to={`/courses/${courseid}`}>
              <button className="course-cancel">Cancel</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditChapterPage;
