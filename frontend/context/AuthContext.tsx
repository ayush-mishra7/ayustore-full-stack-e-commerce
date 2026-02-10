import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '../types';
import { AuthService } from '../services/api';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    logout: () => void;
    checkAuth: () => Promise<void>;
    requireAuth: (redirectTo?: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const checkAuth = useCallback(async () => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            try {
                const res = await AuthService.getProfile();
                setUser(res.data);
                console.log('Auth check successful, user:', res.data?.name);
            } catch (err) {
                console.error('Auth check failed:', err);
                localStorage.removeItem('auth_token');
                setUser(null);
            }
        } else {
            setUser(null);
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        // Simply check auth on mount - OAuth callback is handled by OAuthCallback page
        checkAuth();
    }, [checkAuth]);

    // This function checks if user is authenticated 
    // Returns true if authenticated, false otherwise
    // Sets up redirect path in sessionStorage for after login
    const requireAuth = useCallback((redirectTo?: string): boolean => {
        if (user) {
            return true;
        }
        // Store the intended destination
        if (redirectTo) {
            sessionStorage.setItem('auth_redirect', redirectTo);
        }
        return false;
    }, [user]);

    const logout = () => {
        AuthService.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            isLoading,
            logout,
            checkAuth,
            requireAuth
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};
