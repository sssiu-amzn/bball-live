// src/pages/AdminGames.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Game {
  id: string;
  homeTeam: {
    name: string;
    score: number;
    logo: string;
  };
  awayTeam: {
    name: string;
    score: number;
    logo: string;
  };
  status: 'upcoming' | 'live' | 'finished';
  date: string;
  venue: string;
}

export default function AdminPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    homeTeam: { name: '', score: 0, logo: '' },
    awayTeam: { name: '', score: 0, logo: '' },
    date: '',
    venue: '',
    status: 'upcoming'
  });

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [team, field] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [team]: { ...prev[team as keyof typeof prev], [field]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && selectedGame) {
        // Update existing game
        // await fetch(`/api/games/${selectedGame.id}`, {
        //   method: 'PUT',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(formData)
        // });
      } else {
        // Add new game
        // await fetch('/api/games', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(formData)
        // });
      }
      setIsModalOpen(false);
      // Refresh games list
      fetchGames();
    } catch (error) {
      console.error('Error saving game:', error);
    }
  };

  // Fetch games
  const fetchGames = async () => {
    try {
      // const response = await fetch('/api/games');
      // const data = await response.json();
      // setGames(data);
    } catch (error) {
      console.error('Error fetching games:', error);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin - Manage Games</h1>
        <button
          onClick={() => {
            setIsEditing(false);
            setFormData({
              homeTeam: { name: '', score: 0, logo: '' },
              awayTeam: { name: '', score: 0, logo: '' },
              date: '',
              venue: '',
              status: 'upcoming'
            });
            setIsModalOpen(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add New Game
        </button>
      </div>

      {/* Games List */}
      <div className="grid gap-4">
        {games.map(game => (
          <div key={game.id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
            <div>
              <p className="font-bold">{game.homeTeam.name} vs {game.awayTeam.name}</p>
              <p className="text-sm text-gray-600">{game.date} - {game.venue}</p>
            </div>
            <button
              onClick={() => {
                setSelectedGame(game);
                setFormData({
                  homeTeam: game.homeTeam,
                  awayTeam: game.awayTeam,
                  date: game.date,
                  venue: game.venue,
                  status: game.status
                });
                setIsEditing(true);
                setIsModalOpen(true);
              }}
              className="bg-gray-500 text-white px-3 py-1 rounded"
            >
              Edit
            </button>
          </div>
        ))}
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {isEditing ? 'Edit Game' : 'Add New Game'}
            </h2>
            <form onSubmit={handleSubmit}>
              {/* Home Team */}
              <div className="mb-4">
                <h3 className="font-bold mb-2">Home Team</h3>
                <input
                  type="text"
                  name="homeTeam.name"
                  placeholder="Team Name"
                  value={formData.homeTeam.name}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded mb-2"
                />
                <input
                  type="number"
                  name="homeTeam.score"
                  placeholder="Score"
                  value={formData.homeTeam.score}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded mb-2"
                />
                <input
                  type="text"
                  name="homeTeam.logo"
                  placeholder="Logo URL"
                  value={formData.homeTeam.logo}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded"
                />
              </div>

              {/* Away Team */}
              <div className="mb-4">
                <h3 className="font-bold mb-2">Away Team</h3>
                <input
                  type="text"
                  name="awayTeam.name"
                  placeholder="Team Name"
                  value={formData.awayTeam.name}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded mb-2"
                />
                <input
                  type="number"
                  name="awayTeam.score"
                  placeholder="Score"
                  value={formData.awayTeam.score}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded mb-2"
                />
                <input
                  type="text"
                  name="awayTeam.logo"
                  placeholder="Logo URL"
                  value={formData.awayTeam.logo}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded"
                />
              </div>

              {/* Game Details */}
              <div className="mb-4">
                <input
                  type="datetime-local"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded mb-2"
                />
                <input
                  type="text"
                  name="venue"
                  placeholder="Venue"

                  value={formData.venue}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded mb-2"
                />
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded"
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="live">Live</option>
                  <option value="finished">Finished</option>
                </select>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  {isEditing ? 'Update Game' : 'Add Game'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}