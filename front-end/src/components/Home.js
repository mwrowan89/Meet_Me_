import React, { useState, useContext, useEffect, useRef } from "react";
import GooglePlacesHandler from "./GooglePlacesHandler";
import GoogleMapsHandler from "./GoogleMapsHandler";
import OpenAIHandler from "./OpenAIHandler";
import SuccessAlert from "./SuccessAlert";
import FailureAlert from "./FailureAlert";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import { AuthContext } from "../context/AuthContext";
import GooglePromptBox from "./GooglePromptBox";

const Home = () => {
  const [markerPositions, setMarkerPositions] = useState([]);
  const [openAiResponse, setopenAiResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showFailureAlert, setShowFailureAlert] = useState(false);
  const [failureAlertMessage, setFailureAlertMessage] = useState("");
  const [aiFetched, setAiFetched] = useState(false);
  const [citiesLength, setCitiesLength] = useState(2);
  const resetCitiesRef = useRef(null);

  const { loginStatus } = useContext(AuthContext);
  const resetCities = (callback) => {
    resetCitiesRef.current = callback;
  };

  useEffect(() => {
    if (loginStatus === "success") {
      setShowSuccessAlert(true);
      setTimeout(() => {
        setShowSuccessAlert(false);
      }, 5000);
    }
  }, [loginStatus]);

  const handleSearch = async (cities) => {
    setLoading(true);

    const geocodePromises = cities.map(async (city) => {
      const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        city
      )}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`;
      try {
        const response = await fetch(geocodeUrl);
        const data = await response.json();
        if (data.status === "OK" && data.results && data.results.length > 0) {
          const location = data.results[0].geometry.location;
          return { lat: location.lat, lng: location.lng };
        } else {
          setShowFailureAlert(true);
          setFailureAlertMessage(
            `Could not find location for ${city}. Please try again.`
          );
          setTimeout(() => {
            setShowFailureAlert(false);
          }, 5000);
          setLoading(false);
          return null;
        }
      } catch (error) {
        console.error(`Error fetching geocode data for ${city}:`, error);
        alert(`An error occurred while fetching location data for ${city}`);
        return null;
      }
    });

    const locations = await Promise.all(geocodePromises);
    const validLocations = locations.filter((location) => location !== null);
    setMarkerPositions((prevPositions) => [
      ...prevPositions,
      ...validLocations,
    ]);
    // setAiFetched(false);
  };

  const handleopenAIResponse = (response) => {
    if (response && response.cities) {
      const aiCities = response.cities.map(
        (city) => `${city.name}, ${city.state}`
      );
      handleSearch(aiCities);
      setopenAiResponse(response);
      setAiFetched(true);
    } else {
      console.error("Invalid response from OpenAI:", response);
    }
    setLoading(false);
  };

  const handleRefresh = () => {
    setMarkerPositions([]);
    setopenAiResponse(null);
    setAiFetched(false);
    if (resetCitiesRef.current) {
      resetCitiesRef.current();
    }
  };

  return (
    <div className="home-container">
      {showSuccessAlert && (
        <div className="home-success-alert">
          <SuccessAlert
            show={showSuccessAlert}
            onClose={() => setShowSuccessAlert(false)}
          >
            Login successful!
          </SuccessAlert>
        </div>
      )}

      <div className="home-banner-box"></div>
      <div className="home-title-container">
        <h3 className="home-title">
          Meet Me @ is your go-to travel planning tool that helps friends,
          families, and groups discover the ideal centralized destination for
          unforgettable getaways. Whether you're coming from different cities or
          countries, we make it easy to meet in the middle—fair, fun, and
          hassle-free. <br />
          <br />
          Start planning your Halfway Vacay now!
        </h3>
      </div>

      <div className="home-prompt-box-map">
        <GooglePromptBox
          onSearch={handleSearch}
          onCitiesLengthChange={setCitiesLength}
          resetCities={resetCities}
        />
        <Button
          variant="outline-secondary"
          id="button-addon2"
          style={{ marginTop: "2vh" }}
          onClick={() => {
            handleRefresh();
          }}
        >
          Refresh Search
        </Button>
        {showFailureAlert && (
          <FailureAlert
            show={showFailureAlert}
            onClose={() => setShowFailureAlert(false)}
          >
            {failureAlertMessage}
          </FailureAlert>
        )}
        <div className="us-map">
          <GoogleMapsHandler
            markerPositions={markerPositions}
            openAiResponse={openAiResponse}
            citiesLength={citiesLength}
          />
        </div>
        {loading && (
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        )}
        {markerPositions.length >= 2 && !aiFetched && (
          <OpenAIHandler
            coordinates={markerPositions}
            onResponse={handleopenAIResponse}
          />
        )}
        {openAiResponse && (
          <GooglePlacesHandler openAiResponse={openAiResponse} />
        )}
      </div>
    </div>
  );
};

export default Home;
