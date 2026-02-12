import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const OAuthCallback: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { checkAuth } = useAuth();

    useEffect(() => {
        const token = searchParams.get('token');
        const error = searchParams.get('error');

        if (error) {
            console.error('OAuth error:', error);
            navigate('/login?error=' + error);
            return;
        }

        if (token) {
            console.log('OAuth callback: Token received, saving to localStorage');
            localStorage.setItem('auth_token', token);

            // Check auth and redirect to home or stored redirect path
            checkAuth().then((isAuthenticated) => {
                if (isAuthenticated) {
                    const redirectPath = localStorage.getItem('redirectAfterLogin') || '/';
                    localStorage.removeItem('redirectAfterLogin');
                    console.log('OAuth success, redirecting to:', redirectPath);
                    navigate(redirectPath, { replace: true });
                } else {
                    console.error('Auth check failed with new token');
                    navigate('/login?error=auth_check_failed');
                }
            });
        } else {
            console.error('No token in callback');
            navigate('/login?error=no_token');
        }
    }, [searchParams, navigate, checkAuth]);

    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                    Signing you in...
                </h2>
                <p className="text-slate-500 dark:text-slate-400">
                    Please wait while we complete your authentication
                </p>
            </div>
        </div>
    );
};

export default OAuthCallback;
