/**
 * Authentication System for FILMEX
 * Handles user registration, login, and session management
 */

class AuthSystem {
  constructor() {
    this.currentUser = this.getCurrentUser();
  }

  /**
   * Register a new user
   * @param {string} name - User's name
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {Object} Result with success status and message
   */
  register(name, email, password) {
    try {
      // Check if user already exists
      const users = this.getUsers();
      if (users.find(user => user.email === email)) {
        return { success: false, message: 'Este correo ya está registrado' };
      }

      // Create new user
      const newUser = {
        id: this.generateId(),
        name,
        email,
        password, // In a real app, this should be hashed
        favorites: [],
        purchases: [],
        created: new Date().toISOString()
      };

      // Save to local storage
      users.push(newUser);
      localStorage.setItem('filmex_users', JSON.stringify(users));

      // Use MongoDB connection if available
      if (typeof addUser === 'function') {
        // Split name into first and last name
        const nameParts = name.split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(' ');
        
        // Call the MongoDB function to add user
        addUser(firstName, lastName, password, email)
          .then(result => console.log('User added to MongoDB:', result))
          .catch(error => console.error('Error adding user to MongoDB:', error));
      }

      return { success: true, message: '¡Registro exitoso!' };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'Error en el registro: ' + error.message };
    }
  }

  /**
   * Log in a user
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {Object} Result with success status and message
   */
  login(email, password) {
    try {
      // Check if user exists
      const users = this.getUsers();
      const user = users.find(user => user.email === email && user.password === password);

      if (!user) {
        return { success: false, message: 'Correo o contraseña incorrectos' };
      }

      // Set current user in session
      const sessionUser = { ...user };
      delete sessionUser.password; // Don't store password in session
      localStorage.setItem('filmex_current_user', JSON.stringify(sessionUser));
      this.currentUser = sessionUser;

      // Use MongoDB connection if available
      if (typeof getUser === 'function') {
        // Call the MongoDB function to get user
        getUser(email)
          .then(result => console.log('User retrieved from MongoDB:', result))
          .catch(error => console.error('Error getting user from MongoDB:', error));
      }

      return { success: true, message: '¡Inicio de sesión exitoso!' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Error en el inicio de sesión: ' + error.message };
    }
  }

  /**
   * Log out the current user
   */
  logout() {
    localStorage.removeItem('filmex_current_user');
    this.currentUser = null;
    return { success: true, message: 'Sesión cerrada' };
  }

  /**
   * Add a movie to favorites
   * @param {Object} movie - Movie object to add to favorites
   * @returns {Object} Result with success status and message
   */
  addToFavorites(movie) {
    try {
      if (!this.currentUser) {
        return { success: false, message: 'Debes iniciar sesión para agregar a favoritos' };
      }

      const users = this.getUsers();
      const userIndex = users.findIndex(user => user.id === this.currentUser.id);

      if (userIndex === -1) {
        return { success: false, message: 'Usuario no encontrado' };
      }

      // Check if movie is already in favorites
      if (users[userIndex].favorites.some(fav => fav.id === movie.id)) {
        return { success: false, message: 'Esta película ya está en tus favoritos' };
      }

      // Add to favorites
      users[userIndex].favorites.push(movie);
      localStorage.setItem('filmex_users', JSON.stringify(users));

      // Update current user
      this.currentUser.favorites = users[userIndex].favorites;
      localStorage.setItem('filmex_current_user', JSON.stringify(this.currentUser));

      // Use MongoDB connection if available
      if (typeof addFavoriteMovie === 'function') {
        // Call the MongoDB function to add favorite movie
        addFavoriteMovie(movie.title, movie.year || new Date().getFullYear(), this.currentUser.id)
          .then(result => console.log('Favorite movie added to MongoDB:', result))
          .catch(error => console.error('Error adding favorite movie to MongoDB:', error));
      }

      return { success: true, message: 'Película agregada a favoritos' };
    } catch (error) {
      console.error('Add to favorites error:', error);
      return { success: false, message: 'Error al agregar a favoritos: ' + error.message };
    }
  }

  /**
   * Add a purchase to user history
   * @param {Object} purchase - Purchase object with items, total, etc.
   * @returns {Object} Result with success status and message
   */
  addPurchase(purchase) {
    try {
      if (!this.currentUser) {
        return { success: false, message: 'Debes iniciar sesión para realizar una compra' };
      }

      const users = this.getUsers();
      const userIndex = users.findIndex(user => user.id === this.currentUser.id);

      if (userIndex === -1) {
        return { success: false, message: 'Usuario no encontrado' };
      }

      // Add purchase with ID and date
      const newPurchase = {
        ...purchase,
        id: this.generateId(),
        date: new Date().toISOString()
      };

      users[userIndex].purchases.push(newPurchase);
      localStorage.setItem('filmex_users', JSON.stringify(users));

      // Update current user
      this.currentUser.purchases = users[userIndex].purchases;
      localStorage.setItem('filmex_current_user', JSON.stringify(this.currentUser));

      // Use MongoDB connection if available
      if (typeof addOrden === 'function') {
        // Process each item in the purchase
        purchase.items.forEach(item => {
          // Call the MongoDB function to add order
          addOrden(item.title, item.price, item.quantity, this.currentUser.id)
            .then(result => console.log('Order added to MongoDB:', result))
            .catch(error => console.error('Error adding order to MongoDB:', error));
        });
      }

      return { success: true, message: 'Compra realizada con éxito' };
    } catch (error) {
      console.error('Add purchase error:', error);
      return { success: false, message: 'Error al procesar la compra: ' + error.message };
    }
  }

  /**
   * Get the current logged-in user
   * @returns {Object|null} Current user or null if not logged in
   */
  getCurrentUser() {
    const userJson = localStorage.getItem('filmex_current_user');
    return userJson ? JSON.parse(userJson) : null;
  }

  /**
   * Get all users from local storage
   * @returns {Array} Array of user objects
   */
  getUsers() {
    const usersJson = localStorage.getItem('filmex_users');
    return usersJson ? JSON.parse(usersJson) : [];
  }

  /**
   * Generate a unique ID
   * @returns {string} Unique ID
   */
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }
}

