import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../../Context/AuthContext';
import { LOGIN } from '../api/loginPageApi';

export const useLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChanges = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Send login request (cookies will be handled automatically)
      await axios.post(LOGIN, formData, { withCredentials: true });

      // Fetch user data after login
      const response = await axios.get('http://localhost:8080/api/auth/user', {
        withCredentials: true,
      });
      console.log('User data:', response);
      // Update authentication context
      loginUser(response.data);

      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error('Login Error:', err);
      setError('Invalid email or password');
    }
    setLoading(false);
  };

  return {
    formData,
    error,
    loading,
    handleChanges,
    handleLogin,
  };
};