import React, { useEffect, useRef, useState } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import GooglePlacesHandler from "./GooglePlacesHandler";

const GooglePromptBox = ({ onSearch, onCitiesLengthChange, resetCities }) => {
  const [cities, setCities] = useState(["", ""]);
  const [showInputGroup, setShowInputGroup] = useState(true); // New state for visibility
  const inputRefs = useRef([]);
  const citiesLength = 2;

  const initializeAutocomplete = () => {
    inputRefs.current.forEach((inputRef, index) => {
      if (inputRef) {
        const autocomplete = new window.google.maps.places.Autocomplete(
          inputRef,
          { types: ["(cities)"] }
        );

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          if (place && place.formatted_address) {
            setCities((prevCities) => {
              const newCities = [...prevCities];
              newCities[index] = place.formatted_address;
              onCitiesLengthChange(newCities.length);
              return newCities;
            });
          }
        });
      }
    });
  };

  useEffect(() => {
    if (window.google && window.google.maps && window.google.maps.places) {
      initializeAutocomplete();
    }
    if (resetCities) {
      resetCities(() => {
        setCities(["", ""]);
        setShowInputGroup(true);
      });
    } // eslint-disable-next-line
  }, [resetCities]);

  const handleInputChange = (index, event) => {
    const newCities = [...cities];
    newCities[index] = event.target.value;
    setCities(newCities);
    onCitiesLengthChange(newCities.length);
  };

  const handleSearch = () => {
    onSearch(cities);
    setCities(["", ""]);
    setShowInputGroup(false);
  };

  const addInputBox = () => {
    const newCities = [...cities, ""];
    setCities(newCities);
    onCitiesLengthChange(citiesLength + 1);
  };

  const removeInputBox = (index) => {
    const newCities = cities.filter((_, i) => i !== index);
    setCities(newCities);
    onCitiesLengthChange(citiesLength - 1);
  };

  return (
    <>
      {showInputGroup && (
        <>
          {cities.map((city, index) => (
            <InputGroup
              key={index}
              size="lg"
              style={{ width: "50%", margin: "auto", marginTop: "4vh" }}
            >
              <InputGroup.Text id="inputGroup-sizing-lg">
                {index === 0
                  ? "Your Location:"
                  : index === 1
                  ? "Friend's Location:"
                  : `Location ${index + 1}:`}
              </InputGroup.Text>
              <Form.Control
                ref={(el) => (inputRefs.current[index] = el)}
                aria-label="Large"
                aria-describedby="inputGroup-sizing-sm"
                value={city}
                onChange={(event) => handleInputChange(index, event)}
              />
              {index > 1 && (
                <Button
                  variant="outline-danger"
                  id="button-addon2"
                  onClick={() => removeInputBox(index)}
                >
                  Remove
                </Button>
              )}
            </InputGroup>
          ))}
          <div className="google-prompt-btns">
            <Button
              variant="outline-primary"
              id="button-addon2"
              onClick={addInputBox}
              disabled={cities[0] === "" || cities[1] === ""}
              style={{ marginTop: "2vh" }}
            >
              Add Location
            </Button>
            <Button
              variant="outline-primary"
              id="button-addon2"
              onClick={handleSearch}
              style={{ marginTop: "2vh" }}
              disabled={cities[0] === "" || cities[1] === ""}
            >
              Search
            </Button>
          </div>
        </>
      )}
      <div style={{ display: "none" }}>
        <GooglePlacesHandler searchedLocations={cities} />
      </div>
    </>
  );
};

export default GooglePromptBox;
