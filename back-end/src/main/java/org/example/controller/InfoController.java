package org.example.controller;

import java.util.List;

import org.example.dao.ItineraryDao;
import org.example.dao.ProfileDao;
import org.example.dao.TripsDao;
import org.example.dao.UserDao;
import org.example.model.Itinerary;
import org.example.model.Profile;
import org.example.model.Trips;
import org.example.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@CrossOrigin
public class InfoController {

    private final TripsDao tripsDao;
    private final UserDao userDao;
    private final ItineraryDao itineraryDao;
    private final ProfileDao profileDao;

    @Autowired
    public InfoController(TripsDao tripsDao, UserDao userDao, ItineraryDao itineraryDao, ProfileDao profileDao) {
        this.tripsDao = tripsDao;
        this.userDao = userDao;
        this.itineraryDao = itineraryDao;
        this.profileDao = profileDao;
    }

    // Users
    @RequestMapping(path = "/users", method = RequestMethod.GET)
    public List<User> getUsers() {
        return userDao.getUsers();
    }
    @RequestMapping(path = "/users/{username}", method = RequestMethod.GET)
    public User getUserByUsername(@PathVariable String username) {
        return userDao.getUserByUsername(username);
    }

    // Profile
    @RequestMapping(path="/profile/add", method = RequestMethod.POST)
    public void addProfile(@RequestBody Profile profile) {
        profileDao.createProfile(profile);
    }
    @RequestMapping(path = "profile/update/{userId}", method = RequestMethod.PUT)
    public void updateProfile(@RequestBody Profile profile, @PathVariable int userId) {
        profileDao.updateProfile(profile, userId);
    }
    @RequestMapping(path = "profile/{userId}", method = RequestMethod.GET)
    public Profile getProfileByUserId(@PathVariable int userId) {
        return profileDao.getProfileById(userId);
    }

    // Trips
    @RequestMapping(path = "/trips/{userId}", method = RequestMethod.GET)
    public List<Trips> getTripsByUserId(@PathVariable int userId) {
        return tripsDao.getTripsByUserId(userId);
    }
    @RequestMapping(path = "/trips/add", method = RequestMethod.POST)
    public void addTrip(@RequestBody Trips trip) {
        if(tripsDao.getTripByCity(trip.getDestinationCity(), trip.getUserId()) != null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Trip already exists");
        } else {
            tripsDao.addTrip(trip);
        }
    }
    @RequestMapping(path = "trip/{tripId}", method = RequestMethod.GET)
    public Trips getTripById(@PathVariable int tripId) {
        return tripsDao.getTripById(tripId);
    }
    @RequestMapping(path = "trip/delete/{tripId}", method = RequestMethod.DELETE)
    public void deleteTrip(@PathVariable int tripId) {
        tripsDao.deleteTrip(tripId);
    }

    // Itinerary
    @RequestMapping(path = "/itinerary/add", method = RequestMethod.POST)
    public void addItinerary(@RequestBody Itinerary itinerary) {
        itineraryDao.addItinerary(itinerary);
    }
    @RequestMapping(path = "/itinerary/{tripId}", method = RequestMethod.GET)
    public Itinerary getItineraryByTripId(@PathVariable int tripId) {
        return itineraryDao.getItineraryByTripId(tripId);
    }
}

