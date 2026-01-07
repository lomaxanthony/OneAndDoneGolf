import { useNavigate } from 'react-router-dom'

export default function Picks() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <button
            onClick={() => navigate('/')}
            className="text-2xl font-bold text-green-600 hover:text-green-700 transition duration-200"
          >
            One & Done Golf
          </button>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/standings')}
              className="text-green-600 hover:text-green-700 font-medium transition duration-200"
            >
              Standings
            </button>
            <button className="px-6 py-2 bg-green-600 hover:bg-green-700 hover:shadow-lg text-white font-semibold rounded-lg transition duration-200">
              Profile
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Make Your Pick</h1>
        {/* Picks content will go here */}
      </div>
    </div>
  )
}
