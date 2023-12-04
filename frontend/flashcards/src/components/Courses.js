import React, { useEffect, useState } from "react";
import { UserAuth } from "./AuthContext";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import "./Courses.css";

function Courses() {
  const [courses, setCourses] = useState([]);
  const { user } = UserAuth();

  var search = "";
  const [searchCourses, setSearchCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`http://localhost:8080/courses?email=${encodeURIComponent(
          user.email
        )}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const courses = await response.json();

        setCourses(courses);
        setSearchCourses(courses);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchCourses();
  }, [user.email]);

  const breakAll = (str) => {
    if (str !== undefined) {
      const words = str.split(" ");

      // Check each word
      for (let i = 0; i < words.length; i++) {
        if (words[i].length > 12) {
          return true;
        }
      }
    }
    return false;
  };

  const searchFeature = async (e) => {
    const search = e.target.value.trim().toLowerCase();
    if (search === "") {
      setSearchCourses(courses);
      return;
    }

    const searchChapters = [];

    try {
      for (let i = 0; i < courses.length; i++) {
        if (typeof courses[i].name === "undefined") {
          continue;
        }

        if (courses[i].name.toLowerCase().startsWith(search)) {
          searchChapters.push(courses[i]);
        }
        if (typeof courses[i].tags !== "undefined") {
          const course_tags = courses[i].tags.map((element) => {
            return element.toLowerCase();
          });

          const stat = course_tags.find((entry) =>
            entry.startsWith(search)
          );
          if (
            stat !== undefined &&
            searchChapters.indexOf(courses[i]) === -1
          ) {
            searchChapters.push(courses[i]);
          }
        }
      }
      setSearchCourses(searchChapters);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Sort courses based on playcount in descending order
  const sortedCourses = [...searchCourses].sort(
    (a, b) => b.playcount - a.playcount
  );

  return (
    <div className="Course-wrapper">
      <div className="heading-wrapper">
        <h1 className="course-heading">Courses</h1>
        <div className="input-wrapper">
          <input
            className="search-input"
            placeholder="Search"
            onChange={searchFeature}
          ></input>
          <Link to="/new-course">
            <button className="create-course">
              <FaPlus />
            </button>
          </Link>
        </div>
      </div>
      <ul className="scrollable-container">
        {sortedCourses.map((item, index) => (
          <Link key={item.id} to={`/courses/${item.id}`}>
            <li
              key={index}
              className={`item ${
                breakAll(item.name) ? "break-all" : ""
              } color-${index % 4}`}
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
