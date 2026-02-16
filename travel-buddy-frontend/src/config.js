const config = {
  API_BASE_URL: (typeof import.meta !== 'undefined' && import.meta.env?.REACT_APP_API_URL) || 'http://172.50.10.2:3001',
  
  GOOGLE_CLIENT_ID: (typeof import.meta !== 'undefined' && import.meta.env?.REACT_APP_GOOGLE_CLIENT_ID) || '922471186798-op26h57f277gcjuo5la4k5k3qjv6ppvo.apps.googleusercontent.com',
  
  EMAILJS: {
    SERVICE_ID: (typeof import.meta !== 'undefined' && import.meta.env?.REACT_APP_EMAILJS_SERVICE_ID) || 'service_5oeleyx',
    TEMPLATE_ID: (typeof import.meta !== 'undefined' && import.meta.env?.REACT_APP_EMAILJS_TEMPLATE_ID) || 'template_05l2yfe',
    PUBLIC_KEY: (typeof import.meta !== 'undefined' && import.meta.env?.REACT_APP_EMAILJS_PUBLIC_KEY) || '5flHnCwygahE-5P2V',
  },
};

export default config;
