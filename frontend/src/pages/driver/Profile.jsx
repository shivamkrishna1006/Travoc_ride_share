import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Card, Button, Input, Avatar, Badge } from '../../components/common'

export default function DriverProfile() {
  const driver = useSelector((state) => state.auth.driver)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: driver?.firstName || '',
    lastName: driver?.lastName || '',
    email: driver?.email || '',
    phone: driver?.phone || '',
    profilePhoto: driver?.photo || '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    alert('Profile updated successfully!')
    setIsEditing(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pb-20">
      <div className="max-w-2xl mx-auto p-4 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Driver Profile</h1>
          <p className="text-gray-600">Manage your account and vehicle information</p>
        </div>

        {/* Profile Picture */}
        <Card padding="p-6" className="text-center space-y-4">
          <Avatar src={formData.profilePhoto} name={formData.firstName} size="xl" />
          <div>
            <h2 className="text-2xl font-bold">
              {formData.firstName} {formData.lastName}
            </h2>
            <p className="text-gray-600">{formData.email}</p>
            <div className="mt-3 flex justify-center gap-2">
              <Badge variant="success">⭐ 4.8</Badge>
              <Badge variant="info">1250 trips</Badge>
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

        {/* Vehicle Information */}
        <Card padding="p-6" className="space-y-4">
          <h3 className="font-semibold text-lg">Vehicle Information</h3>
          <div className="space-y-2">
            <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Make & Model</span>
              <span className="font-medium">Honda Civic 2022</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">License Plate</span>
              <span className="font-medium">ABC-1234</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Color</span>
              <span className="font-medium">Black</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-600">Capacity</span>
              <span className="font-medium">4 passengers</span>
            </div>
          </div>
          <Button variant="secondary" size="full">
            Update Vehicle Info
          </Button>
        </Card>

        {/* Documents Status */}
        <Card padding="p-6" className="space-y-4">
          <h3 className="font-semibold text-lg">Verification Documents</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
              <span className="font-medium">Driver's License</span>
              <Badge variant="success">✓ Verified</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
              <span className="font-medium">Vehicle Registration</span>
              <Badge variant="success">✓ Verified</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
              <span className="font-medium">Insurance Certificate</span>
              <Badge variant="success">✓ Verified</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
              <span className="font-medium">Pollution Certificate</span>
              <Badge variant="success">✓ Verified</Badge>
            </div>
          </div>
        </Card>

        {/* Bank Account */}
        <Card padding="p-6" className="space-y-4">
          <h3 className="font-semibold text-lg">Payout Bank Account</h3>
          <div className="p-4 border-2 border-gray-200 rounded-lg bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-2xl">🏦</div>
                <div>
                  <div className="font-medium">Chase Bank</div>
                  <div className="text-sm text-gray-600">Checking ****1234</div>
                </div>
              </div>
              <Badge variant="success">Default</Badge>
            </div>
          </div>
          <Button variant="secondary" size="full">
            Update Bank Account
          </Button>
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
              <span className="font-medium">Allow Music Requests</span>
              <input type="checkbox" defaultChecked className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Hide Contact Details</span>
              <input type="checkbox" className="w-5 h-5" />
            </div>
          </div>
        </Card>

        {/* Danger Zone */}
        <Card padding="p-6" className="space-y-4 border-2 border-red-100 bg-red-50">
          <h3 className="font-semibold text-lg text-red-900">Danger Zone</h3>
          <Button variant="danger" size="full">
            Deactivate Account
          </Button>
        </Card>
      </div>
    </div>
  )
}
