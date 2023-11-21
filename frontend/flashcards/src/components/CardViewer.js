import React, { useState } from "react";
import "./CardViewer.css";
import { FaTimes } from "react-icons/fa";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";

function CardViewer({ setPlaying, cards }) {
  const [isflipped, setIsFlipped] = useState(false);
  const [shuffledCards, setShuffledCards] = useState([]);
  const [isLoading, setisLoading] = useState(true);

  useState(() => {
    const shuffleArray = (cards) => {
      const newCards = cards;
      for (var i = newCards.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = newCards[i];
        newCards[i] = newCards[j];
        newCards[j] = temp;
      }
      for (var a = 0; a < newCards.length; a++) {
        newCards[a].marked = false;
      }
      setShuffledCards(newCards);
    };
    shuffleArray(cards);
    setisLoading(false);
  }, [cards, setPlaying]);

  const [currindex, setCurrIndex] = useState(0);

  const nextCard = () => {
    if (currindex !== shuffledCards.length - 1) {
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

  const handleMark = () => {
    let newShuffledCards = [...shuffledCards];
    let duplicatedCard = { ...newShuffledCards[currindex] };
    duplicatedCard.marked = false;
    newShuffledCards.push(duplicatedCard);
    newShuffledCards[currindex].marked = true;
    setShuffledCards(newShuffledCards);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
              {shuffledCards[currindex] ? (
                <p>{shuffledCards[currindex].front}</p>
              ) : null}
            </div>
            <div className={`card-viewing-back`}>
              {shuffledCards[currindex] ? (
                <p>{shuffledCards[currindex].back}</p>
              ) : null}
            </div>
          </div>
        </div>
        <div className="card-nav-buttons">
          <button
            className={`card-prev-button ${currindex === 0 ? "first" : ""}`}
            onClick={() => prevCard()}
          >
            <FaArrowLeftLong />
          </button>
          {shuffledCards[currindex].marked === false ? (
            <button className="mark-card" onClick={() => handleMark()}>
              Mark Card for Review
            </button>
          ) : null}
          <button
            className={`card-next-button ${
              currindex === shuffledCards.length - 1 ? "last" : ""
            }`}
            onClick={() => nextCard()}
          >
            <FaArrowRightLong />
          </button>
        </div>
      </div>
    </div>
  );
}

export default CardViewer;
