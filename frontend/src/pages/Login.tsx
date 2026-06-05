import { useState } from 'react';
import { Form, Button, Card, Alert, Container } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3001/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      
      if (res.data.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/biodata');
      }
      window.location.reload(); // Quick way to update navbar state
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="auth-bg d-flex align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
      <Container className="animate-fade-in" style={{ maxWidth: '450px' }}>
        <Card className="auth-card border-0">
          <Card.Body>
            <h2 className="text-center mb-4" style={{ color: 'var(--primary-navy)' }}>Masuk Portal</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleLogin}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </Form.Group>
              <Button variant="primary" type="submit" className="w-100 mb-3">
                Login
              </Button>
              <div className="text-center">
                Belum punya akun? <a href="/register">Sign Up</a>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}
