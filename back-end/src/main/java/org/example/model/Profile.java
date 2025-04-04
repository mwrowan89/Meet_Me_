package org.example.model;

public class Profile {
    private int userId;
    private String firstName;
    private String lastName;
    private String email;
    private String locationCity;
    private String locationState;
    private String bio;
    private String profilePictureUrl;
    private String userName;

    public Profile() {
    }

    public Profile(int userId, String firstName, String lastName, String email, String locationCity, String locationState, String bio, String profilePictureUrl, String userName) {
        this.userId = userId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.locationCity = locationCity;
        this.locationState = locationState;
        this.bio = bio;
        this.profilePictureUrl = profilePictureUrl;
        this.userName = userName;

    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getProfilePictureUrl() {
        return profilePictureUrl;
    }

    public void setProfilePictureUrl(String profilePictureUrl) {
        this.profilePictureUrl = profilePictureUrl;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getLocationCity() {
        return locationCity;
    }

    public void setLocationCity(String location) {
        this.locationCity = location;
    }
    public String getLocationState() {
        return locationState;
    }

    public void setLocationState(String locationState) {
        this.locationState = locationState;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }
    public String getUserName() {
        return userName;
    }
    public void setUserName(String userName) {
        this.userName = userName;
    }
}
