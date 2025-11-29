# Travel Recommendation Backend

Django REST API backend for the Travel Recommendation application.

## Features

- RESTful API for travel destinations
- User preferences and personalized recommendations
- Destination reviews and ratings
- Admin panel for content management
- CORS support for frontend integration

## Technology Stack

- Django 4.2
- Django REST Framework
- SQLite (development) / PostgreSQL (production ready)
- Python 3.8+

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
- `POST /api/destinations/` - Create destination (admin)
- `PUT /api/destinations/{id}/` - Update destination (admin)
- `DELETE /api/destinations/{id}/` - Delete destination (admin)

Query parameters:
- `category` - Filter by category (beach, mountain, city, historical, adventure, cultural)
- `price_range` - Filter by price range (budget, moderate, luxury)
- `search` - Search by name or country

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
│   ├── views.py            # API views
│   ├── urls.py             # URL routing
│   ├── admin.py            # Admin configuration
│   └── tests.py            # Unit tests
├── manage.py
├── requirements.txt
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
