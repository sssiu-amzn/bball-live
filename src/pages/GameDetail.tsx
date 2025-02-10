// src/pages/GameDetail.tsx
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

interface GameDetail {
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
  period: number;
  timeRemaining: string;
  date: string;
  venue: string;
}

export default function GameDetail() {
  const { id } = useParams();
  const [game, setGame] = useState<GameDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch game details when component mounts
    // Replace with your actual API call
    const fetchGameDetails = async () => {
      try {
        // const response = await fetch(`/api/games/${id}`);
        // const data = await response.json();
        // setGame(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching game details:', error);
        setLoading(false);
      }
    };

    fetchGameDetails();
  }, [id]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!game) {
    return <div className="text-center">Game not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Game Status Banner */}
      <div className={`mb-4 p-2 text-center rounded-lg ${
        game.status === 'live' ? 'bg-red-600 text-white' : 
        game.status === 'finished' ? 'bg-gray-600 text-white' : 
        'bg-blue-600 text-white'
      }`}>
        {game.status === 'live' ? 'LIVE' : 
         game.status === 'finished' ? 'FINAL' : 
         'UPCOMING'}
      </div>

      {/* Scoreboard */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="grid grid-cols-3 gap-4 items-center">
          {/* Home Team */}
          <div className="text-center">
            <img src={game.homeTeam.logo} alt={game.homeTeam.name} className="w-24 h-24 mx-auto mb-2" />
            <h2 className="text-xl font-bold">{game.homeTeam.name}</h2>
            <p className="text-3xl font-bold">{game.homeTeam.score}</p>
          </div>

          {/* Game Info */}
          <div className="text-center">
            <div className="text-lg font-semibold mb-2">
              {game.status === 'live' ? (
                <>
                  <div>Quarter {game.period}</div>
                  <div>{game.timeRemaining}</div>
                </>
              ) : (
                <div>{game.date}</div>
              )}
            </div>
            <div className="text-sm text-gray-600">{game.venue}</div>
          </div>

          {/* Away Team */}
          <div className="text-center">
            <img src={game.awayTeam.logo} alt={game.awayTeam.name} className="w-24 h-24 mx-auto mb-2" />
            <h2 className="text-xl font-bold">{game.awayTeam.name}</h2>
            <p className="text-3xl font-bold">{game.awayTeam.score}</p>
          </div>
        </div>
      </div>

      {/* Additional Game Stats */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Add more detailed statistics here */}
        <h3 className="text-xl font-bold mb-4">Game Statistics</h3>
        {/* Add stats components here */}
      </div>
    </div>
  );
}