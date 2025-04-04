import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SuccessAlert from "./SuccessAlert";
import FailureAlert from "./FailureAlert";
import Carousel from "react-bootstrap/Carousel";
import { ListGroup, Badge, Button } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";

const GooglePlacesHandler = ({ openAiResponse }) => {
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [cityInfo, setCityInfo] = useState([]);
  const { userId } = useContext(AuthContext);
  const [successAlertMessage, setSuccessAlertMessage] = useState("");
  const [failureAlertMessage, setFailureAlertMessage] = useState("");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPhoto = async (
      photoReference,
      name,
      state,
      attractions,
      description
    ) => {
      try {
        const response = await axios.get(
          `http://localhost:9000/api/google-places/photo`,
          {
            params: {
              photoReference: photoReference,
            },
            responseType: "blob",
          }
        );

        const photoUrl = URL.createObjectURL(response.data);
        addCityInfo(
          name,
          state,
          attractions,
          photoUrl,
          photoReference,
          description
        );
      } catch (error) {
        console.error("Error fetching photo:", error);
      }
    };

    const fetchPlaceDetails = async (name, state, attractions, description) => {
      const cityName = name + ", " + state;
      try {
        const response = await axios.get(
          `http://localhost:9000/api/google-places/place-details`,
          {
            params: {
              cityName: cityName,
            },
          }
        );

        const placeDetails = response.data;
        if (placeDetails.candidates && placeDetails.candidates.length > 0) {
          const firstPhotoReference =
            placeDetails.candidates[0].photos[0].photo_reference;
          await fetchPhoto(
            firstPhotoReference,
            name,
            state,
            attractions,
            description
          );
        }
      } catch (error) {
        console.error("Error fetching place details:", error);
      }
    };

    setCityInfo([]);

    if (openAiResponse && openAiResponse.cities) {
      openAiResponse.cities.forEach(async (city) => {
        await fetchPlaceDetails(
          city.name,
          city.state,
          city.attractions,
          city.description
        );
      });
    }
  }, [openAiResponse]);

  const addCityInfo = (
    name,
    state,
    attractions,
    photoUrl,
    photoReference,
    description
  ) => {
    setCityInfo((prevCityInfo) => {
      if (!prevCityInfo.some((city) => city.name === name)) {
        return [
          ...prevCityInfo,
          { name, state, attractions, photoUrl, photoReference, description },
        ];
      }
      return prevCityInfo;
    });
  };

  const saveCityInfo = (info) => {
    return async () => {
      const storedUserId = localStorage.getItem("userId");
      setFailureAlertMessage("");
      setSuccessAlertMessage("");
      setShowSuccessAlert(false);

      try {
        await axios.post(`http://localhost:9000/trips/add`, {
          userId: storedUserId,
          destinationCity: info.name,
          destinationState: info.state,
          photoUrl: info.photoUrl,
          photoReference: info.photoReference,
          attractions: info.attractions.join(", "),
          cost: 4.99,
          description: info.description,
        });
        setSuccessAlertMessage(
          "Location saved. Click here to view your saved trips."
        );
        setShowSuccessAlert(true);
      } catch (error) {
        if (error.response.data.message === "Trip already exists") {
          setFailureAlertMessage(
            "Location already saved. Please choose another location."
          );
        } else {
          setFailureAlertMessage(
            "Failed to save location. Please try again later."
          );
        }
      }
    };
  };

  return (
    <div className="google-places-results">
      <div className="google-places-handler-carousel">
        <Carousel
          activeIndex={carouselIndex}
          onSelect={(selectedIndex) => {
            setCarouselIndex(selectedIndex);
          }}
          interval={null}
        >
          {cityInfo.map((city, index) => (
            <Carousel.Item key={index}>
              <img
                className="d-block w-100"
                id="google-places-handler-carousel-image"
                src={city.photoUrl}
                alt={`City ${index + 1}`}
              />
              <Carousel.Caption>
                <h3>{city.name}</h3>
              </Carousel.Caption>
            </Carousel.Item>
          ))}
        </Carousel>
      </div>
      {cityInfo[carouselIndex] && (
        <div className="city-info">
          <h1>
            <Badge bg="secondary">Attractions</Badge>
          </h1>
          <ListGroup>
            {cityInfo[carouselIndex].attractions.map((attraction, index) => (
              <ListGroup.Item variant="dark" key={index}>
                {attraction}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      )}
      {failureAlertMessage && (
        <FailureAlert>{failureAlertMessage}</FailureAlert>
      )}
      {userId ? (
        <Button
          variant="primary"
          onClick={saveCityInfo(cityInfo[carouselIndex])}
        >
          Save City
        </Button>
      ) : (
        <>
          <Button
            variant="primary"
            onClick={saveCityInfo(cityInfo[carouselIndex])}
            disabled
          >
            Save City
          </Button>
          <p>please login to save</p>
        </>
      )}
      <SuccessAlert
        show={showSuccessAlert}
        onClose={() => setShowSuccessAlert(false)}
      >
        <span
          style={{
            cursor: "pointer",
            color: "blue",
            textDecoration: "underline",
          }}
          onClick={() => navigate("/savedtrips")}
        >
          {successAlertMessage}
        </span>
      </SuccessAlert>
    </div>
  );
};

export default GooglePlacesHandler;
