# 🚀 Second PC Setup Guide

## ✅ Prerequisites on Second PC
- ✅ Python 3.8+ (Already installed)
- ⚠️ Node.js 16+ (Required for frontend)
- ⚠️ pip (Python package manager)

---

## 📦 Step 1: Extract the ZIP File

1. Extract the downloaded ZIP file to a location, for example:
   ```
   C:\Projects\Travel_Recommendation_app
   ```

2. Open PowerShell/Command Prompt and navigate to the extracted folder:
   ```powershell
   cd C:\Projects\Travel_Recommendation_app
   ```

---

## 🐍 Step 2: Backend Setup

### 2.1 Navigate to Backend Directory
```powershell
cd travel-buddy-backend
```

### 2.2 Create Virtual Environment
```powershell
python -m venv venv
```

### 2.3 Activate Virtual Environment
```powershell
.\venv\Scripts\activate
```

You should see `(venv)` prefix in your terminal.

### 2.4 Install Python Dependencies
```powershell
pip install -r requirements.txt
```

**This will install:**
- Django (web framework)
- Django REST framework
- CORS headers
- Pillow (image handling)
- MySQL client
- spaCy (NLP)
- scikit-learn (ML)
- numpy, pandas
- requests (API calls)

⏱️ **Time:** 5-10 minutes depending on internet speed

### 2.5 Install spaCy Language Model (Optional but Recommended)
```powershell
python -m spacy download en_core_web_sm
```

### 2.6 Create .env File for API Keys

**Option A: If you have the .env file from first PC**
- Copy the `.env` file from your first PC to `travel-buddy-backend` folder

**Option B: Create new .env file**
Create a file named `.env` in the `travel-buddy-backend` folder:
```env
OPENWEATHER_API_KEY=your_api_key_here
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

**Get free OpenWeather API key:** https://openweathermap.org/api

### 2.7 Setup Database

The project uses SQLite by default (no MySQL required for development).

**Run migrations:**
```powershell
python manage.py migrate
```

### 2.8 Create Admin User
```powershell
python manage.py createsuperuser
```

Follow the prompts to create username and password.

### 2.9 (Optional) Load Sample Destinations

If you have the database from first PC:
- Copy `db.sqlite3` file from first PC to second PC's `travel-buddy-backend` folder
- Skip creating superuser (use existing credentials)

### 2.10 Test Backend Server
```powershell
python manage.py runserver
```

✅ **Backend should be running at:** `http://localhost:8000`

**Test it:** Open browser and go to `http://localhost:8000/admin`

---

## 🎨 Step 3: Frontend Setup

### 3.1 Install Node.js (If Not Installed)

Download from: https://nodejs.org/ (LTS version recommended)

**Verify installation:**
```powershell
node --version
npm --version
```

### 3.2 Open NEW Terminal/PowerShell

Keep backend running in the first terminal. Open a new terminal.

### 3.3 Navigate to Frontend Directory
```powershell
cd C:\Projects\Travel_Recommendation_app\travel-buddy-frontend
```

### 3.4 Install Frontend Dependencies
```powershell
npm install
```

⏱️ **Time:** 3-5 minutes

**This will install:**
- React
- Vite (build tool)
- React Router
- Leaflet (maps)
- Tailwind CSS
- Framer Motion
- Axios
- And more...

### 3.5 Start Frontend Development Server
```powershell
npm run dev
```

✅ **Frontend should be running at:** `http://localhost:5173`

**Test it:** Open browser and go to `http://localhost:5173`

---

## ✅ Step 4: Verify Everything Works

### Check Backend:
1. Open: `http://localhost:8000/admin`
2. Login with superuser credentials
3. You should see Django admin panel

### Check Frontend:
1. Open: `http://localhost:5173`
2. You should see the Travel Buddy homepage
3. Try searching for destinations

### Check API Connection:
1. In frontend, try adding a destination
2. Try fetching weather data
3. Both should work without CORS errors

---

## 🔥 Common Issues & Solutions

