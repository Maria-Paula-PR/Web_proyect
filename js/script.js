/**
 * Main script for FILMEX application
 * Handles movie catalog, cart functionality, and API interactions
 */

// Initialize API Router
const api = new ApiRouter('https://jsonplaceholder.typicode.com');

// Sample movie data (in a real app, this would come from an API)
const movies = [
  {
    id: 1,
    title: 'Interstellar',
    description: 'Un grupo de exploradores emprende una misión espacial para encontrar un nuevo hogar para la humanidad.',
    price: 19.99,
    image: 'https://m.media-amazon.com/images/I/91obuWzA3XL._AC_UF1000,1000_QL80_.jpg',
    year: 2014,
    director: 'Christopher Nolan',
    cast: 'Matthew McConaughey, Anne Hathaway, Jessica Chastain',
    trailer: 'https://www.youtube.com/embed/zSWdZVtXT7E'
  },
  {
    id: 2,
    title: 'The Shawshank Redemption',
    description: 'Dos hombres encarcelados forjan una amistad a lo largo de los años, encontrando consuelo y redención a través de actos de decencia común.',
    price: 14.99,
    image: 'https://m.media-amazon.com/images/I/51NiGlapXlL._AC_UF1000,1000_QL80_.jpg',
    year: 1994,
    director: 'Frank Darabont',
    cast: 'Tim Robbins, Morgan Freeman, Bob Gunton',
    trailer: 'https://www.youtube.com/embed/6hB3S9bIaco'
  },
  {
    id: 3,
    title: 'The Dark Knight',
    description: 'Batman se enfrenta a un nuevo villano, el Joker, que busca sumir a Ciudad Gótica en la anarquía.',
    price: 16.99,
    image: 'https://m.media-amazon.com/images/I/91KkWf50SoL._AC_UF1000,1000_QL80_.jpg',
    year: 2008,
    director: 'Christopher Nolan',
    cast: 'Christian Bale, Heath Ledger, Aaron Eckhart',
    trailer: 'https://www.youtube.com/embed/EXeTwQWrcwY'
  },
  {
    id: 4,
    title: 'Pulp Fiction',
    description: 'Las vidas de dos sicarios, un boxeador, la esposa de un gánster y un par de bandidos se entrelazan en cuatro historias de violencia y redención.',
    price: 15.99,
    image: 'https://m.media-amazon.com/images/I/71CXxWupsCL._AC_UF1000,1000_QL80_.jpg',
    year: 1994,
    director: 'Quentin Tarantino',
    cast: 'John Travolta, Uma Thurman, Samuel L. Jackson',
    trailer: 'https://www.youtube.com/embed/s7EdQ4FqbhY'
  },
  {
    id: 5,
    title: 'The Matrix',
    description: 'Un programador descubre que la realidad es una simulación creada por máquinas inteligentes.',
    price: 13.99,
    image: 'https://m.media-amazon.com/images/I/51EG732BV3L._AC_UF1000,1000_QL80_.jpg',
    year: 1999,
    director: 'Lana y Lilly Wachowski',
    cast: 'Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss',
    trailer: 'https://www.youtube.com/embed/vKQi3bBA1y8'
  },
  {
    id: 6,
    title: 'Forrest Gump',
    description: 'Las décadas en la vida de Forrest Gump, un hombre con un coeficiente intelectual bajo que participa involuntariamente en eventos históricos de EE.UU.',
    price: 12.99,
    image: 'https://m.media-amazon.com/images/I/71xfR1wEUnL._AC_UF1000,1000_QL80_.jpg',
    year: 1994,
    director: 'Robert Zemeckis',
    cast: 'Tom Hanks, Robin Wright, Gary Sinise',
    trailer: 'https://www.youtube.com/embed/bLvqoHBptjg'
  }
];

/**
 * Load movies into the products container
 */
