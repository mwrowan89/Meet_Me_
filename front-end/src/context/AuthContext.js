import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(localStorage.getItem("userId"));
  const [loginStatus, setLoginStatus] = useState(null);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
      setIsLoggedIn(true);
    }
  }, [loginStatus, userId]);

  const login = (userId, userName) => {
    setIsLoggedIn(true);
    setUserId(userId);
    setUserName(localStorage.getItem("userName"));
    localStorage.setItem("userId", userId);
    localStorage.setItem("userName", userName);
    setLoginStatus("success");
  };

  const logout = (navigate) => {
    setIsLoggedIn(false);
    setLoginStatus("logout");
    setUserId(null);
    localStorage.removeItem("userId");
    localStorage.removeItem("authToken");
    localStorage.removeItem("userName");
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, userId, login, logout, loginStatus, userName }}
    >
      {children}
    </AuthContext.Provider>
  );
};
