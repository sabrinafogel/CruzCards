import React, { useEffect, useState } from "react";
// import { collection, getDocs, onSnapshot } from "firebase/firestore";
// import { db } from "./firebase_config";
import "./Courses.css";

function Courses() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("http://localhost:5000/courses");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const courses = await response.json();
        setCourses(courses);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchCourses();
  }, []);

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
    <div className="Course-wrapper">
      <ul className="scrollable-container">
        {courses.map((item, index) => (
          <Link to={`/courses/${item.id}`}>
            <li
              key={index}
              className={`item ${breakAll(item.name) ? "break-all" : ""}`}
            >
              <h1 className="Course-name">{item.name}</h1>
              <p className="Course-description">{item.description}</p>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
}

export default Courses;
