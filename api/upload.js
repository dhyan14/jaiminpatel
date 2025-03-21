const multer = require('multer');
const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

// Set up multer for file uploads (memory storage for serverless)
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Middleware to handle file uploads in serverless environment
const runMiddleware = (req, res, fn) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};

// Load service account credentials
const serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY || '{}');

// Configure JWT client with service account
const jwtClient = new google.auth.JWT(
  serviceAccount.client_email,
  null,
  serviceAccount.private_key,
  ['https://www.googleapis.com/auth/drive']
);

// Create Drive client
const drive = google.drive({ version: 'v3', auth: jwtClient });

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', 'https://jaiminpatel.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    // Process the file upload
    await runMiddleware(req, res, upload.single('file'));

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
    res.status(200).json({
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
}; 