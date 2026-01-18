[README.md](https://github.com/user-attachments/files/24695600/README.md)
# Blog Application

A modern blog application built with React + TypeScript + Vite, supporting column management, article publishing, and user authentication.

## ✨ Features

- 📝 **Article Management**: Publish, edit, and delete articles
- 📚 **Column Functionality**: Create columns and publish articles to columns
- 👤 **User Authentication**: Login and registration functionality
- 📱 **Responsive Design**: Works on both desktop and mobile devices
- ⚡ **Performance Optimization**: Component lazy loading, pagination, and code splitting
- 🔍 **Table of Contents**: Column detail pages support article navigation
- 🔧 **Admin Functionality**: Control write/edit/delete features via environment variables

## 🛠️ Technology Stack

- **Frontend Framework**: React 19 + TypeScript
- **Build Tool**: Vite (rolldown-vite)
- **Routing**: React Router DOM 7
- **Backend**: Supabase (Authentication + Database)
- **State Management**: React Context API
- **Styling**: CSS Modules
- **Code Standards**: ESLint + TypeScript ESLint

## 🚀 Quick Start

### Environment Requirements

- Node.js >= 18
- npm >= 9

### Installation Steps

1. **Clone the Repository**

```bash
git clone https://github.com/devon886/L-blog-lukbuk.git
cd L-blog-lukbuk
```

2. **Install Dependencies**

```bash
npm install
```

3. **Configure Environment Variables**

Create a `.env` file in the project root directory with the following content:

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_ADMIN_ENABLED=true
```

4. **Start Development Server**

```bash
npm run dev
```

The application will start at `http://localhost:5173`.

5. **Build Production Version**

```bash
npm run build
```

Build output will be in the `dist` directory.

6. **Preview Production Version**

```bash
npm run preview
```

## 🚀 Deploy to Netlify

### 1. Import Project via GitHub

1. Visit [Netlify](https://app.netlify.com/) and log in
2. Click "Add new site" > "Import an existing project"
3. Select "GitHub" as the Git provider
4. Search for and select the project `devon886/L-blog-lukbuk`
5. Click "Deploy site"

### 2. Configure Environment Variables

1. In your Netlify project, go to "Site settings" > "Build & deploy" > "Environment variables"
2. Click "Add a variable" to add the following environment variables:
   - `VITE_SUPABASE_URL`: Your Supabase URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key
   - `VITE_ADMIN_ENABLED`: `true`
3. Save the environment variables

### 3. Configure Build Command

Netlify will automatically detect Vite project build commands by default, but you can also configure manually:

- Build command: `npm run build`
- Publish directory: `dist`

### 4. Deploy Website

Click "Trigger deploy" > "Deploy site" to manually trigger deployment, or push code to GitHub to automatically trigger deployment.

After deployment is complete, you can access your website via the Netlify-provided domain.

## 📁 Project Structure

```
L-blog-lukbuk/
├── src/
│   ├── components/          # Reusable components
│   │   ├── ColumnCard.tsx  # Column card component
│   │   ├── Header.tsx      # Header component
│   │   ├── PostDetail.tsx  # Article detail component
│   │   ├── PostList.tsx    # Article list component
│   │   └── WriteForm.tsx   # Article writing form component
│   ├── contexts/            # React Context
│   │   └── AuthContext.tsx # Authentication context
│   ├── pages/              # Page components
│   │   ├── AboutPage.tsx   # About page
│   │   ├── ColumnDetailPage.tsx # Column detail page
│   │   ├── CreateColumnPage.tsx # Create column page
│   │   ├── HomePage.tsx    # Home page
│   │   ├── LoginPage.tsx   # Login page
│   │   ├── PostDetailPage.tsx # Article detail page
│   │   └── WritePage.tsx   # Write article page
│   ├── supabase/           # Supabase configuration
│   │   └── client.ts       # Supabase client
│   ├── App.css             # Global styles
│   ├── App.tsx             # Root component
│   ├── main.tsx            # Entry file
│   └── vite-env.d.ts       # Vite environment types
├── .env.example            # Environment variables example
├── .eslintrc.js            # ESLint configuration
├── package.json            # Project configuration
├── tsconfig.json           # TypeScript configuration
├── tsconfig.node.json      # Node TypeScript configuration
└── vite.config.ts          # Vite configuration
```

## 📖 Usage Instructions

### 1. Home Page

- Displays all column cards
- Shows a list of articles not published to any column
- Supports pagination for loading more articles

### 2. Column Detail Page

- Left side shows article table of contents
- Right side displays all articles in the column
- Click table of contents items to quickly jump to corresponding articles

### 3. Article Detail Page

- Displays complete article content
- Logged-in users can edit or delete their own articles

### 4. Write Article

- Supports title and content editing
- Can choose to publish to a column or not
- Supports immediate publishing
- Only users with admin functionality enabled (VITE_ADMIN_ENABLED=true) and logged in can write articles

### 5. Create Column

- Enter column title and description
- After creation, you can manage articles in the column detail page
- Only logged-in users can create columns

## 🔧 Development Guide

### Code Standards

The project uses ESLint and TypeScript ESLint for code standard checking. Run the following command to check code:

```bash
npm run lint
```

### Type Checking

```bash
npm run typecheck
```

### Performance Optimization

1. **Component Lazy Loading**: Use React.lazy and Suspense for on-demand component loading
2. **Code Splitting**: Split dependency libraries into independent chunks
3. **Pagination**: Article lists use pagination loading strategy
4. **React.memo**: Use React.memo for pure display components

## 🔧 Admin Functionality Configuration

The project supports controlling the enablement of admin features via environment variables:

```env
# Enable admin functionality (show write, edit, and delete buttons)
VITE_ADMIN_ENABLED=true

# Disable admin functionality
VITE_ADMIN_ENABLED=false
```

Admin functionality includes:
- Write articles
- Edit articles
- Delete articles
- Create columns

Default value: false

## 📝 Supabase Configuration Note

It is recommended to disable new user registration in Supabase to prevent unauthorized users from creating accounts. This can be done in the Supabase dashboard under Authentication settings.

## 🤝 Contribution Guide

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## 🙏 Acknowledgments

- [React](https://react.dev/) - JavaScript library for building user interfaces
- [TypeScript](https://www.typescriptlang.org/) - Typed superset of JavaScript
- [Vite](https://vite.dev/) - Next generation frontend tooling
- [Supabase](https://supabase.com/) - Open source Firebase alternative
- [React Router](https://reactrouter.com/) - Declarative React routing

## 📞 Contact

For questions or suggestions, please contact:

- GitHub Issues: [https://github.com/devon886/L-blog-lukbuk/issues]
- Email: zlfdevon@gmail.com

---

If this project helps you, please give it a ⭐️!
