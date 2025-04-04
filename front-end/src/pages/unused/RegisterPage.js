import React from "react";
import axiosService from "../../axios/AuthService";
import { useState } from "react";

const RegisterPage = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChange = (event, value) => {
    if (value === "user") {
      setUserName(event.target.value);
    }
    if (value === "pass") {
      setPassword(event.target.value);
    }
    if (value === "secondPass") {
      setConfirmPassword(event.target.value);
    }
  };

  const submitAccount = (userName, password, confirmPassword) => {
    console.log("Submit");
    if (password !== confirmPassword) {
      console.log("Failed");
      return;
    }
    let user = {
      userName,
      password,
    };
    axiosService.register(user);
  };

  return (
    <div>
      <div id="register" className="text-center">
        <form>
          <h1>Create Account</h1>
          <div className="form-input-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              required
              autoFocus
              value={userName}
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
          <div className="form-input-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              required
              value={confirmPassword}
              onChange={(e) => handleChange(e, "secondPass")}
            />
          </div>

          <br />
          <button
            type="submit"
            onClick={() => submitAccount(userName, password, confirmPassword)}
          >
            Create Account
          </button>
        </form>
      </div>
      <h2>{userName}</h2>
      <h2>{password}</h2>
      <h2>{confirmPassword}</h2>
    </div>
  );
};

export default RegisterPage;
