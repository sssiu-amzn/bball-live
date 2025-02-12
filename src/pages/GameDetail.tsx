// src/pages/GameDetail.tsx
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { events, EventsOptions } from 'aws-amplify/data'
import { fetchAuthSession } from 'aws-amplify/auth';

interface GameDetail {
  id: string;
  homeId: string;
  homeName: string;
  homeScore: number;
  homeLogo: string;
  awayId: string;
  awayName: string;
  awayScore: number;
  awayLogo: string;
  status: 'upcoming' | 'live' | 'finished';
}

interface GameUpdate {
  gameId: string;
  teamId: string;
  quarter: 1 | 2 | 3 | 4;
  minLeft: number;
  secLeft: number;
  score: 1 | 2 | 3;
}

const games: GameDetail[] = [
  {
    id: 'game1',
    homeId: 'Denver Nuggets',
    homeName: 'Denver Nuggets',
    homeScore: 0,
    homeLogo: 'https://upload.wikimedia.org/wikipedia/en/7/76/Denver_Nuggets.svg',
    awayId: 'Boston Celtics',
    awayName: 'Boston Celtics',
    awayScore: 0,
    awayLogo: 'https://upload.wikimedia.org/wikipedia/en/8/8f/Boston_Celtics.svg',
    status: 'live',
  },

  {
    id: 'game2',
    homeId: 'Los Angeles Lakers',
    homeName: 'Los Angeles Lakers',
    homeScore: 0,
    homeLogo: 'https://upload.wikimedia.org/wikipedia/commons/3/3c/Los_Angeles_Lakers_logo.svg',
    awayId: 'Chicago Bulls',
    awayName: 'Chicago Bulls',
    awayScore: 0,
    awayLogo: 'https://upload.wikimedia.org/wikipedia/en/6/67/Chicago_Bulls_logo.svg',
    status: 'upcoming',
  },
]

export default function GameDetail() {
  const { id } = useParams();
  const [game, setGame] = useState<GameDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [updates, setUpdates] = useState<GameUpdate[]>([]);
  const [authToken, setAuthToken] = useState<string | undefined>();
  const eventApiOptions: EventsOptions = {
    authMode: "userPool",
    authToken: authToken
  };


  useEffect(() => {
    const getAuthToken = async () => {
      try {
        const session = await fetchAuthSession();
        const token = session.tokens?.accessToken?.toString();
        setAuthToken(token);
      } catch (error) {
        console.error('Error getting auth session:', error);
      }
    };

    getAuthToken();
  }, []);

  useEffect(() => {
    if (!authToken) {
      return
    }

    const pr = events.connect(`/default/*`, eventApiOptions)
    pr.then((channel) => {
      channel.subscribe({
        next: (data) => {
          const update = data.event;
          try {
            // Add new message to the beginning of the array
            setUpdates((prevUpdates) => {
              const newUpdates = [...prevUpdates, update]
              newUpdates.sort((a, b) => {
                // Compare quarters first (descending - higher quarter first)
                if (b.quarter !== a.quarter) {
                  return b.quarter - a.quarter;
                }
                // If quarters are equal, compare minutes (ascending - lower minutes first)
                if (a.minLeft !== b.minLeft) {
                  return b.minLeft - a.minLeft;
                }
                // If minutes are equal, compare seconds (ascending - lower seconds first)
                return b.secLeft - a.secLeft;
              })
              return newUpdates
            });

            // Update the game score
            setGame((prevGame) => {
              if (!prevGame || update.gameId !== prevGame.id) return prevGame;

              return {
                ...prevGame,
                homeScore: update.teamId === prevGame.homeId
                  ? prevGame.homeScore + update.score
                  : prevGame.homeScore,
                awayScore: update.teamId === prevGame.awayId
                  ? prevGame.awayScore + update.score
                  : prevGame.awayScore,
              };
            });
          } catch (error) {
            console.error('Error processing update:', error);
          }
        },
        error: (value) => console.error(value),
      })
    })

    // Fetch game details when component mounts
    // Replace with your actual API call
    const fetchGameDetails = async () => {
      try {
        let data = games.find(game => game.id === id);
        if (data === undefined) {
          setGame(null);
          return
        }
        setGame(data)
        setLoading(false);
      } catch (error) {
        console.error('Error fetching game details:', error);
        setLoading(false);
      }
    };

    fetchGameDetails();
    return () => {
      pr?.then((channel) => channel?.close())
    }
  }, [authToken]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!game) {
    return <div className="text-center">Game not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Game Status Banner */}
      <div className={`mb-4 p-2 text-center rounded-lg ${game.status === 'live' ? 'bg-red-600 text-white' :
        game.status === 'finished' ? 'bg-gray-600 text-white' :
          'bg-blue-600 text-white'
        }`}>
        {game.status === 'live' ? 'LIVE' :
          game.status === 'finished' ? 'FINAL' :
            'UPCOMING'}
      </div>

      {/* Scoreboard */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="grid grid-cols-2 gap-4 items-center">
          {/* Home Team */}
          <div className="text-center">
            <img src={game.homeLogo} alt={game.homeName} className="w-24 h-24 mx-auto mb-2" />
            <h2 className="text-xl font-bold">{game.homeName}</h2>
            <p className="text-3xl font-bold">{game.homeScore}</p>
          </div>

          {/* Game Info */}
          {/*           <div className="text-center">
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
          </div> */}

          {/* Away Team */}
          <div className="text-center">
            <img src={game.awayLogo} alt={game.awayName} className="w-24 h-24 mx-auto mb-2" />
            <h2 className="text-xl font-bold">{game.awayName}</h2>
            <p className="text-3xl font-bold">{game.awayScore}</p>
          </div>
        </div>
      </div>

      {/* Live Game Updates Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
        <h3 className="text-xl font-bold mb-4">Live Updates</h3>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {updates.map((update, index) => {
            const team = update.teamId === game.homeId ? game.homeName : game.awayName;
            const teamLogo = update.teamId === game.homeId ? game.homeLogo : game.awayLogo;

            return (
              <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg bg-gray-50">
                <img
                  src={teamLogo}
                  alt={team}
                  className="w-8 h-8"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">{team}</span>
                    <span className="text-gray-600">
                      Q{update.quarter} - {update.minLeft}:{update.secLeft.toString().padStart(2, '0')}
                    </span>
                  </div>
                  <div className="text-green-600">
                    +{update.score} points
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}