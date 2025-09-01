# Teacher's Assistant - AI-Powered Teaching Support App

A comprehensive web application designed to support teachers in overcrowded classrooms and rural areas with AI-powered lesson planning, grading assistance, and access to teaching resources.

## Features

### 🎯 Core Functionality
- **AI Lesson Plan Generator**: Create CBC-aligned lesson plans with local materials
- **Automated Grading Assistant**: Track student performance and identify learning gaps
- **Digital Resource Library**: Access textbooks, videos, and worksheets offline
- **Professional Development**: Interactive courses with gamification
- **Performance Analytics**: Visualize class performance and trends

### 📱 Design Highlights
- **Mobile-First Design**: Optimized for teachers on-the-go
- **Offline Capabilities**: Works without internet connection
- **Low Bandwidth Friendly**: Minimal data usage for rural areas
- **Intuitive Interface**: Clean, professional design

## Technology Stack

### Frontend
- **HTML5** - Semantic markup and structure
- **CSS3** - Modern styling with custom properties and grid/flexbox
- **JavaScript ES6+** - Interactive functionality and DOM manipulation
- **Service Worker** - Offline support and caching

### Backend (Production Ready)
- **Node.js/Express** - RESTful API server
- **MySQL** - Relational database for data persistence

### Key Features Implementation

#### 1. Lesson Planning
- CBC curriculum alignment for all grade levels
- Local materials integration for rural schools
- Cross-curricular connections
- Differentiation strategies for diverse learners

#### 2. Assessment & Grading
- Automated grade calculations
- Performance trend analysis
- Individual and class-wide learning gap identification
- CBC-compliant report card generation

#### 3. Resource Management
- Offline-first resource library
- Content categorization by grade, subject, and type
- Download management for limited bandwidth areas
- Resource sharing and collaboration tools

#### 4. Professional Development
- Micro-learning modules
- Gamification with badges and progress tracking
- Practical teaching strategies
- Technology integration training

## Installation & Setup

### Frontend Development
```bash
npm install
npm run dev
```

### Backend Setup (for production)
```bash
# Install backend dependencies
npm install express cors mysql2

# Set up environment variables
cp .env.example .env

# Configure MySQL database
mysql -u root -p
CREATE DATABASE teachers_assistant;

# Start backend server
npm run server
```

### Database Configuration

#### Environment Variables (.env)
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=teachers_assistant
PORT=3001
```

#### Database Schema
The application includes complete MySQL table schemas for:
- Teachers and authentication
- Students and enrollment
- Lesson plans and curriculum alignment
- Assignments and grading
- Resources and offline storage
- Training courses and progress tracking
- Badges and gamification

## Offline Functionality

The app uses a comprehensive offline-first approach:

1. **Service Worker Caching**: Critical app files cached for offline access
2. **IndexedDB Storage**: Local storage for user data and generated content
3. **Background Sync**: Automatic synchronization when connection restored
4. **Offline Indicators**: Clear UI feedback for connection status

## CBC Curriculum Alignment

Full integration with Kenya's Competency-Based Curriculum:
- Grade-specific learning objectives
- Competency-based assessment rubrics
- Cross-curricular learning connections
- Local context integration

## Mobile Optimization

Designed specifically for mobile-first usage:
- Touch-friendly interface elements
- Responsive grid layouts
- Swipe gestures for navigation
- Battery-efficient animations
- Minimal data usage patterns

## Professional Development Gamification

Engaging teacher training through:
- **Progress Tracking**: Visual progress bars and completion metrics
- **Badge System**: Achievement recognition for professional growth
- **Micro-Learning**: Bite-sized courses for busy teachers
- **Practical Application**: Real-world teaching scenarios and solutions

## Contributing

This application is designed to support teachers in challenging environments. Contributions focusing on:
- Offline functionality improvements
- Local language support
- Rural area-specific features
- Performance optimizations

are especially welcome.

## License

MIT License - Built for educational purposes and teacher empowerment.

---

*Empowering teachers with AI-driven tools for better education outcomes in every classroom.*