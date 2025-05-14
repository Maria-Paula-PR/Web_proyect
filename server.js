/**
 * Express server for FILMEX application
 * Serves static files and API endpoints
 */

const express = require('express');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Parse JSON requests
app.use(express.json());

// Serve Swagger documentation
const swaggerDocument = JSON.parse(fs.readFileSync('./api-docs/swagger.json', 'utf8'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Serve static files
app.use(express.static(__dirname));

// Sample API endpoints to match Swagger documentation
// Users endpoints
app.post('/users', (req, res) => {
  res.status(201).json({
    _id: '60d21b4667d0d8992e610c85',
    name: req.body.name,
    lastname: req.body.lastname,
    mail: req.body.mail,
    created_at: new Date().toISOString()
  });
});

app.get('/users', (req, res) => {
  res.json([
    {
      _id: '60d21b4667d0d8992e610c85',
      name: 'John',
      lastname: 'Doe',
      mail: 'john.doe@example.com',
      created_at: new Date().toISOString()
    }
  ]);
});

app.get('/users/:email', (req, res) => {
  res.json({
    _id: '60d21b4667d0d8992e610c85',
    name: 'John',
    lastname: 'Doe',
    mail: req.params.email,
    created_at: new Date().toISOString()
  });
});

app.post('/auth/login', (req, res) => {
  res.json({
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtYWlsIjoiam9obi5kb2VAZXhhbXBsZS5jb20iLCJpYXQiOjE2MjUwNjQ4MjJ9',
    user: {
      _id: '60d21b4667d0d8992e610c85',
      name: 'John',
      lastname: 'Doe',
      mail: req.body.mail,
      created_at: new Date().toISOString()
    }
  });
});

// Movies endpoints
app.get('/movies', (req, res) => {
  res.json([
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
    }
  ]);
});

app.get('/movies/:id', (req, res) => {
  res.json({
    id: parseInt(req.params.id),
    title: 'Interstellar',
    description: 'Un grupo de exploradores emprende una misión espacial para encontrar un nuevo hogar para la humanidad.',
    price: 19.99,
    image: 'https://m.media-amazon.com/images/I/91obuWzA3XL._AC_UF1000,1000_QL80_.jpg',
    year: 2014,
    director: 'Christopher Nolan',
    cast: 'Matthew McConaughey, Anne Hathaway, Jessica Chastain',
    trailer: 'https://www.youtube.com/embed/zSWdZVtXT7E'
  });
});

// Favorites endpoints
app.post('/favorites', (req, res) => {
  res.status(201).json({
    _id: '60d21b4667d0d8992e610c85',
    name: req.body.name,
    year: req.body.year,
    user_id: req.body.user_id,
    added_at: new Date().toISOString()
  });
});

app.get('/favorites', (req, res) => {
  res.json([
    {
      _id: '60d21b4667d0d8992e610c85',
      name: 'Interstellar',
      year: 2014,
      user_id: req.query.user_id,
      added_at: new Date().toISOString()
    }
  ]);
});

// Orders endpoints
app.post('/orders', (req, res) => {
  res.status(201).json({
    _id: '60d21b4667d0d8992e610c85',
    movie_name: req.body.movie_name,
    movie_price: req.body.movie_price,
    cantidad: req.body.cantidad,
    user_id: req.body.user_id,
    total: req.body.movie_price * req.body.cantidad,
    order_date: new Date().toISOString(),
    status: 'pending'
  });
});

app.get('/orders', (req, res) => {
  res.json([
    {
      _id: '60d21b4667d0d8992e610c85',
      movie_name: 'Interstellar',
      movie_price: 19.99,
      cantidad: 1,
      user_id: req.query.user_id,
      total: 19.99,
      order_date: new Date().toISOString(),
      status: 'pending'
    }
  ]);
});

app.get('/orders/:id', (req, res) => {
  res.json({
    _id: req.params.id,
    movie_name: 'Interstellar',
    movie_price: 19.99,
    cantidad: 1,
    user_id: '60d21b4667d0d8992e610c85',
    total: 19.99,
    order_date: new Date().toISOString(),
    status: 'pending'
  });
});

// Fallback route for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
});
