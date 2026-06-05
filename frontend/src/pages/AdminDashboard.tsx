import { useState, useEffect } from 'react';
import { Table, Button, Form, Modal, Card, InputGroup, Alert } from 'react-bootstrap';
import axios from 'axios';
import BiodataForm from './BiodataForm';

export default function AdminDashboard() {
  const [biodataList, setBiodataList] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedBiodata, setSelectedBiodata] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');

  const fetchBiodata = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:3001/api/admin/biodata?search=${search}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBiodataList(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBiodata();
  }, [search]);

  const handleDelete = async (id: number) => {
    if (window.confirm('Hapus data ini?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:3001/api/admin/biodata/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchBiodata();
        setAlertMsg('Data pelamar berhasil dihapus!');
        setTimeout(() => setAlertMsg(''), 3000);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleView = (biodata: any) => {
    setSelectedBiodata(biodata);
    setShowModal(true);
  };

  return (
    <Card className="shadow-lg border-0 mb-5 animate-fade-in" style={{ borderRadius: '16px' }}>
      <Card.Body className="p-4 p-md-5">
        <h2 className="mb-4" style={{ color: 'var(--primary-navy)', fontWeight: 700 }}>Admin Dashboard</h2>
        
        {alertMsg && <Alert variant="success" className="mb-4">{alertMsg}</Alert>}
        
        <InputGroup className="mb-4 shadow-sm" style={{ borderRadius: '8px', overflow: 'hidden' }}>
          <InputGroup.Text className="bg-white border-end-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search text-muted" viewBox="0 0 16 16">
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
            </svg>
          </InputGroup.Text>
          <Form.Control
            className="border-start-0 ps-0"
            style={{ boxShadow: 'none' }}
            placeholder="Cari berdasarkan Nama, Posisi dilamar, atau Tingkat Pendidikan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </InputGroup>

        <Table striped hover responsive className="align-middle">
          <thead style={{ backgroundColor: 'var(--primary-navy)', color: 'white' }}>
            <tr>
              <th>Nama</th>
              <th>Tempat & Tanggal Lahir</th>
              <th>Posisi Dilamar</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {biodataList.map((item: any) => (
              <tr key={item.id}>
                <td>{item.nama || '-'}</td>
                <td>{item.tempatLahir ? `${item.tempatLahir}, ` : ''}{item.tanggalLahir || '-'}</td>
                <td>{item.posisiYangDilamar || '-'}</td>
                <td>
                  <Button variant="info" size="sm" className="me-2 text-white" onClick={() => handleView(item)}>Edit</Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(item.id)}>Hapus</Button>
                </td>
              </tr>
            ))}
            {biodataList.length === 0 && (
              <tr><td colSpan={4} className="text-center">Tidak ada data ditemukan.</td></tr>
            )}
          </tbody>
        </Table>

        <Modal show={showModal} onHide={() => setShowModal(false)} size="xl" contentClassName="border-0 shadow-lg">
          <Modal.Header closeButton className="bg-primary text-white" style={{ backgroundColor: 'var(--primary-navy) !important' }}>
            <Modal.Title>Edit Biodata Pelamar</Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-0 bg-light">
            {selectedBiodata && (
              <BiodataForm 
                adminViewId={selectedBiodata.id} 
                onClose={(msg: string) => {
                  setShowModal(false);
                  fetchBiodata();
                  if (msg) {
                    setAlertMsg(msg);
                    setTimeout(() => setAlertMsg(''), 3000);
                  }
                }} 
              />
            )}
          </Modal.Body>
        </Modal>

      </Card.Body>
    </Card>
  );
}
