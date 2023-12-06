import React, { useEffect, useState } from "react";
import "./EditChapterPage.css";
import Navbar from "../components/Navbar";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BsFillExclamationSquareFill } from "react-icons/bs";

/**
 * EditChapterPage.js
 * EditChapterPage() displays the fields necessary to edit a given Chapter of a Course
 * Additionally, EditChapterPage() will display everything necessary to save any edits the user makes
 * @returns EditChapterPage, a webpage that displays the fields needed to edit a chapter's fields
 */
function EditChapterPage() {
  // Gets these params from the url
  const { courseid: courseId, chapterindex: chapterIndex } = useParams();
  const [chapindex, setChapterIndex] = useState(1); 

  // Initialize necessary variables, including character limits for Chapter names and descriptions
  const [noName, setNoName] = useState(false);
  const navigate = useNavigate();
  const nameCharlimit = 50;
  const descCharlimit = 250;

  // Initialize input values using React's useState hook
  const [inputValues, setInputValues] = useState({
    name: "",
    description: "",
  });

  /**
   * EditChapterPage.js
   * handleInputChange() is a method that changes the chapter name and/or description to an event target's value
   * @param {event} e
   * @returns None
   */
  const handleInputChange = (e) => {
    // Get the value from e's target
    const value = e.target.value;

    // Checks the type and length of the value's name
    const overNameLimit =
      e.target.name === "name" && value.length <= nameCharlimit;

    // Checks the type and length of the value's description
    const overDescLimit =
      e.target.description === "description" && value.length <= descCharlimit;

    // Set values according to the changed values if the values pass the above tests
    if (overNameLimit || overDescLimit) {
      setInputValues({
        ...inputValues,
        [e.target.name]: value,
      });
    }
  };

  // Will fetch course from db and will fetch again if courseid changes
  useEffect(() => {
    /**
     * EditChapterPage.js
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
        
        setChapterIndex(courseInfo.chapters[chapterIndex].chapterindex);

        // Set the values of name and description based on the parsed JSON response
        setInputValues({
          name: courseInfo.chapters[chapterIndex].name,
          description: courseInfo.chapters[chapterIndex].description || "",
        });
      } catch (error) {
        console.error("Error:", error);
      }
    };

    // Call fetchCourseInfo()
    fetchCourseInfo();
  }, [courseId, chapterIndex]); // Dependency array includes the courseid and chapterIndex

  /**
   * EditChapterPage.js
   * saveChapter() is an asynchronous function that saves chapter information
   * @param {event} e
   */
  const saveChapter = async (e) => {
    e.preventDefault();

    // If there is no name, then return true for NoName
    if (inputValues.name.length <= 0) {
      return setNoName(true);
    }

    try {
      const response = await fetch("http://localhost:8080/editChapter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: courseId,
          index: chapterIndex,
          name: inputValues.name,
          description: inputValues.description,
          chapterindex: chapindex,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // Return to the course page for courseid
      navigate(`/courses/${courseId}`);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Return the formatted EditChapterPage
  return (
    <div>
      <Navbar />
      <div>
        <div className="NewChapter">
          <div className="new-chapter-header">Edit a Chapter</div>

          <div className="name-and-tags">
            <input
              name="name"
              className="chapter-name-input"
              placeholder="Enter chapter name..."
              value={inputValues.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <p>{inputValues.name.length}/50</p>
          {noName ? (
            <div className="noName-error">
              <BsFillExclamationSquareFill />
              <p className="noName-text">Please enter a name...</p>
            </div>
          ) : null}

          <textarea
            name="description"
            className="chapter-description"
            placeholder="Enter chapter description..."
            value={inputValues.description}
            onChange={handleInputChange}
          ></textarea>
          <p>{inputValues.description.length}/250</p>

          <div className="button-wrap">
            <button className="course-save" onClick={saveChapter}>
              Save
            </button>
            <Link to={`/courses/${courseId}`}>
              <button className="course-cancel">Cancel</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditChapterPage;
