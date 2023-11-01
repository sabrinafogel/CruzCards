import React, { useEffect, useState } from "react";
import "./CoursePage.css";
import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import { Link } from "react-router-dom";

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

  const breakAll = (str) => {
    const words = str.split(" ");

    // Check each word
    for (let i = 0; i < words.length; i++) {
      if (words[i].length > 12) {
        return true;
      }
    }

    return false;
  };

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
              <div>
                <div className="chapters" key={chapterindex}>
                  <h1>
                    Chapter {chapterindex + 1}: {chapter.name}
                  </h1>
                  <Link to={`/courses/${courseid}/${chapterindex}/new-set`}>
                    <button className="addSet">
                      <FaPlus />
                      Add Set
                    </button>
                  </Link>
                </div>
                <ul className="sets-scrollable-container">
                  {chapter.sets?.map((set, setindex) => (
                    <Link
                      key={setindex}
                      to={`/courses/${courseid}/${chapterindex}/${setindex}`}
                    >
                      <li
                        className={`item ${
                          breakAll(set.name) ? "break-all" : ""
                        } color-${setindex % 4}`}
                      >
                        <h1 className="Course-name">{set.name}</h1>
                        <p className="Course-description">{set.description}</p>
                      </li>
                    </Link>
                  ))}
                </ul>
              </div>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default CoursePage;
