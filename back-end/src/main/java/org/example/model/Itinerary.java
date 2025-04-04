package org.example.model;

import java.util.Map;

public class Itinerary {
    private int itineraryId;
    private int tripId;
    private String city;
    private Map<String, Object> itinerary;

    public Itinerary() {
    }

    public Itinerary(int itineraryId, String city, Map<String, Object> itinerary) {
        this.itineraryId = itineraryId;
        this.tripId = itineraryId;
        this.city = city;
        this.itinerary = itinerary;
    }

    //Getters and Setters
    public int getItineraryId() {
        return itineraryId;
    }
    public void setItineraryId(int itineraryId) {
        this.itineraryId = itineraryId;
    }
    public int getTripId() {
        return tripId;
    }
    public void setTripId(int tripId) {
        this.tripId = tripId;
    }
    public String getCity() {
        return city;
    }
    public void setCity(String city) {
        this.city = city;
    }
    public Map<String, Object> getItinerary() {
        return itinerary;
    }
    public void setItinerary(Map<String, Object> itinerary) {
        this.itinerary = itinerary;
    }

}
