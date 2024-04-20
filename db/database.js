const properties = require("./json/properties.json");
const users = require("./json/users.json");
const { Pool } = require("pg");    //add postgres module for database connectivity

const pool = new Pool({
  user: "development",
  password: "development",
  host: "localhost",
  database: "lightbnb",
});

// the following assumes that you named your connection variable `pool`
// pool.query(`SELECT title FROM properties LIMIT 10;`)
// .then(response => {console.log("We've got a SQL response!\n", response.rows)});


/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function (email) {

  return pool
  .query(`SELECT *
          FROM users
          WHERE email = $1`
          ,[email])
  .then((result) => {
    console.log("getUserWithEmail SQL query returns the following data:\n", result.rows[0]);
    return result.rows[0];
  })
  .catch((err) => {
    console.error("⛔ SQL encountered an error:\n", err.message);
  });

//------------- original in-memory code -----------
  // let resolvedUser = null;
  // for (const userId in users) {
  //   const user = users[userId];
  //   if (user && user.email.toLowerCase() === email.toLowerCase()) {
  //     resolvedUser = user;
  //   }
  // }
  // return Promise.resolve(resolvedUser);
};

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function (id) {  
  return pool
  .query(`SELECT *
          FROM users
          WHERE id = $1`,
          [id])
  .then((result) => {
    console.log("getUserWithId SQL query returns the following data:\n", result.rows[0]);
    return result.rows[0];
  })
  .catch((err) => {
    console.error("⛔ SQL encountered an error:\n", err.message);
  });

//------------- original in-memory code -----------
  // return Promise.resolve(users[id]);
};

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function (user) {
  return pool
    .query(`INSERT INTO users 
            (name, email, password)
            VALUES ($1, $2, $3) RETURNING *;`,
            [user.name, user.email, user.password])
    .then((result) => {
      console.log("addUser SQL INSERT query returns the following data:\n", result.rows[0]);
      return result.rows[0];
    })
    .catch((err) => {
      console.log("⛔ SQL encountered an error:\n", err.message);
    });

//------------- original in-memory code -----------
  // const userId = Object.keys(users).length + 1;
  // user.id = userId;
  // users[userId] = user;
  // return Promise.resolve(user);
};

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function (guest_id, limit = 10) {
  return getAllProperties(null, 2);
};

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function (options, limit = 10) {

  return pool
  .query(`SELECT * FROM properties LIMIT $1`, [limit])
  .then((result) => {
    console.log("Database returns the following data:\n", result.rows);
    return result.rows;
  })
  .catch((err) => {
    console.error("⛔ SQL encountered an error:\n", err.message);
  });

//------------- original in-memory code -----------
  // const limitedProperties = {};
  // for (let i = 1; i <= limit; i++) {
  //   limitedProperties[i] = properties[i];
  // }
  // return Promise.resolve(limitedProperties);
};

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function (property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
};

module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  addProperty,
};
