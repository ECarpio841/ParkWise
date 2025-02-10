import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Layout } from 'antd';
import ParkingPanel from './components/Panels/ParkingPanel';
import Login from './components/AdminLogin/Login';
import AdminStatistics from './components/AdminStatistics/AdminStatistics';

const { Content } = Layout;

const App = () => {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Content style={{ padding: '24px' }}>
          <Routes>
            <Route path="/" element={<ParkingPanel />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/admin/statistics"
              element={isAuthenticated ? <AdminStatistics /> : <Navigate to="/login" />}
            />
          </Routes>
        </Content>
      </Layout>
    </Router>
  );
};

export default App;