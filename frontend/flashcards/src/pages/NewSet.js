import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BsFillExclamationSquareFill } from "react-icons/bs";
import { AiFillDelete, AiFillEdit, AiFillPlusCircle } from "react-icons/ai";
import Navbar from "../components/Navbar";
import "./NewSet.css";

/**
 * NewSet.js
 * NewSet() displays the webpage for creating a new set
 * @returns NewSet page
 */
function NewSet() {
  // Initialize necessary variables
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [textAreaDisabled, setTextAreaDisabled] = useState(false);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [noName, setNoName] = useState(false);
  const [cards, setCards] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editSetIndex, setEditSetIndex] = useState();
  const [cardFront, setCardFront] = useState("");
  const [cardBack, setCardBack] = useState("");
  const { courseid: courseId, index } = useParams();
  const navigate = useNavigate();

  /**
   * NewSet.js
   * handleInputChange() is a method that changes the set name to an event target's value
   * @param {event} e
   * @returns None
   */
  const handleInputChange = (event) => {
    // Get the value and store it in newName
    const newName = event.target.value;

    // Check to make sure newName's length is within the character limit for names
    // If it is, change the name accordingly. If not, do nothing
    if (newName.length <= 50) {
      setName(newName);
    } else {
      setInputDisabled(!inputDisabled);
    }
  };

  /**
   * NewSet.js
   * handleDescriptionChange() is a method that changes the set description to an event target's value
   * @param {event} e
   * @returns None
   */
  const handleDescriptionChange = (event) => {
    // Get the value and store it in newDescription
    const newDescription = event.target.value;

    // Check to make sure newDescription's length is within the character limit for descriptions
    // If it is, change the description accordingly. If not, do nothing
    if (newDescription.length <= 250) {
      setDescription(newDescription);
    } else {
      setTextAreaDisabled(!textAreaDisabled);
    }
  };

  /**
   * NewSet.js
   * handleSubmit() is an asynchronous function that saves set information
   * @param {event} e
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // If there is no name, then return true for NoName
    if (name.length <= 0) {
      return setNoName(true);
    }

    try {
      const response = await fetch("http://localhost:8080/newSet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: courseId,
          index: index,
          name: name,
          description: description,
          cards: cards,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // Return to the chapter page for chapter at index
      navigate(`/courses/${courseId}/chapters/${index}`);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const showaddNewCard = () => {
    setShowModal(!showModal);
  };

  // Add a new card with front, back, and id
  // Append newCard to the set of cards
  const addNewCard = (e) => {
    const newCard = { front: cardFront, back: cardBack, id: Date.now() };
    setCards([newCard, ...cards]);
    setCardFront("");
    setCardBack("");
    setShowModal(false);
  };

  // Show the edit of the card at index with front and back
  const showEditCard = (index) => {
    setEditSetIndex(index);
    setCardFront(cards[index].front);
    setCardBack(cards[index].back);
    setShowEditModal(!showEditModal);
  };

  // Cancel the edit of the card at index
  const cancelEditCard = (index) => {
    setEditSetIndex(undefined);
    setCardFront("");
    setCardBack("");
    setShowEditModal(!showEditModal);
  };

  // Save changes to the cards
  const saveCard = () => {
    const edittedCards = [...cards];
    edittedCards[editSetIndex] = {
      front: cardFront,
      back: cardBack,
      id: Date.now(),
    };
    // console.log(edittedCards);
    setCardFront("");
    setCardBack("");
    setEditSetIndex(undefined);
    setCards(edittedCards);
    setShowEditModal(false);
  };

  // Remove a card using a given index by filtering for all cards except the card at index
  const deleteCard = (index) => {
    const newCards = cards.filter((card, i) => i !== index);
    setCards(newCards);
  };

  // Returns a NewSet page
  return (
    <div className="course-page-wrapper">
      <Navbar />
      <div className="new-set">
        <div className="set-input-containers">
          <h1 className="new-set-header">Create a New Set</h1>
          <input
            className="course-name-input"
            placeholder="Enter name..."
            value={name}
            onChange={handleInputChange}
            required
          />
          <p className="char-count">{name.length}/50</p>
          {noName ? (
            <div className="noName-error">
              <BsFillExclamationSquareFill />
              <p className="noName-text">Please enter a name...</p>
            </div>
          ) : null}
          <textarea
            value={description}
            onChange={handleDescriptionChange}
            className="course-description"
            placeholder="Enter description..."
          ></textarea>
          <p className="char-count">{description.length}/250</p>
        </div>
        <div className="new-card-wrapper">
          <div className="new-card-button-container">
            <button className="new-card-button" onClick={showaddNewCard}>
              <AiFillPlusCircle className="plus-button" />
            </button>
            {showModal && (
              <div className="modal-blur">
                <div className="modal-container">
                  <div className="modal">
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
        <div className="card-wrapper">
          <ul>
            {cards.map((card, index) => {
              return (
                <div className="card-container" key={card.id}>
                  <div className="card">
                    <h1>{card.front}</h1>
                  </div>
                  <div className="card">
                    <h1>{card.back}</h1>
                  </div>
                  <button
                    className="delete-button"
                    onClick={() => deleteCard(index)}
                  >
                    <AiFillDelete />
                  </button>
                  <button
                    className="edit-button"
                    onClick={() => showEditCard(index)}
                  >
                    <AiFillEdit />
                  </button>
                </div>
              );
            })}
          </ul>
        </div>

        <div className="button-wrap">
          <button className="course-save" onClick={handleSubmit}>
            Save
          </button>
          <Link to={`/courses/${courseId}/chapters/${index}`}>
            <button className="course-cancel">Cancel</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NewSet;
