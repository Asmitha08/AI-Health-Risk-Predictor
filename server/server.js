import express from 'express';
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { predictRisk } from './logic.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
const DB_NAME = 'healthPredictor';
const JWT_SECRET = String(process.env.JWT_SECRET || 'super-secret-key');

// Middleware
app.use(cors());
app.use(express.json());

let cachedClient = null;
let cachedDb = null;

async function connectDB() {
  if (cachedDb) return cachedDb;
  
  try {
    const client = await MongoClient.connect(MONGO_URI);
    const db = client.db(DB_NAME);
    cachedClient = client;
    cachedDb = db;
    console.log('✅ Connected to MongoDB');
    return db;
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB:', err.message);
    throw err;
  }
}

// Middleware for JWT verification
const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('[JWT ERROR]', err.message);
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
  }
};

// Ensure DB is connected before handling requests
app.use(async (req, res, next) => {
  try {
    req.db = await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ error: 'Database connection failed' });
  }
});

const router = express.Router();

// --- Auth Routes ---
router.post('/auth/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const db = req.db;

    const hashedPassword = await bcrypt.hash(password, 10);
    const existingUser = await db.collection('users').findOne({ email });
    
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    const result = await db.collection('users').insertOne({ email, password: hashedPassword, name });
    const token = jwt.sign({ userId: result.insertedId, email }, JWT_SECRET, { expiresIn: '7d' });
    
    res.status(201).json({ token, user: { id: result.insertedId, email, name } });
  } catch (err) {
    console.error('[SIGNUP ERROR]', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const db = req.db;

    const user = await db.collection('users').findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ userId: user._id, email }, JWT_SECRET, { expiresIn: '7d' });
    res.status(200).json({ token, user: { id: user._id, email, name: user.name } });
  } catch (err) {
    console.error('[LOGIN ERROR]', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// --- Protected Routes ---
router.post('/predict', authenticate, async (req, res) => {
  try {
    const data = req.body;
    const db = req.db;
    const user = req.user;

    const result = predictRisk(data);
    const prediction = {
      ...data,
      ...result,
      userId: new ObjectId(user.userId),
      timestamp: new Date()
    };
    
    const saved = await db.collection('predictions').insertOne(prediction);
    res.status(200).json({ ...result, id: saved.insertedId });
  } catch (err) {
    console.error('[PREDICT ERROR]', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/history', authenticate, async (req, res) => {
  try {
    const db = req.db;
    const user = req.user;

    const history = await db.collection('predictions')
      .find({ userId: new ObjectId(user.userId) })
      .sort({ timestamp: -1 })
      .limit(20)
      .toArray();
      
    res.status(200).json(history);
  } catch (err) {
    console.error('[HISTORY ERROR]', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Apply router to both base URL and /api (to handle Vercel rewrites gracefully)
app.use('/', router);
app.use('/api', router);

// Catch-all for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Export the app for Vercel
export default app;

// Vercel serverless function configuration to allow Express to parse the body
export const config = {
  api: {
    bodyParser: false,
  },
};

// For local development
const isDirectRun = process.argv[1] && process.argv[1].indexOf('server.js') !== -1;
if (process.env.NODE_ENV !== 'production' && isDirectRun) {
  app.listen(PORT, () => {
    console.log(`🚀 Local Express Server running on port ${PORT}`);
  });
}
