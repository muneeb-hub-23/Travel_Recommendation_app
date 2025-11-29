# MySQL Database Setup Guide

This guide explains how to configure and connect your Django backend to MySQL.

## Configuration File

The MySQL configuration is centralized in `travel_backend/config.py`:

### DatabaseConfig Class
- **DB_ENGINE**: Database engine (default: `django.db.backends.mysql`)
- **DB_NAME**: Database name (default: `travel_recommendation_db`)
- **DB_USER**: MySQL username (default: `root`)
- **DB_PASSWORD**: MySQL password
- **DB_HOST**: MySQL server host (default: `localhost`)
- **DB_PORT**: MySQL server port (default: `3306`)

### ServerConfig Class
- **SERVER_HOST**: Django server host (default: `127.0.0.1`)
- **SERVER_PORT**: Django server port (default: `8000`)
- **API_VERSION**: API version
- **API_TITLE**: API title

## Setup Instructions

### 1. Install MySQL Server

Make sure MySQL is installed on your system:
- **Windows**: Download from [MySQL Downloads](https://dev.mysql.com/downloads/installer/)
- **Linux**: `sudo apt-get install mysql-server`
- **Mac**: `brew install mysql`

### 2. Create MySQL Database

Open MySQL command line or workbench:

```sql
-- Login to MySQL
mysql -u root -p

-- Create database
CREATE DATABASE travel_recommendation_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user (optional, recommended for production)
CREATE USER 'travel_user'@'localhost' IDENTIFIED BY 'your_secure_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON travel_recommendation_db.* TO 'travel_user'@'localhost';
FLUSH PRIVILEGES;

-- Exit MySQL
EXIT;
```

### 3. Configure Environment Variables

Create a `.env` file in the backend root directory (copy from `.env.example`):

```bash
cp .env.example .env
```

Update the `.env` file with your MySQL credentials:

```env
# Django Settings
DEBUG=True
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=localhost,127.0.0.1

# MySQL Database Configuration
DB_ENGINE=django.db.backends.mysql
DB_NAME=travel_recommendation_db
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_HOST=localhost
DB_PORT=3306

# Server Configuration
SERVER_HOST=127.0.0.1
SERVER_PORT=8000

# CORS Configuration
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

### 4. Install MySQL Python Client

Install the required Python MySQL client:

```bash
pip install mysqlclient
```

**Note for Windows users**: If you encounter issues installing `mysqlclient`, you may need to:
1. Install Microsoft Visual C++ Build Tools
2. Or use `pip install pymysql` and add this to `travel_backend/__init__.py`:
   ```python
   import pymysql
   pymysql.install_as_MySQLdb()
   ```

### 5. Run Database Migrations

Apply migrations to create tables in MySQL:

```bash
python manage.py makemigrations
python manage.py migrate
```

### 6. Create Superuser

Create an admin user:

```bash
python manage.py createsuperuser
```

### 7. Start the Server

```bash
python manage.py runserver
```

## Remote MySQL Server

If your MySQL server is on a remote machine, update these in `.env`:

```env
DB_HOST=192.168.1.100  # Replace with actual server IP
DB_PORT=3306
DB_USER=remote_user
DB_PASSWORD=remote_password
```

## Production Configuration

For production:

1. **Use strong passwords** for database users
2. **Create a dedicated database user** (not root)
3. **Enable SSL/TLS** for database connections
4. **Set DEBUG=False** in `.env`
5. **Use environment-specific settings** for different environments

## Switching Between SQLite and MySQL

To switch back to SQLite for development, uncomment these lines in `settings.py`:

```python
# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.sqlite3',
#         'NAME': BASE_DIR / 'db.sqlite3',
#     }
# }
```

And comment out the MySQL configuration:

```python
# DATABASES = {
#     'default': DatabaseConfig.get_database_config()
# }
```

## Troubleshooting

### Error: Can't connect to MySQL server
- Check if MySQL service is running: `sudo service mysql status` (Linux) or check Services (Windows)
- Verify host and port in `.env`
- Check firewall settings

### Error: Access denied for user
- Verify username and password in `.env`
- Check user privileges in MySQL: `SHOW GRANTS FOR 'username'@'localhost';`

### Error: Unknown database
- Create the database using the SQL commands above
- Verify database name matches in `.env`

### Error: No module named 'MySQLdb'
- Install mysqlclient: `pip install mysqlclient`
- Or use pymysql as alternative (see step 4)

## Database Backup

To backup your MySQL database:

```bash
mysqldump -u root -p travel_recommendation_db > backup.sql
```

To restore:

```bash
mysql -u root -p travel_recommendation_db < backup.sql
```

## Configuration Reference

All configuration values are loaded from environment variables with sensible defaults:

| Variable | Default | Description |
|----------|---------|-------------|
| DB_ENGINE | django.db.backends.mysql | Database backend |
| DB_NAME | travel_recommendation_db | Database name |
| DB_USER | root | MySQL username |
| DB_PASSWORD | (empty) | MySQL password |
| DB_HOST | localhost | MySQL host |
| DB_PORT | 3306 | MySQL port |
| SERVER_HOST | 127.0.0.1 | Django server host |
| SERVER_PORT | 8000 | Django server port |
