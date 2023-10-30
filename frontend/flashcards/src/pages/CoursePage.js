import React, { useState, useEffect } from "react";
import "./CoursePage.css";
import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import { AiOutlineClose } from "react-icons/ai";
import { Link } from "react-router-dom";

function CoursePage() {
  const { courseid } = useParams();
  const [course_info, setCourseInfo] = useState([]);
  const [newSetName, setNewSetName] = useState("");
  const [shownewSet, setshowNewSet] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/course-data?id=${encodeURIComponent(courseid)}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const course = await response.json();
        setCourseInfo(course);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchCourses();
  }, [courseid]);

  const chapters = course_info.chapters;

  const toggleNewSet = () => {
    setshowNewSet(!shownewSet);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    console.log(value);
    setNewSetName(value);
  };

  const handleSubmit = (e, item) => {
    e.preventDefault();
    const newSet = {
      name: newSetName,
      sets: [],
    };
    item.sets.push(newSet);
    {
      console.log(course_info);
    }

    const updateCourse = async () => {
      fetch("http://localhost:8080/updatecourse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: courseid,
          course: course_info,
        }),
      })
        .then((response) => response.json())
        .then((data) => setCourseInfo(data))
        .catch((error) => {
          console.error("Error:", error);
        });
    };

    updateCourse();
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
            {chapters?.map((chapters, index) => (
              <div>
                <div className="chapters" key={index}>
                  <h1>
                    Chapter {index + 1}: {chapters.name}
                  </h1>
                  <button className="addSet">
                    <FaPlus onClick={toggleNewSet} />
                    Add Set
                  </button>
                </div>
                {chapters.sets.map((sets, card_index) => (
                  <div>
                    <ul>
                      <li key={card_index}>{sets.name}</li>
                    </ul>
                  </div>
                ))}
                {shownewSet ? (
                  <>
                    <div className="overlay"></div>
                    <div className="newSet-container">
                      <div className="content-container" onClick={toggleNewSet}>
                        <p>Thing</p>
                        <button className="newSet-close">
                          <AiOutlineClose />
                        </button>
                      </div>
                      <div>
                        <input
                          className="newSet-input"
                          placeholder="Name..."
                          onChange={handleChange}
                          onSubmit={handleSubmit}
                        ></input>
                      </div>
                      <button onClick={(e) => handleSubmit(e, chapters)}>
                        Submit
                      </button>
                    </div>
                  </>
                ) : null}
              </div>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default CoursePage;
