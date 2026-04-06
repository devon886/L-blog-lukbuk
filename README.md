[README.md](https://github.com/user-attachments/files/26493625/README.md)# L-blog-lukbuk

A minimalist personal blog application built with React + TypeScript + Vite. Features a clean design with profile sidebar, article publishing, and responsive layout.

## ✨ Features

- 📝 **Article Management**: Publish, edit, and delete articles
-  **User Authentication**: Secure login system powered by Supabase
- 📱 **Responsive Design**: Optimized for desktop and mobile devices
- ⚡ **Performance**: Code splitting, lazy loading, and efficient caching
- 🎨 **Minimalist Design**: Clean black & white theme with profile sidebar
- 🔧 **Admin Control**: Environment-based feature toggles

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite (rolldown-vite)
- **Routing**: React Router DOM 7
- **Backend**: Supabase (Auth + Database)
- **State Management**: React Context API
- **Styling**: CSS Modules

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18
- npm >= 9

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/devon886/L-blog-lukbuk.git
cd L-blog-lukbuk
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_ADMIN_ENABLED=true
```

4. **Start development server**

```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

5. **Build for production**

```bash
npm run build
```

Production files will be generated in the `dist` directory.

6. **Preview production build**

```bash
npm run preview
```

## 🌐 Deploy to Netlify

### Option 1: GitHub Integration

1. Visit [Netlify](https://app.netlify.com/) and sign in
2. Click "Add new site" → "Import an existing project"
3. Connect your GitHub account and select `devon886/L-blog-lukbuk`
4. Click "Deploy site"

### Option 2: Manual Configuration

1. **Configure build settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`

2. **Set environment variables** in Netlify dashboard:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key
   - `VITE_ADMIN_ENABLED`: Set to `true`

3. **Deploy**:
   - Push to GitHub to trigger auto-deployment, or
   - Manually trigger deployment from Netlify dashboard

## 📁 Project Structure

```
L-blog-lukbuk/
├── public/                 # Static assets
│   └── lukbuk.jpg         # Profile avatar
├── src/
│   ├── components/        # Reusable components
│   │   ├── Header.tsx     # Navigation header
│   │   ├── PostList.tsx   # Article list
│   │   ├── PostDetail.tsx # Article detail view
│   │   └── WriteForm.tsx  # Article editor
│   ├── contexts/          # React Context providers
│   │   └── AuthContext.tsx # Authentication logic
│   ├── hooks/             # Custom React hooks
│   │   └── useCachedData.ts # Data caching hook
│   ├── pages/             # Page components
│   │   ├── HomePage.tsx   # Home with sidebar
│   │   ├── PostDetailPage.tsx
│   │   ├── WritePage.tsx
│   │   └── LoginPage.tsx
│   ├── supabase/          # Supabase client config
│   │   └── client.ts
│   ├── App.tsx            # Root component
│   ├── main.tsx           # Entry point
│   └── *.css              # Stylesheets
├── .env.example           # Environment template
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 📖 Usage

### Home Page

- Displays article list with pagination
- Left sidebar shows:
  - Profile avatar and name (lukbuk)
  - Blog introduction
  - Site statistics (founded date, running days)
  - Contact information
  - Social links (GitHub, X)

### Article Detail

- Full article content display
- Edit/delete options for authenticated users
- Clean reading experience

### Write Article

- Rich text editing
- Title and content fields
- Publish immediately
- Access controlled by `VITE_ADMIN_ENABLED`

## 🔧 Development

### Code Quality

```bash
# Run ESLint
npm run lint

# Type checking
npm run typecheck
```

### Build Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_SUPABASE_URL` | Supabase project URL | Required |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | Required |
| `VITE_ADMIN_ENABLED` | Enable admin features (write/edit/delete) | `false` |

### Supabase Setup

1. Create a new project at [Supabase](https://supabase.com)
2. Get your project URL and anonymous key from Settings → API
3. Create necessary tables for posts and users
4. Configure authentication providers if needed

**Recommendation**: Disable public user registration in Supabase to prevent unauthorized access.

## 🎨 Design Philosophy

This blog follows a **minimalist design philosophy**:

- Clean black & white color scheme
- Focus on content readability
- Simple navigation
- Fast loading performance
- No unnecessary distractions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://react.dev/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Vite](https://vite.dev/) - Build tooling
- [Supabase](https://supabase.com/) - Backend services
- [React Router](https://reactrouter.com/) - Routing

## 📞 Contact

- **GitHub**: [@devon886](https://github.com/devon886)
- **Email**: lukbuk@qq.com
- **Twitter**: [@de_v_o_n](https://x.com/de_v_o_n)

---

Built with ❤️ by lukbuk

