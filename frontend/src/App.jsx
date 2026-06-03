import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store/store'
import { MainLayout, AuthLayout } from './components/layout'
import { ProtectedRoute, RoleRoute } from './middleware/RouteGuards'

// Pages (lazy loaded later)
import Landing from './pages/public/Landing'
import Login from './pages/public/Login'
import Signup from './pages/public/Signup'
import DriverSignup from './pages/public/DriverSignup'
import NotFound from './pages/public/NotFound'

// Rider pages
import RiderDashboard from './pages/rider/Dashboard'
import SearchRide from './pages/rider/SearchRide'
import RideTracking from './pages/rider/RideTracking'
import RideHistory from './pages/rider/RideHistory'
import RiderProfile from './pages/rider/Profile'

// Driver pages
import DriverDashboard from './pages/driver/Dashboard'
import ActiveRide from './pages/driver/ActiveRide'
import DriverHistory from './pages/driver/RideHistory'
import DriverEarnings from './pages/driver/Earnings'
import DriverProfile from './pages/driver/Profile'

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/driver-signup" element={<DriverSignup />} />
          </Route>

          {/* Protected Routes */}
          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            {/* Rider Routes */}
            <Route
              path="/rider/dashboard"
              element={
                <RoleRoute role="rider">
                  <RiderDashboard />
                </RoleRoute>
              }
            />
            <Route
              path="/rider/search"
              element={
                <RoleRoute role="rider">
                  <SearchRide />
                </RoleRoute>
              }
            />
            <Route
              path="/rider/tracking/:rideId"
              element={
                <RoleRoute role="rider">
                  <RideTracking />
                </RoleRoute>
              }
            />
            <Route
              path="/rider/history"
              element={
                <RoleRoute role="rider">
                  <RideHistory />
                </RoleRoute>
              }
            />
            <Route
              path="/rider/profile"
              element={
                <RoleRoute role="rider">
                  <RiderProfile />
                </RoleRoute>
              }
            />

            {/* Driver Routes */}
            <Route
              path="/driver/dashboard"
              element={
                <RoleRoute role="driver">
                  <DriverDashboard />
                </RoleRoute>
              }
            />
            <Route
              path="/driver/active/:rideId"
              element={
                <RoleRoute role="driver">
                  <ActiveRide />
                </RoleRoute>
              }
            />
            <Route
              path="/driver/history"
              element={
                <RoleRoute role="driver">
                  <DriverHistory />
                </RoleRoute>
              }
            />
            <Route
              path="/driver/earnings"
              element={
                <RoleRoute role="driver">
                  <DriverEarnings />
                </RoleRoute>
              }
            />
            <Route
              path="/driver/profile"
              element={
                <RoleRoute role="driver">
                  <DriverProfile />
                </RoleRoute>
              }
            />
          </Route>

          <Route path="/not-authorized" element={<NotFound message="Access Denied" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  )
}

export default App
