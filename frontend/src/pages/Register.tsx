import { useState } from 'react';
import { Form, Button, Card, Alert, Container } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/api/auth/register', { email, password });
      setSuccess('Registrasi berhasil! Silakan login.');
      setError('');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
      setSuccess('');
    }
  };

  return (
    <div className="auth-bg d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Container className="animate-fade-in" style={{ maxWidth: '450px' }}>
        <Card className="auth-card border-0">
          <Card.Body>
            <h3 className="text-center mb-4" style={{ color: 'var(--primary-navy)' }}>Pendaftaran Portal</h3>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <Form onSubmit={handleRegister}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </Form.Group>
            <Form.Group className="mb-4">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100 mb-3">
              Daftar Sekarang
            </Button>
            <div className="text-center">
              Sudah punya akun? <a href="/login">Login</a>
            </div>
          </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}
