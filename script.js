// Configuración global
const CONFIG = {
  API_KEY: 'e60b122830b5717e215f3ca2112f8279',
  LANGUAGE: 'es-MX',
  CART_STORAGE_KEY: 'filmex_cart',
  MOVIES_PER_PAGE: 5
};

// Variables de estado
let currentPage = 1;
let totalPages = 4;
let movies = [];
let cart = [];


// Clase para manejar películas
class Movie {
  constructor(id, title, price, image, description, director, cast, trailer) {
    this.id = id;
    this.title = title;
    this.price = price;
    this.image = image;
    this.description = description;
    this.director = director;
    this.cast = cast;
    this.trailer = trailer;
  }
}

// Funciones principales
async function initializeApp() {
  // Verificar si estamos en la página de carrito
  const isCartPage = document.getElementById('cart-items') !== null;

  if (!isCartPage) {
    await loadMovies();
    renderMovies();
    setupPagination();
  }

  loadCart();
  updateCartCount();

  if (isCartPage) {
    renderCart();
  }

  setupEventListeners();
}

document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
  updateAuthUI();
});


// Cargar películas desde TMDb API
async function loadMovies() {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${CONFIG.API_KEY}&language=${CONFIG.LANGUAGE}&page=1`
    );
    const data = await response.json();

    const rawMovies = data.results.slice(0, 20);

    movies = await Promise.all(rawMovies.map(async movie => {
      const [details, credits, videos] = await Promise.all([
        fetchMovieDetails(movie.id),
        fetchMovieCredits(movie.id),
        fetchMovieVideos(movie.id)
      ]);
      
      return new Movie(
        movie.id,
        movie.title,
        calculatePrice(movie.vote_average),
        `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        movie.overview,
        getDirector(credits.crew),
        getMainCast(credits.cast),
        getTrailer(videos.results)
      );
    }));
  } catch (error) {
    console.error('Error loading movies:', error);
    showToast('Error al cargar películas', 'danger');
  }
}

// Renderizar películas en la página principal
function renderMovies() {
  const container = document.getElementById('products-container');
  if (!container) return;

  const start = (currentPage - 1) * CONFIG.MOVIES_PER_PAGE;
  const end = start + CONFIG.MOVIES_PER_PAGE;
  const moviesToShow = movies.slice(start, end);

  container.innerHTML = moviesToShow.map(movie => `
    <div class="col-lg-4 col-md-6 mb-4">
      <div class="card h-100">
        <img src="${movie.image}" class="card-img-top" alt="${movie.title}" loading="lazy">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${movie.title}</h5>
          <p class="card-text mt-auto">$${movie.price.toFixed(2)}</p>
          <div class="d-grid gap-2 mt-3">
            <button class="btn btn-primary" onclick="addToCart(${movie.id})">
              <i class="fas fa-cart-plus"></i> Agregar
            </button>
            <button class="btn btn-outline-secondary" onclick="showMovieDetails(${movie.id})">
              <i class="fas fa-info-circle"></i> Detalles
            </button>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

// Configurar paginación
function setupPagination() {
  const container = document.getElementById('pagination');
  if (!container) return;

  container.innerHTML = '';

  for (let i = 1; i <= totalPages; i++) {
    const li = document.createElement('li');
    li.className = `page-item ${i === currentPage ? 'active' : ''}`;
    li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
    li.addEventListener('click', (e) => {
      e.preventDefault();
      currentPage = i;
      renderMovies();
      setupPagination();
    });
    container.appendChild(li);
  }
}

// Funciones de detalles de película
function showMovieDetails(movieId) {
  const movie = movies.find(m => m.id === movieId);
  if (!movie) return;

  document.getElementById('movieModalTitle').textContent = movie.title;
  document.getElementById('movieModalImage').src = movie.image;
  document.getElementById('movieModalDescription').textContent = movie.description;
  document.getElementById('movieModalDirector').textContent = movie.director;
  document.getElementById('movieModalCast').textContent = movie.cast;

  const trailer = document.getElementById('movieModalTrailer');
  trailer.src = movie.trailer;
  trailer.closest('.modal').dataset.movieId = movieId;

  const modal = new bootstrap.Modal(document.getElementById('movieModal'));
  modal.show();
}

// Funciones auxiliares para películas
async function fetchMovieDetails(movieId) {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}?api_key=${CONFIG.API_KEY}&language=${CONFIG.LANGUAGE}`
  );
  return response.json();
}

async function fetchMovieCredits(movieId) {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${CONFIG.API_KEY}`
  );
  return response.json();
}

async function fetchMovieVideos(movieId) {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${CONFIG.API_KEY}&language=${CONFIG.LANGUAGE}`
  );
  return response.json();
}

function getDirector(crew) {
  const director = crew.find(person => person.job === 'Director');
  return director ? director.name : 'Director no disponible';
}

function getMainCast(cast) {
  return cast.slice(0, 3).map(actor => actor.name).join(', ');
}

function getTrailer(videos) {
  const trailer = videos.find(v => v.type === 'Trailer' && v.site === 'YouTube');
  return trailer ? `https://www.youtube.com/embed/${trailer.key}` : '';
}

function calculatePrice(rating) {
  return 80 + (Math.round(rating) * 5);
}



// Funciones del carrito
function loadCart() {
  const savedCart = localStorage.getItem(CONFIG.CART_STORAGE_KEY);
  cart = savedCart ? JSON.parse(savedCart) : [];
}

function saveCart() {
  localStorage.setItem(CONFIG.CART_STORAGE_KEY, JSON.stringify(cart));
  updateCartCount();
}

