/**
 * App Connector
 * Connects the MongoDB database and API router with the frontend application
 */

// Import MongoDB connection functions if in Node.js environment
let mongoDb = {};

// Check if we're in a browser environment
if (typeof window !== 'undefined') {
  // Make MongoDB functions available globally in browser
  try {
    // Import the MongoDB connection module if it exists
    if (typeof module !== 'undefined' && module.exports) {
      mongoDb = require('./mongo_connection.js');
    }
    
    // Add MongoDB functions to window object for browser access
    window.addUser = async function(name, lastname, password, mail) {
      try {
        if (mongoDb.addUser) {
          return await mongoDb.addUser(name, lastname, password, mail);
        } else {
          console.log('MongoDB connection not available, using local storage only');
          return null;
        }
      } catch (error) {
        console.error('Error in addUser:', error);
        return null;
      }
    };

    window.getUser = async function(mail) {
      try {
        if (mongoDb.getUser) {
          return await mongoDb.getUser(mail);
        } else {
          console.log('MongoDB connection not available, using local storage only');
          return null;
        }
      } catch (error) {
        console.error('Error in getUser:', error);
        return null;
      }
    };

    window.addFavoriteMovie = async function(name, year, user_id) {
      try {
        if (mongoDb.addFavoriteMovie) {
          return await mongoDb.addFavoriteMovie(name, year, user_id);
        } else {
          console.log('MongoDB connection not available, using local storage only');
          return null;
        }
      } catch (error) {
        console.error('Error in addFavoriteMovie:', error);
        return null;
      }
    };

    window.getFavoriteMovies = async function(user_id) {
      try {
        if (mongoDb.getFavoriteMovies) {
          return await mongoDb.getFavoriteMovies(user_id);
        } else {
          console.log('MongoDB connection not available, using local storage only');
          return null;
        }
      } catch (error) {
        console.error('Error in getFavoriteMovies:', error);
        return null;
      }
    };

    window.addOrden = async function(movie_name, movie_price, cantidad, user_id) {
      try {
        if (mongoDb.addOrden) {
          return await mongoDb.addOrden(movie_name, movie_price, cantidad, user_id);
        } else {
          console.log('MongoDB connection not available, using local storage only');
          return null;
        }
      } catch (error) {
        console.error('Error in addOrden:', error);
        return null;
      }
    };

    window.getOrden = async function(order_id) {
      try {
        if (mongoDb.getOrden) {
          return await mongoDb.getOrden(order_id);
        } else {
          console.log('MongoDB connection not available, using local storage only');
          return null;
        }
      } catch (error) {
        console.error('Error in getOrden:', error);
        return null;
      }
    };

    window.getUserOrders = async function(user_id) {
      try {
        if (mongoDb.getUserOrders) {
          return await mongoDb.getUserOrders(user_id);
        } else {
          console.log('MongoDB connection not available, using local storage only');
          return null;
        }
      } catch (error) {
        console.error('Error in getUserOrders:', error);
        return null;
      }
    };
    
    window.myPurchases = async function(user_id) {
      try {
        if (mongoDb.myPurchases) {
          const result = await mongoDb.myPurchases(user_id);
          // Ensure we always return an array, even if the result is null or undefined
          return Array.isArray(result) ? result : [];
        } else {
          console.log('MongoDB connection not available, using local storage only');
          return [];
        }
      } catch (error) {
        console.error('Error in myPurchases:', error);
        return [];
      }
    };
    
    window.addPurchase = async function(user_id, movie_id, movie_name, movie_price, cantidad = 1) {
      try {
        if (mongoDb.addPurchase) {
          // Log the purchase attempt
          console.log('Attempting to add purchase:', { user_id, movie_id, movie_name, movie_price, cantidad });
          
          // Call the MongoDB function with all available parameters
          const result = await mongoDb.addPurchase(user_id, movie_id);
          
          // Return the result or an empty object if null/undefined
          return result || { success: false, message: 'No result from MongoDB' };
        } else {
          console.log('MongoDB connection not available, using local storage only');
          return { success: false, message: 'MongoDB connection not available' };
        }
      } catch (error) {
        console.error('Error in addPurchase:', error);
        return { success: false, message: error.message || 'Unknown error occurred' };
      }
    };

    console.log('MongoDB connection functions initialized');
  } catch (error) {
    console.error('Error initializing MongoDB connection:', error);
  }
}

// Initialize the API Router
document.addEventListener('DOMContentLoaded', function() {
  // Create a global API router instance if not already created
  if (typeof window.api === 'undefined' && typeof ApiRouter !== 'undefined') {
    window.api = new ApiRouter();
    console.log('API Router initialized');
  }
  
  // Example API call to test connection
  if (window.api) {
    window.api.get('/posts/1')
      .then(data => console.log('API test successful:', data))
      .catch(error => console.error('API test failed:', error));
  }
});
