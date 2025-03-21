const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// Configure CORS to allow requests from your domain
app.use(cors({
  origin: 'https://jaiminpatel.vercel.app',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

// Set up multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // Limit file size to 10MB
  }
});

// Load service account credentials
const serviceAccountKeyPath = path.join(__dirname, 'service-account-key.json');
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountKeyPath, 'utf8'));

// Configure JWT client with service account
const jwtClient = new google.auth.JWT(
  serviceAccount.client_email,
  null,
  serviceAccount.private_key,
  ['https://www.googleapis.com/auth/drive']
);

// Create Drive client
const drive = google.drive({ version: 'v3', auth: jwtClient });

// API endpoint for file uploads
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    // Check if file exists
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    const { name, id, comments } = req.body;
    
    // Validate required fields
    if (!name || !id) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    console.log(`Processing upload for ${name} (${id})`);
    
    // Create file metadata
    const fileMetadata = {
      name: `Assignment_${id}_${name}_${new Date().toISOString().split('T')[0]}.pdf`,
      mimeType: req.file.mimetype,
      parents: ['10MxT_pSnmdHc12z8SFQWUnJpC-pZQJPM'], // Your folder ID
      description: `Assignment submitted by ${name} (${id}). Comments: ${comments || 'None'}`
    };

    // Upload file to Drive
    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: {
        mimeType: req.file.mimetype,
        body: req.file.buffer
      }
    });

    console.log(`File uploaded with ID: ${response.data.id}`);

    // Make the file viewable by anyone with the link
    await drive.permissions.create({
      fileId: response.data.id,
      requestBody: {
        role: 'reader',
        type: 'anyone'
      }
    });

    // Get the web view link
    const fileData = await drive.files.get({
      fileId: response.data.id,
      fields: 'webViewLink'
    });

    // Return success response
    res.json({
      success: true,
      fileId: response.data.id,
      fileUrl: fileData.data.webViewLink
    });
  } catch (error) {
    console.error('Error uploading to Drive:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 