function renderCart() {
  const container = document.getElementById('cart-items');
  const totalElement = document.getElementById('total-price');

  if (!container || !totalElement) return;

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="col-12 text-center py-5">
        <i class="fas fa-shopping-cart fa-5x text-muted mb-3"></i>
        <h3>Tu carrito está vacío</h3>
        <a href="index.html" class="btn btn-primary mt-3">Ir a la tienda</a>
      </div>
    `;
    totalElement.textContent = "0.00";
  } else {
    container.innerHTML = cart.map(item => `
      <div class="col-lg-6 col-md-6 mb-4">
        <div class="card h-100">
          <div class="row g-0">
            <div class="col-md-4">
              <img src="${item.image}" class="img-fluid rounded-start h-100" alt="${item.title}" style="object-fit: cover;">
            </div>
            <div class="col-md-8">
              <div class="card-body">
                <h5 class="card-title">${item.title}</h5>
                <p class="card-text">Precio unitario: $${item.price.toFixed(2)}</p>
                <div class="d-flex align-items-center mb-2">
                  <button class="btn btn-outline-secondary btn-sm" onclick="changeQuantity(${item.id}, -1)">
                    <i class="fas fa-minus"></i>
                  </button>
                  <span class="mx-2">${item.quantity}</span>
                  <button class="btn btn-outline-secondary btn-sm" onclick="changeQuantity(${item.id}, 1)">
                    <i class="fas fa-plus"></i>
                  </button>
                </div>
                <p class="card-text"><strong>Subtotal: $${(item.price * item.quantity).toFixed(2)}</strong></p>
                <button class="btn btn-danger btn-sm" onclick="removeFromCart(${item.id})">
                  <i class="fas fa-trash"></i> Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `).join('');

    totalElement.textContent = calculateTotal().toFixed(2);
  }
}

function addToCart(movieId) {
  const movie = movies.find(m => m.id === movieId);
  if (!movie) return;

  const existingItem = cart.find(item => item.id === movieId);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({
      id: movie.id,
      title: movie.title,
      price: movie.price,
      image: movie.image,
      quantity: 1
    });
  }

  saveCart();
  showToast(`${movie.title} agregada al carrito`);
}

function removeFromCart(movieId) {
  cart = cart.filter(item => item.id !== movieId);
  saveCart();
  if (document.getElementById('cart-items')) {
    renderCart();
  }
}

function changeQuantity(movieId, change) {
  const item = cart.find(item => item.id === movieId);
  if (!item) return;

  item.quantity += change;

  if (item.quantity < 1) {
    removeFromCart(movieId);
  } else {
    saveCart();
    if (document.getElementById('cart-items')) {
      renderCart();
    }
  }
}

function calculateTotal() {
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const countElement = document.getElementById('cart-count');
  if (countElement) countElement.textContent = count;
}

// Funciones globales para el carrito
window.cancelOrder = function() {
  if (confirm('¿Estás seguro de vaciar el carrito?')) {
    cart = [];
    saveCart();
    renderCart();
  }
}

window.checkout = function() {
  if (cart.length === 0) {
    showToast('El carrito está vacío', 'danger');
    return;
  }

  if (confirm(`¿Confirmar compra por $${calculateTotal().toFixed(2)}?`)) {
    cart = [];
    saveCart();
    showToast('¡Compra realizada con éxito!');
    renderCart();
  }
}

// Funciones de autenticación
function updateAuthUI() {
  const auth = new AuthSystem();
  const user = auth.currentUser;

  const loginNav = document.getElementById('loginNav');
  const registerNav = document.getElementById('registerNav');
  const userInfo = document.getElementById('user-info');
  const purchasesNav = document.getElementById('purchasesNav');
  const userName = document.getElementById('user-name');

  if (user) {
    if (loginNav) loginNav.style.display = 'none';
    if (registerNav) registerNav.style.display = 'none';
    if (userInfo) userInfo.style.display = 'block';
    if (purchasesNav) purchasesNav.style.display = 'block';
    if (userName) userName.textContent = user.name;
  } else {
    if (loginNav) loginNav.style.display = 'block';
    if (registerNav) registerNav.style.display = 'block';
    if (userInfo) userInfo.style.display = 'none';
    if (purchasesNav) purchasesNav.style.display = 'none';
    if (userName) userName.textContent = '';
  }
}

function setupEventListeners() {
  // Login form
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value;
      const password = document.getElementById('loginPassword').value;

      if (email && password) {
        showToast('Inicio de sesión exitoso');
        const modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
        modal.hide();
      } else {
        showToast('Por favor completa todos los campos', 'danger');
      }
    });
  }

  // Logout
  const logoutBtn = document.getElementById('logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function (e) {
      e.preventDefault();
      const auth = new AuthSystem();
      auth.logout();
      showToast('Sesión cerrada');
      updateAuthUI();
      window.location.href = 'index.html';
    });
  }
}


// Funciones utilitarias
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast show position-fixed bottom-0 end-0 m-3`;
  toast.innerHTML = `
    <div class="toast-header bg-${type} text-white">
      <strong class="me-auto">${type === 'success' ? 'Éxito' : 'Error'}</strong>
      <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
    <div class="toast-body">${message}</div>
  `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// Hacer funciones accesibles globalmente
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.changeQuantity = changeQuantity;
window.showMovieDetails = showMovieDetails;
window.cancelOrder = cancelOrder;
window.checkout = checkout;
window.showToast = showToast;
window.updateAuthUI = updateAuthUI; 
window.AuthSystem = AuthSystem;


 