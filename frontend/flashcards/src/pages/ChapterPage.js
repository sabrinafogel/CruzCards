import React, { useState, useEffect } from "react";
import "./ChapterPage.css";
import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import { Link } from "react-router-dom";

function ChapterPage() {
  const { courseid, chapterIndex } = useParams();
  const [course_info, setCourseInfo] = useState([]);

  const fetchCourseInfo = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/courseinfo?courseid=${encodeURIComponent(courseid)}`
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const course_info = await response.json();
      setCourseInfo(course_info);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  useEffect(() => {
    fetchCourseInfo();
  }, [courseid]);

  if (!course_info || !course_info.chapters) {
    return (
      <div>
        <Navbar />
        <div className="ChapterPage">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const chapters = course_info.chapters;
  const currentChapter = chapters[chapterIndex];

  return (
    <div>
      <Navbar />
      <div className="ChapterPage">
        <div className="heading-wrapper">
          <h1 className="course-heading">
            {currentChapter ? `Chapter ${parseInt(chapterIndex) + 1}: ${currentChapter.name}` : "Loading..."}
          </h1>
          <div className="input-wrapper">
            <input className="search-input" placeholder="Search" />
          </div>
        </div>

        <button className="create-set">
          <div className="new-set-text">New Set</div>
          <div className="new-set-icon">
            <Link to={`/new-set`}>
              <FaPlus />
            </Link>
          </div>
        </button>
      </div>

      <div className="setDisplay">
        <ul>
          {chapters?.map((chapter, index) => (
            <div key={index}>
              {console.log(chapter.sets)}
              {chapter.sets?.map((set, setIndex) => (
                <Link
                  key={setIndex}
                  to={`/courses/${courseid}/${chapterIndex}/${setIndex}`}
                >
                  <h1 key={setIndex}>
                    <ul className="sets">{set.name}</ul>
                  </h1>
                </Link>
              ))}
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ChapterPage;
