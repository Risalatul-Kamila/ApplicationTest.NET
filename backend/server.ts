import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey123';

app.use(cors());
app.use(express.json());

// --- SWAGGER CONFIG ---
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Biodata API',
      version: '1.0.0',
      description: 'API Documentation untuk Aplikasi Biodata Calon Karyawan'
    },
    servers: [{ url: `http://localhost:${PORT}` }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        }
      }
    },
    security: [{ bearerAuth: [] }]
  },
  apis: ['./server.ts'] // We will document directly in this file
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => {
  res.send('Backend API Biodata berjalan dengan baik. Silakan buka Frontend React Anda (biasanya di http://localhost:5173). Atau buka /api-docs untuk dokumentasi API.');
});


// Middleware to verify JWT
const authenticate = (req: any, res: any, next: any) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Access denied' });
  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ error: 'Invalid token' });
  }
};

const isAdmin = (req: any, res: any, next: any) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// --- AUTH ROUTES ---
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrasi user baru
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       201:
 *         description: Berhasil
 */
app.post('/api/auth/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ error: 'Email already exists' });
    
    // First user is automatically ADMIN for testing purposes
    const isFirstUser = await prisma.user.count() === 0;
    const role = isFirstUser ? 'ADMIN' : 'USER';
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, role },
    });
    
    // Create empty biodata entry for user
    await prisma.biodata.create({ data: { userId: user.id } });
    
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Berhasil
 */
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: 'Invalid email or password' });
    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Invalid email or password' });
    
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, role: user.role });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// --- BIODATA ROUTES (CANDIDATE) ---
/**
 * @swagger
 * /api/biodata/me:
 *   get:
 *     summary: Ambil biodata user yang sedang login
 *     responses:
 *       200:
 *         description: Berhasil
 */
app.get('/api/biodata/me', authenticate, async (req: any, res) => {
  try {
    const biodata = await prisma.biodata.findUnique({
      where: { userId: req.user.id },
      include: {
        pendidikan: true,
        pelatihan: true,
        pekerjaan: true,
      }
    });
    res.json(biodata);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch biodata' });
  }
});

app.post('/api/biodata', authenticate, async (req: any, res) => {
  // Alias to PUT or handle initial submission if it doesn't exist
  // Since we create an empty biodata on register, we can just treat POST as an update to their own data
  const data = req.body;
  try {
    const { pendidikan, pelatihan, pekerjaan, id, userId, user, createdAt, updatedAt, ...biodataFields } = data;
    
    const updated = await prisma.biodata.update({
      where: { userId: req.user.id },
      data: {
        ...biodataFields,
        pendidikan: {
          deleteMany: {},
          create: pendidikan ? pendidikan.map(({ id, biodataId, ...rest }: any) => rest) : []
        },
        pelatihan: {
          deleteMany: {},
          create: pelatihan ? pelatihan.map(({ id, biodataId, ...rest }: any) => rest) : []
        },
        pekerjaan: {
          deleteMany: {},
          create: pekerjaan ? pekerjaan.map(({ id, biodataId, ...rest }: any) => rest) : []
        }
      },
      include: { pendidikan: true, pelatihan: true, pekerjaan: true }
    });
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create/update biodata' });
  }
});

app.put('/api/biodata/:id', authenticate, async (req: any, res) => {
  const data = req.body;
  try {
    const { pendidikan, pelatihan, pekerjaan, id, userId, user, createdAt, updatedAt, ...biodataFields } = data;
    
    // Ensure user can only update their own biodata unless admin
    const currentBiodata = await prisma.biodata.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!currentBiodata || (currentBiodata.userId !== req.user.id && req.user.role !== 'ADMIN')) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const updated = await prisma.biodata.update({
      where: { id: parseInt(req.params.id) },
      data: {
        ...biodataFields,
        pendidikan: {
          deleteMany: {},
          create: pendidikan ? pendidikan.map(({ id, biodataId, ...rest }: any) => rest) : []
        },
        pelatihan: {
          deleteMany: {},
          create: pelatihan ? pelatihan.map(({ id, biodataId, ...rest }: any) => rest) : []
        },
        pekerjaan: {
          deleteMany: {},
          create: pekerjaan ? pekerjaan.map(({ id, biodataId, ...rest }: any) => rest) : []
        }
      },
      include: { pendidikan: true, pelatihan: true, pekerjaan: true }
    });
    
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update biodata' });
  }
});

// --- ADMIN ROUTES ---
/**
 * @swagger
 * /api/admin/biodata:
 *   get:
 *     summary: Ambil semua biodata (khusus admin)
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Cari berdasarkan Nama, Posisi, atau Pendidikan
 *     responses:
 *       200:
 *         description: Berhasil
 */
app.get('/api/admin/biodata', authenticate, isAdmin, async (req, res) => {
  const { search } = req.query;
  try {
    let whereClause = {};
    if (search) {
      const searchStr = String(search);
      whereClause = {
        OR: [
          { nama: { contains: searchStr } },
          { posisiYangDilamar: { contains: searchStr } },
          {
            pendidikan: {
              some: {
                jenjang: { contains: searchStr }
              }
            }
          }
        ]
      };
    }
    
    const allBiodata = await prisma.biodata.findMany({
      where: {
        ...whereClause,
        user: { role: 'USER' }
      },
      include: { pendidikan: true, pelatihan: true, pekerjaan: true, user: { select: { email: true, role: true } } }
    });
    res.json(allBiodata);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch all biodata' });
  }
});

app.get('/api/admin/biodata/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const biodata = await prisma.biodata.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { pendidikan: true, pelatihan: true, pekerjaan: true }
    });
    if (!biodata) return res.status(404).json({ error: 'Not found' });
    res.json(biodata);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch biodata' });
  }
});

app.put('/api/admin/biodata/:id', authenticate, isAdmin, async (req, res) => {
  const data = req.body;
  try {
    const { pendidikan, pelatihan, pekerjaan, id, userId, user, ...biodataFields } = data;
    
    const updated = await prisma.biodata.update({
      where: { id: parseInt(req.params.id) },
      data: {
        ...biodataFields,
        pendidikan: {
          deleteMany: {},
          create: pendidikan ? pendidikan.map(({ id, biodataId, ...rest }: any) => rest) : []
        },
        pelatihan: {
          deleteMany: {},
          create: pelatihan ? pelatihan.map(({ id, biodataId, ...rest }: any) => rest) : []
        },
        pekerjaan: {
          deleteMany: {},
          create: pekerjaan ? pekerjaan.map(({ id, biodataId, ...rest }: any) => rest) : []
        }
      }
    });
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update biodata' });
  }
});

app.delete('/api/admin/biodata/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const biodata = await prisma.biodata.findUnique({ where: { id: parseInt(req.params.id) } });
    if (biodata) {
      await prisma.user.delete({ where: { id: biodata.userId } }); // Cascade delete
    }
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete biodata' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend API running on http://localhost:${PORT}`);
});
