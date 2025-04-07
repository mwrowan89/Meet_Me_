import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Nav from "../components/Nav";
import { AuthContext } from "../context/AuthContext";
import {
  Container,
  Row,
  Col,
  Card,
  Image,
  Form,
  Button,
} from "react-bootstrap";

const ProfilePage = () => {
  const userId = localStorage.getItem("userId");
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState({});
  const { loginStatus } = useContext(AuthContext);

  useEffect(() => {
    if (loginStatus !== "success") {
      window.location.href = "/";
      return;
    } else {
      const fetchProfile = async () => {
        try {
          const response = await axios.get(
            `http://localhost:9000/profile/${userId}`
          );
          setProfile(response.data);
          setUpdatedProfile(response.data);
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      };
      fetchProfile();
    }
  }, [userId]);

  const profilePictureUrls = {
    male: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZg_T9GhVVOcnXBEBvKu3PoyeHusQY_wJ9wA&s",
    female:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQH5sFjZPx1Yzi1b9_FpQzrxqgsjv2DPAp81Q&s",
    "N/A": "/empty-profile.jpeg",
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    const updatedValue =
      name === "profilePictureUrl" ? profilePictureUrls[value] || "" : value;

    setUpdatedProfile((prevState) => ({
      ...prevState,
      [name]: updatedValue,
    }));
  };

  const handleSubmit = async () => {
    await updateProfile(updatedProfile);
    setIsEditing(false);
  };

  const updateProfile = async (updatedProfile) => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        await axios.put(
          `http://localhost:9000/profile/update/${userId}`,
          updatedProfile
        );
        setProfile(updatedProfile);
      } catch (error) {
        console.error("Error updating profile:", error);
      }
    }
  };

  if (!profile) {
    return (
      <div>
        <Nav />
        <Container className="text-center mt-5">
          <h3>Loading profile...</h3>
        </Container>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <Nav />
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col md={6}>
            <Card>
              <Card.Body className="text-center">
                <Image
                  src={
                    updatedProfile.profilePictureUrl || "/empty-profile.jpeg"
                  }
                  roundedCircle
                  width={150}
                  height={150}
                  alt="Profile Picture"
                  className="mb-3"
                />

                {isEditing ? (
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label>Profile Picture</Form.Label>
                      <Form.Select
                        name="profilePictureUrl"
                        value={
                          Object.keys(profilePictureUrls).find(
                            (key) =>
                              profilePictureUrls[key] ===
                              updatedProfile.profilePictureUrl
                          ) || ""
                        }
                        onChange={handleInputChange}
                      >
                        <option value="">Select an option</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="N/A">N/A</option>
                      </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>First Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="firstName"
                        value={updatedProfile.firstName || ""}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="lastName"
                        value={updatedProfile.lastName || ""}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Bio</Form.Label>
                      <Form.Control
                        as="textarea"
                        name="bio"
                        value={updatedProfile.bio || ""}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={updatedProfile.email || ""}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>City</Form.Label>
                      <Form.Control
                        type="text"
                        name="locationCity"
                        value={updatedProfile.locationCity || ""}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>State</Form.Label>
                      <Form.Control
                        type="text"
                        name="locationState"
                        value={updatedProfile.locationState || ""}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                      Save Changes
                    </Button>
                    <Button
                      variant="secondary"
                      className="ms-2"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                  </Form>
                ) : (
                  <>
                    <Card.Title>
                      {profile.firstName} {profile.lastName}
                    </Card.Title>
                    <Card.Text>
                      <strong>UserName:</strong> @{profile.userName}
                    </Card.Text>
                    <Card.Text>{profile.bio}</Card.Text>
                    <Card.Text>
                      <strong>Email:</strong> {profile.email}
                    </Card.Text>
                    <Card.Text>
                      <strong>Location:</strong>
                      {profile.locationCity || profile.locationState ? (
                        <>
                          {" "}
                          {profile.locationCity}, {profile.locationState}
                        </>
                      ) : (
                        "N/A"
                      )}
                    </Card.Text>
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <Container className="mt-5">
        <h3>Update your profile to collaborate with friends</h3>
        <Button variant="primary" onClick={() => setIsEditing(true)}>
          Update Profile
        </Button>
      </Container>
    </div>
  );
};

export default ProfilePage;
