package org.example.dao;

import org.example.model.Profile;

public interface ProfileDao {

    Profile getProfileById(int userId);
    void createProfile(Profile profile);
    void updateProfile(Profile profile, int userId);
    void deleteUser(int id);
}
