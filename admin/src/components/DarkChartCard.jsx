import React from 'react'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js'
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend)

export default function DarkChartCard({title, data}){
  const chartData = {
    labels: data?.labels || [],
    datasets: [{ label: title || 'Chart', data: data?.values || [], tension: 0.3 }]
  }
  const options = {
    responsive: true,
    plugins: { legend: { labels: { color: '#cbd5e1' } }, tooltip: { mode: 'index', intersect: false }},
    scales: {
      x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(148,163,184,0.06)' } },
      y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(148,163,184,0.06)' } }
    }
  }
  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-4 rounded border border-slate-700">
      <h4 className="font-bold mb-2 text-slate-100">{title}</h4>
      <Line data={chartData} options={options} />
    </div>
  )
}
