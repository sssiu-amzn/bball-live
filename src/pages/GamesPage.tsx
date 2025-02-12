import { useEffect } from "react"
import { Link } from "react-router-dom"

import { Amplify } from 'aws-amplify'
import { events } from 'aws-amplify/data'
import config from '../amplify_outputs.json'
import { useState } from "react"

export default function GamesPage() {


  const games = [
    { id: 'game1', title: 'Game 1', date: '2025-02-06', status: 'Live' },
    { id: 'game2', title: 'Game 2', date: '2025-02-06', status: 'Upcoming' },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Games</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {games.map((game) => (
          <Link key={game.id} to={`/games/${game.id}`}>
            <div key={game.id} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-2">{game.title}</h2>
              <div className="text-gray-600">
                <p>Date: {game.date}</p>
                <p>Status: <span className="text-primary font-medium">{game.status}</span></p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}