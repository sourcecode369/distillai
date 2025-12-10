# AI Handbooks

A comprehensive, production-ready learning platform for Artificial Intelligence, Machine Learning, and Data Science. Built with React, Supabase, and modern web technologies.

## 🚀 Features

### ✅ Authentication & User Management

- **User Authentication**

  - Email/password sign up and sign in
  - Secure session management with Supabase Auth
  - Automatic profile creation on signup
  - Welcome toast notifications on login
  - Persistent authentication state

- **User Profiles**

  - Customizable profile with full name and avatar
  - Avatar selector with multiple options
  - Profile information display
  - Admin role management

- **Account Security**
  - Change email address with confirmation
  - Change password with automatic logout for security
  - Delete account with permanent data removal
  - Confirmation dialogs for destructive actions

### 📚 Content Management

- **Content Organization**

  - Multiple handbooks (sections) with categories
  - Topics organized by category
  - Rich content support (text, images, code blocks, equations, tables)
  - Video embedding support
  - Prerequisites and learning objectives
  - Related topics recommendations

- **Content Display**

  - Beautiful topic view pages with proper typography
  - Responsive layouts for all screen sizes
  - Code syntax highlighting
  - Mathematical equation rendering
  - Image lazy loading
  - Table of contents sidebar navigation
  - Breadcrumb navigation
  - Print-friendly views
  - PDF export functionality

- **Database-Backed Content**
  - All content stored in Supabase database
  - Dynamic content loading
  - Support for custom admin-created topics
  - Content versioning and timestamps

### 🎯 Learning Features

- **Progress Tracking**

  - Mark topics as complete/incomplete
  - Progress percentage calculation
  - Completion badges and indicators
  - My Progress dashboard page
  - Category-level progress tracking
  - Unique topic counting (prevents duplicates)

- **Quiz System**

  - Interactive quizzes for each topic
  - Multiple choice questions
  - Automatic score calculation
  - Quiz result persistence to database
  - Quiz history tracking
  - Pass/fail indicators (80% threshold)
  - Quiz lock icons for unavailable quizzes
  - Automatic topic completion on quiz pass (≥80%)

- **Achievements & Gamification**

  - Achievement badges for milestones:
    - 10, 25, 50 topics completed
    - 5, 10 quizzes taken
    - Handbook completion (100%)
  - Visual achievement display with icons and colors
  - Progress-based achievements

- **Bookmarks**

  - Save topics for later reading
  - Quick access from sidebar
  - Bookmark indicators on topic cards
  - Remove bookmarks functionality

- **Reading History**
  - Automatic tracking of viewed topics
  - Recent reading history display
  - Last read timestamps
  - Reading progress percentage

### 🔍 Search & Discovery

- **Global Search**

  - Full-text search across all topics and categories
  - Search results page with filters
  - Search highlighting in results
  - Keyboard shortcut (Ctrl+K) for quick search
  - Search from topbar and multiple entry points

- **Content Discovery**
  - Related topics based on tags and categories
  - Category browsing
  - Topic recommendations
  - Filter by difficulty level

### 👨‍💼 Admin Dashboard

- **Content Management (Full CRUD)**

  - Create new topics with rich content editor
  - Edit existing topics (title, description, difficulty, tags, content)
  - Delete topics with confirmation
  - Import static topics to database
  - Import sections and categories
  - Custom topic indicators
  - Real-time content updates

- **Content Editor**

  - Rich JSON editor for topic content
  - Preview mode for content structure
  - Support for all content types (sections, images, code, equations, tables)
  - Real-time JSON validation
  - Content metrics display

- **User Management**

  - View all registered users
  - User statistics and analytics
  - Filter users by role (admin/regular)
  - User activity tracking
  - User profile viewing

- **Analytics Dashboard**

  - User statistics (total users, active users)
  - Content statistics (total topics, categories)
  - Activity logs
  - Time-based analytics (30, 60, 90 days)
  - Charts and visualizations

- **Notification Management**
  - Send notifications to all users
  - Send notifications to specific users
  - Notification history

### 🔔 Notifications

