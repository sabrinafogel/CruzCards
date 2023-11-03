import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./EditSet.css";
import { BsFillExclamationSquareFill } from "react-icons/bs";
import { AiFillPlusCircle, AiFillDelete } from "react-icons/ai";

function EditSet() {
  // For general use in fetching the course
  const { courseid, index, setindex } = useParams();
  const [set, setSet] = useState();
  const [cards, setCards] = useState([]);
  // For setting the name input to disabled or not
  const [inputDisabled, setInputDisabled] = useState(false);
  // Initial value for the name box
  const [inputvalue, setinputvalue] = useState("");
  // The popup for adding the card
  const [showModal, setShowModal] = useState(false);
  const [cardFront, setCardFront] = useState("");
  const [cardBack, setCardBack] = useState("");
  // Initial value for the description
  const [description, setDescription] = useState("");
  // Bool if the user tries to save with no name
  const [noName, setNoName] = useState(false);
  // This allows the use of the navigate function to move the user back to the sets page after saving
  const navigate = useNavigate();

  // Will set the description when the set first starts up
  useEffect(() => {
    if (set) {
      setDescription(set?.description);
    }
  }, [set]);
  // Will handle the value the input shows for the description
  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
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
        //setCourseInfo(course_info);
        setSet(course_info?.chapters?.[index]?.sets?.[setindex]);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchCourseInfo();
  }, [courseid, index, setindex]);

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

  return (
    <div>
      {/* Puts the navbar on the top of the screen */}
      <Navbar />
      <div className="edit-set-heading">
        {/* Makes sure the set is defined and will display the name and description edit boxes */}
        {set && (
          <div>
            <div className="set-input-containers">
              <h1 className="edit-set-header">Set Name:</h1>
              <input
                className="course-name-input"
                placeholder="Enter name..."
                value={inputvalue}
                onChange={handleInputChange}
                required
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
              ></textarea>
              <p className="char-count">
                {description && description.length}/250
              </p>
            </div>
          </div>
        )}
      </div>
      <div className="new-card-wrapper">
        {/* The background for the mock card for the add card button */}
        <div className="set-new-card-button-container">
          {/* The button inside the mock card to add a card */}
          <button className="set-edit-new-card-button" onClick={showaddNewCard}>
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
      </div>
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
      {/* The save and cancel buttons */}
      <div className="button-wrapper">
        <button className="course-save" onClick={saveSet}>
          Save
        </button>
        <Link to={`/courses/${courseid}/chapters/${index}`}>
          <button className="course-cancel">Cancel</button>
        </Link>
      </div>
    </div>
  );
}

export default EditSet;
