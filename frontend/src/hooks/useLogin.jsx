import { useState } from 'react'
import { useAuthContext } from './useAuthContext'

import { useNavigate } from 'react-router-dom';  // Import useNavigate from react-router-dom
import axios from 'axios';

export const useLogin = () => {
  const [errorLogin, setError] = useState(null)
  const [isLoadingLogin, setIsLoading] = useState(null)
  const { dispatch } = useAuthContext()
  const navigate = useNavigate();

    const login = async (email, password) => {
        setIsLoading(true)
        setError(null)

        const response = await axios.post('http://localhost:4000/api/user/login', {
        email,
        password
        });

        if (response.status === 201) {
            console.log('User signed in successfully:', response.data);
            // You can store the token in localStorage for future use (e.g., token-based authentication)
            localStorage.setItem('user', response.data.token);  // Save token to localStorage

            // update the auth context
            dispatch({type: 'LOGIN', payload: response.data})

            // update loading state
            setIsLoading(false)
            
            navigate('/');  

        } else {
            
            setIsLoading(false)
            setError(errorLogin.response.data.message);
            console.error('Error during sign-in:', errorLogin.response.data);
            
        }
    }
    return { login, errorLogin, isLoadingLogin }
}
