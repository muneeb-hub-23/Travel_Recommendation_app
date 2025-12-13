"""
AI-powered natural language search for destinations
Processes user queries and filters destinations accordingly
Uses spaCy and scikit-learn for advanced NLP
"""
import re
from django.db.models import Q
from .models import Destination
from .nlp_processor import NLPProcessor


class SmartSearch:
    """Smart search engine for natural language queries"""
    
    # Category keywords mapping
    CATEGORY_KEYWORDS = {
        'mountain': ['mountain', 'mountains', 'peak', 'peaks', 'hill', 'hills', 'valley', 'valleys'],
        'beach': ['beach', 'beaches', 'sea', 'ocean', 'coastal', 'seaside', 'shore'],
        'city': ['city', 'cities', 'urban', 'town', 'metropolitan'],
        'historical': ['historical', 'historic', 'ancient', 'heritage', 'monument', 'fort', 'palace'],
        'adventure': ['adventure', 'adventurous', 'trekking', 'hiking', 'extreme'],
        'cultural': ['cultural', 'culture', 'traditional', 'ethnic', 'local'],
    }
    
    # Weather keywords mapping
    WEATHER_KEYWORDS = {
        'sunny': ['sunny', 'sun', 'sunshine', 'clear', 'bright'],
        'cloudy': ['cloudy', 'clouds', 'overcast'],
        'rainy': ['rainy', 'rain', 'rainfall', 'monsoon', 'wet'],
        'cold': ['cold', 'chilly', 'freezing', 'winter'],
        'snow': ['snow', 'snowfall', 'snowy', 'snowcapped', 'skiing'],
    }
    
    # Season keywords
    SEASON_KEYWORDS = {
        'Spring': ['spring'],
        'Summer': ['summer', 'hot'],
        'Autumn': ['autumn', 'fall'],
        'Winter': ['winter', 'cold', 'snow'],
        'All Year': ['all year', 'year-round', 'anytime'],
    }
    
    # Special filters
    TRENDING_KEYWORDS = ['trending', 'popular', 'famous', 'top', 'best']
    
    @staticmethod
    def extract_keywords(query):
        """Extract relevant keywords from query"""
        query = query.lower().strip()
        
        result = {
            'categories': [],
            'weather': [],
            'seasons': [],
            'is_trending': False,
            'original_query': query
        }
        
        # Check for categories
        for category, keywords in SmartSearch.CATEGORY_KEYWORDS.items():
            if any(keyword in query for keyword in keywords):
                result['categories'].append(category)
        
        # Check for weather
        for weather, keywords in SmartSearch.WEATHER_KEYWORDS.items():
            if any(keyword in query for keyword in keywords):
                result['weather'].append(weather)
        
        # Check for seasons
        for season, keywords in SmartSearch.SEASON_KEYWORDS.items():
            if any(keyword in query for keyword in keywords):
                result['seasons'].append(season)
        
        # Check for trending
        if any(keyword in query for keyword in SmartSearch.TRENDING_KEYWORDS):
            result['is_trending'] = True
        
        return result
    
    @staticmethod
    def search_destinations(query, limit=20):
        """
        Search destinations based on natural language query using NLP
        Returns filtered destinations
        """
        # Use advanced NLP processing
        nlp_result = NLPProcessor.process_query(query)
        
        # Start with all destinations
        queryset = Destination.objects.all()
        
        # Apply destination type filters (from NLP extraction)
        if nlp_result['destination_types']:
            type_query = Q()
            for dest_type in nlp_result['destination_types']:
                # Search in category, name, and description for destination types
                type_query |= Q(category__icontains=dest_type)
                type_query |= Q(name__icontains=dest_type)
                type_query |= Q(description__icontains=dest_type)
            queryset = queryset.filter(type_query)
        
        # Apply category filters (fallback to old method)
        old_keywords = SmartSearch.extract_keywords(query)
        if old_keywords['categories'] and not nlp_result['destination_types']:
            category_query = Q()
            for category in old_keywords['categories']:
                category_query |= Q(category__icontains=category)
                # Also search in name/description
                category_query |= Q(name__icontains=category)
                category_query |= Q(description__icontains=category)
            queryset = queryset.filter(category_query)
        
        # Apply weather filters (search in general_weather, name, and description)
        if nlp_result['weather']:
            weather_query = Q()
            for weather in nlp_result['weather']:
                # Search in general_weather field
                weather_query |= Q(general_weather__icontains=weather)
                # Also search in name and description (in case general_weather is not set)
                weather_query |= Q(name__icontains=weather)
                weather_query |= Q(description__icontains=weather)
            queryset = queryset.filter(weather_query)
        
        # Apply season filters
        if nlp_result['seasons']:
            season_query = Q()
            for season in nlp_result['seasons']:
                season_query |= Q(best_season__icontains=season)
            queryset = queryset.filter(season_query)
        
        # If no specific filters but has keywords, search in name and description
        if not (nlp_result['destination_types'] or nlp_result['weather'] or nlp_result['seasons']):
            if nlp_result['keywords']:
                name_desc_query = Q()
                for keyword in nlp_result['keywords']:
                    if len(keyword) > 2:  # Skip very short words
                        name_desc_query |= Q(name__icontains=keyword) | Q(description__icontains=keyword)
                if name_desc_query:
                    queryset = queryset.filter(name_desc_query)
        
        # Apply trending filter (order by rating)
        if nlp_result['is_trending']:
            queryset = queryset.order_by('-rating', '-created_at')
        else:
            queryset = queryset.order_by('-rating')
        
        # Limit results
        results = list(queryset[:limit])
        
        # Merge NLP results with old keywords for summary
        combined_keywords = {
            'categories': old_keywords['categories'] if old_keywords['categories'] else nlp_result['destination_types'],
            'weather': nlp_result['weather'],
            'seasons': nlp_result['seasons'],
            'is_trending': nlp_result['is_trending'],
            'extracted_keywords': nlp_result['keywords'],
            'room_type': nlp_result.get('room_type'),
            'budget_min': nlp_result.get('budget_min'),
            'budget_max': nlp_result.get('budget_max'),
            'days': nlp_result.get('days'),
            'location': nlp_result.get('location')
        }
        
        return {
            'destinations': results,
            'count': len(results),
            'keywords': combined_keywords,
            'query': query
        }
    
    @staticmethod
    def generate_search_summary(keywords):
        """Generate a human-readable summary of the search"""
        parts = []
        
        if keywords.get('categories'):
            parts.append(', '.join(keywords['categories']).title())
        
        if keywords.get('weather'):
            parts.append(f"{', '.join(keywords['weather']).title()} weather")
        
        if keywords.get('seasons'):
            parts.append(f"{', '.join(keywords['seasons'])} season")
        
        if keywords.get('is_trending'):
            parts.insert(0, "Trending")
        
        if parts:
            return f"Showing: {' | '.join(parts)}"
        elif keywords.get('extracted_keywords'):
            keywords_str = ', '.join(keywords['extracted_keywords'][:5])  # Show first 5
            return f"Results for: {keywords_str}"
        else:
            return "Search results"
