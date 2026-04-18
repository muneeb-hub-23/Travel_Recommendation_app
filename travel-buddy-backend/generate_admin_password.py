"""
Script to generate Django password hash for admin user
"""
import os
import django

# Setup Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'travel_backend.settings')
django.setup()

from django.contrib.auth.hashers import make_password

# Generate password hash for "admin"
password = "admin"
hashed_password = make_password(password)

print("Password: admin")
print("Hashed password:")
print(hashed_password)
print("\nYou can use this hash to update the admin user password in the database.")
