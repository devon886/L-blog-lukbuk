import React, { createContext, useState, useEffect, useContext } from 'react';
import type { ReactNode } from 'react';
import { supabase } from '../supabase/client';

interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 检查用户的登录状态
    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user && user.email ? { id: user.id, email: user.email } : null);
      } catch (error) {
        console.error('Error checking user:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();

    // 监听认证状态变化
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user && session.user.email ? { id: session.user.id, email: session.user.email } : null);
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  // 登录函数
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || '登录失败');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // 注册函数
  const register = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || '注册失败');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // 登出函数
  const logout = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (err: any) {
      setError(err.message || '登出失败');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // 清除错误信息
  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    isLoading,
    error,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 自定义Hook，用于在组件中使用认证上下文
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
