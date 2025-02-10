import React, { useState, useEffect } from 'react';
import { Layout, Row, Col, Card, Button, Checkbox } from 'antd';
import { CarOutlined, CheckCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import { Space } from '../Types/types';
import { useNavigate } from 'react-router-dom';

const { Header, Content } = Layout;

const ParkingPanel = () => {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [showAvailable, setShowAvailable] = useState(false);
  const [isAdminPanel, setIsAdminPanel] = useState(false);
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('token');

  const fetchSpaces = async () => {
    try {
      const response = await axios.get<Space[]>('http://localhost:3000/stats/spacesall');
      setSpaces(response.data);
    } catch (error) {
      console.error('Error fetching spaces:', error);
    }
  };

  const updateSpaceStatus = async (spaceId: string, occupied: boolean) => {
    try {
      await axios.patch(`http://localhost:3000/stats/spaces/${spaceId}`, { occupied });
      fetchSpaces();
    } catch (error) {
      console.error('Error updating space:', error);
    }
  };

  const handleAdminPanel = () => {
    if (!isAuthenticated) {
      navigate('/login');
      setIsAdminPanel(true);
    } else {
      navigate('/admin/statistics');
    }
  };

  useEffect(() => {
    fetchSpaces();
    const interval = setInterval(fetchSpaces, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredSpaces = showAvailable ? spaces.filter(space => !space.occupied) : spaces;

  return (
    <Layout>
      <Header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '0 20px', 
        background: '#f0f2f5'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h1 style={{ margin: 0, fontWeight: 'bold', color: '#8B0000' }}>ParkWise</h1>
          <span style={{ marginLeft: 10, fontSize: '16px', color: '#555' }}>Panel de disponibilidad</span>
        </div>
        
        <div>
          <Button 
            type="primary" 
            style={{ marginRight: 10 }}
            onClick={() => setShowAvailable(!showAvailable)}
          >
            {showAvailable ? 'Mostrar todos' : 'Espacios disponibles'}
          </Button>
          
          <Button 
            type={isAdminPanel ? 'primary' : 'default'}
            onClick={handleAdminPanel}
          >
            {isAdminPanel || isAuthenticated ? 'Panel del Administrador' : 'Panel Admnistrador'}
          </Button>
        </div>
      </Header>

      <Content style={{ padding: '20px', background: '#fff' }}>
        <div style={{ 
          border: '2px dashed #d9d9d9', 
          padding: '20px', 
          borderRadius: '8px'
        }}>
          <Row gutter={[16, 16]} justify="center">
            {filteredSpaces.map((space) => (
              <Col xs={12} sm={8} md={6} lg={4} key={space.id}>
                <Card
                  style={{
                    textAlign: 'center',
                    background: space.occupied ? '#fff1f0' : '#f6ffed',
                    borderColor: space.occupied ? '#ff4d4f' : '#52c41a',
                  }}
                >
                  {space.occupied ? (
                    <CarOutlined style={{ fontSize: '48px', color: '#8B0000', marginBottom: '10px' }} />
                  ) : (
                    <CheckCircleOutlined style={{ fontSize: '48px', color: '#52c41a', marginBottom: '10px' }} />
                  )}
                  
                  <Checkbox
                    checked={!space.occupied}
                    onChange={(e) => updateSpaceStatus(space.spaceId, !e.target.checked)}
                  >
                    Espacio {space.spaceId}
                  </Checkbox>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </Content>
    </Layout>
  );
};

export default ParkingPanel;