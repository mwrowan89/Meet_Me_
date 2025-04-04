package org.example.controller;


import javax.validation.Valid;

import org.example.dao.UserDao;
import org.example.exception.DaoException;
import org.example.model.LoginDto;
import org.example.model.LoginResponseDto;
import org.example.model.RegisterUserDto;
import org.example.model.User;
import org.example.security.jwt.JWTFilter;
import org.example.security.jwt.TokenProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@CrossOrigin
public class AuthenticationController {

    private final TokenProvider tokenProvider;
    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    private final UserDao userDao;
    private final Logger log = LoggerFactory.getLogger(AuthenticationController.class);


    public AuthenticationController(TokenProvider tokenProvider,
                                    AuthenticationManagerBuilder authenticationManagerBuilder, UserDao userDao) {
        this.tokenProvider = tokenProvider;
        this.authenticationManagerBuilder = authenticationManagerBuilder;
        this.userDao = userDao;
    }

    @RequestMapping(path = "/login", method = RequestMethod.POST)
    public ResponseEntity<LoginResponseDto> login(@Valid @RequestBody LoginDto loginDto) {

        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                loginDto.getUsername(), loginDto.getPassword());

        Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.createToken(authentication, false);

        User user;
        try {
            user = userDao.getUserByUsername(loginDto.getUsername());
        } catch (DaoException e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Username or password is incorrect.");
        }

        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add(JWTFilter.AUTHORIZATION_HEADER, "Bearer " + jwt);
        return new ResponseEntity<>(new LoginResponseDto(jwt, user), httpHeaders, HttpStatus.OK);
    }

    @ResponseStatus(HttpStatus.CREATED)
    @RequestMapping(path = "/register", method = RequestMethod.POST)
    public void register(@Valid @RequestBody RegisterUserDto newUser) {
        try {
            if (userDao.getUserByUsername(newUser.getUsername()) != null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User already exists.");
            } else if(newUser.getUsername().isEmpty() || newUser.getPassword().isEmpty()){
                 throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Please fill all the required fields.");
             } else if (newUser.getUsername().length() < 4 || newUser.getUsername().length() > 16) {
                 throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username must be between 4 and 16 characters.");
             } else if (newUser.getPassword().length() < 8 || newUser.getPassword().length() > 16) {
                 throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password must be between 8 and 16 characters.");
             } else if(newUser.getEmail().isEmpty() || newUser.getEmail().length() < 5){
                 throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Please fill all the required fields.");
             } else if(userDao.getUserByEmail(newUser.getEmail()) != null){
                 throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email already exists.");
             }
              else {
                userDao.createUser(newUser);
            }
        } catch (DaoException e) {
            log.error("User registration failed", e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "User registration failed.");
        }
    }
    

}
