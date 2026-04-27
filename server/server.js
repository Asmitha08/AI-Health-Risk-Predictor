import http from 'http';
import { MongoClient, ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { predictRisk } from './logic.js';

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = 'healthPredictor';
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';

let cachedClient = null;
let cachedDb = null;

async function connectDB() {
  if (cachedDb) return cachedDb;
  
  if (!MONGO_URI) {
    throw new Error('MONGO_URI environment variable is not defined');
  }

  try {
    const client = await MongoClient.connect(MONGO_URI);
    const db = client.db(DB_NAME);
    cachedClient = client;
    cachedDb = db;
    console.log('Connected to MongoDB');
    return db;
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    throw err;
  }
}

// Helper to get JSON from request body
const getJSONBody = (req) => new Promise((resolve, reject) => {
  let body = '';
  req.on('data', chunk => body += chunk.toString());
  req.on('end', () => {
    try { resolve(JSON.parse(body)); }
    catch (err) { reject(err); }
  });
});

// Middleware for JWT verification
const authenticate = (req) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
};

const handler = async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const { url, method } = req;
  const db = await connectDB();

  try {
    // Normalize URL (remove /api prefix if present for Vercel support)
    const normalizedUrl = url.replace(/^\/api/, '');

    // --- Auth Routes ---
    if (normalizedUrl === '/auth/signup' && method === 'POST') {
      const { email, password, name } = await getJSONBody(req);
      const hashedPassword = await bcrypt.hash(password, 10);
      const existingUser = await db.collection('users').findOne({ email });
      if (existingUser) {
        res.writeHead(400);
        return res.end(JSON.stringify({ error: 'User already exists' }));
      }
      const result = await db.collection('users').insertOne({ email, password: hashedPassword, name });
      const token = jwt.sign({ userId: result.insertedId, email }, JWT_SECRET, { expiresIn: '7d' });
      res.writeHead(201);
      return res.end(JSON.stringify({ token, user: { id: result.insertedId, email, name } }));
    }

    if (normalizedUrl === '/auth/login' && method === 'POST') {
      const { email, password } = await getJSONBody(req);
      const user = await db.collection('users').findOne({ email });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        res.writeHead(401);
        return res.end(JSON.stringify({ error: 'Invalid credentials' }));
      }
      const token = jwt.sign({ userId: user._id, email }, JWT_SECRET, { expiresIn: '7d' });
      res.writeHead(200);
      return res.end(JSON.stringify({ token, user: { id: user._id, email, name: user.name } }));
    }

    // --- Protected Routes ---
    const user = authenticate(req);
    if (!user) {
      res.writeHead(401);
      return res.end(JSON.stringify({ error: 'Unauthorized' }));
    }

    if (normalizedUrl === '/predict' && method === 'POST') {
      const data = await getJSONBody(req);
      const result = predictRisk(data);
      const prediction = {
        ...data,
        ...result,
        userId: new ObjectId(user.userId),
        timestamp: new Date()
      };
      const saved = await db.collection('predictions').insertOne(prediction);
      res.writeHead(200);
      return res.end(JSON.stringify({ ...result, id: saved.insertedId }));
    }

    if (normalizedUrl === '/history' && method === 'GET') {
      const history = await db.collection('predictions')
        .find({ userId: new ObjectId(user.userId) })
        .sort({ timestamp: -1 })
        .limit(20)
        .toArray();
      res.writeHead(200);
      return res.end(JSON.stringify(history));
    }

    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Route not found' }));

  } catch (err) {
    console.error(err);
    res.writeHead(500);
    res.end(JSON.stringify({ error: 'Internal Server Error' }));
  }
};

// Export the handler for Vercel
export default handler;

// For local development
if (process.env.NODE_ENV !== 'production' && import.meta.url === `file://${process.argv[1]}`) {
  const server = http.createServer(handler);
  server.listen(PORT, () => {
    console.log(`🚀 Local Server running on port ${PORT}`);
  });
} else if (process.env.NODE_ENV !== 'production') {
  // Fallback for some environments where import.meta.url check is tricky
  const server = http.createServer(handler);
  server.listen(PORT, () => {
    console.log(`🚀 Local Server running on port ${PORT}`);
  });
}

