import React, { useState, useEffect } from "react";
import "./ChapterPage.css";
import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";
import { FaPlus, FaAngleLeft } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import { UserAuth } from "../components/AuthContext";
import { FaAngleRight, FaCheck } from "react-icons/fa";
import { BiPlay } from "react-icons/bi";

/**
 * ChapterPage.js
 * ChapterPage() displays the Sets associated with a given Chapter of a Course.
 * Additionally, ChapterPage() displays different options if the user
 * has editing permissions for the Course (if they do, they can add Sets to the Chapter)
 * @returns ChapterPage, a webpage that displays the Sets associated with a given Chapter of a Course
 */

function ChapterPage() {
  // Gets these params from the url
  const { courseid: courseId, chapterIndex } = useParams();
  // Used to keep the course_info and sets for use on the page
  const [courseInfo, setCourseInfo] = useState({});
  const [currentChapter, setCurrentChapter] = useState({});
  const [sets, setSets] = useState([]);
  // Keeps the index for what the user wants to delete since the delete popup is located outside of the mapping
  const [deleteIndex, setDeleteindex] = useState();
  // A boolean value for if the delete popup is shown or not to the user, default is false
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  // User from authcontext provider this will be used later for restricting non-editors from changing the sets
  const { user } = UserAuth();

  // Initializes isEditor, which contains information about if a user has editing permissions
  const [isEditor, setIsEditor] = useState(false);

  // Initializes variables used for searching through courses
  // (searchChapters and setSearchChapters using React's useState hook)
  var search = "";
  const [searchChapters, setSearchChapters] = useState([]);

  // Initializes variables for tracking any changes in Chapter Name
  const [isChangingName, setIsChangingName] = useState(false);
  const [chapNameInput, setChapNameInput] = useState(currentChapter.name);

  // Initializes variables for tracking any changes in Chapter Description
  const [isChangingDesc, setIsChangingDesc] = useState(false);
  const [chapDescInput, setChapDescInput] = useState(courseInfo.description);

  const [chapindex, setChapterIndex] = useState(1); 

  // Will fetch course from db and will fetch again if courseid changes
  useEffect(() => {
    /**
     * ChapterPage.js
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
        const recCourseInfo = await response.json();
        const recChap = recCourseInfo.chapters[chapterIndex];

        // Sets the returned course_info for future use, based on the parsed response
        setCourseInfo(recCourseInfo);
        setCurrentChapter(recChap);
        setChapNameInput(recChap.name);
        setChapDescInput(recChap.description);
        setChapterIndex(recChap.chapterindex);

        // Set the correct information about those with editing permissions of the course
        // Including the owner and any editors
        const courseEditors = [recCourseInfo.owner];

        recCourseInfo.editors.forEach((editor) => {
          courseEditors.push(editor);
        });

        // If the user's email is found within course_editors, give them editor permissions
        if (courseEditors.includes(user.email)) {
          setIsEditor(true);
        } else {
          setIsEditor(false);
        }

        // Will keep a local copy of the sets for removing sets without extra reads and refreshes
        setSets(recCourseInfo.chapters[chapterIndex].sets);
        setSearchChapters(recCourseInfo.chapters[chapterIndex].sets);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    // Call fetchCourseInfo()
    fetchCourseInfo();
  }, [courseId, chapterIndex, user]); // Dependency array includes the courseid, chapterIndex, and user

  /**
   * ChapterPage.js
   * searchFeature() is an asynchronous function that contains the search feature for Chapters
   * By taking in an event's target value and using that value to filter through Sets/Chapters
   * @param {event} e
   * @returns None
   */
  const searchFeature = async (e) => {
    // Grab the value from e, perform modifications (trim and make all lowercase), and store in search
    search = e.target.value.trim();

    // If the search string is empty, set the searched sets to the original list and return
    if (search === "") {
      setSearchChapters(sets);
      return;
    }

    // newSets will store the matching Sets
    var newSets = [];

    // Iterate through sets
    for (let i = 0; i < sets.length; i++) {
      // Check to see if the name of the set matches with the search value
      // If so, add to newSets array
      if (sets[i].name.toLowerCase().startsWith(search.toLowerCase())) {
        newSets.push(sets[i]);
      }
    }

    // Update with the search results
    setSearchChapters(newSets);
  };

  // Returns a loading screen if the fetch hasn't finished yet
  if (!courseInfo || !courseInfo.chapters) {
    return (
      <div>
        <Navbar />
        <div className="ChapterPage">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  /**
   * ChapterPage.js
   * saveDelete() is an asynchronous function that calls the backend to delete
   * a specified set from the sets array.
   * @returns None
   */
  const saveDelete = async () => {
    try {
      const response = await fetch("http://localhost:8080/deleteSet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: courseId,
          index: chapterIndex,
          setindex: deleteIndex,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  /**
   * ChapterPage.js
   * deleteSet() is a function that calls the backend for a delete function.
   *  deleteSet() will then save the changes locally in order to avoid more reads/refresh for changes.
   *  deleteSet() also hides the delete popup and sets the delete index to undefined.
   * @returns None
   */
  const deleteSet = () => {
    // newCards is a new array that gets all sets except the one at deleteindex
    const newCards = sets.filter((set, i) => i !== deleteIndex);
    // console.log(sets.filter((set, i) => i !== deleteindex));

    // We then set the state variable sets to newCards
    setSets(newCards);
    setSearchChapters(newCards);

    // Calls saveDelete (see above)
    saveDelete();

    // Toggles the showDeleteModal and sets the deleteindex to undefined
    setShowDeleteModal(!showDeleteModal);
    setDeleteindex(undefined);
  };

  /**
   * ChapterPage.js
   * showDeletePopup() is a method that completes two functions:
   * 1. Takes note of the set index the user wishes to delete
   * 2. Shows the delete popup
   * @param {*} index, the index of the set the user wants to delete
   * @returns None
   */
  const showDeletePopup = (index) => {
    // Toggles the showDeleteModal and sets the deleteindex to index
    setShowDeleteModal(!showDeleteModal);
    setDeleteindex(index);
  };

  /**
   * ChapterPage.js
   * handleChapNameChange() is a method that changes the chapter name to an event target's value
   * @param {event} e
   * @returns None
   */
  const handleChapNameChange = (e) => {
    setChapNameInput(e.target.value);
  };

  /**
   * ChapterPage.js
   * handleDescNameChange() is a method that changes the description to an event target's value
   * @param {event} e
   * @returns None
   */
  const handleChapDescChange = (e) => {
    setChapDescInput(e.target.value);
  };

  /**
   * ChapterPage.js
   * handleNameChangeSubmit() is a function that takes care of the changes to a name and description of a chapter
   * @returns None
   */
  const handleNameChangeSubmit = async () => {
    // Set the modes for changing name and description to false
    setIsChangingName(false);
    setIsChangingDesc(false);

    // Send a POST request to the server to update chapter information
    const response = await fetch("http://localhost:8080/editChapter", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: courseId,
        index: chapterIndex,
        name: chapNameInput,
        description: chapDescInput,
        chapterindex: chapindex,
      }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    // Get and store the new chapter information (name and description)
    const newChapInfo = { ...currentChapter };
    newChapInfo.name = chapNameInput;
    newChapInfo.description = chapDescInput;

    // Modify the chapter to relflect the new information
    setCurrentChapter(newChapInfo);
  };

  // Return the formatted ChapterPage
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
        <button className="back-nav">
          <Link to={`/courses/${courseId}`}>
            <FaAngleLeft />
          </Link>
        </button>
        <div className="Link-wrapper">
          <Link className="Link-tree" to={`/`}>
            <p>Courses</p>
          </Link>
          <FaAngleRight className="angle-right" />

          <Link className="Link-tree" to={`/courses/${courseId}`}>
            <p>{courseInfo.name}</p>
          </Link>

          <FaAngleRight className="angle-right" />

          <p className="Link-current">{currentChapter.name}</p>
        </div>

        <div className="heading-wrapper">
          {/* Heading which displays the chapter number and its name */}

          {!isChangingName ? (
            <div>
              <h1 className="chapter-heading">
                {currentChapter
                  ? `Chapter ${parseInt(chapterIndex) + 1}: ${
                      currentChapter.name
                    }`
                  : "Loading..."}
              </h1>
              {isEditor ? (
                <AiFillEdit
                  className="chapter-namedesc-edit-icon"
                  onClick={(e) => setIsChangingName(true)}
                />
              ) : null}
            </div>
          ) : (
            <div>
              <input
                className="chapter-name-input"
                placeholder={chapNameInput}
                value={chapNameInput}
                onChange={handleChapNameChange}
                required
              />
              <FaCheck
                className="chapter-namedesc-edit-icon"
                onClick={handleNameChangeSubmit}
              />
            </div>
          )}

          {/* Search to look through your sets (NOT IMPLEMENTED) */}
          <div className="input-wrapper">
            <input
              className="search-input"
              placeholder="Search"
              onChange={searchFeature}
            />
          </div>
        </div>

        {!isChangingDesc ? (
          <div>
            <p className="description">
              {currentChapter.description
                ? currentChapter.description
                : "No Description"}
            </p>
            {isEditor ? (
              <AiFillEdit
                className="chapter-namedesc-edit-icon"
                onClick={(e) => setIsChangingDesc(true)}
              />
            ) : null}
          </div>
        ) : (
          <div>
            <textarea
              className="chapter-description"
              placeholder={chapDescInput}
              value={chapDescInput}
              onChange={handleChapDescChange}
              required
            />
            <FaCheck
              className="chapter-namedesc-edit-icon"
              onClick={handleNameChangeSubmit}
            />
          </div>
        )}

        {/* New Set button */}
        {isEditor ? (
          <Link to={`/courses/${courseId}/${chapterIndex}/new-set/`}>
            <button className="create-set">
              <div className="new-set-text">New Set</div>
              <div className="new-set-icon">
                <FaPlus />
              </div>
            </button>
          </Link>
        ) : null}
      </div>
      {/* Div for the sets */}
      <div className="setDisplay">
        <ul>
          {/* Maps all of the sets with this format */}
          {searchChapters?.map((set, setIndex) => (
            <div className="set-wrapper">
              <Link
                key={setIndex}
                className="link-fix"
                to={`/courses/${courseId}/${chapterIndex}/${setIndex}`}
              >
                <button className={`sets color-${setIndex % 4}`}>
                  <h1>{set.name}</h1>
                </button>
              </Link>
              <Link
                to={`/courses/${courseId}/${chapterIndex}/${setIndex}/play-set`}
              >
                <button>
                  <BiPlay className="play-button" />
                </button>
              </Link>
              {/* Delete Button */}
              {isEditor ? (
                <button
                  className="delete-set-button"
                  onClick={() => showDeletePopup(setIndex)}
                >
                  <AiFillDelete className="delete-icon" />
                </button>
              ) : null}
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ChapterPage;
