import { Link } from 'react-router-dom'
import { Button } from '../../components/common'

export default function NotFound({ message = 'Page Not Found' }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 text-white flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-2xl text-gray-300 mb-8">{message}</p>
        <Link to="/">
          <Button variant="accent" size="lg">
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  )
}
