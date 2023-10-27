import React from "react";
import "./CoursePage.css";
import Navbar from "../components/Navbar";
import { UserAuth } from "../components/AuthContext";
import { useRoutes, useNavigate, useParams } from 'react-router-dom';

function CoursePage() {
  const { user } = UserAuth();

  const { courseid } = useParams();

  return <div>
    <Navbar />
    <div className="CourseHome">
      <div className="heading-wrapper">
        <h1 className="course-heading">{courseid}</h1>
      </div>
    </div>
  </div>;
}

export default CoursePage;
