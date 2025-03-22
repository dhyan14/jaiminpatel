import { google } from 'googleapis';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Set up Google Drive API
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/drive.file'],
    });

    const drive = google.drive({ version: 'v3', auth });

    // Get files from the submissions folder
    const response = await drive.files.list({
      q: `'${process.env.GOOGLE_DRIVE_FOLDER_ID}' in parents`,
      fields: 'files(id, name, createdTime, webViewLink)',
      orderBy: 'createdTime desc',
    });

    const files = response.data.files.map(file => {
      // Parse the filename to extract metadata
      // Format: Assignment_[assignmentId]_[enrollmentNumber]_[studentName]_[timestamp].pdf
      const nameParts = file.name.split('_');
      
      return {
        id: file.id,
        assignmentId: nameParts[1] || 'Unknown',
        enrollmentNumber: nameParts[2] || 'Unknown',
        studentName: (nameParts[3] || 'Unknown').replace(/_/g, ' '),
        fileName: file.name,
        uploadDate: file.createdTime,
        viewLink: file.webViewLink
      };
    });

    return res.status(200).json(files);
  } catch (error) {
    console.error('Error retrieving submissions:', error);
    return res.status(500).json({ error: 'Failed to retrieve submissions' });
  }
} 