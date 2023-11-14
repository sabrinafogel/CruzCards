import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";
import "./PlaySet.css";
import { BiPlay } from "react-icons/bi";
import CardViewer from "../components/CardViewer";

function PlaySet() {
  const { courseid, chapterindex, setindex } = useParams();
  const [set, setSet] = useState([]);
  const [course_info, setCourseInfo] = useState();
  const [cards, setCards] = useState([]);
  const [playing, setPlaying] = useState(false);

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
        setCourseInfo(course_info);
        setSet(course_info?.chapters?.[chapterindex]?.sets?.[setindex]);
        setCards(course_info?.chapters?.[chapterindex]?.sets?.[setindex].cards);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchCourseInfo();
  }, [courseid, chapterindex, setindex]);

  const [isflipped, setIsFlipped] = useState(
    new Array(cards.length).fill(false)
  );

  const handleFlip = (index) => {
    const newIsFlipped = [...isflipped];
    newIsFlipped[index] = !newIsFlipped[index];
    setIsFlipped(newIsFlipped);
  };

  const [showDesc, setShowDesc] = useState(false);

  const handleCardClick = (index) => {
    setVisibleCardIndex(index === visibleCardIndex ? null : index);
  };

  if (!course_info || !set || !cards) {
    return (
      <div>
        <Navbar />
        Loading...
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      {playing ? <CardViewer setPlaying={setPlaying} cards={cards} /> : null}
      <div className="play-heading">
        <h1 className="play-header">Playing: {set?.name}</h1>
        <>
          <p className={`play-desc ${showDesc ? "" : "cut"}`}>
            {set?.description}
          </p>
          <button
            className="desc-show-more"
            onClick={() => setShowDesc(!showDesc)}
          >
            Show More
          </button>
        </>
      </div>
      <button
        className="play-set-button"
        onClick={() => {
          setPlaying(!playing);
        }}
      >
        <BiPlay />
        Play
      </button>
      <ul className="card-grid">
        {cards.map((card, index) => {
          return (
            <li
              className="card-play-container"
              key={index}
              onClick={() => handleFlip(index)}
            >
              <div className={`card-play ${isflipped[index] ? "flipped" : ""}`}>
                <div className="card-play-front">
                  <p>{card.front}</p>
                </div>
                <div className="card-play-back">
                  <p>{card.back}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default PlaySet;
