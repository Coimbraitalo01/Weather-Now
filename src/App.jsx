import React from 'react'
import WeatherCard from './components/WeatherCard'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-3xl font-bold text-center mb-6">☁️ Weather Now</h1>
      <WeatherCard />
    </div>
  )
}
