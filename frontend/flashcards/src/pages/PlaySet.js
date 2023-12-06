import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Link, useParams } from "react-router-dom";
import "./PlaySet.css";
import { BiPlay } from "react-icons/bi";
import CardViewer from "../components/CardViewer";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

/**
 * PlaySet.js
 * PlaySet() displays the game page for playing sets
 * @returns PlaySet page
 */
function PlaySet() {
  // Initialize necessary variables
  const {
    courseid: courseID,
    chapterindex: chapterIndex,
    setindex: setIndex,
  } = useParams();
  const [set, setSet] = useState([]);
  const [courseInfo, setCourseInfo] = useState();
  const [cards, setCards] = useState([]);
  const [playing, setPlaying] = useState(false);

  // Will fetch course from db and will fetch again if courseid changes
  useEffect(() => {
    /**
     * PlaySet.js
     * fetchCourseInfo() is an asynchronous function that fetches course information
     * from the backend based on a given courseID
     */
    const fetchCourseInfo = async () => {
      try {
        // Encodes the courseid in the url for fetching
        const response = await fetch(
          `http://localhost:8080/courseinfo?courseid=${encodeURIComponent(
            courseID
          )}`
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        // Parse response as JSON
        const courseInfo = await response.json();

        // Sets the course_info for future use based on the parsed response
        // Sets the values of sets and cards as well
        setCourseInfo(courseInfo);
        setSet(courseInfo?.chapters?.[chapterIndex]?.sets?.[setIndex]);
        setCards(courseInfo?.chapters?.[chapterIndex]?.sets?.[setIndex].cards);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    // Call fetchCourseInfo()
    fetchCourseInfo();
  }, [courseID, chapterIndex, setIndex]); // Dependency array includes the courseid, chapterindex, and setindex

  // Initialize isflipped, which tracks the flipping of cards in sets
  const [isFlipped, setIsFlipped] = useState(
    new Array(cards.length).fill(false)
  );

  /**
   * PlaySet.js
   * handleFlip() is a method that changes the "flip" of cards within sets
   * This is how the game aspect is created
   * @param {*} index
   */
  const handleFlip = (index) => {
    // Create a new array, newIsFlipped, with the same elements as isflipped
    const newIsFlipped = [...isFlipped];

    // Toggle the flip state of the item at index
    newIsFlipped[index] = !newIsFlipped[index];

    // Update the state with the new, modified array
    setIsFlipped(newIsFlipped);
  };

  const [showDesc, setShowDesc] = useState(false);

  const handlePlayButtonClick = async () => {
    if (cards.length === 0) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/courseplay`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseid: courseID,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      setPlaying(!playing);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (!courseInfo || !set || !cards) {
    return (
      <div>
        <Navbar />
        Loading...
      </div>
    );
  }

  // Returns a PlaySet page
  return (
    <div>
      <Navbar />
      {playing ? <CardViewer setPlaying={setPlaying} cards={cards} /> : null}
      <div className="play-heading">
        <button className="back-nav">
          <Link to={`/courses/${courseID}/chapters/${chapterIndex}`}>
            <FaAngleLeft />
          </Link>
        </button>
        <div className="Link-wrapper">
          <Link className="Link-tree" to={`/`}>
            <p>Courses</p>
          </Link>
          <FaAngleRight className="angle-right" />

          <Link className="Link-tree" to={`/courses/${courseID}`}>
            <p>{courseInfo.name}</p>
          </Link>

          <FaAngleRight className="angle-right" />

          <Link
            className="Link-tree"
            to={`/courses/${courseID}/chapters/${chapterIndex}`}
          >
            {courseInfo?.chapters?.[chapterIndex].name}
          </Link>
          <FaAngleRight className="angle-right" />

          <p className="Link-current">Playing: {set?.name}</p>
        </div>
        <h1 className="play-header">Playing: {set?.name}</h1>
        <>
          {set?.description !== undefined || set?.description > 0 ? (
            <>
              <p className={`play-desc ${showDesc ? "" : "cut"}`}>
                {set?.description}
              </p>
              <button
                className="desc-show-more"
                onClick={() => setShowDesc(!showDesc)}
              >
                {showDesc ? "Show Less" : "Show More"}
              </button>
            </>
          ) : null}
        </>
      </div>
      <button className="play-set-button" onClick={handlePlayButtonClick}>
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
              <div className={`card-play ${isFlipped[index] ? "flipped" : ""}`}>
                <div className={`card-play-front color-${index % 4}`}>
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
