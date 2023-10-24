import React from "react";
import "./MyCourses.css";

function MyCourses() {
  const courses = [
    {
      name: "Introduction to Programming",
      description:
        "This course introduces the fundamental concepts of programming. Students will learn to write simple programs using variables, loops, and conditionals.",
    },
    {
      name: "Web Development",
      description:
        "This course covers the basics of web development, including HTML, CSS, and JavaScript. Students will learn to create interactive websites.",
    },
    {
      name: "Data Structures and Algorithms",
      description:
        "This course provides an overview of data structures like arrays, linked lists, stacks, queues, trees, and graphs. It also covers basic algorithms for searching and sorting data.",
    },
    {
      name: "Database Systems",
      description:
        "This course introduces the principles of database systems. Topics include data modeling, relational databases, SQL, and database design.",
    },
    {
      name: "Machine Learning",
      description:
        "This course provides an introduction to machine learning techniques and algorithms. Students will learn about regression, classification, clustering, and neural networks.",
    },
  ];

  return (
    <div className="Course-wrapper">
      <ul className="scrollable-container">
        {courses.map((item, index) => (
          <li key={index} className="item">
            <h1 className="Course-name">{item.name}</h1>
            <p className="Course-description">{item.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MyCourses;
