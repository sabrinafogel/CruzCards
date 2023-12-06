import React, { useEffect, useState } from "react";
import "./CoursePage.css";
import Navbar from "../components/Navbar";
import { UserAuth } from "../components/AuthContext";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FaPlus, FaAngleLeft, FaTrash } from "react-icons/fa6";
import { AiFillEdit } from "react-icons/ai";
import { FaAngleRight, FaCheck } from "react-icons/fa";

/**
 * CoursePage.js
 * CoursePage() displays the Chapters associated with a given Course.
 * Additionally, ChapterPage() displays different options if the user
 * has editing permissions for the Course (if they do, they can add Chapters to the Course)
 * @returns CoursePage, a webpage that displays the Chapters associated with a given Course
 */
function CoursePage() {
  // User from authcontext provider this will be used later for restricting non-editors from changing the sets
  const { user } = UserAuth();

  // Gets these params from the url
  const { courseid: courseId } = useParams();
  // Used to keep the course_info and sets for use on the page
  const [courseInfo, setCourseInfo] = useState([]);

  // Initializes isEditor, which contains information about if a user has editing permissions
  const [isEditor, setIsEditor] = useState(false);

  // Initializes toggle
  const [toggle, setToggle] = useState(undefined);

  // Initializes variables used for searching through courses
  // (searchChapters and setSearchChapters using React's useState hook)
  var search = "";
  const [searchChapters, setSearchChapters] = useState([]);

  const navigate = useNavigate();

  // Will fetch course from db and will fetch again if courseid changes
  useEffect(() => {
    /**
     * CoursePage.js
     * fetchCourseInfo() is an asynchronous function that fetches course information
     * from the backend based on a given courseID
     */
    const fetchCourseInfo = async () => {
      try {
        // Encodes the courseid in the url for fetching
        const response = await fetch(
          `http://localhost:8080/courseinfo?courseid=${encodeURIComponent(
            courseId
          )}`
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        // Parse response as JSON
        const courseInfo = await response.json();

        // Sets the course_info for future use, based on the parsed JSON response
        setCourseInfo(courseInfo);
        setSearchChapters(courseInfo.chapters);
        setCourseNameInput(courseInfo.name);

        if (courseInfo.privacy !== "undefined") {
          setToggle(courseInfo.privacy);
        }

        // Set the correct information about those with editing permissions of the course
        // Including the owner and any editors
        const courseEditors = [courseInfo.owner];

        courseInfo.editors.forEach((editor) => {
          courseEditors.push(editor);
        });

        // If the user's email is found within course_editors, give them editor permissions
        if (courseEditors.includes(user.email)) {
          setIsEditor(true);
        } else {
          setIsEditor(false);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    // Call fetchCourseInfo()
    fetchCourseInfo();
  }, [courseId, user]); // Dependency array includes the courseid and user

  const chapters = courseInfo.chapters;

  /**
   * CoursePage.js
   * searchFeature() is an asynchronous function that contains the search feature for Courses
   * By taking in an event's target value and using that value to filter through Courses
   * @param {event} e
   * @returns None
   */
  const searchFeature = async (e) => {
    // Grab the value from e, perform modifications (trim), and store in search
    search = e.target.value.trim();

    // If the search string is empty, set the searched chapters to the original list and return
    if (search === "") {
      setSearchChapters(chapters);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/searchchapter?search=${encodeURIComponent(
          search
        )}&courseid=${encodeURIComponent(courseId)}`
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // searchChapters is the JSON response to the fetch request
      const searchChapters = await response.json();

      // set searchChapters accordingly
      setSearchChapters(searchChapters.chapters);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Initializes variables for tracking any changes in Course Name
  const [isChangingName, setIsChangingName] = useState(false);
  const [courseNameInput, setCourseNameInput] = useState(courseInfo.name);

  // Initializes variables for tracking any changes in Course Description
  const [isChangingDesc, setIsChangingDesc] = useState(false);
  const [courseDescInput, setCourseDescInput] = useState(
    courseInfo.description
  );

  /**
   * CoursePage.js
   * handleCourseNameChange() is a method that changes the course's name to an event target's value
   * @param {event} e
   * @returns None
   */
  const handleCourseNameChange = (e) => {
    setCourseNameInput(e.target.value);
  };

  /**
   * CoursePage.js
   * handleCourseDescChange() is a method that changes the course's description to an event target's value
   * @param {event} e
   * @returns None
   */
  const handleCourseDescChange = (e) => {
    setCourseDescInput(e.target.value);
  };

  /**
   * CoursePage.js
   * handleJSONDownload() is a method that creates a downloadable file.
   * This file contains JSON information representing a course
   * @param {event} e
   * @returns None
   */
  const handleJSONDownload = (e) => {
    // Convert the course_info object into a JSON string, then into a Blob
    const courseJSONData = JSON.stringify(courseInfo);
    const blob = new Blob([courseJSONData], { type: "application/json" });

    // Create a link element for download
    const link = document.createElement("a");
    link.download = `${courseInfo.name}.json`;
    link.href = window.URL.createObjectURL(blob);

    // Add the link to the CoursePage
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /**
   * CoursePage.js
   * handleCourseDelete() is a menthod that handles the deletion of courses.
   */
  const handleCourseDelete = async() => {

    try {
      // Encodes the courseid in the url for fetching
      const response = await fetch("http://localhost:8080/deletecourse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: courseId,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // Deletion was successful, redirects user to home page
      navigate("/");

    } catch (error) {
      console.error("Error:", error);
    }
  };

  /**
   * CoursePage.js
   * handleNameChangeSubmit() is a function that takes care of the changes to a name and description of a course
   * @returns None
   */
  const handleNameChangeSubmit = async (e) => {
    // Set the modes for changing name and description to false
    setIsChangingName(false);
    setIsChangingDesc(false);

    // If there is no input in courseName, return immediately
    if (courseNameInput.length === 0) {
      return;
    }

    // Send a POST request to the server to update course information
    const response = await fetch("http://localhost:8080/editCourse", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: courseId,
        name: courseNameInput,
        description: courseDescInput,
      }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    // Get and store the new course information (name and description)
    const newCourseInfo = { ...courseInfo };
    newCourseInfo.name = courseNameInput;
    newCourseInfo.description = courseDescInput;

    // Modify the course to relflect the new information
    setCourseInfo(newCourseInfo);
  };

  /**
   * CoursePage.js
   * toggleButton() is a function that handles toggling the privacy state of a course
   * @returns None
   */
  const toggleButton = async () => {
    //setToggle(!toggle);

    const response = await fetch("http://localhost:8080/editPrivacy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: courseId,
        privacy: !toggle,
      }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    // Create a variable newCourseInfo that stores the course_info
    const newCourseInfo = { ...courseInfo };

    // Change newCourseInfo's privacy setting
    newCourseInfo.privacy = !toggle;

    // Modify the course to reflect the new information
    setCourseInfo(newCourseInfo);

    setToggle(!toggle);
  };

  // Return the formatted CoursePage
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
            <p className="Link-current">{courseInfo.name}</p>
          </div>
        </div>

        <div className="heading-wrapper">
          {!isChangingName ? (
            <div>
              <h1 className="course-heading">{courseInfo.name}</h1>
              {isEditor ? (
                <AiFillEdit
                  className="course-namedesc-edit-icon"
                  onClick={(e) => setIsChangingName(true)}
                />
              ) : null}
            </div>
          ) : (
            <div>
              <input
                className="course-name-input"
                placeholder={courseNameInput}
                value={courseNameInput}
                onChange={handleCourseNameChange}
                required
              />
              <FaCheck
                className="course-namedesc-edit-icon"
                onClick={handleNameChangeSubmit}
              />
            </div>
          )}
          <div className="input-wrapper">
            <input
              className="search-input"
              placeholder="Search"
              onChange={searchFeature}
            ></input>
          </div>
        </div>

        {!isChangingDesc ? (
          <div>
            <p className="description">
              {courseInfo.description
                ? courseInfo.description
                : "No Description"}
            </p>
            {isEditor ? (
              <AiFillEdit
                className="course-namedesc-edit-icon"
                onClick={(e) => setIsChangingDesc(true)}
              />
            ) : null}
          </div>
        ) : (
          <div>
            <textarea
              className="course-description"
              placeholder={courseDescInput}
              value={courseDescInput}
              onChange={handleCourseDescChange}
              required
            />
            <FaCheck
              className="course-namedesc-edit-icon"
              onClick={handleNameChangeSubmit}
            />
          </div>
        )}
        <div className="course-download-div">
          <button className="download-JSON" onClick={handleJSONDownload}>
            Download Course JSON
          </button>
        </div>

        {isEditor ? (
          <div className="course-delete">
            <button className="delete-Course" onClick={handleCourseDelete}>
              Delete This Course
            </button>  
          </div>
        ) : null}
        
        {isEditor ? (
          <div className="toggle-button">
            {toggle ? (
              <button onClick={toggleButton} className="public-button">
                Make Course Public
              </button>
            ) : (
              <button onClick={toggleButton} className="private-button">
                Make Course Private
              </button>
            )}
          </div>
        ) : null}

        {isEditor ? (
          <button className="create-set">
            <div className="new-chapter-text">New Chapter</div>
            <div className="new-chapter-icon">
              <Link to={`/new-chapter/${courseId}`}>
                <FaPlus />
              </Link>
            </div>
          </button>
        ) : null}

        <div>
          <ul>
            {searchChapters?.map((chapter, chapterindex) => (
              <div className="chapter-container">
                <Link
                  className="chapter-button"
                  to={`/courses/${courseId}/chapters/${chapterindex}`}
                >
                  <button className={`chapters item-${chapterindex % 4}`}>
                    <h1>
                      Chapter {chapter.chapterindex}: {chapter.name}
                    </h1>
                  </button>
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
