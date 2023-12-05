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
  const { courseid, chapterindex, setindex } = useParams();
  const [set, setSet] = useState([]);
  const [course_info, setCourseInfo] = useState();
  const [cards, setCards] = useState([]);
  const [playing, setPlaying] = useState(false);
  const [markedCards, setMarkedCards] = useState([]);

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
            courseid
          )}`
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        // Parse response as JSON
        const course_info = await response.json();

        // Sets the course_info for future use based on the parsed response
        // Sets the values of sets and cards as well
        setCourseInfo(course_info);
        setSet(course_info?.chapters?.[chapterindex]?.sets?.[setindex]);
        setCards(course_info?.chapters?.[chapterindex]?.sets?.[setindex].cards);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    // Call fetchCourseInfo()
    fetchCourseInfo();
  }, [courseid, chapterindex, setindex]); // Dependency array includes the courseid, chapterindex, and setindex

  // Initialize isflipped, which tracks the flipping of cards in sets
  const [isflipped, setIsFlipped] = useState(
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
    const newIsFlipped = [...isflipped];

    // Toggle the flip state of the item at index
    newIsFlipped[index] = !newIsFlipped[index];

    // Update the state with the new, modified array
    setIsFlipped(newIsFlipped);
  };

  const [showDesc, setShowDesc] = useState(false);

  if (!course_info || !set || !cards) {
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
      {playing ? (
        <CardViewer
          setPlaying={setPlaying}
          cards={cards}
          markedCards={markedCards}
          setMarkedCards={setMarkedCards}
        />
      ) : null}
      <div className="play-heading">
        <button className="back-nav">
          <Link to={`/courses/${courseid}`}>
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
            to={`/courses/${courseid}/chapters/${chapterindex}`}
          >
            {course_info?.chapters?.[chapterindex].name}
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
