import { useState } from 'react';
import { useAuthContext } from './useAuthContext';
import axios from 'axios';

export const useSignup = () => {
    const [errorSignup, setError] = useState(null);
    const [isLoadingSignup, setIsLoading] = useState(null);
    const { dispatch } = useAuthContext();

    const signup = async (email, password) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.post('http://localhost:4000/api/user/signup', {
                email,
                password
            });

            // Save user to localStorage
            localStorage.setItem('user', JSON.stringify({
                _id: response.data._id,
                email: response.data.email,
                role: response.data.role,
                token: response.data.token
            }));

            // Update auth context
            dispatch({ type: 'LOGIN', payload: response.data });

            setIsLoading(false);
            return response.data; // Return user data on success

        } catch (error) {
            setIsLoading(false);
            const errorMessage = error.response?.data?.message || 'Signup failed. Please try again.';

            setError(errorMessage);
            console.error('Signup error:', error);
            
            // Add this line to propagate the error to your component
            throw new Error(errorMessage); // This will trigger your component's catch block
        }
    };

    return { signup, errorSignup, isLoadingSignup };
};