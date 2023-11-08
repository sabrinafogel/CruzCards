import React, { useEffect, useState } from "react";
import "./CoursePage.css";
import Navbar from "../components/Navbar";
import { useParams, Link } from "react-router-dom";
import { FaPlus, FaAngleLeft } from "react-icons/fa6";
import { AiFillEdit } from "react-icons/ai";
import { FaAngleRight } from "react-icons/fa";

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
        <button className="back-nav">
          <Link to={`/`}>
            <FaAngleLeft />
          </Link>
        </button>
        <div className="Link-wrapper">
          <Link className="Link-tree" to={`/`}>
            <p>Courses</p>
          </Link>
          <FaAngleRight className="angle-right" />
          <div className="Link-current">
            <p className="Link-current">{course_info.name}</p>
          </div>
        </div>

        <div className="heading-wrapper">
          <h1 className="course-heading">{course_info.name}</h1>
          <div className="input-wrapper">
            <input className="search-input" placeholder="Search"></input>
          </div>
        </div>

        {course_info.description ? (
          <p className="description">{course_info.description}</p>
        ) : null}

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
                  <button className={`chapters item-${chapterindex % 4}`}>
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
