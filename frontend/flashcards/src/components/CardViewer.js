import React, { useState } from "react";
import "./CardViewer.css";
import { FaTimes } from "react-icons/fa";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import { TfiReload } from "react-icons/tfi";

function CardViewer({ setPlaying, cards }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [shuffledCards, setShuffledCards] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  const [highIndexNum, setHighIndexNum] = useState(0);

  useState(() => {
    const shuffleArray = (cards) => {
      const newCards = [...cards];
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

  const shuffleAgain = () => {
    const newShuffledCards = [...cards]; // Create a copy of the original array
    for (let i = newShuffledCards.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = newShuffledCards[i];
      newShuffledCards[i] = newShuffledCards[j];
      newShuffledCards[j] = temp;
    }
    for (let a = 0; a < newShuffledCards.length; a++) {
      newShuffledCards[a].marked = false;
    }
    setShuffledCards(newShuffledCards);
    setCurrIndex(0);
  };

  const [currIndex, setCurrIndex] = useState(0);

  const nextCard = () => {
    if (
      currIndex !== shuffledCards.length - 1 &&
      shuffledCards[currIndex].marked === true
    ) {
      if (isFlipped !== false) {
        setIsFlipped(false);
        setTimeout(() => {
          setHighIndexNum(currIndex + 1);
          setCurrIndex(currIndex + 1);
        }, 1000);
      } else {
        setHighIndexNum(currIndex + 1);
        setCurrIndex(currIndex + 1);
      }
    }
  };

  const prevCard = () => {
    if (currIndex !== 0) {
      if (isFlipped !== false) {
        setIsFlipped(false);
        setTimeout(() => {
          setCurrIndex(currIndex - 1);
        }, 1000);
      } else {
        setCurrIndex(currIndex - 1);
      }
    }
  };

  const handleMark = () => {
    let newShuffledCards = [...shuffledCards];
    let duplicatedCard = { ...newShuffledCards[currIndex] };
    duplicatedCard.marked = false;
    newShuffledCards.push(duplicatedCard);
    newShuffledCards[currIndex].marked = true;
    setShuffledCards(newShuffledCards);
    setHighIndexNum(currIndex + 1);
    setIsFlipped(false);
    setTimeout(() => {
      setHighIndexNum(currIndex + 1);
      setCurrIndex(currIndex + 1);
    }, 1000);
  };

  const handleRight = () => {
    let newShuffledCards = [...shuffledCards];
    newShuffledCards[currIndex].marked = true;
    setShuffledCards(newShuffledCards);
    nextCard();
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
        <div className="card-buttons">
          <button
            className={`card-prev-button ${currIndex === 0 ? "first" : ""}`}
            onClick={() => prevCard()}
          >
            <FaArrowLeftLong />
          </button>
          <div
            className="card-viewing-container"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            {console.log(currIndex)}
            {console.log(shuffledCards)}

            <div className={`card-viewing ${isFlipped ? "flipped" : ""}`}>
              <div className={`card-viewing-front`}>
                {shuffledCards[currIndex] ? (
                  <p>{shuffledCards[currIndex].front}</p>
                ) : null}
              </div>
              <div className={`card-viewing-back`}>
                {shuffledCards[currIndex] ? (
                  <p>{shuffledCards[currIndex].back}</p>
                ) : null}
              </div>
            </div>
          </div>

          <button
            className={`card-next-button ${
              currIndex === shuffledCards.length - 1 ? "last" : ""
            } ${currIndex === highIndexNum ? "not_answered" : ""}`}
            onClick={() => nextCard()}
          >
            <FaArrowRightLong />
          </button>
        </div>

        <div className="card-nav-buttons">
          {shuffledCards[currIndex].marked === false ? (
            <>
              <button className="mark-card-right" onClick={() => handleRight()}>
                Right
              </button>
              <button className="mark-card-wrong" onClick={() => handleMark()}>
                Wrong
              </button>
            </>
          ) : null}
        </div>
        <div className="card-reshuffle">
          <button
            className="mark-card-right reshuffle"
            onClick={() => shuffleAgain(cards)}
          >
            Reshuffle <TfiReload className="reload" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default CardViewer;
