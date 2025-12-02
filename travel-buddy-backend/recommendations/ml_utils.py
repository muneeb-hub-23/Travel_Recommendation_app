"""
Utility functions for ML-powered recommendations
Integrates ml_engine with Django models
"""
import logging
from typing import List, Dict, Any
from django.db.models import QuerySet
from .models import Destination, Review, UserPreference
from .ml_engine import (
    get_content_based_recommendations,
    process_review_text,
    extract_keywords,
    analyze_sentiment
)

logger = logging.getLogger(__name__)


def get_ml_recommendations_for_user(user, limit: int = 10) -> QuerySet:
    """
    Get ML-powered recommendations for a user
    
    Args:
        user: Django User object
        limit: Maximum number of recommendations to return
        
    Returns:
        QuerySet of recommended Destination objects
    """
    try:
        # Get user preferences
        try:
            preferences = UserPreference.objects.get(user=user)
            user_text = build_user_preference_text(preferences)
        except UserPreference.DoesNotExist:
            # Use generic preferences if none exist
            user_text = "travel adventure explore beautiful destinations"
        
        # Get all destinations with their descriptions
        destinations = Destination.objects.all()
        destination_texts = [
            f"{dest.name} {dest.country} {dest.description} {dest.category} {dest.best_season}"
            for dest in destinations
        ]
        
        if not destination_texts:
            return Destination.objects.none()
        
        # Get recommendations using content-based filtering
        recommended_indices = get_content_based_recommendations(
            destination_texts,
            user_text,
            top_n=limit
        )
        
        # Convert indices to destination IDs
        destination_list = list(destinations)
        recommended_destinations = [destination_list[i] for i in recommended_indices if i < len(destination_list)]
        
        # Return as queryset preserving order
        if recommended_destinations:
            destination_ids = [d.id for d in recommended_destinations]
            preserved = {d.id: i for i, d in enumerate(recommended_destinations)}
            return sorted(
                Destination.objects.filter(id__in=destination_ids),
                key=lambda x: preserved[x.id]
            )
        
        return Destination.objects.none()
        
    except Exception as e:
        logger.error(f"Error getting ML recommendations: {e}")
        # Fallback to rating-based recommendations
        return Destination.objects.all().order_by('-rating')[:limit]


def build_user_preference_text(preferences: UserPreference) -> str:
    """
    Build a text representation of user preferences for ML processing
    
    Args:
        preferences: UserPreference object
        
    Returns:
        Text representation of preferences
    """
    text_parts = []
    
    # Add preferred categories
    if preferences.preferred_categories:
        text_parts.extend(preferences.preferred_categories)
    
    # Add budget preference
    if preferences.budget_range:
        text_parts.append(preferences.budget_range)
    
    # Add preferred seasons
    if preferences.preferred_seasons:
        text_parts.extend(preferences.preferred_seasons)
    
    return " ".join(text_parts)


def analyze_review_sentiment_bulk(destination_id: int) -> Dict[str, Any]:
    """
    Analyze sentiment of all reviews for a destination
    
    Args:
        destination_id: ID of the destination
        
    Returns:
        Dictionary with aggregated sentiment analysis
    """
    try:
        reviews = Review.objects.filter(destination_id=destination_id)
        
        if not reviews.exists():
            return {
                'total_reviews': 0,
                'average_sentiment_score': 0.5,
                'sentiment_distribution': {
                    'positive': 0,
                    'neutral': 0,
                    'negative': 0
                }
            }
        
        sentiment_scores = []
        sentiment_counts = {'positive': 0, 'neutral': 0, 'negative': 0}
        
        for review in reviews:
            sentiment_result = analyze_sentiment(review.comment)
            sentiment_scores.append(sentiment_result['score'])
            sentiment_counts[sentiment_result['sentiment']] += 1
        
        return {
            'total_reviews': len(sentiment_scores),
            'average_sentiment_score': sum(sentiment_scores) / len(sentiment_scores),
            'sentiment_distribution': sentiment_counts
        }
        
    except Exception as e:
        logger.error(f"Error analyzing review sentiments: {e}")
        return {
            'total_reviews': 0,
            'average_sentiment_score': 0.5,
            'sentiment_distribution': {'positive': 0, 'neutral': 0, 'negative': 0}
        }


def extract_destination_keywords(destination: Destination) -> List[str]:
    """
    Extract keywords from destination description
    
    Args:
        destination: Destination object
        
    Returns:
        List of extracted keywords
    """
    try:
        text = f"{destination.name} {destination.description} {destination.category}"
        return extract_keywords(text, top_n=15)
    except Exception as e:
        logger.error(f"Error extracting keywords: {e}")
        return []


def get_similar_destinations(destination: Destination, limit: int = 5) -> QuerySet:
    """
    Find similar destinations based on content similarity
    
    Args:
        destination: Reference destination
        limit: Number of similar destinations to return
        
    Returns:
        QuerySet of similar destinations
    """
    try:
        # Get all other destinations
        all_destinations = Destination.objects.exclude(id=destination.id)
        
        if not all_destinations.exists():
            return Destination.objects.none()
        
        # Build text for current destination
        current_text = f"{destination.name} {destination.country} {destination.description} {destination.category}"
        
        # Build texts for all destinations
        destination_texts = [
            f"{dest.name} {dest.country} {dest.description} {dest.category}"
            for dest in all_destinations
        ]
        
        # Get similar destinations
        similar_indices = get_content_based_recommendations(
            destination_texts,
            current_text,
            top_n=limit
        )
        
        # Convert indices to destinations
        destination_list = list(all_destinations)
        similar_destinations = [destination_list[i] for i in similar_indices if i < len(destination_list)]
        
        if similar_destinations:
            destination_ids = [d.id for d in similar_destinations]
            preserved = {d.id: i for i, d in enumerate(similar_destinations)}
            return sorted(
                Destination.objects.filter(id__in=destination_ids),
                key=lambda x: preserved[x.id]
            )
        
        return Destination.objects.none()
        
    except Exception as e:
        logger.error(f"Error finding similar destinations: {e}")
        # Fallback to same category
        return Destination.objects.filter(
            category=destination.category
        ).exclude(id=destination.id)[:limit]


def enhance_review_with_ml(review_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Enhance review data with ML-extracted information
    
    Args:
        review_data: Dictionary containing review information
        
    Returns:
        Enhanced review data with ML insights
    """
    try:
        if 'comment' in review_data:
            ml_insights = process_review_text(review_data['comment'])
            review_data['ml_insights'] = ml_insights
        return review_data
    except Exception as e:
        logger.error(f"Error enhancing review with ML: {e}")
        return review_data
