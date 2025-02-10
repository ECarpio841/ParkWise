import { Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';

const ProtectedRoute = ({ role }: { role?: string }) => {
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axios.get('http://localhost:3000/auth/verify', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (role && response.data.role !== role) {
          setIsValid(false);
          return;
        }
        
        setIsValid(true);
      } catch (error) {
        setIsValid(false);
      }
    };

    if (token) verifyToken();
    else setIsValid(false);
  }, [token, role]);

  if (isValid === null) return <div>Loading...</div>;
  return isValid ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;