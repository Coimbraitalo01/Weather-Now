import React from 'react'

export default function WeatherCard() {
  return (
    <div className="max-w-md mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-2">Cidade</h2>
      <p>🌡️ Temperatura: --°C</p>
      <p>💧 Umidade: --%</p>
      <p>🌬️ Vento: -- km/h</p>
    </div>
  )
}
