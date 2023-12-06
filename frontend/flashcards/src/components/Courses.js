import React, { useEffect, useState } from "react";
import { UserAuth } from "./AuthContext";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import "./Courses.css";

/**
 * Courses.js
 * Courses() displays the total set of courses
 * @returns Courses, a displayable list of courses
 */

function Courses() {
  // Initializes courses and setCourses using React's useState hook
  // Uses the UserAuth function from components/AuthContext to create user
  const [courses, setCourses] = useState([]);
  const { user } = UserAuth();

  // Initializes variables used for searching through courses
  // (searchCourses and setSearchCourses using React's useState hook)
  const [searchCourses, setSearchCourses] = useState([]);

  useEffect(() => {
    // fetchCourses makes a fetch request to the URL below (including the user's email)
    // If the network response is not ok, an error is thrown
    const fetchCourses = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/courses?email=${encodeURIComponent(
            user.email
          )}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        // Parse response as JSON
        const courses = await response.json();

        // Update both course lists  with the parsed response
        setCourses(courses);
        setSearchCourses(courses);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    // Call fetchCourses
    fetchCourses();
  }, [user.email]); // Dependency array includes the user's email

  /**
   * Courses.js
   * breakAll() takes in a string str and checks for any words that are greater than length 12
   * @param {string} str
   * @returns true, if str contains at least one word with length > 12. false, if not.
   */
  const breakAll = (str) => {
    if (str !== undefined) {
      const words = str.split(" ");

      // Check each word in words array
      for (let i = 0; i < words.length; i++) {
        if (words[i].length > 12) {
          return true;
        }
      }
      return false;
    }
  };

  /**
   * Courses.js
   * searchFeature() contains the code for the search feature for Courses
   * By taking in an event's target value and using that value to filter through courses
   * @param {event} e
   * @returns None
   */
  const searchFeature = async (e) => {
    // Grab the value from e, perform modifications (trim and make all lowercase), and store in search
    const search = e.target.value.trim().toLowerCase();
    if (search === "") {
      setSearchCourses(courses);
      return;
    }

    // searchChapters will store the matching chapters
    const searchChapters = [];

    try {
      // Iterate through courses
      for (let i = 0; i < courses.length; i++) {
        if (typeof courses[i].name === "undefined") {
          continue;
        }

        // Check to see if the name of the ith index of courses starts with the search value
        // If so, add to searchChapters array
        if (courses[i].name.toLowerCase().startsWith(search)) {
          searchChapters.push(courses[i]);
        }

        // If the course has tags, convert the course tags to lowercase
        // and see if any match the search value. If so, add to searchChapters
        if (typeof courses[i].tags !== "undefined") {
          const courseTags = courses[i].tags.map((element) => {
            return element.toLowerCase();
          });

          const stat = courseTags.find((entry) => entry.startsWith(search));
          if (stat !== undefined && searchChapters.indexOf(courses[i]) === -1) {
            searchChapters.push(courses[i]);
          }
        }
      }

      // Update with the search results
      setSearchCourses(searchChapters);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Sort courses based on playcount in descending order
  const sortedCourses = [...searchCourses].sort(
    (a, b) => b.playcount - a.playcount
  );

  // Return an organized list of Courses inside a scrollable container
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
