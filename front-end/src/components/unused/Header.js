import React from "react";
import { NavLink } from "react-router-dom";
import "../css/Header.css";

const Header = () => {
  //TODO create fix for complicated dropdown menus
  return (
    <div className="header-whole">
      <div className="header-contents">
        <h1 id="page-title">My Pet Chart</h1>

        <h4>
          <NavLink to={"/login"}>Login / Sign Up</NavLink>
        </h4>
      </div>
    </div>
  );
};

export default Header;
