//const properties = require("./json/properties.json");
//const users = require("./json/users.json");

// ^ Refactored out since we're using database queries now
// Ideally would also remove them from the project directory, but thats not a requirement for submission

const { Pool } = require("pg");    //add postgres module for database connectivity
const pool = new Pool({            //defines database connection variables
  user: "development",
  password: "development",
  host: "localhost",
  database: "lightbnb",
});

/// Users
/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  return pool
    .query(`SELECT *
          FROM users
          WHERE email = $1`
    ,[email])
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      console.error("Database query error:\n", err.message);
    });
};

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  return pool
    .query(`SELECT *
          FROM users
          WHERE id = $1`,
    [id])
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      console.error("Database query error:\n", err.message);
    });
};

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function(user) {
  return pool
    .query(`INSERT INTO users 
            (name, email, password)
            VALUES ($1, $2, $3) RETURNING *;`,
    [user.name, user.email, user.password])
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      console.error("Database query error:\n", err.message);
    });
};

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guestId The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guestId, limit = 10) {
  return pool
    .query(`SELECT reservations.id, properties.title, properties.cost_per_night,
          reservations.start_date, AVG(rating) as average_rating
          FROM reservations
          JOIN properties ON properties.id = reservations.property_id
          JOIN property_reviews ON properties.id = property_reviews.property_id 
          WHERE reservations.guest_id = $1 
            AND reservations.end_date < now()::date
          GROUP BY properties.id, reservations.id
          ORDER BY reservations.start_date
          LIMIT $2`,
    [guestId, limit])
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      console.error("Database query error:\n", err.message);
    });
};

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */

const getAllProperties = function(options, limit = 10) {
  // Initialize array of parameters to pass to our pool.query after search term results are appended
  const queryParams = [];
  // Defines our initial SQL query string to construct
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  WHERE 1=1`;

  // Sometimes object may have an owner_id property in passed in,
  // Such as when user is logged in and clicks "My Listings"
  if (options.owner_id) {
    queryParams.push(`${options.owner_id}`);
    queryString += `AND owner_id = $${queryParams.length}\n`;
  }
  // If city has been specified in search, appends the entry to array and query
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += ` 
    AND city LIKE $${queryParams.length}`;
  }
  // If the MIN price has been specified in search
  if (options.minimum_price_per_night) {
    queryParams.push(options.minimum_price_per_night * 100); // converts dollar value to cents to store in our DB
    queryString += ` 
    AND cost_per_night >= $${queryParams.length}`;
  }
  // If the MAX price has been specified in search
  if (options.maximum_price_per_night) {
    queryParams.push(options.maximum_price_per_night * 100); // converts dollar value to cents to store in our DB
    queryString += ` 
    AND cost_per_night <= $${queryParams.length}`;
  }

  //GROUP BY clause required before any HAVING clauses
  queryString += ` 
  GROUP BY properties.id`;

  // If the minimum rating has been specified in search
  if (options.minimum_rating) {
    queryParams.push(options.minimum_rating);
    queryString += ` 
    HAVING avg(property_reviews.rating) >= $${queryParams.length}`;
  }
  // Always adds LIMIT of how many results should be returned
  queryParams.push(limit);
  queryString += ` 
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};`;

  return pool
    .query(queryString, queryParams)
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      console.error("⛔ getAllProperties query encountered an error:\n", err.message);
      return;
    });
};

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  //Performs a check if a user inputs a negative value into these search fields
  if (property.cost_per_night < 0 ||
    property.parking_spaces < 0  ||
    property.number_of_bathrooms < 0 ||
    property.number_of_bedrooms < 0) {
    throw new Error('Cannot input a negative value');
  }
  return pool
    .query(`
    INSERT INTO properties
    (owner_id, title, description,
    thumbnail_photo_url, cover_photo_url,
    cost_per_night, parking_spaces, number_of_bathrooms,number_of_bedrooms,
    country, street, city, province, post_code)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    RETURNING *;`,
    [property.owner_id, property.title, property.description,
      property.thumbnail_photo_url, property.cover_photo_url,
      property.cost_per_night, property.parking_spaces, property.number_of_bathrooms, property.number_of_bedrooms,
      property.country, property.street, property.city, property.province, property.post_code])
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      console.error("⛔ addProperty query encountered an error:\n", err.message);
      return;
    });
};

module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  getAllReservations,
  getAllProperties,
  addProperty,
};