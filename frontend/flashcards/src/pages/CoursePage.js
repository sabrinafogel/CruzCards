import React, { useEffect, useState } from "react";
import "./CoursePage.css";
import Navbar from "../components/Navbar";
import { useParams, Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import { AiFillEdit } from "react-icons/ai";

function CoursePage() {
  const { courseid } = useParams();
  const [course_info, setCourseInfo] = useState([]);

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
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchCourseInfo();
  }, [courseid]);

  const chapters = course_info.chapters;

  return (
    <div>
      <Navbar />
      <div className="CourseHome">
        <div className="heading-wrapper">
          <h1 className="course-heading">{course_info.name}</h1>
          <div className="input-wrapper">
            <input className="search-input" placeholder="Search"></input>
          </div>
        </div>

        <button className="create-set">
          <div className="new-chapter-text">New Chapter</div>
          <div className="new-chapter-icon">
            <Link to={`/new-chapter/${courseid}`}>
              <FaPlus />
            </Link>
          </div>
        </button>

        <div>
          <ul>
            {chapters?.map((chapter, chapterindex) => (
              <div className="chapter-container">
                <Link
                  className="chapter-button"
                  to={`/courses/${courseid}/chapters/${chapterindex}`}
                >
                  <button className="chapters">
                    <h1>
                      Chapter {chapterindex + 1}: {chapter.name}
                    </h1>
                  </button>
                </Link>
                <Link
                  to={`/courses/${courseid}/chapters/${chapterindex}/chapter-edit`}
                >
                  <AiFillEdit className="course-edit-icon" />
                </Link>
              </div>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default CoursePage;
