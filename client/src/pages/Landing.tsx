import { useNavigate } from 'react-router-dom'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-green-600">One & Done Golf</h1>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/login')}
              className="text-green-600 hover:text-green-700 font-medium transition duration-200"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 hover:shadow-lg text-white font-semibold rounded-lg transition duration-200"
            >
              Sign Up
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-5xl font-bold text-gray-800 mb-4">
            This Week's Tournament
          </h2>
          <p className="text-3xl text-green-600 font-semibold mb-4">
            PGA Tour - Phoenix Open
          </p>
          <p className="text-lg text-gray-600 mb-8">
            Make your one and done pick. Win big.
          </p>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/picks')}
              className="px-8 py-3 bg-green-600 hover:bg-green-700 hover:shadow-lg hover:scale-105 text-white font-semibold rounded-lg transition duration-200"
            >
              Make My Pick
            </button>
            <button className="px-8 py-3 border-2 border-green-600 text-green-600 hover:bg-green-50 font-semibold rounded-lg transition duration-200">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Tournament Info */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-200">
            <h3 className="text-green-600 text-sm font-bold mb-2 uppercase">Dates</h3>
            <p className="text-xl font-semibold text-gray-800">Jan 29 - Feb 2</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-200">
            <h3 className="text-green-600 text-sm font-bold mb-2 uppercase">Location</h3>
            <p className="text-xl font-semibold text-gray-800">Phoenix, AZ</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-200">
            <h3 className="text-green-600 text-sm font-bold mb-2 uppercase">Prize Pool</h3>
            <p className="text-xl font-semibold text-gray-800">$20 Million</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-200">
            <h3 className="text-green-600 text-sm font-bold mb-2 uppercase">Top Players</h3>
            <p className="text-xl font-semibold text-gray-800">Rory, Jon, Ludvig</p>
          </div>
        </div>
      </section>
    </div>
  )
}