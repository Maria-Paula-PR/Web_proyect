// auth-system.js
class AuthSystem {
  constructor() {
    this.users = JSON.parse(localStorage.getItem('filmex_users')) || [];
    this.currentUser = JSON.parse(localStorage.getItem('filmex_currentUser')) || null;
  }

  register(name, email, password) {
    // Validación adicional
    if (!name || !email || !password) {
      return { success: false, message: 'Todos los campos son obligatorios' };
    }

    if (this.users.some(user => user.email === email)) {
      return { success: false, message: 'El correo ya está registrado' };
    }

    const newUser = {
      id: this.generateId(),
      name,
      email,
      password,
      registrationDate: new Date().toISOString(),
      purchases: []
    };

    this.users.push(newUser);
    localStorage.setItem('filmex_users', JSON.stringify(this.users));
    
    // Autologin después del registro
    this.currentUser = newUser;
    localStorage.setItem('filmex_currentUser', JSON.stringify(newUser));
    
    return { success: true, message: 'Registro exitoso', user: newUser };
  }

  login(email, password) {
    if (!email || !password) {
      return { success: false, message: 'Email y contraseña son requeridos' };
    }

    const user = this.users.find(u => u.email === email && u.password === password);
    
    if (user) {
      this.currentUser = user;
      localStorage.setItem('filmex_currentUser', JSON.stringify(user));
      return { success: true, message: 'Inicio de sesión exitoso', user };
    }
    
    return { success: false, message: 'Credenciales incorrectas' };
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem('filmex_currentUser');
    return { success: true, message: 'Sesión cerrada' };
  }

  generateId() {
    return Math.random().toString(36).substr(2, 9);
  }
}