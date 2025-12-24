# Authentication Setup Guide

This guide explains how to set up the complete authentication system with OTP email verification and Google OAuth.

## Features

✅ **User Registration** with email verification  
✅ **OTP-based Email Verification** via EmailJS  
✅ **Login System** with JWT tokens  
✅ **Google OAuth** for quick signup/login  
✅ **Password Security** with Django's built-in hashing  
✅ **Token-based Authentication** using JWT  
✅ **User Database Storage** in MySQL/SQLite  

---

## Backend Setup

### 1. Install Required Packages

```bash
cd travel-buddy-backend
pip install -r requirements.txt
```

This installs:
- `djangorestframework-simplejwt` - JWT authentication
- `google-auth` - Google OAuth verification
- All other dependencies

### 2. Configure Environment Variables

Create or update `.env` file in the backend directory:

```bash
# Django Settings
DEBUG=True
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=localhost,127.0.0.1

# Database Configuration
DB_ENGINE=django.db.backends.mysql
DB_NAME=travel_recommendation_db
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_HOST=localhost
DB_PORT=3306

# Google OAuth Configuration
# Get your Client ID from: https://console.cloud.google.com/apis/credentials
GOOGLE_CLIENT_ID=your_google_client_id_here.apps.googleusercontent.com
```

### 3. Run Database Migrations

```bash
# Create migrations for the new accounts app
python manage.py makemigrations accounts

# Apply all migrations
python manage.py makemigrations
python manage.py migrate
```

### 4. Create Superuser (Optional)

```bash
python manage.py createsuperuser
```

### 5. Start Django Server

```bash
python manage.py runserver 8080
```

### Backend API Endpoints

All authentication endpoints are under `/api/auth/`:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/signup/` | POST | User registration |
| `/api/auth/verify-otp/` | POST | Verify email with OTP |
| `/api/auth/login/` | POST | User login |
| `/api/auth/resend-otp/` | POST | Resend OTP code |
| `/api/auth/google-auth/` | POST | Google OAuth login |
| `/api/auth/profile/` | GET | Get user profile (requires auth) |
| `/api/auth/profile/update/` | PUT | Update user profile (requires auth) |

---

## Frontend Setup

### 1. Install Required Packages

```bash
cd travel-buddy-frontend
npm install
```

New packages added:
- `@react-oauth/google` - Google OAuth client
- `emailjs-com` - Email service for sending OTPs

### 2. Configure EmailJS

#### Step 1: Create EmailJS Account
1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account
3. Create an email service (Gmail, Outlook, etc.)
4. Create an email template with the following structure:

**Template Name:** `otp_verification`

**Template Content:**
```
Hello {{to_name}},

Your OTP verification code is:

{{otp_code}}

This code will expire in 10 minutes.

If you didn't request this code, please ignore this email.

Best regards,
Travel Buddy Team
```

**Template Variables:**
- `{{to_name}}` - User's name
- `{{to_email}}` - User's email
- `{{otp_code}}` - 6-digit OTP code
- `{{message}}` - Additional message

5. Note your:
   - Service ID
   - Template ID
   - Public Key

### 3. Configure Google OAuth

#### Step 1: Create Google Cloud Project
1. Go to [https://console.cloud.google.com/](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth 2.0 Client ID**
5. Configure consent screen if prompted
6. Select **Web application** as application type
7. Add authorized JavaScript origins:
   - `http://localhost:4000`
   - `http://127.0.0.1:4000`
8. Add authorized redirect URIs (if needed):
   - `http://localhost:4000`
9. Copy your **Client ID**

### 4. Configure Environment Variables

Create `.env` file in the frontend directory:

```bash
# API Configuration
REACT_APP_API_URL=http://localhost:8080

# EmailJS Configuration
# Get your credentials from: https://www.emailjs.com/
REACT_APP_EMAILJS_SERVICE_ID=your_emailjs_service_id
REACT_APP_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
REACT_APP_EMAILJS_PUBLIC_KEY=your_emailjs_public_key

# Google OAuth Configuration
# Get your Client ID from: https://console.cloud.google.com/apis/credentials
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id_here.apps.googleusercontent.com
```

### 5. Start Frontend Server

```bash
npm run dev
```

Frontend will run on `http://localhost:4000`

---

## Testing the Authentication Flow

### 1. Test User Signup

1. Navigate to `http://localhost:4000/signup`
2. Fill in the registration form:
   - First Name: John
   - Last Name: Doe
   - Email: john.doe@example.com
   - Phone: +92 300 1234567
   - Password: test123
   - Confirm Password: test123
3. Click **Create Account**
4. Check your email for the 6-digit OTP code
5. Enter the OTP code to verify your email
6. You'll be automatically logged in and redirected to home

