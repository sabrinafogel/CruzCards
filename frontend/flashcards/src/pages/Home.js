import React from "react";
import "./Home.css";
import Navbar from "../components/Navbar";
import { UserAuth } from "../components/AuthContext";
import MyCourses from "../components/MyCourses";
import Courses from "../components/Courses";

function Home() {
  const { user } = UserAuth();

  return (
    <div>
      <Navbar />
      <div className="Home">
        {user === null ? (
          <div className="heading">Welcome</div>
        ) : (
          <div>
            <div>
              <div>
                <MyCourses />
              </div>
            </div>
            <div className="all-courses">
              <div>
                <Courses />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
