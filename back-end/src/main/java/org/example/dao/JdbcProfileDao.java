package org.example.dao;

import org.example.exception.DaoException;
import org.example.model.Profile;
import org.springframework.jdbc.CannotGetJdbcConnectionException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Component;


@Component
public class JdbcProfileDao implements ProfileDao {
    private final JdbcTemplate jdbcTemplate;
    public JdbcProfileDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }


    @Override
    public Profile getProfileById(int userId){
        Profile profile = null;
        String sql = "SELECT * FROM profile WHERE user_id = ?";
        try {
            SqlRowSet results = jdbcTemplate.queryForRowSet(sql, userId);
            if (results.next()) {
                profile = mapRowToProfile(results);
            }
        } catch (CannotGetJdbcConnectionException e) {
            throw new DaoException("Unable to connect to server or database", e);
        }
        return profile;
    }

    @Override
    public void createProfile(Profile profile) {
        String sql = "INSERT INTO profile (user_id, user_name, email) VALUES (?, ?, ?)";
        try {
            jdbcTemplate.update(sql, profile.getUserId(), profile.getUserName(), profile.getEmail());
        } catch (CannotGetJdbcConnectionException e) {
            throw new DaoException("Unable to connect to server or database", e);
        }
    }

    @Override
    public void updateProfile(Profile profile, int userId) {
        String sql = "UPDATE profile SET first_name = ?, last_name = ?, user_name = ?, email = ?, location_city = ?, location_state = ?, bio = ?, profile_picture_url = ?  WHERE user_id = ?";
        try {
            jdbcTemplate.update(sql, profile.getFirstName(), profile.getLastName(), profile.getUserName(), profile.getEmail(), profile.getLocationCity(), profile.getLocationState(), profile.getBio(), profile.getProfilePictureUrl(), userId);
        } catch (CannotGetJdbcConnectionException e) {
            throw new DaoException("Unable to connect to server or database", e);
        }

    }

    @Override
    public void deleteUser(int id) {

    }



    private Profile mapRowToProfile(SqlRowSet results) {
        Profile profile = new Profile();
        profile.setUserId(results.getInt("user_id"));
        profile.setFirstName(results.getString("first_name"));
        profile.setLastName(results.getString("last_name"));
        profile.setUserName(results.getString("user_name"));
        profile.setEmail(results.getString("email"));
        profile.setLocationCity(results.getString("location_city"));
        profile.setLocationState(results.getString("location_state"));
        profile.setBio(results.getString("bio"));
        profile.setProfilePictureUrl(results.getString("profile_picture_url"));
        return profile;
    }
}
