import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { UserAuth } from "../components/AuthContext";
import Navbar from "../components/Navbar";
import "./EditSet.css";
import { FaPlus, FaAngleLeft } from "react-icons/fa6";
import { FaAngleRight } from "react-icons/fa";
import { BsFillExclamationSquareFill } from "react-icons/bs";
import { AiFillPlusCircle, AiFillDelete, AiFillEdit } from "react-icons/ai";

function EditSet() {
  // For general use in fetching the course
  const { courseid, index, setindex } = useParams();
  const [set, setSet] = useState();
  const [cards, setCards] = useState([]);
  // For setting the name input to disabled or not
  const [inputDisabled, setInputDisabled] = useState(false);
  // Initial value for the name box
  const [inputvalue, setinputvalue] = useState("");
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

  const [course_info, setCourseInfo] = useState({});

  const { user } = UserAuth();

  const [isEditor, setIsEditor] = useState(false);

  // Will set the description when the set first starts up
  useEffect(() => {
    if (set) {
      setDescription(set?.description);
    }
  }, [set]);

  const [descriptionDisabled, setDescriptionDisabled] = useState(false);

  // Will handle the value the input shows for the description
  const handleDescriptionChange = (e) => {
    if (e.target.value.length <= 250) {
      setDescription(e.target.value);
    } else {
      setDescriptionDisabled(descriptionDisabled);
    }
  };
  // Handles the name input change sets the value to what the user types
  const handleInputChange = (e) => {
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
  // This will add a new card to the cards arr and will reset the values of inputs for front and back
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
            courseid
          )}`
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const course_info = await response.json();
        //setCourseInfo(course_info);
        setCourseInfo(course_info);
        setSet(course_info?.chapters?.[index]?.sets?.[setindex]);

        const course_editors = [course_info.owner];

        course_info.editors.forEach((editor) => {
          course_editors.push(editor);
        });

        if (course_editors.includes(user.email)) {
          setIsEditor(true);
        } else {
          setIsEditor(false);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchCourseInfo();
  }, [courseid, index, setindex, user]);

  // This saves the set by calling the backedn and passing the in the req.body
  const saveSet = async (e) => {
    e.preventDefault();

    if (inputvalue.length <= 0) {
      return setNoName(true);
    }

    try {
      const response = await fetch("http://localhost:8080/editSet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: courseid,
          index: index,
          setindex: setindex,
          name: inputvalue,
          description: description,
          cards: cards,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      navigate(`/courses/${courseid}/chapters/${index}`);
    } catch (error) {
      console.error("Error:", error);
    }
  };

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

  const chapters = course_info.chapters;
  const currentChapter = chapters[index];

  const handleJSONDownload = (e) => {
    const setJSONData = JSON.stringify(set);
    const blob = new Blob([setJSONData], { type: 'application/json' });
    const link = document.createElement('a');
    link.download = `${set.name}.json`;
    link.href = window.URL.createObjectURL(blob);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

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
                <Link to={`/courses/${courseid}/chapters/${index}`}>
                  <FaAngleLeft />
                </Link>
              </button>
              <div className="Link-wrapper">
                <Link className="Link-tree" to={`/`}>
                  <p>Courses</p>
                </Link>
                <FaAngleRight className="angle-right" />

                <Link className="Link-tree" to={`/courses/${courseid}`}>
                  <p>{course_info.name}</p>
                </Link>

                <FaAngleRight className="angle-right" />

                <Link
                  className="Link-tree"
                  to={`/courses/${courseid}/chapters/${index}`}
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
                value={inputvalue}
                onChange={handleInputChange}
                required
                disabled={!isEditor}
              />
              <p className="char-count">{inputvalue && inputvalue.length}/50</p>
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
          <button
            className="download-JSON"
            onClick={handleJSONDownload}>
            Download Set JSON
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
          <Link to={`/courses/${courseid}/chapters/${index}`}>
            <button className="course-cancel">Cancel</button>
          </Link>
        </div>
      ) : null}
    </div>
  );
}

export default EditSet;
