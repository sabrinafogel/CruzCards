import React, { useState, useEffect } from "react";
import "./ChapterPage.css";
import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { AiFillDelete } from "react-icons/ai";
import { UserAuth } from "../components/AuthContext";

function ChapterPage() {
  // Gets these params from the url
  const { courseid, chapterIndex } = useParams();
  // Used to keep the course_info and sets for use on the page
  const [course_info, setCourseInfo] = useState([]);
  const [sets, setSets] = useState([]);
  // Keeps the index for what the user wants to delete since the delete popup is located outside of the mapping
  const [deleteindex, setDeleteindex] = useState();
  // A boolean value for if the delete popup is shown or not to the user, default is false
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  // User from authcontext provider this will be used later for restricting non-editors from changing the sets
  const { user } = UserAuth();

  // Fetches the course info from the backend
  const fetchCourseInfo = async () => {
    try {
      // Encodes the courseid in the url for fetching
      const response = await fetch(
        `http://localhost:8080/courseinfo?courseid=${encodeURIComponent(
          courseid
        )}`
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const course_info = await response.json();
      // Sets the returned course_info for future use
      setCourseInfo(course_info);
      // Will keep a local copy of the sets for removing sets without extra reads and refreshes
      setSets(course_info.chapters[chapterIndex].sets);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Will fetch course from db and will fetch again if courseid changes
  useEffect(() => {
    fetchCourseInfo();
  }, [courseid]);

  // Returns a loading screen if the fetch hasn't finished yet
  if (!course_info || !course_info.chapters) {
    return (
      <div>
        <Navbar />
        <div className="ChapterPage">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Calls the backend to delete the specified set from the sets array will show error if respose is bad
  const saveDelete = async () => {
    try {
      const response = await fetch("http://localhost:8080/deleteSet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: courseid,
          index: chapterIndex,
          setindex: deleteindex,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // This will call the backend for a delete function and will save the changes locally to avoid more reads and refreshing for changes
  // Also hides the delete popup and sets the delete index to undefined to avoid extra deleteing errors
  const deleteSet = () => {
    const newCards = sets.filter((set, i) => i !== deleteindex);
    console.log(sets.filter((set, i) => i !== deleteindex));
    setSets(newCards);
    saveDelete();
    setShowDeleteModal(!showDeleteModal);
    setDeleteindex(undefined);
  };

  // This will take note of what set index the user wants to delete and will show the delete popup
  const showDeletePopup = (index) => {
    setShowDeleteModal(!showDeleteModal);
    setDeleteindex(index);
  };

  const chapters = course_info.chapters;
  const currentChapter = chapters[chapterIndex];

  return (
    <div>
      <Navbar />
      {/* The popup for deleting a set */}
      {showDeleteModal && (
        <div className="delete-popup-blur">
          {/* Blur is for the darkened background, container is the white background */}
          <div className="delete-popup-container">
            <h1>Delete this set?</h1>
            <div className="delete-popup-buttoncontainer">
              <button
                className="delete-popup-delete"
                onClick={() => deleteSet()}
              >
                Delete
              </button>
              <button className="delete-popup-cancel" onClick={showDeletePopup}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Wrap for the rest of the page */}
      <div className="ChapterPage">
        <div className="heading-wrapper">
          {/* Heading which displays the chapter number and its name */}
          <h1 className="course-heading">
            {currentChapter
              ? `Chapter ${parseInt(chapterIndex) + 1}: ${currentChapter.name}`
              : "Loading..."}
          </h1>
          {/* Search to look through your sets (NOT IMPLEMENTED) */}
          <div className="input-wrapper">
            <input className="search-input" placeholder="Search" />
          </div>
        </div>
        {/* New Set button */}
        <Link to={`/courses/${courseid}/${chapterIndex}/new-set/`}>
          <button className="create-set">
            <div className="new-set-text">New Set</div>
            <div className="new-set-icon">
              <FaPlus />
            </div>
          </button>
        </Link>
      </div>
      {/* Div for the sets */}
      <div className="setDisplay">
        <ul>
          {/* Maps all of the sets with this format */}
          {sets?.map((set, setIndex) => (
            <div className="set-wrapper">
              {/* Link to EditSetPage */}
              <Link
                key={setIndex}
                className="link-fix"
                to={`/courses/${courseid}/${chapterIndex}/${setIndex}`}
              >
                <button className={`sets color-${setIndex % 4}`}>
                  <h1>{set.name}</h1>
                </button>
              </Link>
              {/* Delete Button */}
              <button
                className="delete-set-button"
                onClick={() => showDeletePopup(setIndex)}
              >
                <AiFillDelete className="delete-icon" />
              </button>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ChapterPage;
