import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'travel_backend.settings')
django.setup()

from django.db import connection

cursor = connection.cursor()

# Delete problematic admin migrations
cursor.execute("DELETE FROM django_migrations WHERE app='admin'")
print(f"Deleted admin migrations")

# Mark accounts initial migration as applied (MySQL syntax)
cursor.execute("INSERT INTO django_migrations (app, name, applied) VALUES ('accounts', '0001_initial', NOW())")
print("Marked accounts.0001_initial as applied")

connection.commit()
print("\nMigration history fixed! Now run:")
print("  1. python manage.py makemigrations accounts")
print("  2. python manage.py migrate")
