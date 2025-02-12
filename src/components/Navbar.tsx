import { Link } from 'react-router-dom'
import { getCurrentUser } from 'aws-amplify/auth';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const [username, setUsername] = useState<string>('');

  useEffect(() => {
    getCurrentUserAsync();
  }, []);

  const getCurrentUserAsync = async () => {
    try {
      const user = await getCurrentUser();
      // Get username - you can choose what to display:
      // Option 1: Username
      setUsername(user.username);

      // Option 2: If you want to display their email
      // setUsername(user.attributes.email);

      // Option 3: If you want to display their name (if collected during sign up)
      // setUsername(user.attributes.name);

    } catch (error) {
      console.error('Error getting user:', error);
    }
  };

  const signOutRedirect = () => {
    const clientId = "3qc9d55t7i3btfsagdhjprhq90";
    const logoutUri = "http://localhost:5173";
    const cognitoDomain = "https://us-west-22kxoyiqhb.auth.us-west-2.amazoncognito.com";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  return (
    <nav className="bg-primary text-white p-4">
      <nav className="bg-primary text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-xl font-bold">Sports App</Link>
          <div className="space-x-4">
            <Link to="/games" className="hover:text-gray-300">Games</Link>
            {username ? (<div>
              <div>
                <span>Welcome, {username}!</span>
              </div>
              <div>
              <button onClick={() => signOutRedirect()}>Sign out</button>
              </div>
            </div>
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