require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { GoogleAIFileManager } = require('@google/generative-ai/server');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/monolith';
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_fallback';

// Connect to MongoDB
mongoose.connect(MONGO_URI).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Failed to connect to MongoDB:', err.message);
  console.log('Please ensure MongoDB is running or provide a valid MONGO_URI in .env');
});

// Define Mongoose Schemas
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  displayName: { type: String },
  accountType: { type: String, enum: ['free', 'paid'], default: 'free' },
  createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model('User', userSchema);

const jobSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  filename: String,
  filepath: String,
  mimetype: String,
  status: { type: String, default: 'uploaded' },
  createdAt: { type: Date, default: Date.now },
  insights: mongoose.Schema.Types.Mixed
});
const Job = mongoose.model('Job', jobSchema);

// Initialize Gemini API clients
const apiKey = process.env.GEMINI_API_KEY || 'dummy_key';
const genAI = new GoogleGenerativeAI(apiKey);
const fileManager = new GoogleAIFileManager(apiKey);

// Middleware
app.use(cors());
app.use(express.json());

// Setup directories
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

async function uploadToGemini(filePath, mimeType) {
  const uploadResult = await fileManager.uploadFile(filePath, {
    mimeType,
    displayName: path.basename(filePath),
  });
  const file = uploadResult.file;
  return file;
}

async function waitForFileActive(name) {
  let file = await fileManager.getFile(name);
  while (file.state === 'PROCESSING') {
    process.stdout.write('.');
    await new Promise((resolve) => setTimeout(resolve, 3000));
    file = await fileManager.getFile(name);
  }
  if (file.state !== 'ACTIVE') {
    throw new Error(`File ${file.name} failed to process`);
  }
  return file;
}

/**
 * Calls Gemini 1.5 Flash with the uploaded video
 */
async function generateInsightsWithGemini(geminiFileUri) {
  if (apiKey === 'dummy_key') {
    throw new Error('No GEMINI_API_KEY provided');
  }

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
    }
  });

  const prompt = `You are an expert marketing AI. Analyze this video (both visuals and audio) and generate a JSON object describing the target audience persona for this video's marketing campaign.

The JSON MUST exactly follow this schema:
{
  "persona": {
    "id": "A unique 6-character hex string (e.g. 4A-8F-92)",
    "title": "Persona Name (e.g. The Urban Tech Professional)",
    "ageBracket": "Age range (e.g. 28 - 35)",
    "incomeLevel": "Income (e.g. $80k - $120k)",
    "motivators": ["3 core motivators as strings"]
  },
  "fit": [
    { "label": "Audience Group 1", "percentage": 85 },
    { "label": "Audience Group 2", "percentage": 60 }
  ],
  "strategy": [
    { "icon": "campaign", "title": "Strategy 1", "description": "Details" },
    { "icon": "architecture", "title": "Strategy 2", "description": "Details" }
  ],
  "recommendations": ["Recommendation 1", "Recommendation 2", "Recommendation 3"]
}`;

  const result = await model.generateContent([
    {
      fileData: {
        mimeType: "video/mp4", // generic mimeType works well enough for API usually
        fileUri: geminiFileUri
      }
    },
    { text: prompt },
  ]);

  let text = result.response.text();
  // Strip markdown formatting if present
  if (text.startsWith('```json')) {
    text = text.substring(7, text.length - 3).trim();
  }
  return JSON.parse(text);
}

function getMockInsights() {
  return {
    persona: {
      id: '4A-8F-92',
      title: 'The Urban Tech Professional',
      ageBracket: '28 - 35',
      incomeLevel: '$80k - $120k',
      motivators: ['Efficiency', 'Status', 'Innovation']
    },
    fit: [
      { label: 'Tech Enthusiasts', percentage: 92 },
      { label: 'Creative Professionals', percentage: 78 }
    ],
    strategy: [
      {
        icon: 'campaign',
        title: 'Launch Q3 Campaign',
        description: 'Focus ad spend on LinkedIn and tech-focused newsletters.'
      },
      {
        icon: 'architecture',
        title: 'Refine Messaging',
        description: "Shift tone towards 'efficiency' over 'innovation' for this segment."
      }
    ],
    recommendations: [
      'Increase mobile layout performance; 65% of this segment browses on mobile.',
      'A/B test dark mode UI elements in ad creatives.',
      'Simplify checkout process to 3 steps max.'
    ]
  };
}

// Auth Middleware
const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized: User not found' });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: Token expired or invalid' });
  }
};

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already in use' });
    
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    
    const displayName = email.split('@')[0];
    const user = new User({ email, passwordHash, displayName });
    await user.save();
    
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user._id, email: user.email, displayName: user.displayName, accountType: user.accountType } });
  } catch (err) {
    res.status(500).json({ error: 'Server error during registration' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });
    
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });
    
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, email: user.email, displayName: user.displayName, accountType: user.accountType } });
  } catch (err) {
    res.status(500).json({ error: 'Server error during login' });
  }
});

app.get('/api/auth/me', requireAuth, (req, res) => {
  res.json({ user: { id: req.user._id, email: req.user.email, displayName: req.user.displayName, accountType: req.user.accountType } });
});

app.post('/api/user/tier', requireAuth, async (req, res) => {
  try {
    const { accountType } = req.body;
    if (!['free', 'paid'].includes(accountType)) {
      return res.status(400).json({ error: 'Invalid account type' });
    }
    req.user.accountType = accountType;
    await req.user.save();
    res.json({ user: { id: req.user._id, email: req.user.email, displayName: req.user.displayName, accountType: req.user.accountType } });
  } catch (err) {
    res.status(500).json({ error: 'Server error updating tier' });
  }
});

