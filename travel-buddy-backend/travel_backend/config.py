"""
Database and Server Configuration
This file contains MySQL database configuration and server settings.
"""


class DatabaseConfig:
    """MySQL Database Configuration"""
    
    # MySQL Database Settings
    DB_ENGINE = 'django.db.backends.mysql'
    DB_NAME = 'travel_buddy'
    DB_USER = 'root'
    DB_PASSWORD = 'root'
    DB_HOST = 'localhost'
    DB_PORT = '3306'
    
    # Additional MySQL Options
    DB_OPTIONS = {
        'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
        'charset': 'utf8mb4',
    }
    
    @classmethod
    def get_database_config(cls):
        """Returns the complete database configuration dictionary"""
        return {
            'ENGINE': cls.DB_ENGINE,
            'NAME': cls.DB_NAME,
            'USER': cls.DB_USER,
            'PASSWORD': cls.DB_PASSWORD,
            'HOST': cls.DB_HOST,
            'PORT': cls.DB_PORT,
            'OPTIONS': cls.DB_OPTIONS,
        }


class ServerConfig:
    """Server Configuration"""
    
    # Server Settings
    SERVER_HOST = '127.0.0.1'
    SERVER_PORT = '4002'
    
    # API Settings
    API_VERSION = 'v1'
    API_TITLE = 'Travel Recommendation API'
    
    @classmethod
    def get_server_url(cls):
        """Returns the complete server URL"""
        return f"http://{cls.SERVER_HOST}:{cls.SERVER_PORT}"


class AppConfig:
    """Application-wide Configuration"""
    
    # Django Settings
    SECRET_KEY = 'your-secret-key-here'
    DEBUG = True
    ALLOWED_HOSTS = ['*']  # Allow all hosts for IIS deployment
    
    # CORS Settings
    CORS_ALLOWED_ORIGINS = [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://172.30.10.2:4001',
        'http://124.109.46.50:4001',
    ]
    
    # Media and Static Files
    MEDIA_ROOT_PATH = 'media'
    STATIC_ROOT_PATH = 'staticfiles'
    
    # Google OAuth
    GOOGLE_CLIENT_ID = '922471186798-op26h57f277gcjuo5la4k5k3qjv6ppvo.apps.googleusercontent.com'


# Create singleton instances for easy import
database_config = DatabaseConfig()
server_config = ServerConfig()
app_config = AppConfig()
