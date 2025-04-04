import React from "react";
import { LoadScript } from "@react-google-maps/api";

const libraries = ["places", "geometry", "drawing", "visualization"];

const GoogleMapsProvider = ({ children }) => {
  return (
    <LoadScript
      googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
      libraries={libraries}
    >
      {children}
    </LoadScript>
  );
};

export default GoogleMapsProvider;
