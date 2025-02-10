import  { useEffect, useState } from 'react';
import { Card, Row, Col, Tag } from 'antd';
import { CarOutlined, CheckCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import { Space } from '../Types/types'; // Importa la interfaz

const AdminStatistics = () => {
  const [spaces, setSpaces] = useState<Space[]>([]); // Especifica el tipo

  const fetchSpaces = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get<Space[]>('http://localhost:3000/stats/spacesall', { // Especifica el tipo de respuesta
        headers: { Authorization: `Bearer ${token}` },
      });
      setSpaces(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchSpaces();
    const interval = setInterval(fetchSpaces, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: '24px' }}>
      <h1>Admin Statistics</h1>
      <Row gutter={[16, 16]}>
        {spaces.map((space) => (
          <Col key={space.id} span={8}>
            <Card
              title={`Espacio ${space.spaceId}`}
              style={{ textAlign: 'center' }}
            >
              {space.occupied ? (
                <>
                  <CarOutlined style={{ fontSize: '48px', color: '#8B0000' }} />
                  <Tag color="red" style={{ marginTop: '8px' }}>
                    Ocupado
                  </Tag>
                </>
              ) : (
                <>
                  <CheckCircleOutlined style={{ fontSize: '48px', color: '#52c41a' }} />
                  <Tag color="green" style={{ marginTop: '8px' }}>
                    Disponible
                  </Tag>
                </>
              )}
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default AdminStatistics;