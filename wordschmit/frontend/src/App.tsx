import { createBrowserRouter, RouterProvider, Navigate, useLocation, LoaderFunction, useRouteError } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import CreateContent from './pages/CreateContent';
import Settings from './pages/Settings';
import { ScheduleTest } from '@/components/content/ScheduleTest';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { StatusCheck } from '@/components/ui/status-check';

function ErrorBoundary() {
  const error = useRouteError();
  console.error(error);
  return <Navigate to="/login" replace />;
}

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!user.hasCompletedOnboarding && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  if (user.hasCompletedOnboarding && location.pathname === '/onboarding') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

// Custom loader to handle revalidation
const customLoader: LoaderFunction = async ({ request }) => {
  // Skip revalidation for error responses
  if (request.headers.get('X-Error-Response')) {
    return null;
  }
  return {};
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
    loader: customLoader,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/login",
    element: <AuthProvider><Login /></AuthProvider>,
    loader: customLoader,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/register",
    element: <AuthProvider><Register /></AuthProvider>,
    loader: customLoader,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/onboarding",
    element: <AuthProvider><PrivateRoute><Onboarding /></PrivateRoute></AuthProvider>,
    loader: customLoader,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/dashboard",
    element: <AuthProvider><PrivateRoute><Dashboard /></PrivateRoute></AuthProvider>,
    loader: customLoader,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/dashboard/create",
    element: <AuthProvider><PrivateRoute><CreateContent /></PrivateRoute></AuthProvider>,
    loader: customLoader,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/dashboard/settings",
    element: <AuthProvider><PrivateRoute><Settings /></PrivateRoute></AuthProvider>,
    loader: customLoader,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/dashboard/schedule",
    element: (
      <AuthProvider>
        <PrivateRoute>
          <DashboardLayout>
            <div className="container py-6">
              <ScheduleTest />
            </div>
          </DashboardLayout>
        </PrivateRoute>
      </AuthProvider>
    ),
    loader: customLoader,
    errorElement: <ErrorBoundary />,
  },
]);

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="ui-theme">
      <RouterProvider router={router} />
      <StatusCheck />
    </ThemeProvider>
  );
}

export default App;
