import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";
import "./PlaySet.css";

function PlaySet() {
  const { courseid, chapterindex, setindex } = useParams();
  const [set, setSet] = useState([]);
  const [course_info, setCourseInfo] = useState();
  const [cards, setCards] = useState([]);
  const [visibleCardIndex, setVisibleCardIndex] = useState(null);

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
  }, [courseid]);

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
      <div className="play-heading">
        <h1>Playing: {set?.name}</h1>
      </div>
      <div className="card-grid">
        {cards.map((card, index) => {
          return (
            <div className="card-item" key={index} onClick={() => handleCardClick(index)}>
              <div className="play-card">
                <div className={`play-card-front ${visibleCardIndex === index ? "hidden" : "visible"}`}>
                  <p>{card.front}</p>
                </div>
                <div className={`play-card-back ${visibleCardIndex === index ? "visible" : "hidden"}`}>
                  <p>{card.back}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PlaySet;
