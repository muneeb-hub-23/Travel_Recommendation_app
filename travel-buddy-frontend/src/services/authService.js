import config from '../config';

const API_URL = `${config.API_BASE_URL}/api/auth`;

export const authService = {
  async signup(userData) {
    const response = await fetch(`${API_URL}/signup/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || Object.values(data)[0] || 'Signup failed');
    }
    return data;
  },

  async verifyOTP(email, code) {
    const response = await fetch(`${API_URL}/verify-otp/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, code }),
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'OTP verification failed');
    }
    
    // Store tokens
    if (data.tokens) {
      localStorage.setItem('access_token', data.tokens.access);
      localStorage.setItem('refresh_token', data.tokens.refresh);
    }
    
    return data;
  },

  async login(email, password) {
    const response = await fetch(`${API_URL}/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || Object.values(data)[0] || 'Login failed');
    }
    
    // Store tokens if login successful
    if (data.tokens) {
      localStorage.setItem('access_token', data.tokens.access);
      localStorage.setItem('refresh_token', data.tokens.refresh);
    }
    
    return data;
  },

  async resendOTP(email) {
    const response = await fetch(`${API_URL}/resend-otp/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to resend OTP');
    }
    return data;
  },

  async googleAuth(token) {
    const response = await fetch(`${API_URL}/google-auth/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Google authentication failed');
    }
    
    // Store tokens
    if (data.tokens) {
      localStorage.setItem('access_token', data.tokens.access);
      localStorage.setItem('refresh_token', data.tokens.refresh);
    }
    
    return data;
  },

  async getProfile() {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${API_URL}/profile/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch profile');
    }
    return data;
  },

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },

  isAuthenticated() {
    return !!localStorage.getItem('access_token');
  },

  getToken() {
    return localStorage.getItem('access_token');
  }
};
