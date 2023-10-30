import React, { useState } from "react";
import "./CoursePage.css";
import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import { Link } from "react-router-dom";

function CoursePage() {
  const { courseid } = useParams();
  const [course_info, setCourseInfo] = useState([]);

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
            {chapters?.map((chapters, index) => (
              <button className="chapters" key={index}>
                <h1>
                  Chapter {index + 1}: {chapters.name}
                </h1>
              </button>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default CoursePage;
