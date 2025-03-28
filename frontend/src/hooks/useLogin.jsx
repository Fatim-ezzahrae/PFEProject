import { useState } from 'react';
import { useAuthContext } from './useAuthContext';
import axios from 'axios';

export const useLogin = () => {
    const [errorLogin, setError] = useState(null);
    const [isLoadingLogin, setIsLoading] = useState(null);
    const { dispatch } = useAuthContext();

    const login = async (email, password) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.post('http://localhost:4000/api/user/login', {
                email,
                password
            });

            // Save user to localStorage
            localStorage.setItem('user', JSON.stringify({
                _id: response.data._id,
                email: response.data.email,
                token: response.data.token
            }));

            // Update auth context
            dispatch({ type: 'LOGIN', payload: response.data });

            setIsLoading(false);
            return response.data; // Return user data on success

        } catch (error) {
            setIsLoading(false);
            const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
            setError(errorMessage);
            console.error('Login error:', error);
            return null; // Return null on failure
        }
    };

    return { login, errorLogin, isLoadingLogin };
};