import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import BiodataForm from './pages/BiodataForm';
import AdminDashboard from './pages/AdminDashboard';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Navigation = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="mb-4">
      <Container>
        {!token && <Navbar.Brand href="/" style={{ color: 'white', fontWeight: 'bold' }}>Biodata Calon Karyawan</Navbar.Brand>}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {token && role === 'USER' && <Nav.Link href="/biodata" style={{ color: 'white', fontWeight: 'bold' }}>Entry Biodata</Nav.Link>}
            {token && role === 'ADMIN' && <Nav.Link href="/admin" style={{ color: 'white', fontWeight: 'bold' }}>Admin Dashboard</Nav.Link>}
          </Nav>
          <Nav>
            {token ? (
              <Button variant="outline-light" onClick={handleLogout}>Logout</Button>
            ) : (
              <>
                <Nav.Link href="/login" style={{ color: 'white', fontWeight: 'bold' }}>Login</Nav.Link>
                <Nav.Link href="/register" style={{ color: 'white', fontWeight: 'bold' }}>Sign Up</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

const ProtectedRoute = ({ children, role }: { children: any, role?: string }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  if (!token) return <Navigate to="/login" />;
  if (role && userRole !== role) return <Navigate to="/" />;

  return children;
};

function App() {
  return (
    <Router>
      <Navigation />
      <Container>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/biodata" 
            element={
              <ProtectedRoute role="USER">
                <BiodataForm />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute role="ADMIN">
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
