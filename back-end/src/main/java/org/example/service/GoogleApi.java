package org.example.service;

import org.example.controller.AuthenticationController;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class GoogleApi {
    private final Logger log = LoggerFactory.getLogger(AuthenticationController.class);

    @Value("${google.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate;

    public GoogleApi(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public String fetchPlaceDetails(String cityName) {
        log.debug(cityName);
        String url = String.format(
            "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=%s&inputtype=textquery&fields=photos,name&key=%s",
            cityName, apiKey
        );
        return restTemplate.getForObject(url, String.class);
    }

    public byte[] fetchPhoto(String photoReference) {
        String url = String.format(
            "https://maps.googleapis.com/maps/api/place/photo?photoreference=%s&key=%s&maxwidth=1000&maxheight=1000",
            photoReference, apiKey
        );
        return restTemplate.getForObject(url, byte[].class);
    }
}