### 2. Test User Login

1. Navigate to `http://localhost:4000/login`
2. Enter your registered email and password
3. Click **Login**
4. If email is not verified, you'll be prompted to verify with OTP
5. After successful login, you'll be redirected to home

### 3. Test Google OAuth

1. On either Login or Signup page
2. Click **Continue with Google**
3. Select your Google account
4. Grant permissions
5. You'll be automatically logged in/registered and redirected to home

---

## User Data Storage

### Database Schema

Users are stored in the `accounts_user` table with the following fields:

- `id` - Primary key
- `username` - Auto-generated from email
- `email` - User email (unique)
- `first_name` - User's first name
- `last_name` - User's last name
- `phone` - Phone number
- `password` - Hashed password
- `is_verified` - Email verification status
- `google_id` - Google account ID (for OAuth users)
- `profile_picture` - Profile image
- `is_active` - Account status
- `created_at` - Registration timestamp
- `updated_at` - Last update timestamp

### OTP Storage

OTPs are stored in the `accounts_otp` table:

- `id` - Primary key
- `user_id` - Foreign key to user
- `code` - 6-digit OTP code
- `purpose` - signup, login, or reset
- `is_used` - Whether OTP has been used
- `created_at` - Creation timestamp
- `expires_at` - Expiration timestamp (10 minutes)

---

## Security Features

### Password Security
- Minimum 6 characters
- Hashed using Django's PBKDF2 algorithm
- Never stored in plain text

### JWT Tokens
- Access Token: Valid for 1 day
- Refresh Token: Valid for 30 days
- Stored in browser's localStorage
- Sent in Authorization header: `Bearer <token>`

### OTP Security
- 6-digit random code
- Valid for 10 minutes
- Single-use only
- Sent via email

### Google OAuth
- Token verification on backend
- Secure token exchange
- No password required

---

## Troubleshooting

### Backend Issues

**Issue:** `ModuleNotFoundError: No module named 'accounts'`
**Solution:** Make sure you've added `'accounts'` to `INSTALLED_APPS` in `settings.py`

**Issue:** `django.db.utils.OperationalError: no such table: accounts_user`
**Solution:** Run migrations: `python manage.py makemigrations && python manage.py migrate`

**Issue:** Google OAuth fails
**Solution:** Verify `GOOGLE_CLIENT_ID` is set in backend `.env` file

### Frontend Issues

**Issue:** `process is not defined` error
**Solution:** Already fixed in `config.js` with proper checks

**Issue:** EmailJS not sending emails
**Solution:** 
1. Verify credentials in `.env`
2. Check EmailJS dashboard for sending limits
3. Verify email template is published

**Issue:** Google OAuth button not working
**Solution:**
1. Verify `REACT_APP_GOOGLE_CLIENT_ID` in `.env`
2. Check authorized origins in Google Cloud Console
3. Restart frontend server after adding environment variables

### Database Issues

**Issue:** MySQL connection error
**Solution:** 
1. Ensure MySQL server is running
2. Verify database exists: `CREATE DATABASE travel_recommendation_db;`
3. Check credentials in `.env`

**Alternative:** Use SQLite for development (comment MySQL config in `settings.py`)

---

## Admin Panel

Access the Django admin panel to manage users:

1. Navigate to `http://localhost:8080/admin/`
2. Login with superuser credentials
3. Manage users, OTPs, and all data

---

## API Usage Examples

### Signup Request
```bash
curl -X POST http://localhost:8080/api/auth/signup/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "test123",
    "confirm_password": "test123",
    "first_name": "John",
    "last_name": "Doe",
    "phone": "+92 300 1234567"
  }'
```

### Login Request
```bash
curl -X POST http://localhost:8080/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "test123"
  }'
```

### Get Profile (Authenticated)
```bash
curl -X GET http://localhost:8080/api/auth/profile/ \
  -H "Authorization: Bearer <your_access_token>"
```

---

## Next Steps

1. **Email Templates:** Customize the EmailJS template with your branding
2. **Password Reset:** Implement password reset flow (similar to OTP verification)
3. **Social Login:** Add more OAuth providers (Facebook, GitHub, etc.)
4. **Two-Factor Auth:** Add optional 2FA for enhanced security
5. **User Profiles:** Build user profile pages with edit functionality
6. **Session Management:** Add logout from all devices feature

---

## Support

For issues or questions:
- Check Django logs: Backend terminal
- Check browser console: Frontend debugging
- Review API responses in Network tab
- Test endpoints with Postman/cURL

---

**Authentication system is now fully functional!** 🎉

Users can signup, verify email via OTP, login, and use Google OAuth - all data is securely stored in the database.
