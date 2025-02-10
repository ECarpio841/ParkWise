import { Form, Input, Button, message } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    try {
      const response = await axios.post('http://localhost:3000/auth/register', {
        email: values.email,
        password: values.password
      });
  
      if (response.status === 201) {
        message.success('Registro exitoso!');
        navigate('/login');
      }
    } catch (error) {
      const axiosError = error as AxiosError; // Tipar el error como AxiosError
  
      if (axiosError.response?.data) {
        const errorData = axiosError.response.data as { message: string };
        message.error(errorData.message || 'Error al registrar el usuario');
      } else {
        message.error('Error de conexión con el servidor');
      }
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      backgroundColor: '#f4f4f4'
    }}>
      <div style={{ 
        width: 400, 
        padding: 20, 
        backgroundColor: 'white', 
        borderRadius: 8, 
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ textAlign: 'center', color: '#8358E8' }}>Admin Registration</h1>
        <Form onFinish={onFinish}>
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Username" />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Invalid email format' }
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Register
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Register;