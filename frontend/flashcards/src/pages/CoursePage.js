import React, { useEffect, useState } from "react";
import "./CoursePage.css";
import Navbar from "../components/Navbar";
import { UserAuth } from "../components/AuthContext";
import { useParams, Link } from "react-router-dom";
import { FaPlus, FaAngleLeft } from "react-icons/fa6";
import { AiFillEdit } from "react-icons/ai";
import { FaAngleRight, FaCheck } from "react-icons/fa";

function CoursePage() {
  const { user } = UserAuth();

  const { courseid } = useParams();
  const [course_info, setCourseInfo] = useState([]);

  const [isEditor, setIsEditor] = useState(false);

  const [toggle, setToggle] = useState(undefined);

  var search = "";
  const [searchChapters, setSearchChapters] = useState([]);

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
        setSearchChapters(course_info.chapters);
        setCourseNameInput(course_info.name);
        if (course_info.privacy !== 'undefined'){
          setToggle(course_info.privacy);
        }

        const course_editors = [course_info.owner];

        course_info.editors.forEach((editor) => {
          course_editors.push(editor);
        });

        if (course_editors.includes(user.email)) {
          setIsEditor(true);
        } else {
          setIsEditor(false);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchCourseInfo();
  }, [courseid, user]);

  const chapters = course_info.chapters;

  
  // Search feature
  const searchFeature = async (e) => {
    //setSearch(e.target.value);
    search = e.target.value.trim();
    if (search === "") {
      setSearchChapters(chapters);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/searchchapter?search=${encodeURIComponent(
          search
        )}&courseid=${encodeURIComponent(courseid)}`
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const searchChapters = await response.json();
      setSearchChapters(searchChapters.chapters);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const [isChangingName, setIsChangingName] = useState(false);
  const [courseNameInput, setCourseNameInput] = useState(course_info.name);

  const [isChangingDesc, setIsChangingDesc] = useState(false);
  const [courseDescInput, setCourseDescInput] = useState(
    course_info.description
  );

  const handleCourseNameChange = (e) => {
    setCourseNameInput(e.target.value);
  };

  const handleCourseDescChange = (e) => {
    setCourseDescInput(e.target.value);
  };

  const handleJSONDownload = (e) => {
    const courseJSONData = JSON.stringify(course_info);
    const blob = new Blob([courseJSONData], { type: "application/json" });
    const link = document.createElement("a");
    link.download = `${course_info.name}.json`;
    link.href = window.URL.createObjectURL(blob);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleNameChangeSubmit = async (e) => {
    setIsChangingName(false);
    setIsChangingDesc(false);
    if (courseNameInput.length === 0) {
      return;
    }
    const response = await fetch("http://localhost:8080/editCourse", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: courseid,
        name: courseNameInput,
        description: courseDescInput,
      }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const newCourseInfo = { ...course_info };
    newCourseInfo.name = courseNameInput;
    newCourseInfo.description = courseDescInput;

    setCourseInfo(newCourseInfo);
  };

  const toggleButton = async() => {
    //setToggle(!toggle);

    const response = await fetch("http://localhost:8080/editPrivacy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: courseid,
        privacy: !toggle,
      }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const newCourseInfo = {...course_info};
    newCourseInfo.privacy = !toggle;
    setCourseInfo(newCourseInfo);

    setToggle(!toggle);

  }

  return (
    <div>
      <Navbar />
      <div className="CourseHome">
        <button className="back-nav">
          <Link to={`/`}>
            <FaAngleLeft />
          </Link>
        </button>
        <div className="Link-wrapper">
          <Link className="Link-tree" to={`/`}>
            <p>Courses</p>
          </Link>
          <FaAngleRight className="angle-right" />
          <div className="Link-current">
            <p className="Link-current">{course_info.name}</p>
          </div>
        </div>

        <div className="heading-wrapper">
          {!isChangingName ? (
            <div>
              <h1 className="course-heading">{course_info.name}</h1>
              {isEditor ? (
                <AiFillEdit
                  className="course-namedesc-edit-icon"
                  onClick={(e) => setIsChangingName(true)}
                />
              ) : null}
            </div>
          ) : (
            <div>
              <input
                className="course-name-input"
                placeholder={courseNameInput}
                value={courseNameInput}
                onChange={handleCourseNameChange}
                required
              />
              <FaCheck
                className="course-namedesc-edit-icon"
                onClick={handleNameChangeSubmit}
              />
            </div>
          )}
          <div className="input-wrapper">
            <input
              className="search-input"
              placeholder="Search by name or tag"
              onChange={searchFeature}
            ></input>
          </div>
        </div>

        {!isChangingDesc ? (
          <div>
            <p className="description">
              {course_info.description
                ? course_info.description
                : "No Description"}
            </p>
            {isEditor ? (
              <AiFillEdit
                className="course-namedesc-edit-icon"
                onClick={(e) => setIsChangingDesc(true)}
              />
            ) : null}
          </div>
        ) : (
          <div>
            <textarea
              className="course-description"
              placeholder={courseDescInput}
              value={courseDescInput}
              onChange={handleCourseDescChange}
              required
            />
            <FaCheck
              className="course-namedesc-edit-icon"
              onClick={handleNameChangeSubmit}
            />
          </div>
        )}
        <div className="course-download-div">
          <button className="download-JSON" onClick={handleJSONDownload}>
            Download Course JSON
          </button>
        </div>

        {isEditor ? (
        <div className="toggle-button">
          {toggle ? (
            <button onClick={toggleButton} className="public-button">Make Course Public</button>
          ) : 
          (<button onClick={toggleButton} className="private-button">Make Course Private</button>)}
          
        </div>
        ) : null}

        
        {isEditor ? (
          <button className="create-set">
            <div className="new-chapter-text">New Chapter</div>
            <div className="new-chapter-icon">
              <Link to={`/new-chapter/${courseid}`}>
                <FaPlus />
              </Link>
            </div>
          </button>
        ) : null}

        <div>
          <ul>
            {searchChapters?.map((chapter, chapterindex) => (
              <div className="chapter-container">
                <Link
                  className="chapter-button"
                  to={`/courses/${courseid}/chapters/${chapterindex}`}
                >
                  <button className={`chapters item-${chapterindex % 4}`}>
                    <h1>
                      Chapter {chapterindex + 1}: {chapter.name}
                    </h1>
                  </button>
                </Link>
              </div>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default CoursePage;
