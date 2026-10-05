import React, { createContext, useContext, useState, useEffect } from 'react';

export type AppRoute =
  | '/'
  | '/admissions'
  | '/admissions/success'
  | '/teachers/apply'
  | '/teachers/application-success'
  | '/admin/login'
  | '/admin/dashboard'
  | '/admin'
  | '/teacher/login'
  | '/teacher/dashboard'
  | '/teacher/students'
  | '/teacher/today'
  | '/teacher/attendance'
  | '/teacher/progress'
  | '/teacher/profile'
  | '/teacher'
  | '/unauthorized';

interface RouterContextType {
  currentRoute: AppRoute;
  navigate: (route: AppRoute, state?: any) => void;
  routeState: any;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

const VALID_ROUTES: AppRoute[] = [
  '/',
  '/admissions',
  '/admissions/success',
  '/teachers/apply',
  '/teachers/application-success',
  '/admin/login',
  '/admin/dashboard',
  '/admin',
  '/teacher/login',
  '/teacher/dashboard',
  '/teacher/students',
  '/teacher/today',
  '/teacher/attendance',
  '/teacher/progress',
  '/teacher/profile',
  '/teacher',
  '/unauthorized',
];

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname as AppRoute;
      if (VALID_ROUTES.includes(path)) {
        return path;
      }
    }
    return '/';
  });

  const [routeState, setRouteState] = useState<any>(null);

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname as AppRoute;
      if (VALID_ROUTES.includes(path)) {
        setCurrentRoute(path);
      } else {
        setCurrentRoute('/');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (route: AppRoute, state?: any) => {
    let target = route;
    if (target === '/admin') target = '/admin/dashboard';
    if (target === '/teacher') target = '/teacher/dashboard';

    setCurrentRoute(target);
    setRouteState(state || null);
    if (typeof window !== 'undefined' && window.history) {
      window.history.pushState(state || {}, '', target);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <RouterContext.Provider value={{ currentRoute, navigate, routeState }}>
      {children}
    </RouterContext.Provider>
  );
};

export const useRouter = () => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
};
