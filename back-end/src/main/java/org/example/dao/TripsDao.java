package org.example.dao;
import java.util.List;

import org.example.model.Trips;

public interface  TripsDao {
    List<Trips> getTripsByUserId(int userId);
    List<Trips> getTrips();
    Trips getTripById(int id);
    void addTrip(Trips trip);
    Trips getTripByCity(String city, int userId);
    void deleteTrip(int id);
}