function loadMovies() {
  const productsContainer = document.getElementById('products-container');
  if (!productsContainer) return;

  // Clear container
  productsContainer.innerHTML = '';

  // Add movie cards
  movies.forEach(movie => {
    const movieCard = document.createElement('div');
    movieCard.className = 'col-md-4 mb-4';
    movieCard.innerHTML = `
      <div class="card h-100">
        <img src="${movie.image}" class="card-img-top" alt="${movie.title}" style="height: 400px; object-fit: cover;">
        <div class="card-body">
          <h5 class="card-title">${movie.title}</h5>
          <p class="card-text">$${movie.price.toFixed(2)}</p>
          <div class="d-flex justify-content-between">
            <button class="btn btn-primary btn-sm" onclick="showMovieDetails(${movie.id})">
              <i class="fas fa-info-circle"></i> Detalles
            </button>
            <button class="btn btn-success btn-sm" onclick="addToCart(${movie.id})">
              <i class="fas fa-cart-plus"></i> Agregar
            </button>
          </div>
        </div>
      </div>
    `;
    productsContainer.appendChild(movieCard);
  });
}

/**
 * Show movie details in modal
 * @param {number} movieId - ID of the movie to show details for
 */
function showMovieDetails(movieId) {
  const movie = movies.find(m => m.id === movieId);
  if (!movie) return;

  // Set modal content
  document.getElementById('movieModalTitle').textContent = movie.title;
  document.getElementById('movieModalImage').src = movie.image;
  document.getElementById('movieModalImage').alt = movie.title;
  document.getElementById('movieModalDescription').textContent = movie.description;
  document.getElementById('movieModalDirector').textContent = movie.director;
  document.getElementById('movieModalCast').textContent = movie.cast;
  document.getElementById('movieModalTrailer').src = movie.trailer;

  // Show modal
  const movieModal = new bootstrap.Modal(document.getElementById('movieModal'));
  movieModal.show();
}

/**
 * Add a movie to cart
 * @param {number} movieId - ID of the movie to add to cart
 */
function addToCart(movieId) {
  const movie = movies.find(m => m.id === movieId);
  if (!movie) return;

  // Get current cart
  let cart = getCart();

  // Check if movie is already in cart
  const existingItem = cart.find(item => item.id === movie.id);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: movie.id,
      title: movie.title,
      price: movie.price,
      image: movie.image,
      quantity: 1
    });
  }

  // Save cart
  localStorage.setItem('filmex_cart', JSON.stringify(cart));
  
  // Update cart count
  updateCartCount();

  // Show confirmation
  alert(`${movie.title} agregada al carrito`);

  // Use MongoDB connection if available
  try {
    const auth = new AuthSystem();
    if (auth.currentUser && typeof addOrden === 'function') {
      // This is just to track cart additions, not actual purchases
      addOrden(movie.title, movie.price, 1, auth.currentUser.id)
        .then(result => console.log('Cart addition tracked in MongoDB:', result))
        .catch(error => console.error('Error tracking cart addition in MongoDB:', error));
    }
  } catch (error) {
    console.error('Error with MongoDB tracking:', error);
  }
}

/**
 * Load cart items and display them
 */
function loadCart() {
  const cartItemsContainer = document.getElementById('cart-items');
  if (!cartItemsContainer) return;

  const cart = getCart();
  
  // Calculate total
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalElement = document.getElementById('total-price');
  if (totalElement) {
    totalElement.textContent = total.toFixed(2);
  }
}

/**
 * Render cart items in the cart page
 */
