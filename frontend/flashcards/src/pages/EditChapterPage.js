import React, { useEffect, useState } from "react";
import "./EditChapterPage.css";
import Navbar from "../components/Navbar";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BsFillExclamationSquareFill } from "react-icons/bs";

function EditChapterPage() {
  const { courseid, chapterindex } = useParams();
  const [course_info, setCourseInfo] = useState([]);
  const [noName, setNoName] = useState(false);
  const [chapterName, setChapterName] = useState("");
  const navigate = useNavigate();
  const [inputvalues, setInputValues] = useState({
    name: "",
    description: "",
    course_tags: "",
    chapter_tags: "",
  });

  const handleInputChange = (e) => {
    const value = e.target.value;
    console.log(value);
    setInputValues({
      ...inputvalues,
      [e.target.name]: value,
    });
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
        setCourseInfo(course_info);
        setInputValues({
          name: course_info.chapters[chapterindex].name,
          description: course_info.chapters[chapterindex].description,
          course_tags: course_info.chapters[chapterindex].course_tags,
          chapter_tags: course_info.chapters[chapterindex].chapter_tags,
        });
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchCourseInfo();
  }, [courseid]);

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
      <div>
        <div className="NewChapter">
          <div className="new-chapter-header">Create a New Chapter</div>

          <div className="name-and-tags">
            <input
              name="name"
              className="chapter-name-input"
              placeholder="Enter chapter name..."
              value={inputvalues.name}
              onChange={handleInputChange}
              required
            />

            <input
              name="course_tags"
              className="course-tag-name-input"
              placeholder="Enter course tag..."
              value={inputvalues.course_tags}
              onChange={handleInputChange}
              required
            />
            <input
              name="chapter_tags"
              className="chapter-tag-name-input"
              placeholder="Enter chapter tag..."
              value={inputvalues.chapter_tags}
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
            name="description"
            className="chapter-description"
            placeholder="Enter chapter description..."
            value={inputvalues.description}
            onChange={handleInputChange}
          ></textarea>

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
