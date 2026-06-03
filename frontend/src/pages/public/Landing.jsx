import { Link } from 'react-router-dom'
import { Button } from '../../components/common'

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">RideHub</h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-12">
          The fastest way to book a ride or earn as a driver
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/signup" className="w-full sm:w-auto">
            <Button variant="accent" size="lg" className="w-full">
              Ride as Rider
            </Button>
          </Link>
          <Link to="/driver-signup" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full">
              Drive as Driver
            </Button>
          </Link>
        </div>

        <div className="mt-12 pt-12 border-t border-gray-700">
          <p className="text-gray-400 mb-4">Already have an account?</p>
          <Link to="/login">
            <Button variant="ghost" size="md">
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
