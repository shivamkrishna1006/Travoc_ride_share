import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { Button, Input, Card, Toast, Select } from '../../components/common'

export default function DriverSignup() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    vehicleMake: '',
    vehicleModel: '',
    vehicleColor: '',
    licensePlate: '',
    licenseNumber: '',
    bankName: '',
    bankAccount: '',
  })
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState({ type: '', text: '' })
  const { driverSignup, loading } = useAuth()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (step === 1) {
      const newErrors = {}
      if (!formData.firstName) newErrors.firstName = 'Required'
      if (!formData.lastName) newErrors.lastName = 'Required'
      if (!formData.email) newErrors.email = 'Required'
      if (!formData.phone) newErrors.phone = 'Required'
      if (!formData.password) newErrors.password = 'Required'
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match'

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors)
        return
      }
      setStep(2)
    } else if (step === 2) {
      const newErrors = {}
      if (!formData.vehicleMake) newErrors.vehicleMake = 'Required'
      if (!formData.vehicleModel) newErrors.vehicleModel = 'Required'
      if (!formData.vehicleColor) newErrors.vehicleColor = 'Required'
      if (!formData.licensePlate) newErrors.licensePlate = 'Required'

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors)
        return
      }
      setStep(3)
    } else {
      try {
        await driverSignup({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          vehicle: {
            make: formData.vehicleMake,
            model: formData.vehicleModel,
            color: formData.vehicleColor,
            licensePlate: formData.licensePlate,
          },
          bankAccount: formData.bankAccount,
          bankName: formData.bankName,
        })
        setMessage({ type: 'success', text: 'Account created! Under verification. Redirecting...' })
      } catch (err) {
        setMessage({
          type: 'error',
          text: err.response?.data?.message || 'Signup failed.',
        })
      }
    }
  }

  return (
    <Card className="w-full" padding="p-8">
      <h2 className="text-3xl font-bold mb-2">Drive with RideHub</h2>
      <p className="text-gray-600 mb-6">Step {step} of 3</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {step === 1 && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="First Name"
                name="firstName"
                placeholder="John"
                value={formData.firstName}
                onChange={handleChange}
                error={errors.firstName}
              />
              <Input
                label="Last Name"
                name="lastName"
                placeholder="Doe"
                value={formData.lastName}
                onChange={handleChange}
                error={errors.lastName}
              />
            </div>
            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />
            <Input
              label="Phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
            />
            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
            />
            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
            />
          </>
        )}

        {step === 2 && (
          <>
            <Input
              label="Vehicle Make"
              name="vehicleMake"
              placeholder="Toyota"
              value={formData.vehicleMake}
              onChange={handleChange}
              error={errors.vehicleMake}
            />
            <Input
              label="Vehicle Model"
              name="vehicleModel"
              placeholder="Camry"
              value={formData.vehicleModel}
              onChange={handleChange}
              error={errors.vehicleModel}
            />
            <Input
              label="Vehicle Color"
              name="vehicleColor"
              placeholder="Black"
              value={formData.vehicleColor}
              onChange={handleChange}
              error={errors.vehicleColor}
            />
            <Input
              label="License Plate"
              name="licensePlate"
              placeholder="AB123CD"
              value={formData.licensePlate}
              onChange={handleChange}
              error={errors.licensePlate}
            />
          </>
        )}

        {step === 3 && (
          <>
            <Input
              label="Driver License"
              name="licenseNumber"
              placeholder="DL123456"
              value={formData.licenseNumber}
              onChange={handleChange}
            />
            <Input
              label="Bank Name"
              name="bankName"
              placeholder="Bank of America"
              value={formData.bankName}
              onChange={handleChange}
            />
            <Input
              label="Bank Account Number"
              name="bankAccount"
              placeholder="1234567890"
              value={formData.bankAccount}
              onChange={handleChange}
            />
          </>
        )}

        <div className="flex gap-3">
          {step > 1 && (
            <Button
              type="button"
              variant="secondary"
              size="full"
              onClick={() => setStep(step - 1)}
            >
              Back
            </Button>
          )}
          <Button
            type="submit"
            variant="primary"
            size="full"
            loading={loading}
          >
            {step === 3 ? 'Complete Signup' : 'Next'}
          </Button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600 text-sm">
          Riding instead?{' '}
          <Link to="/signup" className="text-black font-semibold hover:underline">
            Sign up as Rider
          </Link>
        </p>
      </div>

      {message.text && (
        <Toast
          message={message.text}
          type={message.type}
          onClose={() => setMessage({ type: '', text: '' })}
        />
      )}
    </Card>
  )
}
