import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Nav from "../components/Nav";
import { AuthContext } from "../context/AuthContext";
import Card from "react-bootstrap/Card";
import Placeholder from "react-bootstrap/Placeholder";

const SavedTripsPage = () => {
  const maxWidth = 600;
  const maxHeight = 600;
  const { userId } = useContext(AuthContext);
  const [trips, setTrips] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      const storeduserId = localStorage.getItem("userId");
      try {
        const response = await axios.get(
          `http://localhost:9000/trips/${storeduserId}`
        );

        setTrips(response.data);
      } catch (error) {
        console.error("Error fetching trips:", error);
      }
    };

    fetchTrips();

    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [userId]);

  const handleTripClick = (trip) => {
    navigate("/trips", { state: { trip } });
  };

  return (
    <div className="saved-trips-page-container">
      <Nav />
      {loading ? (
        <div className="saved-trips-cards">
          {trips.map((trip) => (
            <Card style={{ width: "18rem" }} key={trip.id}>
              <Card.Body>
                <Placeholder as={Card.Title} animation="glow">
                  <Placeholder xs={6} />
                </Placeholder>
                <Placeholder as={Card.Text} animation="glow">
                  <Placeholder xs={7} /> <Placeholder xs={4} />{" "}
                  <Placeholder xs={4} /> <Placeholder xs={6} />{" "}
                  <Placeholder xs={8} />
                </Placeholder>
                <Placeholder.Button variant="primary" xs={6} />
              </Card.Body>
            </Card>
          ))}
        </div>
      ) : (
        <div className="saved-trips-cards">
          {trips.map((trip) => (
            <Card
              id="saved-trip-card"
              key={trip.id}
              onClick={() => handleTripClick(trip)}
            >
              <Card.Img
                variant="top"
                className="saved-card-image"
                src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&maxheight=${maxHeight}&photoreference=${trip.photoReference}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`}
              />
              <Card.Body>
                <Card.Title>
                  {trip.destinationCity}, {trip.destinationState}
                </Card.Title>
                <Card.Text>{trip.description}</Card.Text>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedTripsPage;
