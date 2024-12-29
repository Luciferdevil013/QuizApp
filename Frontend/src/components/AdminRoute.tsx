import { Navigate } from 'react-router-dom';

interface AdminRouteProps {
  children: JSX.Element;
}

function AdminRoute({ children }: AdminRouteProps) {
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  if (!isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}

export default AdminRoute; 