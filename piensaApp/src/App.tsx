import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Layout } from 'antd';
import ParkingPanel from './components/Panels/ParkingPanel';
import Login from './components/AdminLogin/Login';
import AdminStatistics from './components/AdminStatistics/AdminStatistics';
import Register from './components/Register/Register';
import ProtectedRoute from './components/ProtectedRoutes/ProtectedRoutes';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ParkingPanel />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute role="ADMIN" />}>
          <Route path="/admin/statistics" element={<AdminStatistics />} />
        </Route>
      </Routes>
    </Router>
  ); 
}

export default App;