# Machine Learning Setup Guide

This guide explains how to set up and use the spaCy and scikit-learn integration for the Travel Buddy backend.

## Installation Steps

### 1. Install Python Dependencies

```bash
pip install -r requirements.txt
```

This will install:
- **spaCy** (>=3.7.0) - For NLP tasks
- **scikit-learn** (>=1.3.0) - For machine learning algorithms
- **numpy** (>=1.24.0) - For numerical operations
- **pandas** (>=2.0.0) - For data manipulation

### 2. Download spaCy Language Model

After installing the dependencies, download the English language model for spaCy:

```bash
python -m spacy download en_core_web_sm
```

For better performance, you can use larger models:
```bash
# Medium model (better accuracy, slower)
python -m spacy download en_core_web_md

# Large model (best accuracy, slowest)
python -m spacy download en_core_web_lg
```

If you use a different model, update the model name in `ml_engine.py`:
```python
nlp_model = spacy.load('en_core_web_md')  # or 'en_core_web_lg'
```

## Features

### 1. Content-Based Recommendations
The system uses TF-IDF vectorization and cosine similarity to recommend destinations based on:
- User preferences
- Destination descriptions
- Categories and features

### 2. Natural Language Processing
- **Keyword Extraction**: Extract important keywords from reviews and descriptions
- **Named Entity Recognition**: Identify locations, organizations, and other entities
- **Sentiment Analysis**: Analyze positive/negative sentiment in reviews
- **Text Similarity**: Calculate similarity between destinations

### 3. Automated Initialization
The ML models are automatically initialized when Django starts:
- spaCy NLP model loads on app startup
- TF-IDF vectorizer is pre-initialized
- StandardScaler is ready for feature normalization

## Usage Examples

### Getting ML-Powered Recommendations

```python
from recommendations.ml_utils import get_ml_recommendations_for_user

# Get recommendations for a user
recommended_destinations = get_ml_recommendations_for_user(user, limit=10)
```

### Analyzing Review Sentiment

```python
from recommendations.ml_utils import analyze_review_sentiment_bulk

# Analyze all reviews for a destination
sentiment_data = analyze_review_sentiment_bulk(destination_id)
```

### Finding Similar Destinations

```python
from recommendations.ml_utils import get_similar_destinations

# Find destinations similar to a given one
similar = get_similar_destinations(destination, limit=5)
```

### Extracting Keywords

```python
from recommendations.ml_utils import extract_destination_keywords

# Extract keywords from a destination
keywords = extract_destination_keywords(destination)
```

### Processing Review Text

```python
from recommendations.ml_engine import process_review_text

# Process a review to extract insights
insights = process_review_text("This was an amazing destination!")
# Returns: {
#     'keywords': ['amazing', 'destination'],
#     'entities': {...},
#     'sentiment': {'sentiment': 'positive', 'score': 0.8, ...}
# }
```

## API Integration

The ML features are integrated into the existing ViewSets. You can use them in your views:

```python
from rest_framework.decorators import action
from rest_framework.response import Response
from .ml_utils import get_ml_recommendations_for_user

class DestinationViewSet(viewsets.ModelViewSet):
    @action(detail=False, methods=['get'])
    def ml_recommended(self, request):
        """Get ML-powered recommendations"""
        recommendations = get_ml_recommendations_for_user(
            request.user, 
            limit=10
        )
        serializer = self.get_serializer(recommendations, many=True)
        return Response(serializer.data)
```

## Performance Considerations

1. **Model Loading**: spaCy models are loaded once at startup to improve performance
2. **Caching**: Consider implementing caching for frequently requested recommendations
3. **Batch Processing**: Process multiple reviews or destinations together when possible
4. **Model Size**: Choose the appropriate spaCy model based on your accuracy/performance needs:
   - `en_core_web_sm`: Fast, good for development (11 MB)
   - `en_core_web_md`: Better accuracy (40 MB)
   - `en_core_web_lg`: Best accuracy, slower (560 MB)

## Troubleshooting

### spaCy Model Not Found
If you see the error "Can't find model 'en_core_web_sm'":
```bash
python -m spacy download en_core_web_sm
```

### ImportError for sklearn
Make sure scikit-learn is installed:
```bash
pip install scikit-learn
```

### Memory Issues
If you encounter memory issues with large models:
1. Use the smaller `en_core_web_sm` model
2. Limit the number of documents processed at once
3. Implement pagination for bulk operations

## Development Tips

1. **Testing ML Features**: Use the provided utility functions in your Django shell:
```python
python manage.py shell
>>> from recommendations.ml_engine import extract_keywords
>>> extract_keywords("Beautiful beach destination with crystal clear water")
```

2. **Logging**: ML operations are logged. Check your Django logs for initialization status and errors.

3. **Fallbacks**: All ML functions have fallback mechanisms if models fail to load or errors occur.

## Next Steps

- Implement user feedback learning
- Add collaborative filtering
- Enhance sentiment analysis with deep learning models
- Create a recommendation evaluation system
- Add support for multiple languages
