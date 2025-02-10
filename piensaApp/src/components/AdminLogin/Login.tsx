import { Form, Input, Button, Checkbox, Tabs, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { TabPane } = Tabs;

const Login = () => {
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    try {
      const response = await axios.post('http://localhost:3000/auth/login', {
        email: values.username,
        password: values.password,
      });

      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token);
        message.success('Login successful');
        navigate('/admin/statistics'); // Redirige al panel de estadísticas
      }
    } catch (error) {
      message.error('Invalid credentials');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        margin: 0,
        backgroundColor: '#f4f4f4',
      }}
    >
      <div
        style={{
          width: 400,
          padding: 20,
          backgroundColor: '#fff',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          borderRadius: 10,
          textAlign: 'center',
        }}
      >
        <h1 style={{ color: '#8358E8', fontSize: '2rem', marginBottom: 20 }}>
          ParkWise
        </h1>
        <Tabs defaultActiveKey="1" centered>
          <TabPane tab="Login" key="1">
            <Form
              name="login_form"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              style={{ textAlign: 'left' }}
            >
              <Form.Item
                name="username"
                rules={[{ required: true, message: 'Please input your username!' }]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="admin username"
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="password"
                />
              </Form.Item>
              <Form.Item>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Remember me</Checkbox>
                </Form.Item>
                <a style={{ float: 'right', color: '#8358E8' }} href="#forgot-password">
                  Forgot your password?
                </a>
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" block>
                  Sign In
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
          <TabPane tab="Sign Up" key="2">
            <p>Sign up form goes here...</p>
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default Login;