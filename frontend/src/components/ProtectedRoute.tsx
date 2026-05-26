import { Navigate } from 'react-router-dom';

interface Props {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: Props) => {
  const user = localStorage.getItem('loggedInUser');

  if (!user) {
    return <Navigate to='/login' />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;