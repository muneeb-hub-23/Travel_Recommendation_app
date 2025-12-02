from django.apps import AppConfig
import logging

logger = logging.getLogger(__name__)


class RecommendationsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'recommendations'
    
    def ready(self):
        """Initialize ML models when Django starts"""
        try:
            # Import here to avoid circular imports
            from .ml_engine import initialize_ml_models
            initialize_ml_models()
            logger.info("ML models initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize ML models: {e}")
