import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './pages/Auth/Login'
import ProtectedRoute from './components/layouts/ProtectedRoute'
import ProtectedLayout from './components/layouts/ProtectedLayout'
import Register from './pages/Auth/Register'
import Dashboard from './pages/Dashboard'

function App() {

  return (
    <>
      <Routes>
        {/* Public Routes  */}
        <Route path='/auth/login' element={<Login />} />
        <Route path='/auth/register' element={<Register />} />

        {/* Private Routes  */}
        <Route element={<ProtectedRoute />} >
          <Route element={<ProtectedLayout />} >
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        </Route>

        {/* Default Redirect */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>

    </>
  )
}

export default App
