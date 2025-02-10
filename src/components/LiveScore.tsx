import { useEffect, useState, useRef } from 'react'
import '../App.css'

import { Amplify } from 'aws-amplify'
import { events } from 'aws-amplify/data'
import config from './amplify_outputs.json'

interface GameScore {
  id: number
  homeTeam: string
  awayTeam: string
  homeScore: number
  awayScore: number
  quarter: number
  timeRemaining: string
}

export default function LiveScore() {
  const [games, setGames] = useState<GameScore[]>([])

  useEffect(() => {
    const fetchScores = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await axios.get('YOUR_API_ENDPOINT')
        setGames(response.data)
      } catch (error) {
        console.error('Error fetching scores:', error)
      }
    }

    fetchScores()
    const interval = setInterval(fetchScores, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Live Basketball Scores</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {games.map((game) => (
          <div key={game.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="text-lg font-semibold">{game.homeTeam}</div>
              <div className="text-2xl font-bold">{game.homeScore}</div>
            </div>
            <div className="flex justify-between items-center mb-4">
              <div className="text-lg font-semibold">{game.awayTeam}</div>
              <div className="text-2xl font-bold">{game.awayScore}</div>
            </div>
            <div className="text-center text-gray-600">
              <span className="font-medium">Q{game.quarter}</span>
              <span className="mx-2">|</span>
              <span>{game.timeRemaining}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}