### Issue 1: "python: command not found"
**Solution:**
- Use `py` instead of `python` on Windows
- Or add Python to PATH in system environment variables

### Issue 2: "pip: command not found"
**Solution:**
```powershell
py -m pip install -r requirements.txt
```

### Issue 3: Virtual environment activation fails
**Solution:**
If PowerShell execution policy blocks it:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```
Then try activating again.

### Issue 4: "Module not found" errors
**Solution:**
- Ensure virtual environment is activated (you should see `(venv)`)
- Reinstall requirements:
```powershell
pip install -r requirements.txt
```

### Issue 5: Frontend shows "Network Error"
**Solution:**
- Check backend is running on `http://localhost:8000`
- Check `.env` has correct CORS settings
- Restart both servers

### Issue 6: Port 8000 or 5173 already in use
**Solution:**

**For Backend (port 8000):**
```powershell
python manage.py runserver 8001
```

**For Frontend (port 5173):**
Edit `vite.config.js` or run:
```powershell
npm run dev -- --port 5174
```

### Issue 7: spaCy installation fails
**Solution:**
- Skip spaCy for now (basic NLP will still work)
- Or install Visual C++ Build Tools first:
  https://visualstudio.microsoft.com/visual-cpp-build-tools/

---

## 📋 Quick Reference Commands

### Start Backend (run from `travel-buddy-backend`):
```powershell
.\venv\Scripts\activate
python manage.py runserver
```

### Start Frontend (run from `travel-buddy-frontend`):
```powershell
npm run dev
```

### Stop Servers:
- Press `Ctrl + C` in the terminal

---

## 📂 What Files to Copy from First PC (Optional)

If you want to preserve data from first PC:

1. **Database:**
   - Copy: `travel-buddy-backend/db.sqlite3`
   - To: Second PC's `travel-buddy-backend/` folder
   - This includes all destinations, users, reviews

2. **Environment Variables:**
   - Copy: `travel-buddy-backend/.env`
   - To: Second PC's `travel-buddy-backend/` folder
   - Contains API keys and settings

3. **Media Files (User Uploads):**
   - Copy: `travel-buddy-backend/media/` folder
   - To: Second PC's `travel-buddy-backend/` folder
   - Contains destination images

**Don't copy:**
- ❌ `venv/` folder (recreate it on second PC)
- ❌ `node_modules/` folder (reinstall with npm)
- ❌ `__pycache__/` folders
- ❌ `.pyc` files

---

## ⚡ Express Setup (If You Have First PC Files)

1. Extract ZIP
2. Copy from first PC: `db.sqlite3`, `.env`, `media/` folder
3. Backend setup:
   ```powershell
   cd travel-buddy-backend
   python -m venv venv
   .\venv\Scripts\activate
   pip install -r requirements.txt
   python manage.py runserver
   ```
4. Frontend setup (new terminal):
   ```powershell
   cd travel-buddy-frontend
   npm install
   npm run dev
   ```

Done! 🎉

---

## 🎯 Success Checklist

- [ ] Python is installed and working
- [ ] Node.js is installed and working
- [ ] Backend virtual environment created
- [ ] Backend dependencies installed
- [ ] Database migrations completed
- [ ] Admin user created
- [ ] Backend server runs on port 8000
- [ ] Frontend dependencies installed
- [ ] Frontend server runs on port 5173
- [ ] Can access frontend in browser
- [ ] Can access backend admin panel
- [ ] No CORS errors when using the app

---

## 📞 Need Help?

If you encounter issues:
1. Check error messages carefully
2. Verify all prerequisites are installed
3. Ensure both servers are running
4. Check browser console for frontend errors
5. Check terminal for backend errors

---

## 🎉 You're All Set!

Your Travel Recommendation App should now be running on the second PC!

**Next Steps:**
- Login to admin panel: `http://localhost:8000/admin`
- Access frontend: `http://localhost:5173`
- Start adding destinations or test existing ones
- Enjoy! 🌍✈️
