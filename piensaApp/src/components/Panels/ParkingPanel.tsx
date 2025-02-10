import  { useEffect, useState } from 'react';
import { Card, Row, Col, Tag } from 'antd';
import { CarOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Space } from '../Types/types'; // Importa la interfaz


const ParkingPanel = () => {
  // Especificar el tipo del estado spaces
  const [spaces, setSpaces] = useState<Space[]>([]); // Especifica el tipo

  // Función para obtener los datos de los espacios desde el backend
  const fetchSpaces = async () => {
    try {
      const response = await fetch('http://localhost:3000/stats/spacesall');
      if (!response.ok) {
        throw new Error('Error al obtener los datos');
      }
      const data: Space[] = await response.json(); // Especificar el tipo de data
      setSpaces(data); // Actualiza el estado con los datos del backend
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Llamar a la función fetchSpaces al cargar el componente y cada 5 segundos
  useEffect(() => {
    fetchSpaces();
    const interval = setInterval(fetchSpaces, 5000); // Actualizar cada 5 segundos
    return () => clearInterval(interval);
  }, []);

  return (
    
    <div style={{ padding: '24px' }}>
      <h1>ParkWise Panel de disponibilidad</h1>
      <Row gutter={[16, 16]}>
        {spaces.map((space) => (
          <Col key={space.id} span={8}>
            <Card
              title={`Espacio ${space.spaceId}`} // Usar spaceId en lugar de id
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

export default ParkingPanel;