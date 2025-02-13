// src/pages/GameDetail.tsx
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { events, EventsOptions } from 'aws-amplify/data'
import { fetchAuthSession } from 'aws-amplify/auth';
import { games } from '../games'
import GameUpdate from '../interfaces/GameUpdate';
import GameDetail from '../interfaces/GameDetail';
import Comment from '../interfaces/Comment';
import React from 'react';
import { User } from 'oidc-client-ts';
import { useAuthenticator } from '@aws-amplify/ui-react';

interface CommentPayload extends Comment {
  isAdmin: boolean;
}

export default function GameDetailPage() {
  const { id } = useParams();
  const [game, setGame] = useState<GameDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [updates, setUpdates] = useState<GameUpdate[]>([]);
  const [authToken, setAuthToken] = useState<string | undefined>();
  const [comments, setComments] = useState<CommentPayload[]>([]);
  const [newComment, setNewComment] = useState('');
  const { user, signOut } = useAuthenticator((context) => [context.user]);

  const eventApiOptions: EventsOptions = {
    authMode: "userPool",
    authToken: authToken
  };

  // fetch auth token
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

  // poll comments
  useEffect(() => {
    const pr = events.connect(`/comments/${id}`)
    pr.then((channel) => {
      channel.subscribe({
        next: (data) => {
          // Add new message to the beginning of the array
          setComments((prevComments) => [...prevComments, data.event]);
        },
        error: (value) => console.error(value),
      })
  })

  return () => {
    pr?.then((channel) => channel?.close())
  }
}, []);

// poll game updates
useEffect(() => {
  const pr = events.connect(`/gameUpdate/${id}`)
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
}, []);

if (loading) {
  return <div className="flex justify-center items-center h-screen">Loading...</div>;
}

if (!game) {
  return <div className="text-center">Game not found</div>;
}

const handleCommentSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    if (!authToken) {
      console.error('Auth token not fetched');
      return
    }

    const commentObject: Comment = {
      userId: user.userId,
      username: user.signInDetails?.loginId || 'anonymous',
      text: newComment,
      timestamp: new Date().toISOString()
    }

    events.post(`/comments/${id}`, commentObject, eventApiOptions)
      .then((data) => {
        console.log('Comment posted successfully:', data);
        setNewComment('');
      })
      .catch((error) => {
        console.error('Error posting comment:', error);
      });
  } catch (error) {
    console.error('Error submitting comment:', error);
  }
};

return (
  <div className="container mx-auto p-4 flex">
    <div className="w-full lg:w-2/3 p-2">
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

    {/* Comments section */}
    <div className="w-full lg:w-1/3 mt-4 lg:mt-0 lg:ml-8">
      <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
        <h3 className="text-xl font-bold mb-4">User Comments</h3>
        <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
          {comments.map((comment) => (
            <div key={comment.timestamp + comment.userId} className="p-4 border rounded-lg bg-gray-50">
              <div className="flex justify-between items-center mb-2">
                <span className={`font-semibold ${comment.isAdmin ? 'text-red-600' : ''}`}>
                  {comment.username}
                </span>
                <span className="text-gray-600 text-sm">
                  {new Date(comment.timestamp).toLocaleString()}
                </span>
              </div>
              <p>{comment.text}</p>
            </div>
          ))}
        </div>

        {/* Comment submission form */}
        <form onSubmit={handleCommentSubmit} className="mt-4">
          <textarea
            className="w-full p-2 border rounded"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
          />
          <button
            type="submit"
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Submit Comment
          </button>
        </form>
      </div>
    </div>
  </div>
);
}