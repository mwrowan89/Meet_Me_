package org.example.dao;

import java.util.List;
import java.util.Map;

import org.example.exception.DaoException;
import org.example.model.Itinerary;
import org.springframework.jdbc.CannotGetJdbcConnectionException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.rowset.SqlRowSet;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;


@Component
public class JdbcItineraryDao implements ItineraryDao {
    private final JdbcTemplate jdbcTemplate;

    public JdbcItineraryDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public Itinerary getItineraryByTripId(int tripId) {
        Itinerary itinerary = null;
        String sql = "SELECT * FROM itinerary WHERE trip_id = ?";
        try {
            SqlRowSet results = jdbcTemplate.queryForRowSet(sql, tripId);
            if (results.next()) {
                itinerary = mapRowToItinerary(results);
            }
        } catch (CannotGetJdbcConnectionException e) {
            throw new DaoException("Unable to connect to server or database", e);
        } 
        return itinerary;
    }

    @Override
    public List<Itinerary> getItineraryByCity(String city) {
        return List.of();
    }

    // @Override
    // public void updateItinerary(Itinerary itinerary) {
    //     String sql = "UPDATE itinerary SET city = ?, itinerary = ? WHERE trip_id = ?";
    //     ObjectMapper objectMapper = new ObjectMapper();
    //     try {
    //         String itineraryJson = objectMapper.writeValueAsString(itinerary.getItinerary());
    //         jdbcTemplate.update(sql, itinerary.getCity(), itineraryJson, itinerary.getTripId());
    //     } catch (JsonProcessingException e) {
    //         throw new DaoException("Error serializing itinerary object to JSON", e);
    //     } catch (CannotGetJdbcConnectionException e) {
    //         throw new DaoException("Unable to connect to server or database", e);
    //     }
    // }

    @Override
    public void addItinerary(Itinerary itinerary) {
        String sql = "INSERT INTO itinerary (trip_id, city, itinerary) VALUES (?, ?, ?);";
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            String itineraryJson = objectMapper.writeValueAsString(itinerary.getItinerary());
            jdbcTemplate.update(sql, itinerary.getTripId(), itinerary.getCity(), itineraryJson);
        } catch (JsonProcessingException e) {
            throw new DaoException("Error serializing itinerary object to JSON", e);
        } catch (CannotGetJdbcConnectionException e) {
            throw new DaoException("Unable to connect to server or database", e);
        }
    }

    private Itinerary mapRowToItinerary(SqlRowSet rs) {
        Itinerary itinerary = new Itinerary();
        itinerary.setItineraryId(rs.getInt("itinerary_id"));
        itinerary.setTripId(rs.getInt("trip_id"));
        itinerary.setCity(rs.getString("city"));
        ObjectMapper objectMapper = new ObjectMapper(); //Deserialize
        try {
            String itineraryJson = rs.getString("itinerary");
            if (itineraryJson != null && !itineraryJson.isEmpty()) {
                // Deserialize JSON to a Map
                Map<String, Object> itineraryMap = objectMapper.readValue(itineraryJson, new com.fasterxml.jackson.core.type.TypeReference<Map<String, Object>>() {});
                itinerary.setItinerary(itineraryMap);
            } else {
                itinerary.setItinerary(null);
            }
        } catch (JsonProcessingException e) {
            throw new DaoException("Error deserializing itinerary JSON to object", e);
        } catch (CannotGetJdbcConnectionException e) {
            throw new DaoException("Unable to connect to server or database", e);
        }
        return itinerary;
    }
}
