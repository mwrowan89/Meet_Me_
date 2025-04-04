package org.example.dao;

import org.example.model.*;

import java.util.List;

public interface UserDao {

    List<User> getUsers();

    User getUserById(int id);

    User getUserByUsername(String username);

    User createUser(RegisterUserDto user);

    User getUserByEmail(String email);

    void deleteUser(int id);

}
