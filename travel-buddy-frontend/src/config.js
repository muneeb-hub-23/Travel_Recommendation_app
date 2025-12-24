const config = {
  API_BASE_URL: (typeof process !== 'undefined' && process.env?.REACT_APP_API_URL) || 'http://localhost:4000',
};

export default config;
