import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { UserAuth } from "../components/AuthContext";
import Navbar from "../components/Navbar";
import "./EditSet.css";
import { FaAngleLeft } from "react-icons/fa6";
import { FaAngleRight } from "react-icons/fa";
import { BsFillExclamationSquareFill } from "react-icons/bs";
import { AiFillPlusCircle, AiFillDelete, AiFillEdit } from "react-icons/ai";
import jsPDF from "jspdf";

/**
 * EditSet.js
 * EditSet() displays the fields necessary to edit a given set of a Chapter of a Course
 * Additionally, EditSet() will display everything necessary to save any edits the user makes
 * @returns EditSet, a webpage that displays the fields needed to edit a set
 */
function EditSet() {
  // For general use in fetching the course
  const { courseid: courseId, index, setindex: setIndex } = useParams();
  const [set, setSet] = useState();
  const [cards, setCards] = useState([]);

  // For setting the name input to disabled or not
  const [inputDisabled, setInputDisabled] = useState(false);

  // Initial value for the name box
  const [inputValue, setinputvalue] = useState("");

  // The popup for adding/editing the card
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editSetIndex, setEditSetIndex] = useState();
  const [cardFront, setCardFront] = useState("");
  const [cardBack, setCardBack] = useState("");

  // Initial value for the description
  const [description, setDescription] = useState("");

  // Bool if the user tries to save with no name
  const [noName, setNoName] = useState(false);

  // This allows the use of the navigate function to move the user back to the sets page after saving
  const navigate = useNavigate();

  const [courseInfo, setCourseInfo] = useState({});

  const { user } = UserAuth();

  const [isEditor, setIsEditor] = useState(false);

  // Will set the description when the set first starts up
  useEffect(() => {
    if (set) {
      setDescription(set?.description);
    }
  }, [set]);

  const [descriptionDisabled, setDescriptionDisabled] = useState(false);

  /**
   * EditSet.js
   * handleDescriptionChange() is a method that changes the set's description to an event target's value
   * @param {event} e
   */
  const handleDescriptionChange = (e) => {
    // If the value is under the description character limit, change the description
    // Otherwise, don't do anything
    if (e.target.value.length <= 250) {
      setDescription(e.target.value);
    } else {
      setDescriptionDisabled(descriptionDisabled);
    }
  };

  /**
   * EditSet.js
   * handleInputChange() is a method that changes the set's name to an event target's value
   * @param {event} e
   */
  const handleInputChange = (e) => {
    // If the value is under the name character limit, change the bane
    // Otherwise, don't do anything
    if (e.target.value.length <= 50) {
      setinputvalue(e.target.value);
    } else {
      setInputDisabled(!inputDisabled);
    }
  };

  // Handles setting the set name on startup
  useEffect(() => {
    if (set) {
      setinputvalue(set?.name);
    }
  }, [set]);

  // Handles setting the cards on startup
  useEffect(() => {
    setCards(set?.cards || []);
  }, [set]);

  // This is the var that determines if the new card popup will be shown to the user
  const showaddNewCard = () => {
    setShowModal(!showModal);
  };

  // This will add a new card to the cards arr
  // This will also reset the values of inputs for front and back
  const addNewCard = (e) => {
    const newCard = { front: cardFront, back: cardBack, id: Date.now() };
    setCards([newCard, ...cards]);
    setCardFront("");
    setCardBack("");
    setShowModal(false);
  };

  // This shows the edit popup to the user
  const showEditCard = (index) => {
    setEditSetIndex(index);
    setCardFront(cards[index].front);
    setCardBack(cards[index].back);
    setShowEditModal(!showEditModal);
  };

  // This hides the edit popup and resets the value of the inputs
  const cancelEditCard = (index) => {
    setEditSetIndex(undefined);
    setCardFront("");
    setCardBack("");
    setShowEditModal(!showEditModal);
  };

  // This changes the card locally and will only be saved with the save set button
  const saveCard = () => {
    const edittedCards = [...cards];
    edittedCards[editSetIndex] = {
      front: cardFront,
      back: cardBack,
      id: Date.now(),
    };
    console.log(edittedCards);
    setCardFront("");
    setCardBack("");
    setEditSetIndex(undefined);
    setCards(edittedCards);
    setShowEditModal(false);
  };
  // This will delete the card specified from the cards arr
  const deleteCard = (index) => {
    const newCards = cards.filter((card, i) => i !== index);
    setCards(newCards);
  };
  // This fetches the course from the db
  useEffect(() => {
    const fetchCourseInfo = async () => {
      try {
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

        // Set the course info (including chapters and sets) based on the parsed JSON response
        setCourseInfo(courseInfo);
        setSet(courseInfo?.chapters?.[index]?.sets?.[setIndex]);

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
  }, [courseId, index, setIndex, user]); // Dependency array includes the courseid, index, setindex, and user

  // This saves the set by calling the backend and passing the in the req.body
  const saveSet = async (e) => {
    e.preventDefault();

    if (inputValue.length <= 0) {
      return setNoName(true);
    }

    try {
      const response = await fetch("http://localhost:8080/editSet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: courseId,
          index: index,
          setindex: setIndex,
          name: inputValue,
          description: description,
          cards: cards,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      navigate(`/courses/${courseId}/chapters/${index}`);
    } catch (error) {
      console.error("Error:", error);
    }
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

  const chapters = courseInfo.chapters;
  const currentChapter = chapters[index];

  /**
   * EditSet.js
   * handleJSONDownload() is a method that creates a downloadable JSON file.
   * This file contains JSON information representing a set
   * @param {event} e
   * @returns None
   */
  const handleJSONDownload = (e) => {
    // Convert the set object into a JSON string, then into a Blob
    const setJSONData = JSON.stringify(set);
    const blob = new Blob([setJSONData], { type: "application/json" });

    // Create a link element for download
    const link = document.createElement("a");
    link.download = `${set.name}.json`;
    link.href = window.URL.createObjectURL(blob);

    // Add the link to the CoursePage
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /**
   * EditSet.js
   * handleCSVDownload() is a method that creates a downloadable CSV file.
   * This file contains CSV information representing a set
   * @param {event} e
   * @returns None
   */
  const handleCSVDownload = (e) => {
    if (set.cards.length === 0) {
      return;
    }

    const header = "front,back";
    const rows = set.cards.map((row) => {
      const { front, back } = row;
      return [front, back].join(",");
    });
    const csvDATA = [header, ...rows].join("\n");

    const blob = new Blob([csvDATA], { type: "text/csv;charset=utf-8" });
    const link = document.createElement("a");
    link.download = `${set.name}.csv`;
    link.href = window.URL.createObjectURL(blob);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /**
   * EditSet.js
   * handlePDFDownload() is a method that creates a downloadable PDF file.
   * This file contains PDF information representing a set
   * @param {event} e
   * @returns None
   */
  const handlePDFDownload = (e) => {
    if (set.cards.length === 0) {
      return;
    }

    const pdf = new jsPDF({
      orientation: "landscape",
    });
    set.cards.forEach((slide, index) => {
      // Add a new page for each slide
      if (index !== 0) {
        pdf.addPage();
      }

      // Add front text (larger) centered
      pdf.setFontSize(30);
      pdf.text(150, 80, slide.front, { align: "center" });

      // Add back text centered
      pdf.setFontSize(22);
      pdf.text(150, 110, slide.back, { align: "center" });
    });

    const pdfBlob = pdf.output("blob");
    const link = document.createElement("a");
    link.download = `${set.name}.pdf`;
    link.href = window.URL.createObjectURL(pdfBlob);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Returns the EditSet page
  return (
    <div>
      {/* Puts the navbar on the top of the screen */}
      <Navbar />
      <div className="edit-set-heading">
        {/* Makes sure the set is defined and will display the name and description edit boxes */}
        {set && (
          <div>
            <div className="set-input-containers">
              <button className="back-nav">
                <Link to={`/courses/${courseId}/chapters/${index}`}>
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

                <Link
                  className="Link-tree"
                  to={`/courses/${courseId}/chapters/${index}`}
                >
                  <p>{currentChapter.name}</p>
                </Link>

                <FaAngleRight className="angle-right" />

                <p className="Link-current">{set.name}</p>
              </div>
              <h1 className="edit-set-header">Set Name:</h1>
              <input
                className="course-name-input"
                placeholder="Enter name..."
                value={inputValue}
                onChange={handleInputChange}
                required
                disabled={!isEditor}
              />
              <p className="char-count">{inputValue && inputValue.length}/50</p>
              {noName ? (
                <div className="noName-error">
                  <BsFillExclamationSquareFill />
                  <p className="noName-text">Please enter a name...</p>
                </div>
              ) : null}
              <h1 className="edit-set-header">Set Description:</h1>
              <textarea
                value={description}
                onChange={handleDescriptionChange}
                className="course-description"
                placeholder="Enter description..."
                disabled={!isEditor}
              ></textarea>
              <p className="char-count">
                {description && description.length}/250
              </p>
            </div>
          </div>
        )}
      </div>
      <div className="set-download-div">
        <button className="download-JSON" onClick={handleJSONDownload}>
          Download Set JSON
        </button>
        <button className="download-JSON" onClick={handleCSVDownload}>
          Download Set CSV
        </button>
        <button className="download-JSON" onClick={handlePDFDownload}>
          Download Set PDF
        </button>
      </div>
      {isEditor ? (
        <div className="new-card-wrapper">
          {/* The background for the mock card for the add card button */}
          <div className="set-new-card-button-container">
            {/* The button inside the mock card to add a card */}
            <button
              className="set-edit-new-card-button"
              onClick={showaddNewCard}
            >
              <AiFillPlusCircle className="plus-button" />
            </button>
            {/* This conditionally renders the add card pop for the user after clicking add card button */}
            {showModal && (
              <div className="modal-blur">
                <div className="modal-container">
                  <div className="modal">
                    {/* front and back text-editors */}
                    <textarea
                      value={cardFront}
                      onChange={(e) => {
                        if (e.target.value.length < 150) {
                          setCardFront(e.target.value);
                        }
                      }}
                      className="card-description"
                      placeholder="Front of card"
                    />
                    <textarea
                      value={cardBack}
                      onChange={(e) => {
                        if (e.target.value.length < 250) {
                          setCardBack(e.target.value);
                        }
                      }}
                      className="card-description"
                      placeholder="Back of card"
                    />
                  </div>
                  <div className="char-count-wrapper">
                    <p>{cardFront.length}/150</p>
                    <p>{cardBack.length}/250</p>
                  </div>
                  {/* Save and Cancel buttons */}
                  <div className="modal-button-wrap">
                    <button className="course-save" onClick={addNewCard}>
                      Save
                    </button>
                    <button className="course-cancel" onClick={showaddNewCard}>
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
            {/* This is the edit popup which houses inputs and save and cancel buttons */}
            {showEditModal && (
              <div className="modal-blur">
                <div className="modal-container">
                  <div className="modal">
                    {/* front and back text-editors */}
                    <textarea
                      value={cardFront}
                      onChange={(e) => setCardFront(e.target.value)}
                      className="card-description"
                      placeholder="Front of card"
                    />
                    <textarea
                      value={cardBack}
                      onChange={(e) => setCardBack(e.target.value)}
                      className="card-description"
                      placeholder="Back of card"
                    />
                  </div>
                  {/* Save and Cancel buttons */}
                  <div className="edit-modal-button-wrap">
                    <button className="edit-card-save" onClick={saveCard}>
                      Save Card
                    </button>
                    <button className="course-cancel" onClick={cancelEditCard}>
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}
      {/* The grid for the cards present in the set already */}
      <div className="card-wrapper">
        <ul>
          {cards.map((card, index) => {
            return (
              <div className="card-container" key={card.id}>
                {/* Div for card styling */}
                <div className="card" key={card.id}>
                  {/* Displays the front of the card */}
                  <h1>{card.front}</h1>
                </div>
                <div className="card">
                  {/* Displays the back of the card */}
                  <h1>{card.back}</h1>
                </div>
                {/* This will render the delete card button on top of the card */}
                {isEditor ? (
                  <div>
                    <button
                      className="card-delete-button"
                      onClick={() => deleteCard(index)}
                    >
                      <AiFillDelete />
                    </button>

                    <button
                      className="set-edit-button"
                      onClick={() => showEditCard(index)}
                    >
                      <AiFillEdit />
                    </button>
                  </div>
                ) : null}
              </div>
            );
          })}
        </ul>
      </div>
      {/* The save and cancel buttons */}
      {isEditor ? (
        <div className="button-wrapper">
          <button className="course-save" onClick={saveSet}>
            Save
          </button>
          <Link to={`/courses/${courseId}/chapters/${index}`}>
            <button className="course-cancel">Cancel</button>
          </Link>
        </div>
      ) : null}
    </div>
  );
}

export default EditSet;
