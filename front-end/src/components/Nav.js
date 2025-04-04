import React from "react";
import { useEffect } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import LoginRegisterModal from "./LoginRegisterModal";
import axios from "axios";
import EmailModal from "./EmailModal";
import { useContext, useState, useCallback } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function NavScrollExample() {
  const { isLoggedIn, logout } = useContext(AuthContext);
  const [trips, setTrips] = useState([]);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const navigate = useNavigate();
  const [storedUserName, setStoredUserName] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [profileUserName, setProfileUserName] = useState("");

  useEffect(() => {
    setProfileImage(null);
    if (isLoggedIn) {
      handleLogin();
    }
    setTimeout(() => {
      fetchProfile();
    }, 5);
    //eslint-disable-next-line
  }, [isLoggedIn]);

  //hide navbar on scroll down function
  //const [isScrollingUp, setIsScrollingUp] = useState(true);
  // useEffect(() => {
  //   let lastScrollY = window.scrollY;

  //   const handleScroll = () => {
  //     if (window.scrollY > lastScrollY) {
  //       setIsScrollingUp(false);
  //     } else {
  //       setIsScrollingUp(true);
  //     }
  //     lastScrollY = window.scrollY;
  //   };

  //   window.addEventListener("scroll", handleScroll);

  //   return () => {
  //     window.removeEventListener("scroll", handleScroll);
  //   };
  // }, []);

  const fetchTrips = useCallback(async () => {
    setTrips([]);
    if (isLoggedIn) {
      const storedUserId = localStorage.getItem("userId");
      if (storedUserId !== "undefined") {
        try {
          const response = await axios.get(
            `http://localhost:9000/trips/${storedUserId}`
          );
          setTrips(response.data);
        } catch (error) {
          console.error("Error fetching trips:", error);
        }
      }
    }
  }, [isLoggedIn]);

  const handleTripClick = (trip) => {
    navigate("/trips", { state: { trip } });
  };

  const handleLogout = () => {
    logout(navigate);
    setStoredUserName("");
  };
  const handleLogin = () => {
    setTimeout(() => {
      setStoredUserName(localStorage.getItem("userName"));
    }, 50);
  };

  const handleInviteClick = (trip) => {
    setSelectedTrip(trip);
    setEmailSubject(`Join me on Meet Me @!`);
    setEmailMessage(
      `Hi there! I wanted to share this amazing website with you where we can plan our trip together! \nSign up now so we can collaborate! \n\nCheck it out here: ${window.location.origin}`
    );
    setShowEmailModal(true);
  };
  const message = "Meet Me @";

  const handleCloseModal = () => {
    setShowEmailModal(false); // Hide the modal
    setSelectedTrip(null); // Clear the selected trip
  };
  const fetchProfile = async () => {
    const userId = localStorage.getItem("userId");
    if (isLoggedIn) {
      try {
        const response = await axios.get(
          `http://localhost:9000/profile/${userId}`
        );
        setProfileImage(response.data.profilePictureUrl);
        setProfileUserName(response.data.userName);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    }
  };

  return (
    <div className={`nav-bar-container`}>
      <Navbar
        expand="lg"
        className="bg-body-tertiary"
        bg="dark"
        data-bs-theme="dark"
      >
        <Container fluid>
          <Navbar.Brand href="/">Meet Me @</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav className="me-auto my-2 my-lg-0" navbarScroll>
              <Nav.Link href="/">Home</Nav.Link>
              {isLoggedIn ? (
                <NavDropdown
                  title="Saved Trips"
                  id="navbarScrollingDropdown"
                  onClick={fetchTrips}
                >
                  {trips.length === 0 ? (
                    <NavDropdown.Item disabled>
                      No saved trips found
                    </NavDropdown.Item>
                  ) : (
                    <NavDropdown.Item onClick={() => navigate("/savedtrips")}>
                      All Saved Trips
                    </NavDropdown.Item>
                  )}
                  {trips.map((trip) => (
                    <React.Fragment key={trip.id}>
                      <NavDropdown.Divider />
                      <NavDropdown.Item onClick={() => handleTripClick(trip)}>
                        {trip.destinationCity}, {trip.destinationState}
                      </NavDropdown.Item>
                    </React.Fragment>
                  ))}
                </NavDropdown>
              ) : (
                <NavDropdown title="Saved Trips" id="navbarScrollingDropdown">
                  <NavDropdown.Item disabled>
                    Log in to view saved trips
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <LoginRegisterModal />
                </NavDropdown>
              )}
              <NavDropdown title="Collaborate" id="navbarScrollingDropdown">
                <NavDropdown.Item onClick={() => navigate("/collaborate")}>
                  Start Planning
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={() => handleInviteClick(message)}>
                  Invite Friends to Meet Me @!
                </NavDropdown.Item>
                {/* <NavDropdown.Item>
                  Invite your friends!
                </NavDropdown.Item> */}
              </NavDropdown>
              <NavDropdown title="Friends List">
                <NavDropdown.Item>Currently no friends :(</NavDropdown.Item>
              </NavDropdown>
            </Nav>
            {isLoggedIn && (
              <div
                className="profile-pic-nav-container"
                onClick={() => navigate("/profile")}
              >
                {profileImage ? (
                  <img id="profile-pic-nav" src={profileImage} alt="Profile" />
                ) : (
                  <img
                    id="profile-pic-nav"
                    src="/empty-profile.jpeg"
                    alt="Profile"
                  />
                )}
                {storedUserName !== "undefined" ? (
                  <h3 id="user-name-nav">{profileUserName}</h3>
                ) : (
                  <h3 id="user-name-nav">Update Profile</h3>
                )}
              </div>
            )}

            {isLoggedIn ? (
              <Button onClick={handleLogout}>Log Out</Button>
            ) : (
              <LoginRegisterModal />
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <EmailModal
        show={showEmailModal}
        handleClose={handleCloseModal}
        trip={selectedTrip}
        defaultSubject={emailSubject}
        defaultMessage={emailMessage}
      />
    </div>
  );
}

export default NavScrollExample;
