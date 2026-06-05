import { useState, useEffect } from 'react';
import { Form, Button, Card, Row, Col, Table, Alert } from 'react-bootstrap';
import axios from 'axios';

interface BiodataFormProps {
  adminViewId?: number;
  onClose?: (msg?: string) => void;
}

export default function BiodataForm({ adminViewId, onClose }: BiodataFormProps) {
  const [formData, setFormData] = useState<any>({
    posisiYangDilamar: '', nama: '', noKtp: '', tempatLahir: '', tanggalLahir: '',
    jenisKelamin: '', agama: '', golonganDarah: '', status: '', alamatKtp: '',
    alamatTinggal: '', email: '', noTelp: '', orangTerdekat: '', skill: '',
    bersediaDitempatkan: false, penghasilanDiharapkan: '',
    pendidikan: [], pelatihan: [], pekerjaan: []
  });
  const [message, setMessage] = useState('');

  const fetchBiodata = async () => {
    try {
      const token = localStorage.getItem('token');
      const url = adminViewId 
        ? `http://localhost:3001/api/admin/biodata/${adminViewId}` 
        : 'http://localhost:3001/api/biodata/me';
        
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data) setFormData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBiodata();
  }, []);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleDynamicChange = (index: number, field: string, value: any, type: 'pendidikan' | 'pelatihan' | 'pekerjaan') => {
    const newArray = [...formData[type]];
    let parsedValue = value;
    if (field === 'sertifikat') {
      parsedValue = value === 'true';
    }
    newArray[index] = { ...newArray[index], [field]: parsedValue };
    setFormData({ ...formData, [type]: newArray });
  };

  const addRow = (type: 'pendidikan' | 'pelatihan' | 'pekerjaan', emptyObj: any) => {
    setFormData({ ...formData, [type]: [...formData[type], emptyObj] });
  };

  const removeRow = (index: number, type: 'pendidikan' | 'pelatihan' | 'pekerjaan') => {
    const newArray = [...formData[type]];
    newArray.splice(index, 1);
    setFormData({ ...formData, [type]: newArray });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      if (adminViewId) {
        await axios.put(`http://localhost:3001/api/admin/biodata/${adminViewId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (onClose) onClose('Data pelamar berhasil diperbarui!');
        return;
      } else {
        await axios.post('http://localhost:3001/api/biodata', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      
      setMessage('Data berhasil disimpan!');
      setTimeout(() => {
        setMessage('');
        if (onClose) onClose();
      }, 2000);
    } catch (err) {
      console.error(err);
      setMessage('Gagal menyimpan data.');
    }
  };

  return (
    <Card className="shadow-lg border-0 mb-5 animate-fade-in" style={{ borderRadius: '16px' }}>
      <Card.Body className="p-4 p-md-5">
        {!adminViewId && <h2 className="text-center mb-5" style={{ color: 'var(--primary-navy)', fontWeight: 700 }}>DATA PRIBADI PELAMAR</h2>}
        {message && <Alert variant={message.includes('berhasil') ? 'success' : 'danger'}>{message}</Alert>}
        
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Form.Group as={Col} md="6">
              <Form.Label>Posisi Yang Dilamar</Form.Label>
              <Form.Control name="posisiYangDilamar" value={formData.posisiYangDilamar || ''} onChange={handleChange} />
            </Form.Group>
            <Form.Group as={Col} md="6">
              <Form.Label>Nama</Form.Label>
              <Form.Control name="nama" value={formData.nama || ''} onChange={handleChange} required />
            </Form.Group>
          </Row>
          
          <Row className="mb-3">
            <Form.Group as={Col} md="4">
              <Form.Label>No. KTP</Form.Label>
              <Form.Control name="noKtp" value={formData.noKtp || ''} onChange={handleChange} />
            </Form.Group>
            <Form.Group as={Col} md="4">
              <Form.Label>Tempat Lahir</Form.Label>
              <Form.Control name="tempatLahir" value={formData.tempatLahir || ''} onChange={handleChange} />
            </Form.Group>
            <Form.Group as={Col} md="4">
              <Form.Label>Tanggal Lahir</Form.Label>
              <Form.Control type="date" name="tanggalLahir" value={formData.tanggalLahir || ''} onChange={handleChange} />
            </Form.Group>
          </Row>
          
          <Row className="mb-3">
            <Form.Group as={Col} md="4">
              <Form.Label>Jenis Kelamin</Form.Label>
              <Form.Select name="jenisKelamin" value={formData.jenisKelamin || ''} onChange={handleChange}>
                <option value="">Pilih...</option>
                <option value="LAKI-LAKI">LAKI-LAKI</option>
                <option value="PEREMPUAN">PEREMPUAN</option>
              </Form.Select>
            </Form.Group>
            <Form.Group as={Col} md="4">
              <Form.Label>Agama</Form.Label>
              <Form.Control name="agama" value={formData.agama || ''} onChange={handleChange} />
            </Form.Group>
            <Form.Group as={Col} md="4">
              <Form.Label>Golongan Darah</Form.Label>
              <Form.Control name="golonganDarah" value={formData.golonganDarah || ''} onChange={handleChange} />
            </Form.Group>
          </Row>

          <Row className="mb-3">
             <Form.Group as={Col} md="12">
              <Form.Label>Status</Form.Label>
              <Form.Control name="status" value={formData.status || ''} onChange={handleChange} />
            </Form.Group>
          </Row>
          
          <Form.Group className="mb-3">
            <Form.Label>Alamat KTP</Form.Label>
            <Form.Control as="textarea" rows={2} name="alamatKtp" value={formData.alamatKtp || ''} onChange={handleChange} />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Alamat Tinggal</Form.Label>
            <Form.Control as="textarea" rows={2} name="alamatTinggal" value={formData.alamatTinggal || ''} onChange={handleChange} />
          </Form.Group>
          
          <Row className="mb-4">
            <Form.Group as={Col} md="4">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" value={formData.email || ''} onChange={handleChange} />
            </Form.Group>
            <Form.Group as={Col} md="4">
              <Form.Label>No. Telp</Form.Label>
              <Form.Control name="noTelp" value={formData.noTelp || ''} onChange={handleChange} />
            </Form.Group>
            <Form.Group as={Col} md="4">
              <Form.Label>Orang Terdekat yg dapat dihubungi</Form.Label>
              <Form.Control name="orangTerdekat" value={formData.orangTerdekat || ''} onChange={handleChange} />
            </Form.Group>
          </Row>

          <hr />
          <h5>PENDIDIKAN TERAKHIR</h5>
          <Table bordered hover responsive size="sm">
            <thead>
              <tr className="bg-light">
                <th>Jenjang</th><th>Nama Institusi</th><th>Jurusan</th><th>Tahun Masuk</th><th>Tahun Lulus</th><th>IPK</th><th></th>
              </tr>
            </thead>
            <tbody>
              {formData.pendidikan?.map((item: any, idx: number) => (
                <tr key={idx}>
                  <td><Form.Control value={item.jenjang || ''} onChange={(e) => handleDynamicChange(idx, 'jenjang', e.target.value, 'pendidikan')} /></td>
                  <td><Form.Control value={item.namaInstitusi || ''} onChange={(e) => handleDynamicChange(idx, 'namaInstitusi', e.target.value, 'pendidikan')} /></td>
                  <td><Form.Control value={item.jurusan || ''} onChange={(e) => handleDynamicChange(idx, 'jurusan', e.target.value, 'pendidikan')} /></td>
                  <td><Form.Control value={item.tahunMasuk || ''} onChange={(e) => handleDynamicChange(idx, 'tahunMasuk', e.target.value, 'pendidikan')} /></td>
                  <td><Form.Control value={item.tahunLulus || ''} onChange={(e) => handleDynamicChange(idx, 'tahunLulus', e.target.value, 'pendidikan')} /></td>
                  <td><Form.Control value={item.ipk || ''} onChange={(e) => handleDynamicChange(idx, 'ipk', e.target.value, 'pendidikan')} /></td>
                  <td><Button variant="danger" size="sm" onClick={() => removeRow(idx, 'pendidikan')}>X</Button></td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Button variant="outline-primary" size="sm" onClick={() => addRow('pendidikan', { jenjang: '', namaInstitusi: '', jurusan: '', tahunMasuk: '', tahunLulus: '', ipk: '' })}>+ Tambah Pendidikan</Button>
          
          <hr className="mt-4" />
          <h5>RIWAYAT PELATIHAN</h5>
          <Table bordered hover responsive size="sm">
            <thead>
              <tr className="bg-light">
                <th>Nama Kursus / Seminar</th><th>Penyelenggara</th><th>Sertifikat (Ada/Tidak)</th><th>Tahun</th><th></th>
              </tr>
            </thead>
            <tbody>
              {formData.pelatihan?.map((item: any, idx: number) => (
                <tr key={idx}>
                  <td><Form.Control value={item.namaKursus || ''} onChange={(e) => handleDynamicChange(idx, 'namaKursus', e.target.value, 'pelatihan')} /></td>
                  <td><Form.Control value={item.penyelenggara || ''} onChange={(e) => handleDynamicChange(idx, 'penyelenggara', e.target.value, 'pelatihan')} /></td>
                  <td>
                    <Form.Select value={item.sertifikat ? 'true' : 'false'} onChange={(e) => handleDynamicChange(idx, 'sertifikat', e.target.value, 'pelatihan')}>
                      <option value="false">Tidak</option>
                      <option value="true">Ada</option>
                    </Form.Select>
                  </td>
                  <td><Form.Control value={item.tahun || ''} onChange={(e) => handleDynamicChange(idx, 'tahun', e.target.value, 'pelatihan')} /></td>
                  <td><Button variant="danger" size="sm" onClick={() => removeRow(idx, 'pelatihan')}>X</Button></td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Button variant="outline-primary" size="sm" onClick={() => addRow('pelatihan', { namaKursus: '', penyelenggara: '', sertifikat: false, tahun: '' })}>+ Tambah Pelatihan</Button>

          <hr className="mt-4" />
          <h5>RIWAYAT PEKERJAAN</h5>
          <Table bordered hover responsive size="sm">
            <thead>
              <tr className="bg-light">
                <th>Nama Perusahaan</th><th>Posisi</th><th>Gaji</th><th>Tahun Masuk</th><th>Tahun Keluar</th><th>Alasan Keluar</th><th></th>
              </tr>
            </thead>
            <tbody>
              {formData.pekerjaan?.map((item: any, idx: number) => (
                <tr key={idx}>
                  <td><Form.Control value={item.namaPerusahaan || ''} onChange={(e) => handleDynamicChange(idx, 'namaPerusahaan', e.target.value, 'pekerjaan')} /></td>
                  <td><Form.Control value={item.posisi || ''} onChange={(e) => handleDynamicChange(idx, 'posisi', e.target.value, 'pekerjaan')} /></td>
                  <td><Form.Control value={item.gaji || ''} onChange={(e) => handleDynamicChange(idx, 'gaji', e.target.value, 'pekerjaan')} /></td>
                  <td><Form.Control value={item.tahunMasuk || ''} onChange={(e) => handleDynamicChange(idx, 'tahunMasuk', e.target.value, 'pekerjaan')} /></td>
                  <td><Form.Control value={item.tahunKeluar || ''} onChange={(e) => handleDynamicChange(idx, 'tahunKeluar', e.target.value, 'pekerjaan')} /></td>
                  <td><Form.Control value={item.alasanKeluar || ''} onChange={(e) => handleDynamicChange(idx, 'alasanKeluar', e.target.value, 'pekerjaan')} /></td>
                  <td><Button variant="danger" size="sm" onClick={() => removeRow(idx, 'pekerjaan')}>X</Button></td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Button variant="outline-primary" size="sm" onClick={() => addRow('pekerjaan', { namaPerusahaan: '', posisi: '', gaji: '', tahunMasuk: '', tahunKeluar: '', alasanKeluar: '' })}>+ Tambah Pekerjaan</Button>

          <hr className="mt-4" />
          <Form.Group className="mb-3">
            <Form.Label>Skill (Tuliskan keahlian & keterampilan yang saat ini anda miliki)</Form.Label>
            <Form.Control as="textarea" rows={3} name="skill" value={formData.skill || ''} onChange={handleChange} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Check 
              type="checkbox" 
              name="bersediaDitempatkan" 
              label="Bersedia ditempatkan di seluruh kantor perusahaan" 
              checked={formData.bersediaDitempatkan || false} 
              onChange={handleChange} 
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Penghasilan Yang Diharapkan / Bulan</Form.Label>
            <Form.Control type="text" name="penghasilanDiharapkan" value={formData.penghasilanDiharapkan || ''} onChange={handleChange} />
          </Form.Group>

          <Button variant="primary" type="submit" size="lg" className="w-100 mt-4 shadow-sm" style={{ padding: '1rem' }}>
            Simpan Biodata
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}
