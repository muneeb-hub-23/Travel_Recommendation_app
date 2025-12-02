# Travel Recommendation Backend

Django REST API backend for the Travel Recommendation application.

## Features

- RESTful API for travel destinations
- User preferences and personalized recommendations
- **Machine Learning powered recommendations using spaCy and scikit-learn**
- **Natural Language Processing for review analysis**
- **Content-based filtering for destination similarity**
- **Sentiment analysis of reviews**
- Destination reviews and ratings
- Admin panel for content management
- CORS support for frontend integration

## Technology Stack

- Django 4.2
- Django REST Framework
- SQLite (development) / PostgreSQL (production ready)
- Python 3.8+
- **spaCy 3.7+** - Natural Language Processing
- **scikit-learn 1.3+** - Machine Learning algorithms
- **NumPy & Pandas** - Data processing

## Setup Instructions

### 1. Create Virtual Environment

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2.1. Set Up Machine Learning (Optional but Recommended)

Run the automated ML setup script:

```bash
python setup_ml.py
```

Or manually install spaCy model:

```bash
python -m spacy download en_core_web_sm
```

For more details, see [ML_SETUP.md](recommendations/ML_SETUP.md)

### 3. Environment Configuration

Create a `.env` file in the backend directory:

```bash
cp .env.example .env
```

Update the `.env` file with your configuration:
- `SECRET_KEY`: Django secret key (generate a new one for production)
- `DEBUG`: Set to False in production
- `DATABASE_URL`: Database connection string
- `ALLOWED_HOSTS`: Comma-separated list of allowed hosts
- `CORS_ALLOWED_ORIGINS`: Frontend URLs

### 4. Run Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### 5. Create Superuser

```bash
python manage.py createsuperuser
```

### 6. Run Development Server

```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000/api/`

## API Endpoints

### Destinations
- `GET /api/destinations/` - List all destinations
- `GET /api/destinations/{id}/` - Get destination details
- `GET /api/destinations/recommended/` - Get personalized recommendations
- **`GET /api/destinations/ml_recommended/`** - Get ML-powered recommendations
- **`GET /api/destinations/{id}/similar/`** - Get similar destinations using ML
- **`GET /api/destinations/{id}/keywords/`** - Extract keywords using NLP
- **`GET /api/destinations/{id}/sentiment_analysis/`** - Analyze review sentiment
- `POST /api/destinations/` - Create destination (admin)
- `PUT /api/destinations/{id}/` - Update destination (admin)
- `DELETE /api/destinations/{id}/` - Delete destination (admin)

Query parameters:
- `category` - Filter by category (beach, mountain, city, historical, adventure, cultural)
- `price_range` - Filter by price range (budget, moderate, luxury)
- `search` - Search by name or country
- `limit` - Limit results (for ML endpoints)

For detailed ML API documentation, see [API_ML_ENDPOINTS.md](recommendations/API_ML_ENDPOINTS.md)

### User Preferences
- `GET /api/preferences/` - Get user preferences
- `POST /api/preferences/` - Create/update preferences
- `PUT /api/preferences/{id}/` - Update preferences

### Reviews
- `GET /api/reviews/` - List all reviews
- `GET /api/reviews/?destination={id}` - Get reviews for a destination
- `POST /api/reviews/` - Create review
- `PUT /api/reviews/{id}/` - Update review
- `DELETE /api/reviews/{id}/` - Delete review

## Admin Panel

Access the admin panel at `http://localhost:8000/admin/`

Use the superuser credentials created earlier to log in.

## Testing

Run tests with:

```bash
python manage.py test
```

## Project Structure

```
backend/
├── travel_backend/          # Project settings
│   ├── settings.py
│   ├── urls.py
│   ├── wsgi.py
│   └── asgi.py
├── recommendations/         # Main app
│   ├── models.py           # Database models
│   ├── serializers.py      # DRF serializers
│   ├── views.py            # API views (includes ML endpoints)
│   ├── urls.py             # URL routing
│   ├── admin.py            # Admin configuration
│   ├── tests.py            # Unit tests
│   ├── ml_engine.py        # ML core engine (spaCy + scikit-learn)
│   ├── ml_utils.py         # ML utility functions
│   ├── ML_SETUP.md         # ML setup guide
│   └── API_ML_ENDPOINTS.md # ML API documentation
├── manage.py
├── requirements.txt
├── setup_ml.py             # Automated ML setup script
└── README.md
```

## Models

### Destination
- name, country, description
- category (beach, mountain, city, historical, adventure, cultural)
- price_range (budget, moderate, luxury)
- best_season, rating
- latitude, longitude
- image

### UserPreference
- user (OneToOne with User)
- preferred_categories (JSON array)
- budget_range
- preferred_seasons (JSON array)

### Review
- destination, user
- rating (1-5)
- comment
- timestamps

## Development

### Adding Sample Data

You can add sample destinations through the admin panel or create a data fixture.

### Database Migrations

After model changes:

```bash
python manage.py makemigrations
python manage.py migrate
```

## Deployment

For production deployment:

1. Set `DEBUG=False` in `.env`
2. Configure PostgreSQL database
3. Set strong `SECRET_KEY`
4. Configure `ALLOWED_HOSTS`
5. Set up static files serving
6. Use gunicorn or uwsgi as WSGI server

## License

MIT
