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

// Initial query from LightBnB Select 
  // SELECT reservations.id, properties.title, properties.cost_per_night,
  //          reservations.start_date, AVG(rating) as average_rating
  //   FROM reservations
  //     JOIN properties ON properties.id = reservations.property_id
  //     JOIN property_reviews ON properties.id = property_reviews.property_id 
  //   WHERE reservations.guest_id = $1
  //   GROUP BY properties.id, reservations.id
  //   ORDER BY reservations.start_date
  //   LIMIT $2   

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
          [guest_id, limit])
  .then((result) => {
    console.log("getAllReservations SQL query returns the following data:\n", result.rows);
    return result.rows;
  })
  .catch((err) => {
    console.log("⛔ SQL encountered an error:\n", err.message);
  });

//------------- original in-memory code -----------
  // return getAllProperties(null, 2);
};

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function (options, limit = 10) {
  console.log(`Our search options are:\n`, options);

  //Defines our initial SQL query string to construct 
  //and initialize array of params to pass to our pool.query after search term results are appended
  const queryParams = [];
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  WHERE 1=1`;

  // If city has been specified in search, appends the entry to array and query
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += ` 
    AND city LIKE $${queryParams.length}`;
  }

  // If the MIN price has been specified in search, appends the entry to array and query
  if (options.minimum_price_per_night) {
    queryParams.push(options.minimum_price_per_night * 100);
    queryString += ` 
    AND cost_per_night >= $${queryParams.length}`;
  }

  // If the MAX price has been specified in search, appends the entry to array and query
  if (options.maximum_price_per_night) {
    queryParams.push(options.maximum_price_per_night * 100);
    queryString += ` 
    AND cost_per_night <= $${queryParams.length}`;    
  }

  //GROUP BY clause required before any HAVING clauses
  queryString += ` 
  GROUP BY properties.id`;

  // If the minimum rating  has been specified in search, appends the entry to array and the query
  if (options.minimum_rating) {
    queryParams.push(options.minimum_rating);
    queryString += ` 
    HAVING avg(property_reviews.rating) >= $${queryParams.length}`;
  }

  // Adds how many results should be returned
  queryParams.push(limit);
  queryString += ` 
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};`;

  console.log(`Our final constructed query is:\n`, queryString);
  console.log(`Corresponding parameters are:\n`, queryParams);

  return pool
  .query(queryString, queryParams)
  .then((result) => {
    console.log(`getAllProperties query returns Data sucesfully!\nRendering ${result.rows.length} property listings!`);
    return result.rows;
  })
  .catch((err) => {
    console.error("⛔ getAllProperties query encountered an error:\n", err.message);
    return;
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
