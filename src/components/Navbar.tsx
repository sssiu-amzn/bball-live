import { Link } from 'react-router-dom'
import { getCurrentUser } from 'aws-amplify/auth';
import { useEffect, useState } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import React from 'react';
import { getCurrentUserAsync } from '../util';

export default function Navbar() {
  const [username, setUsername] = useState<string>('');
  const { user, signOut } = useAuthenticator((context) => [context.user]);

  useEffect(() => {
    getCurrentUserAsync(setUsername);
  }, [user]);

  return (
    <nav className="bg-primary text-white p-4">
      <nav className="bg-primary text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-xl font-bold">Basketball Live Stream</Link>
          <div className="space-x-4">
            <Link to="/games" className="hover:text-gray-300">Games</Link>
            {username && <Link to="/admin" className="hover:text-gray-300">Admin</Link>}
            {username ? (
              <button className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600" onClick={() => {
                setUsername('');
                signOut()
              }}>Sign out {user.signInDetails?.loginId}</button>
            ) : (
              <Link
                to="/signup"
                className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </nav>
    </nav>
  )
}