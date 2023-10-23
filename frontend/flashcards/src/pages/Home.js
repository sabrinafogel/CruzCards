import React from "react";
import "./Home.css";
import Navbar from "../components/Navbar";
import { UserAuth } from "../components/AuthContext";

function Home() {
  const { user } = UserAuth();
  return (
    <div>
      <Navbar />
      <div className={"Home"}>{(user === null  || user.displayName === undefined) ? 'Home' : `Welcome ${user.displayName}`}</div>
    </div>
  );
}

export default Home;
