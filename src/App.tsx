import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Header from './components/Header';
import { AuthProvider } from './contexts/AuthContext';
import './App.css';

// 实现组件懒加载
const HomePage = lazy(() => import('./pages/HomePage'));
const PostDetailPage = lazy(() => import('./pages/PostDetailPage'));
const WritePage = lazy(() => import('./pages/WritePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const CreateColumnPage = lazy(() => import('./pages/CreateColumnPage'));
const ColumnDetailPage = lazy(() => import('./pages/ColumnDetailPage'));

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Header />
          <main className="main-content">
            <Suspense fallback={<div className="loading-container"><div className="loading-spinner"></div><p>加载中...</p></div>}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/posts/:id" element={<PostDetailPage />} />
                <Route path="/write" element={<WritePage />} />
                <Route path="/create-column" element={<CreateColumnPage />} />
                <Route path="/columns/:id" element={<ColumnDetailPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/login" element={<LoginPage />} />
              </Routes>
            </Suspense>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