function renderCart() {
  const cartItemsContainer = document.getElementById('cart-items');
  if (!cartItemsContainer) return;

  const cart = getCart();
  
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="col-12">
        <div class="alert alert-info text-center">
          <i class="fas fa-shopping-cart fa-2x mb-3"></i>
          <h4>Tu carrito está vacío</h4>
          <a href="index.html" class="btn btn-primary mt-3">Ir a la tienda</a>
        </div>
      </div>
    `;
    return;
  }

  // Clear container
  cartItemsContainer.innerHTML = '';

  // Add cart items
  cart.forEach(item => {
    const itemElement = document.createElement('div');
    itemElement.className = 'col-md-4 mb-4';
    itemElement.innerHTML = `
      <div class="card">
        <img src="${item.image}" class="card-img-top" alt="${item.title}" style="height: 200px; object-fit: cover;">
        <div class="card-body">
          <h5 class="card-title">${item.title}</h5>
          <p class="card-text">Precio: $${item.price.toFixed(2)}</p>
          <div class="d-flex justify-content-between align-items-center">
            <div class="btn-group">
              <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
              <span class="px-2">${item.quantity}</span>
              <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
            </div>
            <button class="btn btn-danger btn-sm" onclick="removeFromCart(${item.id})">
              <i class="fas fa-trash"></i>
            </button>
          </div>
          <p class="card-text mt-2">Subtotal: $${(item.price * item.quantity).toFixed(2)}</p>
        </div>
      </div>
    `;
    cartItemsContainer.appendChild(itemElement);
  });
}

/**
 * Update quantity of an item in cart
 * @param {number} itemId - ID of the item to update
 * @param {number} newQuantity - New quantity
 */
function updateQuantity(itemId, newQuantity) {
  if (newQuantity < 1) {
    removeFromCart(itemId);
    return;
  }

  let cart = getCart();
  const item = cart.find(item => item.id === itemId);
  if (item) {
    item.quantity = newQuantity;
    localStorage.setItem('filmex_cart', JSON.stringify(cart));
    loadCart();
    renderCart();
    updateCartCount();
  }
}

/**
 * Remove an item from cart
 * @param {number} itemId - ID of the item to remove
 */
function removeFromCart(itemId) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== itemId);
  localStorage.setItem('filmex_cart', JSON.stringify(cart));
  loadCart();
  renderCart();
  updateCartCount();
}

/**
 * Process checkout
 */
function checkout() {
  const auth = new AuthSystem();
  if (!auth.currentUser) {
    alert('Debes iniciar sesión para completar la compra');
    window.location.href = 'sesion.html';
    return;
  }

  const cart = getCart();
  if (cart.length === 0) {
    alert('Tu carrito está vacío');
    return;
  }

  // Calculate total
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Create purchase object
  const purchase = {
    items: cart,
    total: total
  };

  // Add purchase to user history
  const result = auth.addPurchase(purchase);
  alert(result.message);

  if (result.success) {
    // Clear cart
    localStorage.removeItem('filmex_cart');
    updateCartCount();
    
    // Redirect to purchases page
    window.location.href = 'compras.html';
  }
}

/**
 * Cancel order and clear cart
 */
function cancelOrder() {
  if (confirm('¿Estás seguro de que deseas cancelar tu pedido?')) {
    localStorage.removeItem('filmex_cart');
    loadCart();
    renderCart();
    updateCartCount();
  }
}

// Initialize the page based on which page we're on
document.addEventListener('DOMContentLoaded', function() {
  // Load movies on index page
  if (document.getElementById('products-container')) {
    loadMovies();
  }
  
  // Load cart on cart page
  if (document.getElementById('cart-items')) {
    loadCart();
    renderCart();
  }
  
  // Update auth UI on all pages
  updateAuthUI();
  
  // Initialize API examples if we're on a page that needs them
  initializeApiExamples();
});

/**
 * Initialize API examples
 * This demonstrates how to use our improved router.js
 */
function initializeApiExamples() {
  // Only run this if we're on a page that needs API examples
  if (!document.getElementById('api-examples')) return;
  
  // Example GET request
  api.get('/posts/1')
    .then(data => {
      console.log('GET example:', data);
    })
    .catch(error => {
      console.error('GET error:', error);
    });
  
  // Example POST request
  api.post('/posts', {
    title: 'Nuevo post',
    body: 'Este es el contenido del post',
    userId: 1
  })
    .then(data => {
      console.log('POST example:', data);
    })
    .catch(error => {
      console.error('POST error:', error);
    });
}
