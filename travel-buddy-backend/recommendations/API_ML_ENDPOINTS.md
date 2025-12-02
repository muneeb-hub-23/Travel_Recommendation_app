# ML-Powered API Endpoints

This document describes the new machine learning-powered API endpoints available in the Travel Buddy backend.

## Authentication

Most endpoints require authentication. Include the authentication token in your request headers:
```
Authorization: Token <your-auth-token>
```

## Endpoints

### 1. ML-Powered Recommendations

**Endpoint:** `GET /api/destinations/ml_recommended/`

**Description:** Get personalized destination recommendations using machine learning algorithms based on user preferences and content similarity.

**Authentication:** Required (returns top-rated destinations for anonymous users)

**Query Parameters:**
- `limit` (optional): Number of recommendations to return (default: 10)

**Example Request:**
```bash
GET /api/destinations/ml_recommended/?limit=5
```

**Example Response:**
```json
[
  {
    "id": 1,
    "name": "Bali",
    "country": "Indonesia",
    "description": "Beautiful tropical paradise...",
    "category": "beach",
    "price_range": "moderate",
    "rating": 4.8,
    ...
  },
  ...
]
```

---

### 2. Similar Destinations

**Endpoint:** `GET /api/destinations/{id}/similar/`

**Description:** Find destinations similar to a specific destination using content-based filtering and NLP.

**Authentication:** Optional

**Path Parameters:**
- `id`: ID of the reference destination

**Query Parameters:**
- `limit` (optional): Number of similar destinations to return (default: 5)

**Example Request:**
```bash
GET /api/destinations/15/similar/?limit=3
```

**Example Response:**
```json
[
  {
    "id": 23,
    "name": "Phuket",
    "country": "Thailand",
    "category": "beach",
    ...
  },
  ...
]
```

---

### 3. Destination Keywords

**Endpoint:** `GET /api/destinations/{id}/keywords/`

**Description:** Extract important keywords from a destination's description using NLP.

**Authentication:** Optional

**Path Parameters:**
- `id`: ID of the destination

**Example Request:**
```bash
GET /api/destinations/10/keywords/
```

**Example Response:**
```json
{
  "keywords": [
    "beach",
    "tropical",
    "paradise",
    "crystal",
    "water",
    "resort",
    "diving",
    "sunset",
    ...
  ]
}
```

---

### 4. Sentiment Analysis

**Endpoint:** `GET /api/destinations/{id}/sentiment_analysis/`

**Description:** Analyze the sentiment of all reviews for a destination using NLP sentiment analysis.

**Authentication:** Optional

**Path Parameters:**
- `id`: ID of the destination

**Example Request:**
```bash
GET /api/destinations/10/sentiment_analysis/
```

**Example Response:**
```json
{
  "total_reviews": 45,
  "average_sentiment_score": 0.78,
  "sentiment_distribution": {
    "positive": 32,
    "neutral": 8,
    "negative": 5
  }
}
```

**Sentiment Score:**
- 0.0 - 0.4: Negative sentiment
- 0.4 - 0.6: Neutral sentiment
- 0.6 - 1.0: Positive sentiment

---

## Integration Examples

### Frontend (JavaScript/React)

```javascript
// Get ML recommendations
const getMLRecommendations = async (limit = 10) => {
  const response = await fetch(
    `/api/destinations/ml_recommended/?limit=${limit}`,
    {
      headers: {
        'Authorization': `Token ${authToken}`
      }
    }
  );
  return await response.json();
};

// Get similar destinations
const getSimilarDestinations = async (destinationId, limit = 5) => {
  const response = await fetch(
    `/api/destinations/${destinationId}/similar/?limit=${limit}`
  );
  return await response.json();
};

// Get destination keywords
const getDestinationKeywords = async (destinationId) => {
  const response = await fetch(
    `/api/destinations/${destinationId}/keywords/`
  );
  const data = await response.json();
  return data.keywords;
};

// Get sentiment analysis
const getSentimentAnalysis = async (destinationId) => {
  const response = await fetch(
    `/api/destinations/${destinationId}/sentiment_analysis/`
  );
  return await response.json();
};
```

### Python/Django

```python
from recommendations.ml_utils import (
    get_ml_recommendations_for_user,
    get_similar_destinations,
    extract_destination_keywords,
    analyze_review_sentiment_bulk
)

# Get recommendations
recommendations = get_ml_recommendations_for_user(user, limit=10)

# Get similar destinations
destination = Destination.objects.get(id=15)
similar = get_similar_destinations(destination, limit=5)

# Extract keywords
keywords = extract_destination_keywords(destination)

# Analyze sentiment
sentiment = analyze_review_sentiment_bulk(destination.id)
```

## Performance Considerations

1. **Caching**: Consider caching ML recommendations for frequently requested data
2. **Batch Processing**: Process multiple items together when possible
3. **Async Processing**: For large datasets, consider using background tasks (Celery)
4. **Rate Limiting**: Implement rate limiting for computationally expensive endpoints

## Error Handling

All endpoints include fallback mechanisms:
- If ML models fail, endpoints return rule-based results
- Empty results return appropriate empty arrays/objects
- Errors are logged for debugging

## Future Enhancements

- Real-time learning from user interactions
- Collaborative filtering based on similar users
- Deep learning models for better accuracy
- Multi-language support
- Image-based recommendations
