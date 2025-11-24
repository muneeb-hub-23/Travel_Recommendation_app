# 🌍 AI Travel Buddy - Frontend

A modern, AI-powered travel planning application built with React, TailwindCSS, and Framer Motion.

## ✨ Features

- **AI-Powered Search**: Natural language travel planning interface
- **Smart Recommendations**: Personalized destination suggestions
- **Category Selection**: Mountains, beaches, snow, rivers, cities, and desert destinations
- **Accommodation Options**: From budget rooms to 5-star luxury hotels
- **Travel Modes**: Air, bus, bike, and local travel options
- **Food & Weather Preferences**: Complete trip customization
- **User Authentication**: Secure login and signup with test credentials
- **Admin Dashboard**: Comprehensive admin panel for managing users and destinations
- **Responsive Design**: Fully mobile-responsive with beautiful animations

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev
```

The application will open at `http://localhost:5173`

## 🔐 Test Credentials

### User Login
- **Email**: user@test.com
- **Password**: password

### Admin Login
- **Email**: admin@travelbuddy.com
- **Password**: admin123
- **URL**: http://localhost:5173/admin/login

## 📁 Project Structure

```
src/
├── components/
│   ├── Navbar.jsx              # Main navigation component
│   └── ProtectedRoute.jsx      # Route protection wrapper
├── pages/
│   ├── Home.jsx                # Main landing page
│   ├── Login.jsx               # User login page
│   ├── Signup.jsx              # User registration page
│   └── admin/
│       ├── AdminLogin.jsx      # Admin login page
│       └── AdminDashboard.jsx  # Admin dashboard
├── App.jsx                     # Main app with routing
├── main.jsx                    # App entry point
└── index.css                   # Global styles with Tailwind

```

## 🎨 Tech Stack

- **React 19** - UI framework
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **Framer Motion** - Animations
- **React Router** - Routing
- **Lucide React** - Icons

## 🌐 Routes

- `/` - Home page (user landing)
- `/login` - User login
- `/signup` - User registration
- `/admin/login` - Admin login
- `/admin` - Admin dashboard (protected)

## 🎯 Key Features

### Home Page
- AI-powered search bar for natural language queries
- Destination categories with beautiful images
- Hotel/accommodation selection
- Travel mode options
- Food preferences
- Weather preferences
- Trending destinations

### Authentication
- Client-side authentication simulation
- Persistent login using localStorage
- Separate user and admin flows
- Protected admin routes

### Admin Dashboard
- User management overview
- Destination analytics
- Booking statistics
- Revenue tracking
- Activity monitoring

## 🔧 Development

```bash
# Run dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🎨 Design Features

- **Gradient Backgrounds**: Beautiful multi-color gradients
- **Smooth Animations**: Powered by Framer Motion
- **Glass Morphism**: Modern backdrop blur effects
- **Responsive Grid**: Mobile-first design approach
- **Interactive Cards**: Hover effects and transitions
- **Professional Navigation**: Sticky header with mobile menu

## 📝 Notes

- This is the frontend UI only. Backend AI integration is planned for future development.
- All data is currently mocked for demonstration purposes.
- Authentication is client-side only (for testing).
- Images are loaded from Unsplash for demonstration.

## 🔜 Future Enhancements

- Backend API integration
- Real AI-powered recommendations
- Payment gateway integration
- Real-time booking system
- Email notifications
- Multi-language support
- Dark mode
- Progressive Web App (PWA)

## 📄 License

This project is part of the AI Travel Buddy application.

---

Built with ❤️ using React and TailwindCSS
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).
## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
