import React, { useEffect, useState } from "react";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "./firebase_config";
import "./MyCourses.css";

function MyCourses() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "courses"), (snapshot) => {
      const newCourses = snapshot.docs.map((doc) => doc.data());
      setCourses(newCourses);
    });
    return () => unsubscribe();
  }, []);

  const breakAll = (str) => {
    const words = str.split(" ");

    // Check each word
    for (let i = 0; i < words.length; i++) {
      if (words[i].length > 12) {
        return true;
      }
    }

    return false;
  };

  return (
    <div className="Course-wrapper">
      <ul className="scrollable-container">
        {courses.map((item, index) => (
          <li
            key={index}
            className={`item ${breakAll(item.name) ? "break-all" : ""}`}
          >
            <h1 className="Course-name">{item.name}</h1>
            <p className="Course-description">{item.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MyCourses;
