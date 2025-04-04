package org.example.controller;

import org.example.service.GoogleApi;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/google-places")
@CrossOrigin
public class GooglePlacesController {

    private final Logger log = LoggerFactory.getLogger(GooglePlacesController.class);

    @Autowired
    private GoogleApi googleApi;

    @GetMapping("/place-details")
    public String getPlaceDetails(@RequestParam String cityName) {
        log.debug("Received request for city: {}", cityName);
        return googleApi.fetchPlaceDetails(cityName);
    }

    @GetMapping("/photo")
    public byte[] getPhoto(@RequestParam String photoReference) {
        return googleApi.fetchPhoto(photoReference);
    }
}