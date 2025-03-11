import { useState } from 'react'
import { useAuthContext } from './useAuthContext'

import { useNavigate } from 'react-router-dom';  // Import useNavigate from react-router-dom
import axios from 'axios';

export const useSignup = () => {
    const [errorSignup, setError] = useState(null)
    const [isLoadingSignup, setIsLoading] = useState(null)
    const { dispatch } = useAuthContext()
    const navigate = useNavigate();

    const signup = async (email, password) => {
        setIsLoading(true)
        setError(null)

        const response = await axios.post('http://localhost:4000/api/user/signup', {  // Send POST request to backend
            email,
            password
        });

        if (response.status === 201) {
            console.log('User signed up successfully:', response.data);
            // Save token to localStorage
            localStorage.setItem('user', response.data.token); 
            
            navigate('/Home');  // Redirect to dashboard after successful login or sign-up
      
            // update the auth context
            dispatch({type: 'LOGIN', payload: response.data})
      
            // update loading state
            setIsLoading(false)
        } else {
            setIsLoading(false)
            console.error('Error during sign-up:', errorSignup.response.data);
            // Handle error 
            setError(errorSignup.response.data.message);
        }

    }
    return { signup, errorSignup, isLoadingSignup }
}