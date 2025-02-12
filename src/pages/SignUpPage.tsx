import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

const SignUpPage = () => {
  const navigate = useNavigate();
  const { authStatus } = useAuthenticator(context => [context.authStatus]);

  useEffect(() => {
    if (authStatus === 'authenticated') {
      navigate('/');
    }
  }, [authStatus, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md">
        <Authenticator>
          {({ signOut, user }) => (
            <div className="p-4">
              <h1 className="text-2xl font-bold mb-4">Welcome {user?.username}</h1>
              <button
                onClick={signOut}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Sign Out
              </button>
            </div>
          )}
        </Authenticator>
      </div>
    </div>
  );
};

export default SignUpPage;