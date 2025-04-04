BEGIN TRANSACTION;

DROP TABLE IF EXISTS profile CASCADE;
DROP TABLE IF EXISTS itinerary CASCADE;
DROP TABLE IF EXISTS trips CASCADE;
DROP TABLE IF EXISTS users CASCADE;


CREATE TABLE users (
	user_id SERIAL,
	username varchar(50) NOT NULL UNIQUE,
	password_hash varchar(200) NOT NULL,
	role varchar(50) NOT NULL,
    email varchar(50) NOT NULL,
	CONSTRAINT PK_user PRIMARY KEY (user_id)
);	

CREATE TABLE trips (
    trip_id SERIAL,
    user_id integer NOT NULL,
    destination_city TEXT NOT NULL,
    destination_state TEXT NOT NULL,
    photo_url TEXT,
    photo_reference TEXT,
    attractions TEXT,
    cost integer,
    description text,
    CONSTRAINT PK_trip PRIMARY KEY (trip_id),
    CONSTRAINT FK_user_trip FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE itinerary (
    itinerary_id SERIAL,
    trip_id integer NOT NULL,
    city TEXT NOT NULL,
    itinerary TEXT NOT NULL,
    CONSTRAINT PK_itinerary PRIMARY KEY (itinerary_id),
    CONSTRAINT FK_trip_itinerary FOREIGN KEY (trip_id) REFERENCES trips(trip_id)
);

CREATE TABLE profile (
    user_id integer NOT NULL,
    first_name varchar(50),
    last_name varchar(50),
    user_name varchar(50),
    email TEXT,
    location_city TEXT,
    location_state TEXT,
    bio TEXT,
    profile_picture_url TEXT,
    CONSTRAINT PK_profile PRIMARY KEY (user_id),
    CONSTRAINT FK_user_profile FOREIGN KEY (user_id) REFERENCES users(user_id)
);

COMMIT TRANSACTION;
