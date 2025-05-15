/**
 * MongoDB Connection Module
 * Provides functions to interact with MongoDB Atlas database
 */

// Import the MongoDB Node.js driver
const { MongoClient, ObjectId } = require('mongodb');

// Database connection settings
const uri = "mongodb+srv://filmex_user:2sQ!7T8VzK9yJcB@filmex.ddahdpe.mongodb.net/?retryWrites=true&w=majority&appName=FILMEX";
const dbName = 'FILMEX_DB';

// Connection options
const options = { useNewUrlParser: true, useUnifiedTopology: true };

/**
 * Creates a new MongoDB client and connects to the database
 * @returns {Promise<{client: MongoClient, db: Db}>} The connected client and database
 */
async function connectToDatabase() {
  try {
    const client = new MongoClient(uri, options);
    await client.connect();
    console.log('Successfully connected to MongoDB Atlas');
    
    const db = client.db(dbName);
    return { client, db };
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

/**
 * Creates a new user in the database
 * @param {string} name - User's first name
 * @param {string} lastname - User's last name
 * @param {string} password - User's password (should be hashed before storage in production)
 * @param {string} mail - User's email address
 * @returns {Promise<Object>} The created user document
 */
async function addUser(name, lastname, password, mail) {
  let client;
  
  try {
    // Connect to MongoDB Atlas
    const connection = await connectToDatabase();
    client = connection.client;
    const db = connection.db;

    // Access the users collection
    const collection = db.collection('USERS');

    // Check if user with this email already exists
    const existingUser = await collection.findOne({ mail });
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Create user document
    const document = { 
      name,
      lastname,
      password, // Note: In production, this should be hashed
      mail,
      created_at: new Date()
    };
    
    // Insert the document
    const result = await collection.insertOne(document);
    console.log(`Successfully inserted user with ID: ${result.insertedId}`);

    // Return the created user
    const createdUser = await collection.findOne({ _id: result.insertedId });
    return createdUser;
  } catch (error) {
    console.error('Error adding user:', error);
    throw error;
  } finally {
    // Close the MongoDB Atlas connection
    if (client) {
      await client.close();
      console.log('Connection to MongoDB Atlas closed');
    }
  }
}

/**
 * Retrieves a user by their email address
 * @param {string} mail - User's email address
 * @returns {Promise<Object|null>} The user document or null if not found
 */
async function getUser(mail) {
  let client;
  
  try {
    // Connect to MongoDB Atlas
    const connection = await connectToDatabase();
    client = connection.client;
    const db = connection.db;

    // Access the users collection
    const collection = db.collection('USERS');

    // Query the collection
    const user = await collection.findOne({ mail });
    
    if (!user) {
      console.log(`No user found with email: ${mail}`);
    } else {
      console.log(`Found user: ${user.name} ${user.lastname}`);
    }
    
    return user;
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  } finally {
    // Close the MongoDB Atlas connection
    if (client) {
      await client.close();
      console.log('Connection to MongoDB Atlas closed');
    }
  }
}

/**
 * Adds a favorite movie for a user
 * @param {string} name - Movie name
 * @param {number} year - Movie release year
 * @param {string} user_id - User ID
 * @returns {Promise<Object>} The created favorite movie document
 */
async function addFavoriteMovie(name, year, user_id) {
  let client;
  
  try {
    // Connect to MongoDB Atlas
    const connection = await connectToDatabase();
    client = connection.client;
    const db = connection.db;

    // Access the favorites collection
    const collection = db.collection('FAVS');

    // Check if this movie is already a favorite for this user
    const existingFav = await collection.findOne({ name, user_id });
    if (existingFav) {
      console.log('This movie is already in favorites');
      return existingFav;
    }

    // Create favorite document
    const document = { 
      name, 
      year, 
      user_id,
      added_at: new Date() 
    };
    
    // Insert the document
    const result = await collection.insertOne(document);
    console.log(`Successfully added favorite movie with ID: ${result.insertedId}`);

    // Return the created favorite
    const createdFav = await collection.findOne({ _id: result.insertedId });
    return createdFav;
  } catch (error) {
    console.error('Error adding favorite movie:', error);
    throw error;
  } finally {
    // Close the MongoDB Atlas connection
    if (client) {
      await client.close();
      console.log('Connection to MongoDB Atlas closed');
    }
  }
}

/**
 * Gets all favorite movies for a user
 * @param {string} user_id - User ID (optional)
 * @returns {Promise<Array>} Array of favorite movie documents
 */
async function getFavoriteMovies(user_id = null) {
  let client;
  
  try {
    // Connect to MongoDB Atlas
    const connection = await connectToDatabase();
    client = connection.client;
    const db = connection.db;

    // Access the favorites collection
    const collection = db.collection('FAVS');

    // Build query - if user_id is provided, filter by it
    const query = user_id ? { user_id } : {};
    
    // Query the collection
    const favorites = await collection.find(query).toArray();
    
    console.log(`Found ${favorites.length} favorite movies`);
    return favorites;
  } catch (error) {
    console.error('Error getting favorite movies:', error);
    throw error;
  } finally {
    // Close the MongoDB Atlas connection
    if (client) {
      await client.close();
      console.log('Connection to MongoDB Atlas closed');
    }
  }
}

/**
 * Creates a new order in the database
 * @param {string} movie_name - Movie name
 * @param {number} movie_price - Movie price
 * @param {number} cantidad - Quantity
 * @param {string} user_id - User ID
 * @returns {Promise<Object>} The created order document
 */
async function addOrden(movie_name, movie_price, cantidad, user_id) {
  let client;
  
  try {
    // Connect to MongoDB Atlas
    const connection = await connectToDatabase();
    client = connection.client;
    const db = connection.db;

    // Access the orders collection
    const collection = db.collection('ordenes');

    // Create order document
    const document = { 
      movie_name, 
      movie_price, 
      cantidad, 
      user_id,
      total: movie_price * cantidad,
      order_date: new Date(),
      status: 'pending'
    };
    
    // Insert the document
    const result = await collection.insertOne(document);
    console.log(`Successfully created order with ID: ${result.insertedId}`);

    // Return the created order
    const createdOrder = await collection.findOne({ _id: result.insertedId });
    return createdOrder;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  } finally {
    // Close the MongoDB Atlas connection
    if (client) {
      await client.close();
      console.log('Connection to MongoDB Atlas closed');
    }
  }
}

/**
 * Gets an order by its ID
 * @param {string} order_id - Order ID
 * @returns {Promise<Object|null>} The order document or null if not found
 */
async function getOrden(order_id) {
  let client;
  
  try {
    // Connect to MongoDB Atlas
    const connection = await connectToDatabase();
    client = connection.client;
    const db = connection.db;

    // Access the orders collection
    const collection = db.collection('ordenes');

    // Convert string ID to ObjectId if needed
    const id = typeof order_id === 'string' ? new ObjectId(order_id) : order_id;
    
    // Query the collection
    const order = await collection.findOne({ _id: id });
    
    if (!order) {
      console.log(`No order found with ID: ${order_id}`);
    } else {
      console.log(`Found order for movie: ${order.movie_name}`);
    }
    
    return order;
  } catch (error) {
    console.error('Error getting order:', error);
    throw error;
  } finally {
    // Close the MongoDB Atlas connection
    if (client) {
      await client.close();
      console.log('Connection to MongoDB Atlas closed');
    }
  }
}

/**
 * Gets all orders for a user
 * @param {string} user_id - User ID
 * @returns {Promise<Array>} Array of order documents
 */
async function getUserOrders(user_id) {
  let client;
  
  try {
    // Connect to MongoDB Atlas
    const connection = await connectToDatabase();
    client = connection.client;
    const db = connection.db;

    // Access the orders collection
    const collection = db.collection('ordenes');
    
    // Query the collection
    const orders = await collection.find({ user_id }).toArray();
    
    console.log(`Found ${orders.length} orders for user ${user_id}`);
    return orders;
  } catch (error) {
    console.error('Error getting user orders:', error);
    throw error;
  } finally {
    // Close the MongoDB Atlas connection
    if (client) {
      await client.close();
      console.log('Connection to MongoDB Atlas closed');
    }
  }
}

async function addPurchase(user_id, movie_id, movie_name, movie_price, cantidad = 1) {
  let client;
  
  try {
    // Connect to MongoDB Atlas
    const connection = await connectToDatabase();
    client = connection.client;
    const db = connection.db;

    // Access the orders collection
    const collection = db.collection('FAVS');
    
    // Create the purchase document with all available information
    const purchaseDoc = {
      user_id,
      movie_id,
      movie_name: movie_name || 'Unknown Movie',
      movie_price: movie_price || 0,
      cantidad: cantidad || 1,
      total: (movie_price || 0) * (cantidad || 1),
      order_date: new Date(),
      status: 'completed'
    };
    
    // Insert the purchase document
    const result = await collection.insertOne(purchaseDoc);
    
    console.log(`Purchase added for user ${user_id}, movie ${movie_id}`);
    return {
      success: true,
      message: 'Purchase added successfully',
      purchase_id: result.insertedId,
      purchase: purchaseDoc
    };
  } catch (error) {
    console.error('Error adding purchase:', error);
    return {
      success: false,
      message: error.message || 'Error adding purchase'
    };
  } finally {
    // Close the MongoDB Atlas connection
    if (client) {
      await client.close();
      console.log('Connection to MongoDB Atlas closed');
    }
  }
}

async function myPurchases(user_id) {
  let client;
  
  try {
    // Connect to MongoDB Atlas
    const connection = await connectToDatabase();
    client = connection.client;
    const db = connection.db;

    // Access the orders collection
    const collection = db.collection('FAVS');
    
    // Query the collection
    const orders = await collection.find({ user_id }).toArray();
    
    console.log(`Found ${orders.length} orders for user ${user_id}`);
    return orders;
  } catch (error) {
    console.error('Error getting user orders:', error);
    throw error;
  } finally {
    // Close the MongoDB Atlas connection
    if (client) {
      await client.close();
      console.log('Connection to MongoDB Atlas closed');
    }
  }
}

// Export all functions
module.exports = {
  addUser,
  getUser,
  addFavoriteMovie,
  getFavoriteMovies,
  addOrden,
  getOrden,
  getUserOrders,
  myPurchases,
  addPurchase
};
