package org.example.model;

public class Trips {
    private int id;
    private int userId;
    private String destinationCity;
    private String destinationState;
    private String photoUrl;
    private String photoReference;
    private String attractions;
    private double cost;
    private String description;

    public Trips() {
    }

    public Trips(int id, int userId, String destinationCity, String destinationState, String photoUrl, String photoReference, String attractions, double cost, String description) {
        this.id = id;
        this.userId = userId;
        this.destinationCity = destinationCity;
        this.destinationState = destinationState;
        this.photoUrl = photoUrl;
        this.photoReference = attractions;
        this.attractions = attractions;
        this.cost = cost;
        this.description = description;
    }

    // Getters and Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getDestinationCity() {
        return destinationCity;
    }

    public void setDestinationCity(String destinationCity) {
        this.destinationCity = destinationCity;
    }

    public String getDestinationState() {
        return destinationState;
    }

    public void setDestinationState(String destinationState) {
        this.destinationState = destinationState;
    }

    public String getPhotoUrl() {
        return photoUrl;
    }

    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
    }
    public String getPhotoReference() {
        return photoReference;
    }
    public void setPhotoReference(String photoReference) {
        this.photoReference = photoReference;
    }

    public String getAttractions() {
        return attractions;
    }

    public void setAttractions(String attractions) {
        this.attractions = attractions;
    }

    public double getCost() {
        return cost;
    }

    public void setCost(double cost) {
        this.cost = cost;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}