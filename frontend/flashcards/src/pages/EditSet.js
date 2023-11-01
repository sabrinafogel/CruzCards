import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./EditSet.css";
import { BsFillCheckCircleFill, BsFillPencilFill } from "react-icons/bs";
import { FaTimes } from "react-icons/fa";
import { AiFillPlusCircle, AiFillDelete } from "react-icons/ai";

function EditSet() {
  // For general use in fetching the course
  const { courseid, index, setindex } = useParams();
  const [course_info, setCourseInfo] = useState([]);
  const [set, setSet] = useState();
  const [cards, setCards] = useState([]);
  // For setting the name input to disabled or not
  const [isDisabled, setIsDisabled] = useState(true);
  const inputRef = useRef();
  // Initial value for the name box
  const [inputvalue, setinputvalue] = useState(set?.name);
  // Saves the original name to revert back to if they cancel the edit
  const [originalName, setOriginalName] = useState(set?.name);
  // The popup for adding the card
  const [showModal, setShowModal] = useState(false);
  const [cardFront, setCardFront] = useState("");
  const [cardBack, setCardBack] = useState("");
  // Initial value for the description
  const [description, setDescription] = useState(set?.description);
  // For reverting the original description if they cancel.
  const [originalDescription, setOriginalDescription] = useState(
    set?.description
  );
  // Bool if the description is editable or not
  const [isDescriptionDisabled, setIsDescriptionDisabled] = useState(true);
  const descriptionRef = useRef();

  // Will set the description when the set first starts up
  useEffect(() => {
    setDescription(set?.description);
    setOriginalDescription(set?.description);
  }, [set]);

  // Will handle the value the input shows for the description
  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };
  // Handls the description submit which will set the new original desc
  const submitDescription = (e) => {
    e.preventDefault();
    setIsDescriptionDisabled(!isDescriptionDisabled);
    setOriginalDescription(description);
  };
  // Canceling will reset the description to the original and will unfocus it
  const cancelDescription = () => {
    setDescription(originalDescription);
    setIsDescriptionDisabled(true);
  };
  // This will autofocus the description when it becomes editable
  useEffect(() => {
    if (!isDescriptionDisabled) {
      descriptionRef.current.focus();
    }
  }, [isDescriptionDisabled]);
  // Handles the name input change sets the value to what the user types
  const handleInputChange = (e) => {
    const value = e.target.value;
    console.log(value);
    setinputvalue(e.target.value);
  };
  // Handles submiting the name will not take an empty string for a name
  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputvalue === "") {
      return;
    } else {
      setIsDisabled(!isDisabled);
      setOriginalName(inputvalue);
    }
  };
  // Handles setting the set name on startup
  useEffect(() => {
    setOriginalName(set?.name);
    setinputvalue(set?.name);
  }, [set]);
  // Handles setting the cards on startup
  useEffect(() => {
    setCards(set?.cards || []);
  }, [set]);
  // Will set the input to the original name and make the input disabled
  const cancelName = () => {
    setinputvalue(originalName);
    setIsDisabled(true);
  };
  // This makes the name input autofocus when becoming editable
  useEffect(() => {
    if (!isDisabled) {
      inputRef.current.focus();
    }
  }, [isDisabled]);
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
  // This will delete the card specified from the cards arr
  const deleteCard = (index) => {
    const newCards = cards.filter((card, i) => i !== index);
    setCards(newCards);
  };
  // This fetches the course from the db
  useEffect(() => {
    const fetchCourseInfo = async () => {
      console.log(fetch);
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
        setCourseInfo(course_info);
        setSet(course_info?.chapters?.[index]?.sets?.[setindex]);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchCourseInfo();
  }, [courseid, index, setindex]);
  console.log(course_info);

  console.log(set);

  return (
    <div>
      {/* Puts the navbar on the top of the screen */}
      <Navbar />
      <div className="edit-set-heading">
        {/* Makes sure the set is defined and will display the name and description edit boxes */}
        {set && (
          <div>
            <div className="input-wrapper">
              {/* Name input */}
              <input
                className="set-name-input"
                type="text"
                ref={inputRef}
                value={inputvalue}
                disabled={isDisabled}
                onChange={handleInputChange}
                onSubmit={handleSubmit}
              ></input>
              {/* Input start edit button */}
              <button
                className="set-edit-button"
                onClick={() => setIsDisabled(!isDisabled)}
              >
                {isDisabled ? <BsFillPencilFill /> : null}
              </button>
              {/* The cancel button for cancelling edit */}
              {isDisabled ? null : (
                <button onClick={cancelName}>
                  <FaTimes />
                </button>
              )}
              {/* The submit button */}
              {isDisabled ? null : (
                <button className="submit-button" onClick={handleSubmit}>
                  <BsFillCheckCircleFill />
                </button>
              )}
            </div>
            <div className="description-container">
              {/* The textarea to edit the description */}
              <textarea
                className="set-description-input"
                ref={descriptionRef}
                value={description}
                disabled={isDescriptionDisabled}
                onChange={handleDescriptionChange}
                placeholder="Description..."
              ></textarea>
              {/* The button to edit the description */}
              <button
                className="set-edit-button"
                onClick={() => setIsDescriptionDisabled(!isDescriptionDisabled)}
              >
                {/* Initial edit button will disappear after starting edit */}
                {isDescriptionDisabled ? <BsFillPencilFill /> : null}
              </button>
              {/* Cancel button shows up in place of initial edit button when actively editing */}
              {isDescriptionDisabled ? null : (
                <button onClick={cancelDescription}>
                  <FaTimes />
                </button>
              )}
              {/* Description submit button shows up during edit process */}
              {isDescriptionDisabled ? null : (
                <button className="submit-button" onClick={submitDescription}>
                  <BsFillCheckCircleFill />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      {/* The background for the mock card for the add card button */}
      <div className="set-new-card-button-container">
        {/* The button inside the mock card to add a card */}
        <button className="new-card-button" onClick={showaddNewCard}>
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
      </div>
      {/* The grid for the cards present in the set already */}
      <div className="">
        <ul>
          {cards.map((card, index) => {
            return (
              <div className="card-container" key={card.id}>
                {/* Div for card styling */}
                <div className="card">
                  {/* Displays the front of the card */}
                  <h1>{card.front}</h1>
                </div>
                <div className="card">
                  {/* Displays the back of the card */}
                  <h1>{card.back}</h1>
                </div>
                {/* This will render the delete card button on top of the card */}
                <button
                  className="delete-button"
                  onClick={() => deleteCard(index)}
                >
                  <AiFillDelete />
                </button>
              </div>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default EditSet;
