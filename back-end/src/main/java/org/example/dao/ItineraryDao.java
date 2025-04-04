package org.example.dao;

import org.example.model.Itinerary;

import java.util.List;

public interface ItineraryDao {
    Itinerary getItineraryByTripId(int tripId);
    List<Itinerary> getItineraryByCity(String city);
    void addItinerary(Itinerary itinerary);
    
}
