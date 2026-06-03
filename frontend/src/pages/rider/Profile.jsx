import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Card, Button, Input, Avatar, Badge } from '../../components/common'

export default function RiderProfile() {
  const user = useSelector((state) => state.auth.user)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    profilePhoto: user?.photo || '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    // Mock save
    alert('Profile updated successfully!')
    setIsEditing(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-2xl mx-auto p-4 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600">Manage your account settings</p>
        </div>

        {/* Profile Picture */}
        <Card padding="p-6" className="text-center space-y-4">
          <Avatar src={formData.profilePhoto} name={formData.firstName} size="xl" />
          <div>
            <h2 className="text-2xl font-bold">
              {formData.firstName} {formData.lastName}
            </h2>
            <p className="text-gray-600">{formData.email}</p>
            <div className="mt-2">
              <Badge variant="success">Member since 2024</Badge>
            </div>
          </div>
          {!isEditing && (
            <Button variant="secondary" size="full" onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          )}
        </Card>

        {/* Personal Info */}
        <Card padding="p-6" className="space-y-4">
          <h3 className="font-semibold text-lg">Personal Information</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">First Name</label>
              <Input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Last Name</label>
              <Input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Phone</label>
            <Input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>

          {isEditing && (
            <div className="flex gap-3">
              <Button variant="secondary" size="full" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="full" onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          )}
        </Card>

        {/* Preferences */}
        <Card padding="p-6" className="space-y-4">
          <h3 className="font-semibold text-lg">Preferences</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Notifications</span>
              <input type="checkbox" defaultChecked className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Allow Location Sharing</span>
              <input type="checkbox" defaultChecked className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Dark Mode</span>
              <input type="checkbox" className="w-5 h-5" />
            </div>
          </div>
        </Card>

        {/* Payment Methods */}
        <Card padding="p-6" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg">Payment Methods</h3>
            <Button variant="primary" size="sm">
              + Add Card
            </Button>
          </div>
          <div className="p-4 border-2 border-gray-200 rounded-lg bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-2xl">💳</div>
                <div>
                  <div className="font-medium">Visa ending in 4242</div>
                  <div className="text-sm text-gray-600">Expires 12/26</div>
                </div>
              </div>
              <Badge variant="success">Default</Badge>
            </div>
          </div>
        </Card>

        {/* Danger Zone */}
        <Card padding="p-6" className="space-y-4 border-2 border-red-100 bg-red-50">
          <h3 className="font-semibold text-lg text-red-900">Danger Zone</h3>
          <Button variant="danger" size="full">
            Delete Account
          </Button>
        </Card>
      </div>
    </div>
  )
}