/**
 * Update the authentication UI elements based on login status
 */
function updateAuthUI() {
  const auth = new AuthSystem();
  
  // Elements that should be visible/hidden based on auth status
  const loginNav = document.getElementById('loginNav');
  const registerNav = document.getElementById('registerNav');
  const userInfo = document.getElementById('user-info');
  const userName = document.getElementById('user-name');
  const purchasesNav = document.getElementById('purchasesNav');
  const logoutBtn = document.getElementById('logout');
  
  if (auth.currentUser) {
    // User is logged in
    if (loginNav) loginNav.style.display = 'none';
    if (registerNav) registerNav.style.display = 'none';
    if (userInfo) userInfo.style.display = 'block';
    if (userName) userName.textContent = auth.currentUser.name;
    if (purchasesNav) purchasesNav.style.display = 'block';
    
    // Add logout event listener
    if (logoutBtn) {
      logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        auth.logout();
        window.location.reload();
      });
    }
  } else {
    // User is not logged in
    if (loginNav) loginNav.style.display = 'block';
    if (registerNav) registerNav.style.display = 'block';
    if (userInfo) userInfo.style.display = 'none';
    if (purchasesNav) purchasesNav.style.display = 'none';
  }
  
  // Update cart count if available
  updateCartCount();
}

/**
 * Update the cart count in the navbar
 */
function updateCartCount() {
  const cartCountElement = document.getElementById('cart-count');
  if (cartCountElement) {
    const cart = getCart();
    const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
    cartCountElement.textContent = itemCount;
  }
}

/**
 * Get the current cart from local storage
 * @returns {Array} Array of cart items
 */
function getCart() {
  const cartJson = localStorage.getItem('filmex_cart');
  return cartJson ? JSON.parse(cartJson) : [];
}

// Initialize the auth UI when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  if (typeof updateAuthUI === 'function') {
    updateAuthUI();
  }
});
