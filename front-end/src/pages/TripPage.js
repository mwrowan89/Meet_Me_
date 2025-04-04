import React, { useEffect, useState } from "react";
import axios from "axios";
import Nav from "../components/Nav";
import { useLocation, useNavigate } from "react-router-dom";
import { GoogleMap, Marker } from "@react-google-maps/api";
import ItineraryAIHandler from "../components/ItineraryAIHandler";
import SuccessAlert from "../components/SuccessAlert";
import FailureAlert from "../components/FailureAlert";
import EmailModal from "../components/EmailModal";
import Button from "react-bootstrap/esm/Button";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
import Table from "react-bootstrap/Table";

const center = {
  lat: 37.0902,
  lng: -95.7129,
};

const mapOptions = {
  disableDefaultUI: true,
};

const TripsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [markerPositions, setMarkerPositions] = useState([]);
  const [photoUrl, setPhotoUrl] = useState("");
  const [itinerary, setItinerary] = useState(null);
  const [loadingItinerary, setLoadingItinerary] = useState(false);
  const [successAlertMessage, setSuccessAlertMessage] = useState("");
  const [failureAlertMessage, setFailureAlertMessage] = useState("");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showSaveBtn, setShowSaveBtn] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");

  const { trip } = location.state || {};

  useEffect(() => {
    if (trip) {
      setItinerary(null);
      const fetchGeocode = async () => {
        const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          `${trip.destinationCity}`
        )}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`;
        try {
          const response = await fetch(geocodeUrl);
          const data = await response.json();
          if (data.status === "OK" && data.results && data.results.length > 0) {
            const location = data.results[0].geometry.location;
            setMarkerPositions([{ lat: location.lat, lng: location.lng }]);
          } else {
            alert("Location not found");
          }
        } catch (error) {
          console.error("Error fetching geocode data:", error);
          alert("An error occurred while fetching location data");
        }
      };

      fetchGeocode();
      setPhotoUrl(trip.photoReference);
    }
    //eslint-disable-next-line
  }, [trip]);

  useEffect(() => {
    if (trip) {
      const fetchItinerary = async (city) => {
        try {
          const response = await axios.get(
            `http://localhost:9000/itinerary/${trip.id}`
          );
          if (response.data) {
            setItinerary(response.data.itinerary);
            setShowSaveBtn(false);
          } else {
            setShowSaveBtn(true);
          }
        } catch (error) {
          console.error("Error fetching itinerary:", error);
        }
      };
      fetchItinerary(trip.tripId);
    }
  }, [trip]);

  const handleDeleteTrip = async () => {
    if (!trip || !trip.id) {
      return;
    }
    try {
      await axios.delete(`http://localhost:9000/trip/delete/${trip.id}`);
      setShowDeleteModal(false); // Close the modal after deletion
      navigate("/savedtrips");
      setSuccessAlertMessage("Trip deleted successfully!");
    } catch (error) {
      console.error("Error deleting trip:", error);
      setFailureAlertMessage(
        "An error occurred while deleting the trip. Please try again."
      );
    }
  };

  const handleGenerateItinerary = async () => {
    if (!trip || !trip.destinationCity) return;

    setLoadingItinerary(true);
    setItinerary(null);

    try {
      const response = await ItineraryAIHandler.generateItinerary(
        trip.destinationCity
      );
      setItinerary(response);
    } catch (error) {
      console.error("Error generating itinerary:", error);
      setFailureAlertMessage(
        "Failed to generate itinerary. Please ensure the city name is valid and try again."
      );
    } finally {
      setLoadingItinerary(false);
    }
  };

  const saveItinerary = (itinerary) => {
    return async () => {
      try {
        if (Array.isArray(itinerary)) {
          console.error("Itinerary is an array, converting to object...");
          itinerary = Object.assign({}, itinerary);
        }

        await axios.post(`http://localhost:9000/itinerary/add`, {
          tripId: trip.id,
          city: trip.destinationCity,
          itinerary: itinerary,
        });

        setSuccessAlertMessage("Itinerary saved successfully");
        setShowSuccessAlert(true);
        setShowSaveBtn(false);
      } catch (error) {
        console.error("Error saving itinerary:", error);
        setFailureAlertMessage(
          "An error occurred while saving itinerary, try reloading the page"
        );
      }
    };
  };

  const handleInviteClick = (trip) => {
    setSelectedTrip(trip);
    setEmailSubject(`Check out this Trip on Meet Me @!`);
    setEmailMessage(
      `Hi there! I wanted to share this amazing trip with you in ${trip.destinationCity}, ${trip.destinationState}! \n\nCheck it out here: ${window.location.origin}`
    );
    setShowEmailModal(true);
  };

  const handleCloseModal = () => {
    setShowEmailModal(false); // Hide the modal
    setSelectedTrip(null); // Clear the selected trip
  };

  return (
    <>
      <Nav />
      <div className="trips-page-whole">
        <br />
        {trip ? (
          <>
            <div className="trips-info-container">
              <h1 id="title-header">
                {trip.destinationCity}, {trip.destinationState}
              </h1>
              <p>{trip.description}</p>
              <p>Attractions: {trip.attractions}</p>
            </div>

            <div className="google-map-container-trip">
              {photoUrl ? (
                <img
                  id="trip-photo"
                  src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${trip.photoReference}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`}
                  alt={`${trip.destinationCity}`}
                />
              ) : (
                <p>No image available</p>
              )}
              <GoogleMap
                center={markerPositions[0] || center}
                zoom={6}
                id="google-map-trip"
                options={mapOptions}
              >
                {markerPositions.map((position, index) => (
                  <Marker key={index} position={position} />
                ))}
              </GoogleMap>
            </div>
            <div className="trips-itin-save-btn-container">
              {itinerary == null && (
                <Button
                  onClick={handleGenerateItinerary}
                  disabled={loadingItinerary}
                >
                  {loadingItinerary ? (
                    <Spinner animation="border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  ) : (
                    "Generate 2-Day Itinerary"
                  )}
                </Button>
              )}
              <Button onClick={() => handleInviteClick(trip)}>
                Share This Trip
              </Button>
            </div>
            {itinerary && (
              <div>
                <h2 id="title-header">
                  2-Day Itinerary for {trip.destinationCity}
                </h2>
                <div className="itinerary-table">
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Day</th>
                        <th>Time</th>
                        <th>Activity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Day 1 */}
                      <tr>
                        <td rowSpan="3">Day 1</td>
                        <td>Morning</td>
                        <td>{itinerary.day1.morning}</td>
                      </tr>
                      <tr>
                        <td>Afternoon</td>
                        <td>{itinerary.day1.afternoon}</td>
                      </tr>
                      <tr>
                        <td>Evening</td>
                        <td>{itinerary.day1.evening}</td>
                      </tr>
                      {/* Day 2 */}
                      <tr>
                        <td rowSpan="3">Day 2</td>
                        <td>Morning</td>
                        <td>{itinerary.day2.morning}</td>
                      </tr>
                      <tr>
                        <td>Afternoon</td>
                        <td>{itinerary.day2.afternoon}</td>
                      </tr>
                      <tr>
                        <td>Evening</td>
                        <td>{itinerary.day2.evening}</td>
                      </tr>
                    </tbody>
                  </Table>
                </div>{" "}
                {showSaveBtn && (
                  <Button onClick={saveItinerary(itinerary)}>
                    Save Itinerary
                  </Button>
                )}
                {showSuccessAlert && (
                  <div className="home-success-alert">
                    <SuccessAlert
                      show={showSuccessAlert}
                      onClose={() => setShowSuccessAlert(false)}
                    >
                      {successAlertMessage}
                    </SuccessAlert>
                  </div>
                )}
                {failureAlertMessage && (
                  <div className="home-failure-alert">
                    <FailureAlert
                      show={!!failureAlertMessage}
                      onClose={() => setFailureAlertMessage("")}
                    >
                      {failureAlertMessage}
                    </FailureAlert>
                  </div>
                )}
              </div>
            )}
            <Button
              id="trip-delete-btn"
              variant="danger"
              onClick={() => setShowDeleteModal(true)}
            >
              Delete Trip
            </Button>
          </>
        ) : (
          <p>No trip selected</p>
        )}
      </div>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this trip? This action cannot be
          undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteTrip}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      <EmailModal
        show={showEmailModal}
        handleClose={handleCloseModal}
        trip={selectedTrip}
        defaultSubject={emailSubject}
        defaultMessage={emailMessage}
      />
    </>
  );
};

export default TripsPage;
