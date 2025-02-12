import React, { useState } from 'react';

interface GameUpdate {
  gameId: string;
  teamId: string;
  quarter: number;
  minLeft: number;
  secLeft: number;
  score: number;
}

const AdminPage: React.FC = () => {
  const [jsonInput, setJsonInput] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  const validateGameUpdates = (updates: GameUpdate[]): boolean => {
    return updates.every(update => {
      return (
        typeof update.gameId === 'string' &&
        typeof update.teamId === 'string' &&
        typeof update.quarter === 'number' &&
        update.quarter >= 1 &&
        update.quarter <= 4 &&
        typeof update.minLeft === 'number' &&
        update.minLeft >= 0 &&
        update.minLeft <= 12 &&
        typeof update.secLeft === 'number' &&
        update.secLeft >= 0 &&
        update.secLeft <= 59 &&
        typeof update.score === 'number' &&
        update.score >= 0
      );
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      // Parse and validate JSON
      const gameUpdates: GameUpdate[] = JSON.parse(jsonInput);
      
      if (!Array.isArray(gameUpdates)) {
        throw new Error('Input must be an array of game updates');
      }

      if (!validateGameUpdates(gameUpdates)) {
        throw new Error('Invalid game update format');
      }

/*       // Send to backend
      await API.post('api', '/games/updates', {
        body: gameUpdates
      }); */

      setMessage('Game updates successfully posted!');
      setJsonInput(''); // Clear the input after successful submission

    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to post game updates');
    }
  };

  const handlePrettifyJSON = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonInput(JSON.stringify(parsed, null, 2));
    } catch (err) {
      setError('Invalid JSON format');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Post Game Updates</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2">
              Game Updates JSON:
              <textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                className="w-full h-96 p-2 border rounded font-mono text-sm"
                placeholder="Paste your JSON here..."
              />
            </label>
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={handlePrettifyJSON}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Format JSON
            </button>
            
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Submit Updates
            </button>
          </div>
        </form>

        {message && (
          <div className="mt-4 p-3 bg-green-100 text-green-700 rounded">
            {message}
          </div>
        )}
        
        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