- **In-App Notification System**
  - Notification bell icon with unread count badge
  - Notification dropdown with latest notifications
  - Full notifications page with filters (All, Unread, Read)
  - Mark notifications as read
  - Mark all as read functionality
  - Beautiful notification cards with gradients
  - Admin notification sending

### 🎨 User Interface

- **Design System**

  - Modern, clean design with gradients
  - Consistent component styling
  - Dark mode support
  - Responsive design (mobile, tablet, desktop)
  - Smooth animations and transitions
  - Glassmorphic effects
  - Consistent color scheme (indigo/violet theme)

- **Components**

  - Loading skeletons (replaces spinners)
  - Empty states with helpful messages
  - Tooltips for interactive elements
  - Toast notifications with icons
  - Confirmation dialogs
  - Modal dialogs
  - Cards with hover effects
  - Buttons with multiple variants
  - Form inputs with validation
  - Breadcrumbs
  - Scroll indicators
  - Back to top button

- **Navigation**
  - Collapsible sidebar navigation
  - Mobile-responsive sidebar
  - Topbar with search and notifications
  - Breadcrumb navigation
  - Smooth page transitions
  - Skip to content link (accessibility)

### 📱 Responsive Design

- **Mobile Optimization**

  - Touch-friendly targets (minimum 44x44px)
  - Responsive typography (scales appropriately)
  - Mobile-specific spacing and padding
  - Overflow prevention
  - Mobile sidebar with overlay
  - Responsive button text (abbreviated on mobile)

- **Tablet & Desktop**
  - Multi-column layouts
  - Optimized spacing for larger screens
  - Desktop sidebar with expand/collapse
  - Hover states and interactions

### 🚀 Performance

- **Code Splitting**

  - Route-based lazy loading
  - Component-level lazy loading
  - Vendor chunk separation (React, Supabase, Lucide)
  - Reduced initial bundle size (~40% reduction)

- **Data Fetching**

  - React Query integration for smart caching
  - 45-second stale time to prevent unnecessary refetches
  - Automatic cache invalidation
  - Optimistic updates for better UX

- **Optimizations**
  - Component memoization (React.memo, useMemo, useCallback)
  - Image lazy loading
  - Virtual scrolling for long lists
  - Bundle size optimization
  - Minification and tree shaking

### 🔐 Security

- **Row Level Security (RLS)**

  - Database-level security policies
  - User data isolation
  - Admin-only content management
  - Secure authentication

