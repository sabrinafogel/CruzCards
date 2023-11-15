import React, { useState } from "react";
import "./CardViewer.css";
import { FaTimes } from "react-icons/fa";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";

function CardViewer({ setPlaying, cards }) {
  const [isflipped, setIsFlipped] = useState(false);
  const [shuffledCards, setShuffledCards] = useState([]);

  useState(() => {
    const shuffleArray = (cards) => {
      const newCards = cards;
      for (var i = newCards.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = newCards[i];
        newCards[i] = newCards[j];
        newCards[j] = temp;
      }
      setShuffledCards(newCards);
    };
    shuffleArray(cards);
  }, [cards]);

  const [currindex, setCurrIndex] = useState(0);

  const nextCard = () => {
    if (currindex !== cards.length - 1) {
      if (isflipped !== false) {
        setIsFlipped(false);
        setTimeout(() => {
          setCurrIndex(currindex + 1);
        }, 1000);
      } else {
        setCurrIndex(currindex + 1);
      }
    }
  };

  const prevCard = () => {
    if (currindex !== 0) {
      if (isflipped !== false) {
        setIsFlipped(false);
        setTimeout(() => {
          setCurrIndex(currindex - 1);
        }, 1000);
      } else {
        setCurrIndex(currindex - 1);
      }
    }
  };
  return (
    <div className="card-viewer-blur">
      <div className="card-view-modal-container">
        <button className="exit-button">
          <FaTimes
            onClick={() => {
              setPlaying(false);
            }}
          />
        </button>
        <div
          className="card-viewing-container"
          onClick={() => setIsFlipped(!isflipped)}
        >
          {console.log(currindex)}
          {console.log(shuffledCards)}

          <div className={`card-viewing ${isflipped ? "flipped" : ""}`}>
            <div className={`card-viewing-front`}>
              <p>{cards[currindex].front}</p>
            </div>
            <div className="card-viewing-back">
              <p>{cards[currindex].back}</p>
            </div>
          </div>
        </div>
        <div className="card-nav-buttons">
          <button onClick={() => prevCard()}>
            <FaArrowLeftLong />
          </button>
          <button onClick={() => nextCard()}>
            <FaArrowRightLong />
          </button>
        </div>
      </div>
    </div>
  );
}

export default CardViewer;
