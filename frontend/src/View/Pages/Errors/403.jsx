import React from "react";
import "./404.css";
import unAuthorizedpng from "../../../Assets/Errors/403page.png";
import { Link } from "react-router-dom";

const unAuthorized = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-card">
        <img
          src={unAuthorizedpng}
          alt="404"
          className="not-found-image"
          style={{ width: "50%", height: "50%" }}
        />
        <h1 className="not-found-code">403</h1>
        <h2 className="not-found-title">Access Denied</h2>
        <p className="not-found-message">
          You Dont Have The Permission For This Page
        </p>
        <Link to="/" className="dashboard-button">
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default unAuthorized;
