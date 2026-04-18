"""
Script to fix admin user password in database
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'travel_backend.settings')
django.setup()

from accounts.models import AdminUser

try:
    # Get the admin user (adjust the filter if needed)
    admin = AdminUser.objects.first()
    
    if admin:
        print(f"Found admin user: {admin.username}")
        print(f"Current password hash (corrupted): {admin.password[:50]}...")
        
        # Set new password using the model's set_password method
        admin.set_password('admin')
        admin.save()
        
        print(f"\nPassword updated successfully!")
        print(f"New password hash: {admin.password[:50]}...")
        print(f"\nYou can now login with:")
        print(f"Username: {admin.username}")
        print(f"Password: admin")
    else:
        print("No admin user found in database")
        print("\nCreating new admin user...")
        admin = AdminUser.objects.create(
            username='admin',
            name='Administrator',
            email='admin@example.com',
            role='Admin',
            is_active=True
        )
        admin.set_password('admin')
        admin.save()
        print(f"Admin user created successfully!")
        print(f"Username: admin")
        print(f"Password: admin")
        
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
