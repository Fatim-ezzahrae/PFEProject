import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { AuthContextProvider } from './context/AuthContext'
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter> {/* ✅ Router should be the top-level wrapper */}
        <AuthContextProvider>
            <App />
        </AuthContextProvider>
    </BrowserRouter>
);
