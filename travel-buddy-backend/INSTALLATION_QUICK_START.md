# Quick Start: ML Features Installation

This guide will get you up and running with the machine learning features in under 5 minutes.

## Quick Install

### Option 1: Automated Setup (Recommended)

```bash
# Navigate to backend directory
cd travel-buddy-backend

# Run the setup script
python setup_ml.py
```

The script will:
1. Install all Python dependencies (spaCy, scikit-learn, numpy, pandas)
2. Download the spaCy language model
3. Test the installation
4. Show you available API endpoints

### Option 2: Manual Setup

```bash
# Install dependencies
pip install -r requirements.txt

# Download spaCy model
python -m spacy download en_core_web_lg

# Run Django server
python manage.py runserver
```

## Verify Installation

Test that ML features are working:

```bash
# Open Python shell
python manage.py shell

# Test imports
>>> import spacy
>>> import sklearn
>>> from recommendations.ml_engine import get_nlp_model
>>> nlp = get_nlp_model()
>>> print("✓ ML setup successful!")
```

## New API Endpoints

After installation, these ML-powered endpoints are available:

### 1. Get ML Recommendations
```bash
GET http://localhost:8000/api/destinations/ml_recommended/
```

### 2. Find Similar Destinations
```bash
GET http://localhost:8000/api/destinations/1/similar/
```

### 3. Extract Keywords
```bash
GET http://localhost:8000/api/destinations/1/keywords/
```

### 4. Sentiment Analysis
```bash
GET http://localhost:8000/api/destinations/1/sentiment_analysis/
```

## Test with cURL

```bash
# Get ML recommendations (requires authentication)
curl -H "Authorization: Token YOUR_TOKEN" \
  http://localhost:8000/api/destinations/ml_recommended/

# Get similar destinations (no auth required)
curl http://localhost:8000/api/destinations/1/similar/

# Get keywords (no auth required)
curl http://localhost:8000/api/destinations/1/keywords/

# Get sentiment analysis (no auth required)
curl http://localhost:8000/api/destinations/1/sentiment_analysis/
```

## What's Included

### Core ML Features
- **Content-based Filtering**: Recommends destinations based on similarity
- **NLP Processing**: Extracts keywords and entities from text
- **Sentiment Analysis**: Analyzes review sentiment (positive/negative/neutral)
- **Text Similarity**: Compares destinations using advanced algorithms

### ML Libraries
- **spaCy**: Natural Language Processing
- **scikit-learn**: Machine learning algorithms
- **NumPy**: Numerical computations
- **Pandas**: Data manipulation

## Files Created

```
travel-buddy-backend/
├── requirements.txt           (updated)
├── setup_ml.py               (new)
├── recommendations/
│   ├── apps.py               (updated - auto-initializes ML)
│   ├── views.py              (updated - new ML endpoints)
│   ├── ml_engine.py          (new - core ML engine)
│   ├── ml_utils.py           (new - Django integration)
│   ├── ML_SETUP.md           (new - detailed guide)
│   └── API_ML_ENDPOINTS.md   (new - API docs)
└── README.md                 (updated)
```

## Troubleshooting

### Issue: "Can't find model 'en_core_web_lg'"
**Solution:**
```bash
python -m spacy download en_core_web_lg
```

### Issue: "ModuleNotFoundError: No module named 'sklearn'"
**Solution:**
```bash
pip install scikit-learn
```

### Issue: ML initialization fails
**Solution:** Check Django logs. The app will still work with fallback (non-ML) recommendations.

## Next Steps

1. **Add Test Data**: Create destinations and reviews through the admin panel
2. **Test ML Endpoints**: Use the API endpoints listed above
3. **Integrate Frontend**: Update your frontend to use ML recommendations
4. **Customize**: Modify `ml_engine.py` to adjust ML algorithms
5. **Monitor Performance**: Check logs for ML initialization status

## Documentation

- **Detailed Setup**: `recommendations/ML_SETUP.md`
- **API Reference**: `recommendations/API_ML_ENDPOINTS.md`
- **Main README**: `README.md`

## Support

If you encounter issues:
1. Check the logs: Django will log ML initialization errors
2. Verify spaCy model is installed: `python -m spacy info`
3. Test ML functions in Django shell
4. Review `ML_SETUP.md` for troubleshooting

---

**Estimated Setup Time**: 3-5 minutes

**Status**: ✓ Ready for development and testing
