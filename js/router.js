/**
 * API Router - Client for handling API requests
 * Provides a clean interface for making HTTP requests to external APIs
 */

class ApiRouter {
  constructor(baseUrl) {
    this.baseUrl = baseUrl || 'https://jsonplaceholder.typicode.com';
    this.headers = {
      'Content-Type': 'application/json'
    };
  }

  /**
   * Handles the response from fetch requests
   * @param {Response} response - The fetch response object
   * @returns {Promise} - Promise with the parsed response data
   */
  async handleResponse(response) {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! Status: ${response.status}`);
    }
    
    // For DELETE requests that don't return content
    if (response.status === 204) {
      return { success: true };
    }
    
    return response.json();
  }

  /**
   * Makes a GET request to the specified endpoint
   * @param {string} endpoint - The API endpoint
   * @returns {Promise} - Promise with the response data
   */
  async get(endpoint) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`);
      return await this.handleResponse(response);
    } catch (error) {
      console.error('GET Error:', error);
      throw error;
    }
  }

  /**
   * Makes a POST request to the specified endpoint
   * @param {string} endpoint - The API endpoint
   * @param {Object} data - The data to send in the request body
   * @returns {Promise} - Promise with the response data
   */
  async post(endpoint, data) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(data)
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('POST Error:', error);
      throw error;
    }
  }

  /**
   * Makes a PUT request to the specified endpoint
   * @param {string} endpoint - The API endpoint
   * @param {Object} data - The data to send in the request body
   * @returns {Promise} - Promise with the response data
   */
  async put(endpoint, data) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'PUT',
        headers: this.headers,
        body: JSON.stringify(data)
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('PUT Error:', error);
      throw error;
    }
  }

  /**
   * Makes a DELETE request to the specified endpoint
   * @param {string} endpoint - The API endpoint
   * @returns {Promise} - Promise with the response data
   */
  async delete(endpoint) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'DELETE',
        headers: this.headers
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error('DELETE Error:', error);
      throw error;
    }
  }
}

// Export the ApiRouter class for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ApiRouter };
} else {
  // For browser environments
  window.ApiRouter = ApiRouter;
}

// Example usage:
/*
const api = new ApiRouter();

// GET example
api.get('/posts/1')
  .then(data => console.log('GET result:', data))
  .catch(error => console.error('GET error:', error));

// POST example
api.post('/posts', {
  title: 'Nuevo post',
  body: 'Este es el contenido del post',
  userId: 1
})
  .then(data => console.log('POST result:', data))
  .catch(error => console.error('POST error:', error));

// PUT example
api.put('/posts/1', {
  id: 1,
  title: 'Post actualizado',
  body: 'Este es el nuevo contenido',
  userId: 1
})
  .then(data => console.log('PUT result:', data))
  .catch(error => console.error('PUT error:', error));

// DELETE example
api.delete('/posts/1')
  .then(result => console.log('DELETE result:', result))
  .catch(error => console.error('DELETE error:', error));
*/
    