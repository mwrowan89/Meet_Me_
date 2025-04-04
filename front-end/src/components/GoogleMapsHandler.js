import React, { useEffect, useRef, useState } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { Form, InputGroup } from "react-bootstrap";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 37.0902,
  lng: -95.7129,
};

const defaultMapOptions = {
  disableDefaultUI: true,
};

const GoogleMapsHandler = ({ markerPositions, citiesLength }) => {
  const mapRef = useRef(null);
  const [mapOptions, setMapOptions] = useState(defaultMapOptions);

  useEffect(() => {
    if (mapRef.current) {
      if (markerPositions.length === 0) {
        // If markerPositions is empty, set the map to the defined center and zoom
        mapRef.current.setCenter(center);
        mapRef.current.setZoom(4); // Default zoom level
      } else {
        // If markerPositions is not empty, fit the bounds to the markers
        const bounds = new window.google.maps.LatLngBounds();
        markerPositions.forEach((position) => {
          bounds.extend(position);
        });
        mapRef.current.fitBounds(bounds);
      }
    }
  }, [markerPositions]);

  const pinPath =
    //SVG pin icon
    "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z";

  const createCustomIcon = (color) => ({
    path: pinPath,
    fillColor: color,
    fillOpacity: 1,
    strokeWeight: 0,
    scale: 1.5,
    anchor: new window.google.maps.Point(12, 24),
  });

  const handleMapTypeChange = (event) => {
    const selectedType = event.target.value;
    setMapOptions((prevOptions) => ({
      ...prevOptions,
      mapTypeId: selectedType,
    }));
  };

  return (
    <div className="google-maps-handler-container">
      <div>
        <Form.Group controlId="mapType" className="map-controls">
          <InputGroup.Text>Map Options:</InputGroup.Text>
          <Form.Select onChange={handleMapTypeChange} style={{ width: "auto" }}>
            <option value="roadmap">Roadmap</option>
            <option value="satellite">Satellite</option>
            <option value="hybrid">Hybrid</option>
            <option value="terrain">Terrain</option>
          </Form.Select>
        </Form.Group>
      </div>
      <div className="map-container">
        <GoogleMap
          mapContainerClassName="map-container"
          mapContainerStyle={containerStyle}
          center={markerPositions[0] || center}
          zoom={4}
          onLoad={(map) => (mapRef.current = map)}
          options={mapOptions}
        >
          {markerPositions.map((position, index) => (
            <Marker
              key={index}
              position={position}
              icon={createCustomIcon(index < citiesLength ? "red" : "blue")}
            />
          ))}
        </GoogleMap>
      </div>
    </div>
  );
};

export default GoogleMapsHandler;
