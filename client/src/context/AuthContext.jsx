import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const BASE_URL = 'https://s75-thamizhanban-capstone-codebuddy.onrender.com/api';

    useEffect(() => {
        verifyAuth();
    }, []);

    const verifyAuth = async () => {
        try {
            const response = await fetch(`${BASE_URL}/verify`, { credentials: 'include' });
            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error("Auth verification error:", error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const response = await fetch(`${BASE_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
                credentials: 'include'
            });
            const data = await response.json();
            if (response.ok) {
                setUser(data.user);
                return { success: true };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    const logout = async () => {
        try {
            await fetch(`${BASE_URL}/logout`, { method: 'POST', credentials: 'include' });
            setUser(null);
        } catch (error) {
            console.error("Logout error", error);
        }
    };

    const signup = async (email, password) => {
        try {
            const response = await fetch(`${BASE_URL}/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (response.ok) {
                return { success: true };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, signup, loading, verifyAuth }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
