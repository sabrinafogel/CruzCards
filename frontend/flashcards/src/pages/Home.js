import React from "react";
import "./Home.css";
import Navbar from "../components/Navbar";
import { UserAuth } from "../components/AuthContext";
import MyCourses from "../components/MyCourses";
import Courses from "../components/Courses";

/**
 * Home.js
 * Home() displays the CruzCards website homepage,
 * once the user has logged in or signed up to use the site.
 * @returns Homepage
 */

function Home() {
  // Uses the UserAuth function from components/AuthContext to create user
  const { user } = UserAuth();

  // Returns a Homepage organized in the following way:
  // If the user is not logged in:
    // Display the Navbar on the left
    // Display the website title (CruzCards) in the top heading
    // Display the profile section on the right, with a dropdown to sign in
    // Display "Welcome" on the webpage
  // If the user is logged in:
    // Display the Navbar on the left
    // Display the website title (CruzCards) in the top heading
    // Display the username and profile pic on the right, with a dropdown to go to the profile page or sign out
    // Display the user's courses, as well as general courses
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
