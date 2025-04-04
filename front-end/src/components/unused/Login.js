import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axiosService from "../../axios/AuthService";
import "../css/Login.css";

const Login = () => {
  const navigate = useNavigate();
  // const { token, user, login, logout } = useContext(AuthContext);

  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const handleChange = (event, value) => {
    if (value === "user") {
      setUserName(event.target.value);
    }
    if (value === "pass") {
      setPassword(event.target.value);
    }
  };
  const loginAccount = () => {
    if (!password) {
      console.log("Failed");
      return;
    } else {
      let user = {
        username,
        password,
      };
      axiosService.login(user, navigate);
    }
  };

  // const handleLogin = () => {
  //   const user = username;
  //   login(user);
  // };

  // const handleLogout = () => {
  //   logout();
  // };
  return (
    <div>
      <div id="register" className="text-center">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            loginAccount();
          }}
        >
          <h1>Please Sign in</h1>
          <div className="form-input-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              required
              autoFocus
              value={username}
              onChange={(e) => handleChange(e, "user")}
            />
          </div>
          <div className="form-input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              required
              value={password}
              onChange={(e) => handleChange(e, "pass")}
            />
          </div>
          <br />
          <button type="submit">Login</button>
          <p>
            Don't have an account?{" "}
            <NavLink to={"/register"}>Create an Account</NavLink>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
