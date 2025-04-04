package org.example.dao;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.example.exception.DaoException;
import org.example.model.Trips;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.jdbc.CannotGetJdbcConnectionException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Component;

@Component
public class JdbcTripsDao implements TripsDao {
    private final JdbcTemplate jdbcTemplate;

    public JdbcTripsDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public List<Trips> getTripsByUserId(int userId) {
        List<Trips> trips = new ArrayList<>();
        String sql = "SELECT DISTINCT * FROM trips WHERE user_id = ?";
        try {
            SqlRowSet results = jdbcTemplate.queryForRowSet(sql, userId);
            while (results.next()) {
                Trips trip = mapRowToTrip(results);
                trips.add(trip);
            }
        } catch (CannotGetJdbcConnectionException e) {
            throw new DaoException("Unable to connect to server or database", e);
        } catch (SQLException e) {
            throw new DaoException("Unable to connect to server or database, SQL Exception", e);
        }
        return trips;
    }

    @Override
    public List<Trips> getTrips() {
        return List.of();
    }

    @Override
    public Trips getTripById(int id) {
        Trips trip = new Trips();
        String sql = "SELECT * FROM trips WHERE trip_id = ?";
        try {
            SqlRowSet results = jdbcTemplate.queryForRowSet(sql, id);
            while (results.next()) {
                trip = mapRowToTrip(results);
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return trip;
    }

    @Override
    public void addTrip(Trips trip) {
        String sql = "INSERT INTO trips (user_id, destination_city, destination_state, photo_url, photo_reference, attractions, cost, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        try {
            jdbcTemplate.update(sql, trip.getUserId(), trip.getDestinationCity(), trip.getDestinationState(), trip.getPhotoUrl(), trip.getPhotoReference(), trip.getAttractions(), trip.getCost(), trip.getDescription());
        }
        catch (CannotGetJdbcConnectionException e) {
            throw new DaoException("Unable to connect to server or database", e);
        }
    }

    @Override
    public Trips getTripByCity(String city, int userId) {
        Trips trip = null;
        String sql = "SELECT * FROM trips WHERE destination_city = ? AND user_id = ?";
        try {
            SqlRowSet results = jdbcTemplate.queryForRowSet(sql, city, userId);
            while (results.next()) {
                trip = mapRowToTrip(results);
            }
        }
        catch (CannotGetJdbcConnectionException e) {
            throw new DaoException("Unable to connect to server or database", e);
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return trip;
    }

    @Override
    public void deleteTrip(int tripId) {
        String sql = "DELETE FROM itinerary WHERE trip_id = ?; DELETE FROM trips WHERE trip_id = ?";
        try {
            jdbcTemplate.update(sql, tripId, tripId);
        } catch (CannotGetJdbcConnectionException e) {
            throw new DaoException("Unable to connect to server or database", e);
        } catch (DataIntegrityViolationException e) {
            throw new DaoException("Data integrity violation", e);
        }

    }

    private Trips mapRowToTrip(SqlRowSet results) throws SQLException {
        Trips trip = new Trips();
        trip.setId(results.getInt("trip_id"));
        trip.setUserId(results.getInt("user_id"));
        trip.setDestinationCity(results.getString("destination_city"));
        trip.setDestinationState(results.getString("destination_state"));
        trip.setPhotoUrl(results.getString("photo_url"));
        trip.setPhotoReference(results.getString("photo_reference"));
        trip.setAttractions(results.getString("attractions"));
        trip.setCost(results.getInt("cost"));
        trip.setDescription(results.getString("description"));
        return trip;
    }
}
