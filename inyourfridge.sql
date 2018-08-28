--CREATE DATABASE fridge;

--When we insert the new user into the database, we will be storing the passwords securely
CREATE TABLE users(
    id serial PRIMARY KEY NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
);

-- To increase dimension of arrays, add additional square brackets. 
-- If we want to limit the items allowed in the array, we can enter that value into the square brackets.
-- If there is too much overlap among tried and liked or tried and disliked, we can narrow these tables down. 
CREATE TABLE recipes(
    userId integer NOT NULL,
    tried text[],
    liked text[], 
    disliked text[]
);

CREATE TABLE ingredients(
    userId integer NOT NULL,
    included text[],
    excluded text[]
);