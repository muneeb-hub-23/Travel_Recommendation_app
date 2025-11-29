"""
Database and Server Configuration
This file contains MySQL database configuration and server settings.
"""

import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


class DatabaseConfig:
    """MySQL Database Configuration"""
    
    # MySQL Database Settings
    DB_ENGINE = os.getenv('DB_ENGINE', 'django.db.backends.mysql')
    DB_NAME = os.getenv('DB_NAME', 'travel_recommendation_db')
    DB_USER = os.getenv('DB_USER', 'root')
    DB_PASSWORD = os.getenv('DB_PASSWORD', '')
    DB_HOST = os.getenv('DB_HOST', 'localhost')
    DB_PORT = os.getenv('DB_PORT', '3306')
    
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
    SERVER_HOST = os.getenv('SERVER_HOST', '127.0.0.1')
    SERVER_PORT = os.getenv('SERVER_PORT', '8000')
    
    # API Settings
    API_VERSION = os.getenv('API_VERSION', 'v1')
    API_TITLE = os.getenv('API_TITLE', 'Travel Recommendation API')
    
    @classmethod
    def get_server_url(cls):
        """Returns the complete server URL"""
        return f"http://{cls.SERVER_HOST}:{cls.SERVER_PORT}"


class AppConfig:
    """Application-wide Configuration"""
    
    # Django Settings
    SECRET_KEY = os.getenv('SECRET_KEY', 'django-insecure-change-this-in-production')
    DEBUG = os.getenv('DEBUG', 'True') == 'True'
    ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', 'localhost,127.0.0.1').split(',')
    
    # CORS Settings
    CORS_ALLOWED_ORIGINS = os.getenv(
        'CORS_ALLOWED_ORIGINS',
        'http://localhost:3000,http://127.0.0.1:3000'
    ).split(',')
    
    # Media and Static Files
    MEDIA_ROOT_PATH = os.getenv('MEDIA_ROOT', 'media')
    STATIC_ROOT_PATH = os.getenv('STATIC_ROOT', 'staticfiles')


# Create singleton instances for easy import
database_config = DatabaseConfig()
server_config = ServerConfig()
app_config = AppConfig()
