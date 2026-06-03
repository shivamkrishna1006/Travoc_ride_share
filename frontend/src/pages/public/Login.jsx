import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { Button, Input, Card, Toast } from '../../components/common'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('rider')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { riderLogin, driverLogin, loading } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      if (role === 'rider') {
        await riderLogin(email, password)
      } else {
        await driverLogin(email, password)
      }
      setSuccess(`Login successful! Redirecting...`)
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.')
    }
  }

  return (
    <Card className="w-full" padding="p-8">
      <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
      <p className="text-gray-600 mb-6">Sign in to your account</p>

      <div className="mb-6 flex gap-2">
        <Button
          variant={role === 'rider' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setRole('rider')}
          className="flex-1"
        >
          Rider
        </Button>
        <Button
          variant={role === 'driver' ? 'primary' : 'secondary'}
          size="sm"
          onClick={() => setRole('driver')}
          className="flex-1"
        >
          Driver
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Button type="submit" variant="primary" size="full" loading={loading}>
          Sign In
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600 text-sm">
          Don't have an account?{' '}
          <Link to="/signup" className="text-black font-semibold hover:underline">
            Sign up as Rider
          </Link>
        </p>
      </div>

      {error && <Toast message={error} type="error" onClose={() => setError('')} />}
      {success && <Toast message={success} type="success" onClose={() => setSuccess('')} />}
    </Card>
  )
}