- **Error Handling**
  - React Error Boundaries
  - Graceful error fallbacks
  - User-friendly error messages
  - Error isolation (errors don't crash entire app)

### 📊 SEO & Social Sharing

- **SEO Implementation**

  - Dynamic meta tags per page
  - Open Graph tags for social sharing
  - Twitter Card tags
  - JSON-LD structured data (Schema.org Article)
  - Auto-generated sitemap.xml
  - robots.txt configuration
  - Canonical URLs

- **Social Sharing**
  - Share to Twitter
  - Share to LinkedIn
  - Native share API support
  - Copy link functionality
  - Social media preview cards

### 🌐 Progressive Web App (PWA)

- **PWA Features**
  - Service worker registration
  - Offline caching strategies
  - App manifest
  - Installable on mobile devices
  - Workbox integration for caching

### 📄 Pages

- **Landing Page** - Welcome page with feature highlights
- **Home/Handbooks Page** - Browse all handbooks and categories
- **Category View** - View all topics in a category
- **Topic View** - Read topic content with full features
- **Quiz Page** - Interactive quiz interface
- **My Progress** - Learning progress dashboard
- **Profile Page** - User profile and account management
- **Admin Dashboard** - Content and user management
- **Notifications Page** - View all notifications
- **Search Results** - Global search results
- **About Page** - Platform information
- **FAQ Page** - Frequently asked questions
- **Contact Page** - Contact information
- **Contributing Page** - Contribution guidelines
- **Code of Conduct Page** - Community guidelines

### 🎯 Additional Features

- **Dark Mode** - Full dark theme support
- **Keyboard Shortcuts** - Ctrl+K for search
- **Scroll Progress Indicator** - Visual scroll progress
- **Print Support** - Print-friendly topic views
- **PDF Export** - Export topics as PDF
- **Related Topics** - Content recommendations
- **Topic Locking** - Visual indicators for unavailable content
- **Loading States** - Skeleton loaders throughout
- **Empty States** - Helpful messages when no data
- **Toast Notifications** - User feedback system
- **Confirmation Dialogs** - Prevent accidental actions

## 🛠️ Tech Stack

- **Frontend Framework:** React 19.2.0
- **Build Tool:** Vite 7.2.4
- **Styling:** Tailwind CSS 3.4.17
- **Backend:** Supabase (PostgreSQL, Auth, Storage)
- **State Management:** React Context API, TanStack React Query
- **Icons:** Lucide React
- **PWA:** Vite PWA Plugin
- **Code Quality:** ESLint

## 📦 Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd ai-handbook
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:
   Create a `.env` file with:

```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run database migrations:
   Apply all migrations in the `supabase/migrations` directory to your Supabase project.

5. Start the development server:

```bash
npm run dev
```

6. Build for production:

```bash
npm run build
```

7. Generate sitemap (before building):

```bash
npm run generate-sitemap
npm run build:with-sitemap
```

## 📁 Project Structure

```
ai-handbook/
├── src/
│   ├── components/       # Reusable UI components
│   ├── pages/           # Page components
│   ├── context/         # React context providers
│   ├── lib/             # Utilities and helpers
│   ├── utils/           # Utility functions
│   ├── data/            # Static data and content
│   └── assets/          # Static assets
├── supabase/
│   └── migrations/      # Database migration files
├── public/              # Public assets
└── scripts/             # Build and utility scripts
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:analyze` - Build with bundle analysis
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run generate-sitemap` - Generate sitemap.xml
- `npm run build:with-sitemap` - Build with sitemap generation

## 🗄️ Database Schema

The application uses Supabase (PostgreSQL) with the following main tables:

- `user_profiles` - User profile information
- `bookmarks` - User bookmarks
- `reading_history` - Reading activity tracking
- `user_progress` - Progress and quiz scores
- `topics` - Topic content
- `categories` - Category information
- `sections` - Section/handbook information
- `notifications` - In-app notifications

All tables have Row Level Security (RLS) policies for data protection.

## 🎨 Design Principles

- **Consistency:** Unified design system across all components
- **Accessibility:** Keyboard navigation, ARIA labels, focus management
- **Performance:** Optimized loading, caching, and rendering
- **User Experience:** Smooth animations, helpful feedback, intuitive navigation
- **Responsive:** Mobile-first approach with progressive enhancement

## 📝 Key Features Status

| Feature            | Status      | Notes                                   |
| ------------------ | ----------- | --------------------------------------- |
| Authentication     | ✅ Complete | Sign up, sign in, sign out              |
| User Profiles      | ✅ Complete | Full profile management                 |
| Account Security   | ✅ Complete | Email/password change, account deletion |
| Content Management | ✅ Complete | Full CRUD with database                 |
| Quiz System        | ✅ Complete | With result persistence                 |
| Progress Tracking  | ✅ Complete | My Progress page with achievements      |
| Bookmarks          | ✅ Complete | Basic functionality                     |
| Reading History    | ✅ Complete | Automatic tracking                      |
| Search             | ✅ Complete | Global search with filters              |
| Admin Dashboard    | ✅ Complete | Full admin functionality                |
| Notifications      | ✅ Complete | In-app notification system              |
| SEO                | ✅ Complete | Open Graph, Twitter Cards, JSON-LD      |
| PWA                | ✅ Complete | Service worker, offline support         |
| Dark Mode          | ✅ Complete | Full theme support                      |
| Responsive Design  | ✅ Complete | Mobile, tablet, desktop                 |

## 🚧 Future Enhancements

- Advanced gamification (badges, streaks, leaderboards)
- Reading time estimates
- Search history and autocomplete
- Bookmark folders and organization
- Email notifications
- Push notifications
- Analytics integration
- Internationalization (i18n)
- User onboarding tour
- Advanced search filters
- Content recommendations based on reading history

## 📄 License

[Add your license information here]

## 👥 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

## 📞 Support

For questions or support, please visit the [Contact Page](src/pages/ContactPage.jsx) or open an issue on GitHub.

---

**Last Updated:** January 2025  
**Version:** 1.0.0  
**Status:** Production Ready ✅