app.post('/api/user/update-profile', requireAuth, async (req, res) => {
  try {
    const { email, displayName } = req.body;
    if (!email && !displayName) {
      return res.status(400).json({ error: 'No update data provided' });
    }
    
    if (email && email !== req.user.email) {
      const existing = await User.findOne({ email });
      if (existing) return res.status(400).json({ error: 'Email already in use' });
      req.user.email = email;
    }
    
    if (displayName !== undefined) {
      req.user.displayName = displayName;
    }
    
    await req.user.save();
    res.json({ user: { id: req.user._id, email: req.user.email, displayName: req.user.displayName, accountType: req.user.accountType } });
  } catch (err) {
    res.status(500).json({ error: 'Server error updating profile' });
  }
});

/**
 * POST /api/upload
 */
app.post('/api/upload', requireAuth, upload.single('video'), async (req, res) => {
  if (req.user.accountType === 'free') {
    const jobCount = await Job.countDocuments({ userId: req.user._id });
    if (jobCount >= 3) {
      return res.status(403).json({ error: 'Free tier limit reached (3 uploads). Please upgrade to Pro for unlimited uploads.' });
    }
  }

  if (!req.file) return res.status(400).json({ error: 'No video file provided' });
  if (!req.file.mimetype.startsWith('video/')) {
    return res.status(400).json({ error: 'Invalid file format. Only videos are allowed.' });
  }

  const jobId = 'job_' + Date.now();

  try {
    const newJob = new Job({
      id: jobId,
      userId: req.user._id,
      filename: req.file.filename,
      filepath: req.file.path,
      mimetype: req.file.mimetype,
      status: 'uploaded',
      insights: null
    });
    await newJob.save();
    res.json({ jobId, message: 'Upload successful' });
  } catch (err) {
    console.error('Failed to save job to DB:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

/**
 * POST /api/analyze/:id
 */
app.post('/api/analyze/:id', requireAuth, async (req, res) => {
  const jobId = req.params.id;
  const accountType = req.user.accountType;

  try {
    const job = await Job.findOne({ id: jobId, userId: req.user._id });
    if (!job) return res.status(404).json({ error: 'Job not found or unauthorized' });

    if (job.status === 'processing' || job.status === 'completed') {
      return res.json({ jobId, status: job.status, message: 'Analysis already running or completed' });
    }

    // Fire and forget processing
    job.status = 'processing';
    await job.save();
    res.json({ jobId, status: 'processing', message: 'Analysis started' });

    // Background processing
    (async () => {
      try {
        let insights;
        if (apiKey && apiKey !== 'dummy_key') {
          console.log(`[${jobId}] Uploading file to Gemini API...`);
          const fileInfo = await uploadToGemini(job.filepath, job.mimetype);
          console.log(`[${jobId}] Uploaded as ${fileInfo.name}. Waiting for processing...`);

          const activeFile = await waitForFileActive(fileInfo.name);
          console.log(`\n[${jobId}] File is ACTIVE. Generating insights...`);

          insights = await generateInsightsWithGemini(activeFile.uri);

          // Cleanup file from Gemini API (optional but good practice)
          try {
            await fileManager.deleteFile(activeFile.name);
            console.log(`[${jobId}] Deleted file from Gemini API.`);
          } catch (err) {
            console.error(`[${jobId}] Failed to delete file from Gemini API:`, err);
          }
        } else {
          console.log(`[${jobId}] No GEMINI_API_KEY found. Falling back to mock data...`);
          await new Promise(resolve => setTimeout(resolve, 3000)); // Sim processing
          insights = getMockInsights();
        }

        // Handle tier specific logic (image generation and premium features)
        if (insights && insights.persona) {
          const seed = encodeURIComponent(insights.persona.title || insights.persona.id);
          if (accountType === 'free') {
            insights.strategy = [];
            insights.recommendations = [];
            insights.personaImageUrl = `https://api.dicebear.com/9.x/initials/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffdfbf,ffd5dc`;
            console.log(`[${jobId}] Applied Free tier limits and generated Basic Persona Image URL: ${insights.personaImageUrl}`);
          } else {
            insights.personaImageUrl = `https://api.dicebear.com/9.x/micah/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffdfbf,ffd5dc`;
            console.log(`[${jobId}] Generated High-Fidelity Persona Image URL: ${insights.personaImageUrl}`);
          }
        }

        job.status = 'completed';
        job.insights = insights;
        await job.save();
        console.log(`[${jobId}] Processing complete.`);
      } catch (err) {
        console.error(`[${jobId}] Processing failed:`, err);
        job.status = 'failed';
        await job.save();
      }
    })();
  } catch (err) {
    console.error(`[${jobId}] DB error:`, err);
    res.status(500).json({ error: 'Database error' });
  }
});

/**
 * GET /api/insights/:id
 */
app.get('/api/insights/:id', requireAuth, async (req, res) => {
  const jobId = req.params.id;
  try {
    const job = await Job.findOne({ id: jobId, userId: req.user._id });
    if (!job) return res.status(404).json({ error: 'Job not found or unauthorized' });

    res.json({
      id: job.id,
      status: job.status,
      insights: job.insights
    });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

/**
 * GET /api/archive
 */
app.get('/api/archive', requireAuth, async (req, res) => {
  try {
    const jobs = await Job.find({ status: 'completed', userId: req.user._id })
      .sort({ createdAt: -1 })
      .select('id filename createdAt insights.persona.title');
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
