import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { Target } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

interface GoogleCredentialResponse {
  credential: string;
}

interface DecodedCredential {
  email: string;
  name: string;
  picture: string;
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuthStore();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

  const handleSuccess = (credentialResponse: GoogleCredentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential) as DecodedCredential;
    
    setUser({
      email: decoded.email,
      name: decoded.name,
      picture: decoded.picture,
    });

    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <h1 className='text-4xl font-bold text-amber-500'>Xeno's CRM by Deevansh</h1>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to XENO CRM
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Manage your customers and campaigns efficiently
          </p>
        </div>
        <div className="mt-8 flex justify-center">
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => {
              console.error('Login Failed');
            }}
            useOneTap
            theme="outline"
            size="large"
            shape="rectangular"
            width="300"
          />
        </div>
      </div>
    </div>
  );
}