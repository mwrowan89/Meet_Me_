import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";

const PromptBox = ({ onSearch }) => {
  const [city, setCity] = useState("");

  const handleInputChange = (event) => {
    setCity(event.target.value);
  };

  const handleSearch = () => {
    onSearch(city);
    setCity("");
  };

  return (
    <>
      <InputGroup
        size="lg"
        style={{ width: "50%", margin: "auto", marginTop: "4vh" }}
      >
        <InputGroup.Text id="inputGroup-sizing-lg">
          Enter a Location:
        </InputGroup.Text>
        <Form.Control
          aria-label="Large"
          aria-describedby="inputGroup-sizing-sm"
          value={city}
          onChange={handleInputChange}
        />
        <Button
          variant="outline-secondary"
          id="button-addon2"
          onClick={handleSearch}
        >
          Search
        </Button>
      </InputGroup>
    </>
  );
};

export default PromptBox;
