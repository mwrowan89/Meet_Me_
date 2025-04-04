import { useState, useContext } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import axiosService from "../axios/AuthService";
import { AuthContext } from "../context/AuthContext";
import FailureAlert from "./FailureAlert";

function LoginRegisterModal() {
  const [show, setShow] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const { login } = useContext(AuthContext);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const handleShowregister = () => {
    setShowRegister(!showRegister);
  };

  const handleChange = (event, value) => {
    if (value === "user") {
      setUserName(event.target.value);
    }
    if (value === "pass") {
      setPassword(event.target.value);
    }
    if (value === "confirmPassword") {
      setConfirmPassword(event.target.value);
    }
    if (value === "email") {
      setEmail(event.target.value);
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const loginAccount = async () => {
    if (!password) {
      return;
    } else {
      let user = {
        username,
        password,
      };
      try {
        await axiosService.login(user, login, username);
        setShow(false);
      } catch (error) {
        if (error.response && error.response.data) {
          if (error.response.status === 401) {
            setAlertMessage(
              "Username or password is incorrect, please try again."
            );
          } else {
            setAlertMessage("An unexpected error occurred, please try again.");
          }
        } else {
          setAlertMessage("An unexpected error occurred, please try again.");
        }
      }
    }
  };

  const registerAccount = async () => {
    if (!password || password !== confirmPassword) {
      setAlertMessage("Passwords do not match, please try again.");
      return;
    } else if (!validateEmail(email)) {
      setAlertMessage("Please enter a valid email address.");
      return;
    } else if (username.length < 4) {
      setAlertMessage("Username must be at least 4 characters long.");
      return;
    }
    let registerUser = {
      username,
      password,
      confirmPassword,
      role: "user",
      email,
    };

    try {
      await axiosService.register(registerUser, login);
      createProfile();
    } catch (error) {
      //console.error("Registration failed", error);
      if (error.response && error.response.data) {
        if (error.response.data.message === 401) {
          setAlertMessage(
            "Username or password is incorrect, please try again...."
          );
        } else if (error.response.data.message === "Email already exists.") {
          setAlertMessage(
            "Email already exists, please try again with a different email."
          );
        }
      } else {
        setAlertMessage("An unexpected error occurred, please try again.");
      }
    }
  };

  const createProfile = async () => {
    const profile = {
      username,
      email,
    };
    try {
      await axiosService.createProfile(profile);
      loginAccount();
    } catch (error) {
      console.error("Error creating profile:", error);
    }
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Login / Sign Up
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          {showRegister ? (
            <Modal.Title>Register</Modal.Title>
          ) : (
            <Modal.Title>Login</Modal.Title>
          )}
        </Modal.Header>
        <Modal.Body>
          {alertMessage && <FailureAlert>{alertMessage}</FailureAlert>}{" "}
          {showRegister ? (
            <>
              <InputGroup className="mb-3">
                <Form.Control
                  placeholder="Create Username"
                  aria-label="Username"
                  required
                  aria-describedby="basic-addon1"
                  onChange={(e) => handleChange(e, "user")}
                />
              </InputGroup>
              <InputGroup className="mb-3">
                <Form.Control
                  placeholder="Email"
                  aria-label="email"
                  required
                  aria-describedby="basic-addon1"
                  onChange={(e) => handleChange(e, "email")}
                />
              </InputGroup>

              <InputGroup className="mb-3">
                <Form.Control
                  placeholder="Create Password"
                  type="password"
                  aria-label="Password"
                  required
                  aria-describedby="basic-addon1"
                  onChange={(e) => handleChange(e, "pass")}
                />
              </InputGroup>
              <InputGroup className="mb-3">
                <Form.Control
                  placeholder="Confirm Password"
                  type="password"
                  aria-label="Password"
                  required
                  aria-describedby="basic-addon1"
                  onChange={(e) => handleChange(e, "confirmPassword")}
                />
              </InputGroup>
            </>
          ) : (
            <>
              <InputGroup className="mb-3">
                <Form.Control
                  placeholder="Username"
                  aria-label="Username"
                  required={true}
                  autoFocus={true}
                  aria-describedby="basic-addon1"
                  onChange={(e) => handleChange(e, "user")}
                />
              </InputGroup>

              <InputGroup className="mb-3">
                <Form.Control
                  placeholder="Password"
                  type="password"
                  required={true}
                  aria-label="Password"
                  aria-describedby="basic-addon2"
                  onChange={(e) => handleChange(e, "pass")}
                />
              </InputGroup>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          {showRegister ? (
            <Button variant="secondary" onClick={handleShowregister}>
              Login
            </Button>
          ) : (
            <Button variant="secondary" onClick={handleShowregister}>
              Sign Up
            </Button>
          )}
          {showRegister ? (
            <Button variant="primary" onClick={registerAccount}>
              Register
            </Button>
          ) : (
            <Button variant="primary" onClick={loginAccount}>
              Login
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default LoginRegisterModal;
