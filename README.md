# Quality Reporting System (QRS) - SONACOMSTAR

A modern React-based Quality Problem Reporting System for SONACOMSTAR, built with Vite, React, and Tailwind CSS.

## 🚀 Project Structure

```
quality-reporting-system/
├── components/
│   ├── layout/
│   │   ├── Header.jsx          # Top navigation and title bar
│   │   ├── Sidebar.jsx         # Left sidebar navigation
│   │   └── Footer.jsx          # Footer component
│   └── pages/
│       ├── LoginPage.jsx       # Authentication page
│       ├── Dashboard.jsx       # Main dashboard with statistics
│       ├── NewReport.jsx       # Create new quality report
│       ├── MyReports.jsx       # View user's reports
│       ├── AnalyticsPage.jsx   # Analytics and insights
│       └── SettingsPage.jsx    # User settings
├── App.jsx                     # Main app component
├── App.css                     # App-specific styles
├── main.jsx                    # React entry point
├── style.css                   # Global Tailwind styles
├── index.html                  # HTML entry point
├── package.json                # Dependencies and scripts
├── vite.config.js              # Vite configuration
├── postcss.config.js           # PostCSS configuration
└── tailwind.config.js          # Tailwind CSS configuration
```

## 📋 Features

- ✅ User Authentication (Login system)
- ✅ Quality Report Management (Create, View, Edit)
- ✅ Dashboard with Statistics
- ✅ Analytics & Insights
- ✅ User Settings
- ✅ Responsive Design (Mobile & Desktop)
- ✅ Dark Mode Support (Settings)
- ✅ Real-time Notifications
- ✅ Multi-language Support (Setup)

## 🛠️ Technologies

- **React 18.2.0** - UI Framework
- **Vite 4.4.0** - Build tool and dev server
- **Tailwind CSS 3.3.5** - Utility-first CSS framework
- **Lucide React** - Icon library
- **PostCSS 8.4.31** - CSS transformations

## 📦 Installation

```bash
# Navigate to project directory
cd quality-reporting-system

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🚀 Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```
   The app will open at `http://localhost:3000`

3. **Login**
   - Default Employee ID: Any value
   - Default Password: Any value
   - The system uses localStorage for session management

4. **Build for Production**
   ```bash
   npm run build
   ```

## 📁 Component Details

### Layout Components

- **Header.jsx** - Sticky header with title, search, and notifications
- **Sidebar.jsx** - Navigation menu with dashboard, reports, analytics, and settings
- **Footer.jsx** - Footer with links and company information

### Page Components

- **LoginPage.jsx** - Secure login portal with employee credentials
- **Dashboard.jsx** - Overview of quality metrics, recent reports, top vendors
- **NewReport.jsx** - Form to create new quality reports with file upload
- **MyReports.jsx** - List of user's reports with filtering and search
- **AnalyticsPage.jsx** - Charts and analytics for quality trends
- **SettingsPage.jsx** - User preferences and security settings

## 🎨 Styling

- **Tailwind CSS** - Utility-first CSS framework
- **PostCSS** - CSS processing with autoprefixer
- **Custom Animations** - Fade-in, slide-right transitions
- **Responsive Design** - Mobile-first approach

## 💾 State Management

- **React Hooks** - useState, useEffect for local state
- **LocalStorage** - Persistent user data and login state
- **Context** - Can be added for global state

## 🔐 Authentication

- Email: Any value (Demo)
- Password: Any value (Demo)
- Session stored in localStorage
- Default user profile loaded on login

## 📝 Configuration Files

- **vite.config.js** - Vite build tool configuration
- **tailwind.config.js** - Tailwind CSS customization
- **postcss.config.js** - PostCSS with Tailwind and autoprefixer
- **package.json** - Dependencies and npm scripts

## 🚦 Development Tips

1. Components use Tailwind classes for styling
2. Icons from lucide-react library
3. LocalStorage for session persistence
4. Responsive classes (md:, lg:) for breakpoints
5. Custom animations in App.css

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

Project structure is set up for easy feature additions. Each section is modular and independent.

## 📄 License

SONACOMSTAR © 2024. All rights reserved.

## 📞 Support

For issues or feature requests, contact: support@sonacomstar.com

---

**Last Updated:** January 9, 2026
**Version:** 1.0.0
