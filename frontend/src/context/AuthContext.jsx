import { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, signupUser } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if token exists on mount
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
            // In a real app, you might want to validate the token here
            // For now, we'll just assume validity or handle 401s elsewhere
            // We can decode the token to get user info if needed, or fetch /me
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const data = await loginUser(email, password);
            localStorage.setItem('token', data.access_token);
            setToken(data.access_token);
            // You might want to set user state here if the login response includes it
            // or decode the token payload
            setUser({ email });
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.detail || 'Login failed'
            };
        }
    };

    const signup = async (email, password) => {
        try {
            await signupUser(email, password);
            // Auto login after signup? Or require manual login?
            // For now, let's return success and let component redirect to login
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.detail || 'Signup failed'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, signup, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
