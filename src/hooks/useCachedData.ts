import { useState, useEffect } from 'react';

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

/**
 * 通用数据缓存Hook
 * @param cacheKey 缓存键名
 * @param fetchData 获取数据的函数
 * @param dependencies 依赖数组，当依赖变化时重新获取数据
 * @param cacheDuration 缓存有效期（毫秒），默认10分钟
 * @returns 缓存的数据、加载状态和错误信息
 */
export const useCachedData = <T>(
  cacheKey: string,
  fetchData: () => Promise<T>,
  dependencies: React.DependencyList = [],
  cacheDuration: number = 10 * 60 * 1000 // 默认10分钟
): { data: T | null; loading: boolean; error: string | null; refetch: () => Promise<void> } => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 从localStorage加载缓存数据
  const loadFromCache = () => {
    try {
      const cachedItem = localStorage.getItem(cacheKey);
      if (cachedItem) {
        const { data, timestamp } = JSON.parse(cachedItem) as CacheItem<T>;
        // 检查缓存是否过期
        if (Date.now() - timestamp < cacheDuration) {
          setData(data);
          setLoading(false);
          return true;
        }
      }
    } catch (err) {
      console.error('Error loading from cache:', err);
    }
    return false;
  };

  // 保存数据到localStorage
  const saveToCache = (result: T) => {
    try {
      const cacheItem: CacheItem<T> = {
        data: result,
        timestamp: Date.now()
      };
      localStorage.setItem(cacheKey, JSON.stringify(cacheItem));
    } catch (err) {
      console.error('Error saving to cache:', err);
    }
  };

  // 获取数据函数
  const fetchDataWithCache = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchData();
      setData(result);
      saveToCache(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取数据失败');
    } finally {
      setLoading(false);
    }
  };

  // 初始加载数据
  useEffect(() => {
    if (!loadFromCache()) {
      fetchDataWithCache();
    }
  }, [...dependencies]);

  // 重新获取数据
  const refetch = async () => {
    await fetchDataWithCache();
  };

  return { data, loading, error, refetch };
};
