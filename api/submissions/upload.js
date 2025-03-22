import { google } from 'googleapis';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { studentName, enrollmentNumber, assignmentId, fileData } = req.body;

    if (!studentName || !enrollmentNumber || !assignmentId || !fileData) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Set up Google Drive API
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/drive.file'],
    });

    const drive = google.drive({ version: 'v3', auth });

    // Generate a unique filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `Assignment_${assignmentId}_${enrollmentNumber}_${studentName.replace(/\s+/g, '_')}_${timestamp}.pdf`;

    // Extract the base64 data (remove the data:application/pdf;base64, part)
    const base64Data = fileData.split(',')[1];
    const fileBuffer = Buffer.from(base64Data, 'base64');

    // Upload file to Google Drive
    const response = await drive.files.create({
      requestBody: {
        name: filename,
        mimeType: 'application/pdf',
        parents: [process.env.GOOGLE_DRIVE_FOLDER_ID],
      },
      media: {
        mimeType: 'application/pdf',
        body: fileBuffer,
      },
    });

    return res.status(200).json({
      success: true,
      id: response.data.id,
      message: 'Assignment uploaded successfully',
    });
  } catch (error) {
    console.error('Error uploading to Google Drive:', error);
    return res.status(500).json({ error: 'Failed to upload file' });
  }
} 